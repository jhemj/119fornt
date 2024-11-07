<script setup>
import { reactive } from 'vue';
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import CategoriesList from "./components/CategoriesList.vue";

// 차트 데이터를 reactive 변수로 관리
const chartData = reactive({
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: '전체 신고',
      data: [50, 130, 300, 220, 500, 250, 400, 230, 500],
      borderColor: 'rgba(75, 192, 192, 1)', // 기존 색상 유지
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '피싱',
      data: [30, 60, 120, 80, 200, 150, 300, 180, 400],
      borderColor: 'rgba(255, 99, 132, 1)', // 빨간색
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '악성코드',
      data: [20, 40, 90, 60, 150, 120, 250, 130, 350],
      borderColor: 'rgba(255, 159, 64, 1)', // 주황색
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: '캠페인',
      data: [10, 30, 70, 50, 100, 80, 200, 100, 300],
      borderColor: 'rgba(54, 162, 235, 1)', // 파란색
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
      tension: 0.4,
    },
  ],
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <!-- 통계 카드들 -->
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="오늘의 신고"
              value="23건"
              description="<span class='text-sm font-weight-bolder text-success'>+55%</span> since yesterday"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="미분류 신고"
              value="34건"
              description="<span class='text-sm font-weight-bolder text-success'>+3%</span> since last week"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-dark',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="이달의 보안 위협"
              value="1"
              description="<span class='text-sm font-weight-bolder text-danger'>-2</span> since last month"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="누적 신고"
              value="352,732"
              description="<span class='text-sm font-weight-bolder text-success'>+430</span> than last month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>

        <!-- 그래프와 카테고리를 동일한 행에 배치 -->
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
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'danger',
                  },
                  label: '피싱',
                  description: '<strong>673</strong>',
                },
                {
                  icon: {
                    component: 'ni ni-tag',
                    background: 'danger',
                  },
                  label: '악성코드',
                  description: '<strong>13</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: '오신고',
                  description: '123435',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: '캠페인',
                  description: '124435',
                },
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark',
                  },
                  label: '기타',
                  description: '<strong>35</strong>',
                },
              ]"
            />
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