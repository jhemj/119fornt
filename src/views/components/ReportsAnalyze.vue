<!-- ReportsAnalyze.vue -->
<template>
  <div class="card p-3 shadow-sm">
    <h5 class="mb-3">신고 분석</h5>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="chart-container">
          <h6>상태별 신고 현황</h6>
          <canvas ref="statusChart"></canvas>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="chart-container">
          <h6>회사별 신고 현황</h6>
          <canvas ref="companyChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Props 정의
const props = defineProps({
  reports: {
    type: Array,
    required: true,
  },
  statusAggregations: {
    type: Array,
    required: true,
  },
  companyAggregations: {
    type: Array,
    required: true,
  },
});

const statusChart = ref(null);
const companyChart = ref(null);
let statusChartInstance = null;
let companyChartInstance = null;

// 동적 색상 생성 유틸리티 (회사별 신고 현황에 사용)
function generateColors(count) {
  const colors = [];
  const hueStep = Math.floor(360 / count);
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 50%, 60%)`);
  }
  return colors;
}

// 상태별 신고 데이터 준비 (백엔드 집계 데이터 사용)
function prepareStatusData() {
  const statusCounts = props.statusAggregations.reduce((acc, item) => {
    const status = item.status || '미정'; // null인 경우 '미정'으로 처리
    acc[status] = item.count;
    return acc;
  }, {});

  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);
  const backgroundColors = labels.map(status => {
    switch (status) {
      case '캠페인':
        return 'rgba(93, 200, 233, 0.8)';
      case '오신고':
        return 'rgba(133, 146, 169, 0.8)';
      case '피싱':
        return 'rgba(225, 63, 84, 0.8)';
      case '악성코드':
        return 'rgba(232, 99, 64, 0.8)';
      case '미분류':
        return 'rgba(0, 0, 0, 0.8)';
      default:
        return 'rgba(201, 203, 207, 0.7)'; // 기본 색상
    }
  });

  return {
    labels,
    datasets: [
      {
        label: "신고 수",
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
}

// 회사별 신고 데이터 준비 (백엔드 집계 데이터 사용)
function prepareCompanyData() {
  const companyCounts = props.companyAggregations.reduce((acc, item) => {
    const company = item.company || '미정';
    acc[company] = item.count;
    return acc;
  }, {});

  const labels = Object.keys(companyCounts);
  const data = Object.values(companyCounts);
  const backgroundColors = generateColors(labels.length);

  return {
    labels,
    datasets: [
      {
        label: "신고 수",
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
}

// 그래프 초기화 함수
function initCharts() {
  // 기존 차트 인스턴스 파괴
  if (statusChartInstance) statusChartInstance.destroy();
  if (companyChartInstance) companyChartInstance.destroy();

  // 상태별 신고 현황 그래프 (고정 색상)
  statusChartInstance = new Chart(statusChart.value, {
    type: "bar",
    data: prepareStatusData(),
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  });

  // 회사별 신고 현황 그래프 (동적 색상)
  companyChartInstance = new Chart(companyChart.value, {
    type: "bar",
    data: prepareCompanyData(),
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  });
}

// 컴포넌트 마운트 시 차트 초기화
onMounted(() => {
  initCharts();
});

// `statusAggregations` 및 `companyAggregations` 변경 시 차트 업데이트
watch(
  () => [props.statusAggregations, props.companyAggregations],
  () => {
    initCharts();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
