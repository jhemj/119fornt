
// 대시보드에서 복붙함
<script setup>
import { reactive } from 'vue';
// import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import GaugeChart from "@/examples/Charts/GaugeChart.vue";
import CategoriesList from "./components/CategoriesList.vue";
import CampaignTable from "./components/CampaignTable.vue"; // ReportsTable 컴포넌트를 불러옵니다.

// 차트 데이터를 reactive 변수로 관리
const chartData = reactive({
  labels: ['23-3', '23-4', '24-1', '24-2', '24-3', '24-4'],
  datasets: [
    {
      label: '신고 수',
      data: [2000, 2200,  2450, 2300, 2500, 2350],
      borderColor: 'rgba(75, 192, 192, 1)', // 기존 색상 유지
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.4,
    },
    // {
    //   label: '캠페인',
    //   data: [10, 30, 70, 50, 100, 80, 200, 100, 300],
    //   borderColor: 'rgba(54, 162, 235, 1)', // 파란색
    //   backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //   fill: false,
    //   tension: 0.4,
    // },
  ],
});

</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="row mt-4">

        <div class="col-lg-4 col-md-12">
        <!-- 통계 카드들 -->
          <div class="card" id="app">
          
            <GaugeChart :value1="20" :value2="35" />
  
          </div>
        </div>
        
        <div class="col-lg-8 col-md-12 mb-4">
          <div class="card z-index-2">
            <gradient-line-chart
              id="chart-line"
              title="분기별 캠페인 참여율"
              description="<i class='fa fa-arrow-up text-success'></i>
        <span class='font-weight-bold'>10% 증가</span> 하였습니다."         
              :chart="chartData"
            />
          </div>
        </div>


        <!-- 그래프와 카테고리를 동일한 행에 배치 -->
        <div class="row mt-4">
          <!-- 라인 차트 -->
          <div class="col-lg-8 col-md-12 mb-4">
            <campaign-table />
          </div>

          <!-- 카테고리 리스트 -->
          <div class="col-lg-4 col-md-12">
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark',
                  },
                  label: 'Customer 부문',
                  description: '<strong>0.68</strong>',
                },
                {
                  icon: {
                    component: 'ni ni-tag',
                    background: 'dark',
                  },
                  label: 'Enterpris 부문',
                  description: '<strong>0.66</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: '전략/신사업부문',
                  description: '<strong>0.71</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: '네트워크부문',
                  description: '<strong>0.83</strong>',
                },
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark',
                  },
                  label: '기술혁신부문',
                  description: '<strong>0.78</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: '광역본부',
                  description: '<strong>0.95</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: '...',
                  description: '...',
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

/* 게이지 차트 스타일 */
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  min-height: 35vh;
}
</style>