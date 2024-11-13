<template>
  <div class="card mb-4 w-100">
    <div class="card-header pb-0">
      <h6>미분류 신고 리포트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <!-- 추가 메시지 -->
      <div class="additional-message">
        <p class="gradient-text">접수 후 분류되지 않은 {{ totalCount }}건의 신고를 AI가 아래와 같이 사전 분석했습니다.</p>
      </div>
      
      <!-- 테이블 -->
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0 w-100">
          <!-- 테이블 헤더 -->
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 classification-header">
                <strong>분류</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 count-header">
                <strong>건수</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 percentage-header">
                <strong>비율</strong>
              </th>
            </tr>
          </thead>
          <!-- 테이블 바디 -->
          <tbody>
            <tr v-for="(report, index) in reportData" :key="index">
              <td class="align-middle text-sm classification-cell">
                <span class="classification">{{ report.classification }}</span>
              </td>
              <td class="align-middle text-sm count-cell">{{ report.count }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">{{ report.percentage }}%</span>
                  <div class="progress w-100">
                    <div
                      class="progress-bar"
                      :class="report.progressClass"
                      role="progressbar"
                      :aria-valuenow="report.percentage"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: report.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Remove computed import

// 개별 건수 변수
const phishingCount = 10;
const malwareCount = 2;
const campaignCount = 150;
const falseReportCount = 100;

// 총 건수 계산
const totalCount = phishingCount + malwareCount + campaignCount + falseReportCount;

// 비율 계산
const reportData = ref([
  { classification: '피싱', count: phishingCount, percentage: ((phishingCount / totalCount) * 100).toFixed(2), progressClass: 'bg-gradient-warning' },
  { classification: '악성코드', count: malwareCount, percentage: ((malwareCount / totalCount) * 100).toFixed(2), progressClass: 'bg-gradient-danger' },
  { classification: '캠페인', count: campaignCount, percentage: ((campaignCount / totalCount) * 100).toFixed(2), progressClass: 'bg-gradient-info' },
  { classification: '오신고', count: falseReportCount, percentage: ((falseReportCount / totalCount) * 100).toFixed(2), progressClass: 'bg-gradient-success' },
]);
</script>

<style scoped>
/* 그라데이션 텍스트 스타일 */
.gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center; /* 중앙 정렬 */
}

/* 테이블 셀 크기 조정 */
.table th,
.table td {
  padding: 12px; /* 약간의 패딩 증가 */
  font-size: 14px;
  vertical-align: middle;
  text-align: center; /* 중앙 정렬 */
}

/* Adjusted column widths */
.classification-header, .classification-cell {
  width: 15%;
}

.count-header, .count-cell {
  width: 15%;
}

.percentage-header, .percentage-cell {
  width: 70%;
}

/* 테이블 헤더 볼드 처리 */
.table th strong {
  font-weight: bold;
}

/* 분류 텍스트 스타일 */
.classification {
  font-weight: bold;
  color: #333;
  text-align: center; /* 중앙 정렬 */
}

/* 진행률 바 스타일링 */
.progress {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 100%; /* 전체 너비 */
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}

/* 추가 메시지 스타일 */
.additional-message {
  padding: 12px 16px;
  text-align: center;
}

.additional-message p {
  margin: 0;
  font-size: 16px;
  text-align: center; /* 중앙 정렬 */
}

/* 카드 너비 확장 */
.card {
  width: 100%;
}

/* 반응형 디자인 조정 */
@media (max-width: 768px) {
  .progress {
    width: 80px !important;
  }
  
  .additional-message p {
    font-size: 14px;
  }
}
</style>