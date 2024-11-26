<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import CategoriesList from "./components/CategoriesList.vue";

// 라우터 인스턴스 생성
const router = useRouter();

// 카드 클릭 시 경로 이동 함수 정의
function navigateTo(path) {
  router.push(path);
}

// 대시보드 데이터 상태를 관리할 reactive 변수
const dashboardStats = reactive({
  yesterdayReports: 0,
  unclassifiedReports: 0,
  securityThreats: 0,
  cumulativeReports: 0,
});

// 분류 완료된 신고 유형
const classifiedReports = ref({
  피싱: 0,
  악성코드: 0,
  캠페인: 0,
  오신고: 0,
  기타: 0,
});

// 최근 12개월 월별 신고 유형 데이터
const monthlyReportData = ref([]);

// 차트 데이터를 reactive 변수로 관리
const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: '전체 신고',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '피싱',
      data: [],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '악성코드',
      data: [],
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '캠페인',
      data: [],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
      tension: 0.4,
    },
  ],
});

// 카테고리 리스트 데이터를 관리할 변수
const categories = ref([]);

// 데이터 초기화 함수
const fetchDashboardData = async () => {
  try {
    // 1. 신고 건수 확인 API (어제의 신고 건수)
    const reportsYesterdayResponse = await axios.get('http://52.231.104.51/api/reports/stats/reports-yesterday/');
    dashboardStats.yesterdayReports = reportsYesterdayResponse.data.yesterday;

    // 2. 미분류 신고 확인 API
    const unclassifiedResponse = await axios.get('http://52.231.104.51/api/reports/stats/unclassified-reports/');
    dashboardStats.unclassifiedReports = unclassifiedResponse.data.unclassified_reports;

    // 3. 이달의 보안 위협 확인 API
    const securityThreatResponse = await axios.get('http://52.231.104.51/api/reports/stats/security-threat/');
    dashboardStats.securityThreats = securityThreatResponse.data.current_month;

    // 4. 누적 신고 확인 API
    const cumulativeResponse = await axios.get('http://52.231.104.51/api/reports/stats/cumulative-reports/');
    dashboardStats.cumulativeReports = cumulativeResponse.data.current_month_reports;

    // 5. 분류 완료된 신고 유형 API
    const classifiedReportsResponse = await axios.get('http://52.231.104.51/api/reports/stats/classified-report-types/');
    classifiedReports.value = classifiedReportsResponse.data;

    // 6. 최근 12개월 월별 신고 유형 API
    const monthlyReportResponse = await axios.get('http://52.231.104.51/api/reports/stats/monthly-report-types/');
    monthlyReportData.value = monthlyReportResponse.data;

    // 차트 데이터 업데이트
    chartData.labels = monthlyReportData.value.map((data) => data.month);
    chartData.datasets[0].data = monthlyReportData.value.map((data) => data.total_reports);
    chartData.datasets[1].data = monthlyReportData.value.map((data) => data.피싱);
    chartData.datasets[2].data = monthlyReportData.value.map((data) => data.악성코드);
    chartData.datasets[3].data = monthlyReportData.value.map((data) => data.캠페인);
    console.log("chartdata >> ", chartData);
    // 카테고리 리스트 업데이트
    categories.value = [
      {
        icon: {
          component: 'ni ni-mobile-button',
          background: 'danger',
        },
        label: '피싱',
        description: `<strong>${classifiedReports.value.피싱}</strong>`,
      },
      {
        icon: {
          component: 'ni ni-tag',
          background: 'danger',
        },
        label: '악성코드',
        description: `<strong>${classifiedReports.value.악성코드}</strong>`,
      },
      {
        icon: { component: 'ni ni-box-2', background: 'dark' },
        label: '오신고',
        description: `<strong>${classifiedReports.value.오신고}</strong>`,
      },
      {
        icon: { component: 'ni ni-satisfied', background: 'dark' },
        label: '캠페인',
        description: `<strong>${classifiedReports.value.캠페인}</strong>`,
      },
      {
        icon: {
          component: 'ni ni-mobile-button',
          background: 'dark',
        },
        label: '기타',
        description: `<strong>${classifiedReports.value.기타}</strong>`,
      },
    ];
  } catch (error) {
    console.error('대시보드 데이터를 가져오는 중 오류가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트될 때 데이터 로드
onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <!-- 통계 카드들 -->
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <!-- 오늘의 신고 카드 -->
            <mini-statistics-card
              title="오늘의 신고"
              :value="`${dashboardStats.yesterdayReports}건`"
              description="<span class='text-sm font-weight-bolder text-success'>+55%</span> since yesterday"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <!-- 미분류 신고 카드 (클릭 시 /tables 경로로 이동) -->
            <mini-statistics-card
              title="미분류 신고"
              :value="`${dashboardStats.unclassifiedReports}건`"
              description="<span class='text-sm font-weight-bolder text-success'>+3%</span> since last week"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-dark',
                shape: 'rounded-circle',
              }"
              @click="navigateTo('/tables')"
              style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <!-- 이달의 보안 위협 카드 (클릭 시 /threats 경로로 이동) -->
            <mini-statistics-card
              title="이달의 보안 위협"
              :value="`${dashboardStats.securityThreats}`"
              description="<span class='text-sm font-weight-bolder text-danger'>-2</span> since last month"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
              @click="navigateTo('/threats')"
              style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <!-- 누적 신고 카드 (클릭 시 /reports 경로로 이동) -->
            <mini-statistics-card
              title="누적 신고"
              :value="`${dashboardStats.cumulativeReports}`"
              description="<span class='text-sm font-weight-bolder text-success'>+430</span> than last month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
              @click="navigateTo('/reports')"
              style="cursor: pointer;"
            />
          </div>
        </div>

        <!-- 그래프와 카테고리 리스트 -->
        <div class="row mt-4">
          <!-- 라인 차트 -->
          <div class="col-lg-8 col-md-12 mb-4">
            <div class="card z-index-2">
              <gradient-line-chart
                id="chart-line"
                title="2025 Security 119"
                description="<i class='fa fa-arrow-up text-success'></i>
              <span class='font-weight-bold'>4% more</span> in 2024"
                :chart="chartData"
              />
            </div>
          </div>

          <!-- 카테고리 리스트 -->
          <div class="col-lg-4 col-md-12">
            <categories-list :categories="categories" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* 필요한 경우 추가적인 스타일링을 여기에 작성하세요 */
canvas {
  width: 100% !important;
  height: 300px !important; /* 높이를 명시적으로 설정 */
}
</style>