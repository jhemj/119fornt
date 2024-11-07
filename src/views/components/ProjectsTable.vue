<template>
  <div class="card mb-4 w-100">
    <div class="card-header pb-0">
      <h6>AI가 사전 검토한 신고 리포트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <!-- 추가 메시지 -->
      <div class="additional-message">
        <p class="gradient-text">추가 접수된 400건의 신고를 AI가 사전 분류했습니다.</p>
      </div>
      
      <!-- 테이블 -->
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0 w-00">
          <!-- 테이블 헤더 -->
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>분류</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>건수</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>비율</strong>
              </th>
            </tr>
          </thead>
          <!-- 테이블 바디 -->
          <tbody>
            <tr v-for="(report, index) in reportData" :key="index">
              <td class="align-middle text-sm">
                <span class="classification">{{ report.classification }}</span>
              </td>
              <td class="align-middle text-sm">{{ report.count }}</td>
              <td class="align-middle text-sm">
                <div class="d-flex align-items-center">
                  <span class="me-2 text-xs font-weight-bold">{{ report.percentage }}%</span>
                  <div class="progress" style="width: 500px;">
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
import { ref } from 'vue';

// 더미 데이터 (분류, 건수, 비율)
const reportData = ref([
  { classification: '피싱', count: 120, percentage: 40, progressClass: 'bg-gradient-info' },
  { classification: '악성코드', count: 80, percentage: 27, progressClass: 'bg-gradient-danger' },
  { classification: '캠페인', count: 50, percentage: 17, progressClass: 'bg-gradient-warning' },
  { classification: '오신고', count: 50, percentage: 16, progressClass: 'bg-gradient-success' },
]);
</script>

<style scoped>
/* 그라데이션 텍스트 스타일 */
.gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00); /* 다채로운 그라데이션 */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* 테이블 셀 크기 조정 */
.table th,
.table td {
  padding: 12px; /* 약간의 패딩 증가 */
  font-size: 14px;
  vertical-align: middle;
}

/* 테이블 헤더 볼드 처리 */
.table th strong {
  font-weight: bold;
}

/* 분류 텍스트 스타일 */
.classification {
  font-weight: bold;
  color: #333;
}

/* 진행률 바 스타일링 */
.progress {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
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