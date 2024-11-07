<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'success',
  },
  size: {
    type: String,
    default: 'md',
  }
});

const emit = defineEmits(['update:currentPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const emitPageChange = (page) => {
  if (page !== props.currentPage && page > 0 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};

</script>

<template>
  <!-- .pagination 클래스에 pagination-centered 추가 -->
  <ul class="pagination pagination-centered">
    <li class="page-item" :class="{ disabled: props.currentPage === 1 }">
      <button class="page-link" @click.prevent="emitPageChange(props.currentPage - 1)" :disabled="props.currentPage === 1">
        &lt;
      </button>
    </li>
    <li v-for="page in pageNumbers" :key="page" class="page-item" :class="{ active: page === props.currentPage }">
      <button class="page-link" @click.prevent="emitPageChange(page)">{{ page }}</button>
    </li>
    <li class="page-item" :class="{ disabled: props.currentPage === totalPages.value }">
      <button class="page-link" @click.prevent="emitPageChange(props.currentPage + 1)" :disabled="props.currentPage === totalPages.value">
        &gt;
      </button>
    </li>
  </ul>
</template>

<style scoped>
.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center; /* 가운데 정렬을 위해 추가 */
}

.page-item {
  margin: 0 2px;
}

.page-item .page-link {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  cursor: pointer;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: #fff;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>