<!-- src/examples/Charts/GradientLineChart.vue -->
<template>
  <div class="card z-index-2">
    <div class="pb-0 card-header mb-0">
      <h6>{{ title }}</h6>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="description" class="text-sm" v-html="description" />
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas
          :id="id"
          class="chart-canvas"
          :height="height"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "300",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  chart: {
    type: Object,
    required: true,
  },
});

const chartInstance = ref(null);

onMounted(() => {
  const ctx = document.getElementById(props.id).getContext("2d");

  // 기존 차트가 있다면 삭제
  let existingChart = Chart.getChart(props.id);
  if (existingChart) {
    existingChart.destroy();
  }

  // 각 데이터 세트에 대해 그라디언트 배경 생성
  const datasetsWithGradients = props.chart.datasets.map((dataset) => {
    let gradient = ctx.createLinearGradient(0, 230, 0, 50);
    switch (dataset.label) {
      case "Mobile Apps":
        gradient.addColorStop(1, "rgba(75, 192, 192, 0.2)");
        gradient.addColorStop(0.2, "rgba(75, 192, 192, 0.0)");
        gradient.addColorStop(0, "rgba(75, 192, 192, 0)");
        break;
      case "피싱":
        gradient.addColorStop(1, "rgba(255, 99, 132, 0.2)");
        gradient.addColorStop(0.2, "rgba(255, 99, 132, 0.0)");
        gradient.addColorStop(0, "rgba(255, 99, 132, 0)");
        break;
      case "악성코드":
        gradient.addColorStop(1, "rgba(255, 159, 64, 0.2)");
        gradient.addColorStop(0.2, "rgba(255, 159, 64, 0.0)");
        gradient.addColorStop(0, "rgba(255, 159, 64, 0)");
        break;
      case "캠페인":
        gradient.addColorStop(1, "rgba(54, 162, 235, 0.2)");
        gradient.addColorStop(0.2, "rgba(54, 162, 235, 0.0)");
        gradient.addColorStop(0, "rgba(54, 162, 235, 0)");
        break;
      default:
        gradient.addColorStop(1, "rgba(203, 12, 159, 0.2)");
        gradient.addColorStop(0.2, "rgba(72, 72, 176, 0.0)");
        gradient.addColorStop(0, "rgba(203, 12, 159, 0)");
    }

    // 색상 설정
    let borderColor;
    switch (dataset.label) {
      case "Mobile Apps":
        borderColor = "rgba(75, 192, 192, 1)";
        break;
      case "피싱":
        borderColor = "rgba(255, 99, 132, 1)";
        break;
      case "악성코드":
        borderColor = "rgba(255, 159, 64, 1)";
        break;
      case "캠페인":
        borderColor = "rgba(54, 162, 235, 1)";
        break;
      default:
        borderColor = "rgba(203, 12, 159, 1)";
    }

    return {
      label: dataset.label,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
      borderColor: borderColor,
      backgroundColor: gradient,
      fill: true,
      data: dataset.data,
      maxBarThickness: 6,
    };
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels: props.chart.labels,
      datasets: datasetsWithGradients,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, // 범례 표시
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#fbfbfb",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#ccc",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
});

watch(() => props.chart, (newChart) => {
  if (chartInstance.value) {
    chartInstance.value.data = newChart;
    chartInstance.value.update();
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 300px !important; /* 필요에 따라 높이 조정 */
}
</style>