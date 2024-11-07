<template>
    <div class="chart-container">
      <h2>Simulation Results</h2>
      <div class="protection-level">
        <h3>Current protection level: <span>{{ protectionLevel }}%</span></h3>
        <div class="gauge">
          <div :style="gaugeStyle" class="gauge-fill"></div>
        </div>
      </div>
      <BarChart :chart-data="chartData" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    components: {
      BarChart: Bar,
    },
    data() {
      return {
        protectionLevel: 26, // Current protection level
        chartData: {
          labels: ['BEC', 'Credential Phishing', 'Extortion Scam', 'Malware/Ransomware', 'QR Code Phishing'],
          datasets: [
            {
              label: 'Blocked',
              backgroundColor: 'rgba(75, 192, 192, 1)',
              data: [20, 30, 10, 25, 15],
            },
            {
              label: 'Delivered',
              backgroundColor: 'rgba(255, 99, 132, 1)',
              data: [80, 70, 90, 75, 85],
            },
          ],
        },
      };
    },
    computed: {
      gaugeStyle() {
        return {
          width: `${this.protectionLevel}%`,
          backgroundColor: this.protectionLevel < 50 ? 'red' : 'green',
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  
  .protection-level {
    margin-bottom: 20px;
  }
  
  .gauge {
    height: 30px;
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }
  
  .gauge-fill {
    height: 100%;
    transition: width 0.5s ease;
  }
  </style>