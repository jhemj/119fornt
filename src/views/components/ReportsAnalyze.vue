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
          <h6>부문별 신고 현황</h6>
          <canvas ref="sectorChart"></canvas>
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

const props = defineProps({
  reports: {
    type: Array,
    required: true,
  },
});

const statusChart = ref(null);
const sectorChart = ref(null);
let statusChartInstance = null;
let sectorChartInstance = null;

// 동적 색상 생성 유틸리티 (부문별 신고 현황에 사용)
function generateColors(count) {
  const colors = [];
  const hueStep = Math.floor(360 / count);
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 50%, 60%)`);
  }
  return colors;
}

// 상태별 신고 데이터 준비 (고정 색상 사용)
const statusColors = {
  캠페인: 'rgba(93, 200, 233, 0.8)', 
  오신고: 'rgba(133, 146, 169, 0.8)', 
  피싱: 'rgba(225, 63, 84, 0.8)', 
  악성코드: 'rgba(232, 99, 64, 0.8)',
  미분류: 'rgba(0, 0, 0, 0.8)', // text-muted - 회색
};

function prepareStatusData() {
  const statusCounts = props.reports.reduce((acc, report) => {
    const status = report.status || '미분류'; // null인 경우 '미분류'로 처리
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);
  const backgroundColors = labels.map(status => statusColors[status] || 'rgba(201, 203, 207, 0.7)'); // 기본 색상 설정

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

// 부문별 신고 데이터 준비 (동적 색상 사용)
function prepareSectorData() {
  const sectorCounts = props.reports.reduce((acc, report) => {
    acc[report.sector] = (acc[report.sector] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(sectorCounts);
  const data = Object.values(sectorCounts);
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
  if (statusChartInstance) statusChartInstance.destroy();
  if (sectorChartInstance) sectorChartInstance.destroy();

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

  // 부문별 신고 현황 그래프 (동적 색상)
  sectorChartInstance = new Chart(sectorChart.value, {
    type: "bar",
    data: prepareSectorData(),
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

onMounted(() => {
  initCharts();
});

watch(
  () => props.reports,
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