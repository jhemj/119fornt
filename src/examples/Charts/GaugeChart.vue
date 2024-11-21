<template>
  <div class="card z-index-2">
    <div class="p-3 card-body">
      <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
        <!-- 그림자 필터 정의 -->
        <defs>
          <filter id="light-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="1"
              dy="8"
              stdDeviation="4"
              flood-color="#000000"
              flood-opacity="0.1"
            />
          </filter>
        </defs>
        
        <!-- 배경 반원 -->
        <path
          d="M 20 220 A 160 160 0 0 1 380 220"
          fill="none"
          stroke="#2c2c3c"
          stroke-width="30"
          filter="url(#light-shadow)" 
        />
        
        <!-- Variable 2 (주황) -->
        <path
          d="M 20 220 A 160 160 0 0 1 380 220"
          fill="none"
          stroke="#faad14"
          stroke-width="30"
          :stroke-dasharray="computedDashArray2"
          :stroke-dashoffset="-computedDashArray1"
          stroke-linecap="round"
          filter="url(#light-shadow)"
        />
        
        <!-- Variable 1 (빨강) -->
        <path
          d="M 20 220 A 160 160 0 0 1 380 220"
          fill="none"
          stroke="#ff4d4f"
          stroke-width="30"
          :stroke-dasharray="computedDashArray1"
          :stroke-dashoffset="0"
          stroke-linecap="round"
          filter="url(#light-shadow)"
        />


        <!-- 총합 값 표시 -->
        <text x="200" y="150" text-anchor="middle" class="gauge-value">
          신고율 : {{ parseInt((props.value1 * 100) / totalValue) }}%
        </text>
        <!-- 상태 텍스트 표시 -->
        <text x="200" y="180" text-anchor="middle" class="gauge-status">
          {{ statusText }}
        </text>
      </svg>
    </div>
    <!-- 범례 표시 -->
    <div class="legend">
      <div class="legend-item">
        <span class="color-box" style="background-color: #ff4d4f"></span>
        <span>신고 : {{ props.value1 }}</span>
      </div>
      <div class="legend-item">
        <span class="color-box" style="background-color: #faad14"></span>
        <span>미신고 : {{ props.value2 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  value1: { type: Number, default: 2000 }, // 신고
  value2: { type: Number, default: 1500 }, // 미신고
});

// 반원의 실제 길이 계산 (반경 r=160)
const fullCircle = 567

// 총합 계산
const totalValue = computed(() => props.value1 + props.value2);

// 각 변수의 stroke-dasharray 및 stroke-dashoffset 계산
const computedDashArray1 = computed(() => (fullCircle * props.value1) / totalValue.value);
// const computedDashOffset1 = computed(() => fullCircle - computedDashArray1.value);

const computedDashArray2 = computed(() => (fullCircle * props.value2) / totalValue.value);
// const computedDashOffset2 = computed(() => fullCircle - computedDashArray1.value);

// 상태 텍스트 계산
const statusText = computed(() => {
  const ratio = (props.value1 / totalValue.value) * 100;
  if (ratio < 30) return "Poor";
  if (ratio < 70) return "Fair";
  return "Good";
});
</script>

<style scoped>
.gauge-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px; /* 증가된 간격 */
}

.gauge-chart {
  width: 400px; /* 확대된 크기 */
  height: 250px; /* 확대된 크기 */
}

path {
  transition: stroke-dashoffset 0.3s ease;
}

.gauge-value {
  font-size: 32px; /* 확대된 글씨 크기 */
  font-weight: bold;
}

.gauge-status {
  font-size: 20px; /* 확대된 글씨 크기 */
}

.legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start; /* 기존 라인 유지 */
  gap: 15px; /* 증가된 간격 */
  padding: 16px 16px 16px 50px; /* 기존 여백 유지 */
}

.legend-item {
  display: flex;
  align-items: center; /* 'left'는 잘못된 값으로 'center'로 수정 */
  gap: 15px; /* 증가된 간격 */
  font-size: 20px;
}

.color-box {
  width: 30px; /* 확대된 색상 박스 */
  height: 30px; /* 확대된 색상 박스 */
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 추가된 그림자 */
  border-radius: 8px; /* 선택 사항: 그림자가 더 자연스럽게 보이도록 경계선 반경 추가 */
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  /* 호칭 열 숨김 */
  .title-column {
    display: none;
  }
}

@media (max-width: 992px) {
  /* 부문 열 숨김 */
  .sector-column {
    display: none;
  }
}

@media (max-width: 768px) {
  /* 회사 열 숨김 */
  .company-column {
    display: none;
  }
}

@media (max-width: 576px) {
  /* 이름 열 숨김 */
  .name-column {
    display: none;
  }

  .table th, .table td {
    font-size: 0.65rem;
  }

  .btn {
    padding: 4px 8px;
    font-size: 0.65rem;
  }

  .dropdown-menu {
    font-size: 0.75rem;
  }
}
</style>