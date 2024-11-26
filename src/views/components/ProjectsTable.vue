<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 각 분류별 카운트 변수
const phishingCount = ref(0);
const malwareCount = ref(0);
const campaignCount = ref(0);
const falseReportCount = ref(0);
const spamCount = ref(0);
const totalCount = ref(0);

// 데이터 초기화 함수
const fetchReportData = async () => {
  try {
    const response = await axios.get('http://52.231.104.51/api/reports/?status__isnull=true');
    const data = response.data;

    // 분류별 카운트 초기화
    phishingCount.value = 0;
    malwareCount.value = 0;
    campaignCount.value = 0;
    falseReportCount.value = 0;
    spamCount.value = 0;

    // 데이터를 순회하면서 카운트 계산
    data.forEach((item) => {
      if (item.ai_classification === '피싱') phishingCount.value += 1;
      else if (item.ai_classification === '악성코드') malwareCount.value += 1;
      else if (item.ai_classification === '캠페인') campaignCount.value += 1;
      else if (item.ai_classification === '오신고') falseReportCount.value += 1;
      else if (item.ai_classification === '스팸') spamCount.value += 1;
    });

    // 총 건수 계산
    totalCount.value =
      phishingCount.value +
      malwareCount.value +
      campaignCount.value +
      falseReportCount.value + 
      spamCount.value;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트될 때 데이터 로드
onMounted(() => {
  fetchReportData();
});
</script>

<template>
  <div class="card mb-4 w-100">
    <div class="card-header pb-0">
      <h6>미분류 신고 리포트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <!-- 추가 메시지 -->
      <div class="additional-message">
        <p class="gradient-text">
          접수 후 분류되지 않은 {{ totalCount }}건의 신고를 AI가 아래와 같이 사전 분석했습니다.
        </p>
      </div>
      
      <!-- 테이블 -->
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0 w-100">
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
          <tbody>
            <tr>
              <td class="align-middle text-sm classification-cell">피싱</td>
              <td class="align-middle text-sm count-cell">{{ phishingCount }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">
                    {{ ((phishingCount / totalCount) * 100).toFixed(2) }}%
                  </span>
                  <div class="progress w-100">
                    <div
                      class="progress-bar bg-gradient-warning"
                      role="progressbar"
                      :aria-valuenow="(phishingCount / totalCount) * 100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: ((phishingCount / totalCount) * 100).toFixed(2) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="align-middle text-sm classification-cell">악성코드</td>
              <td class="align-middle text-sm count-cell">{{ malwareCount }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">
                    {{ ((malwareCount / totalCount) * 100).toFixed(2) }}%
                  </span>
                  <div class="progress w-100">
                    <div
                      class="progress-bar bg-gradient-danger"
                      role="progressbar"
                      :aria-valuenow="(malwareCount / totalCount) * 100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: ((malwareCount / totalCount) * 100).toFixed(2) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="align-middle text-sm classification-cell">캠페인</td>
              <td class="align-middle text-sm count-cell">{{ campaignCount }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">
                    {{ ((campaignCount / totalCount) * 100).toFixed(2) }}%
                  </span>
                  <div class="progress w-100">
                    <div
                      class="progress-bar bg-gradient-info"
                      role="progressbar"
                      :aria-valuenow="(campaignCount / totalCount) * 100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: ((campaignCount / totalCount) * 100).toFixed(2) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="align-middle text-sm classification-cell">오신고</td>
              <td class="align-middle text-sm count-cell">{{ falseReportCount }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">
                    {{ ((falseReportCount / totalCount) * 100).toFixed(2) }}%
                  </span>
                  <div class="progress w-100">
                    <div
                      class="progress-bar bg-gradient-success"
                      role="progressbar"
                      :aria-valuenow="(falseReportCount / totalCount) * 100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: ((falseReportCount / totalCount) * 100).toFixed(2) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="align-middle text-sm classification-cell">스팸</td>
              <td class="align-middle text-sm count-cell">{{ spamCount }}</td>
              <td class="align-middle text-sm percentage-cell">
                <div class="d-flex align-items-center w-100">
                  <span class="me-2 text-xs font-weight-bold">
                    {{ ((spamCount / totalCount) * 100).toFixed(2) }}%
                  </span>
                  <div class="progress w-100">
                    <div d
                      class="progress-bar bg-gradient-success"
                      role="progressbar"
                      :aria-valuenow="(spamCount / totalCount) * 100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: ((spamCount / totalCount) * 100).toFixed(2) + '%' }"
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

<style scoped>
/* 그라데이션 텍스트 스타일 */
.gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
}

/* 테이블 셀 크기 조정 */
.table th,
.table td {
  padding: 12px;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
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

/* 진행률 바 스타일링 */
.progress {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
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
  text-align: center;
}

.card {
  width: 100%;
}
</style>