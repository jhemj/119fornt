<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

defineProps({
  title: {
    type: String,
    default: "Categories",
  },
  categories: {
    type: Array,
    required: true,
    // Vue 3에서는 prop의 각 항목에 대한 타입을 별도로 정의할 수 없습니다.
    // 대신, 배열 내부의 객체 구조를 검증하려면 `validator`를 사용할 수 있습니다.
  },
});
</script>

<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <h6 class="mb-0">{{ title }}</h6>
    </div>
    <div class="p-3 card-body">
      <!-- 소제목 "누적 분류" 추가 -->
      <h6 class="text-muted mb-2">분류 완료된 신고 유형</h6>
      
      <ul :class="`list-group ${isRTL ? 'pe-0' : ''}`">
        <li
          v-for="(
            { icon: { component, background }, label, description }, index
          ) of categories"
          :key="index"
          :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg
          ${isRTL ? 'pe-0' : 'ps-0'}`"
        >
          <div class="d-flex align-items-center">
            <div
              :class="`text-center shadow icon icon-shape icon-sm bg-gradient-${background} ${
                isRTL ? 'ms-3' : 'me-3'
              }`"
            >
              <i :class="`${component} text-white opacity-10`"></i>
            </div>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-sm text-dark">{{ label }}</h6>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span class="text-xs" v-html="description"> </span>
            </div>
          </div>
          <div class="d-flex">
            <button
              class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right"
            >
              <i
                :class="`ni ${isRTL ? 'ni-bold-left' : 'ni-bold-right'}`"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 추가적인 스타일링을 여기에 작성하세요 */
.icon-shape {
  width: 2rem;
  height: 2rem;
}

.text-muted {
  color: #6c757d !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}
</style>