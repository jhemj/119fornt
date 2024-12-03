<!-- ReportsTable.vue -->
<template>
  <div>
    <!-- 테이블 데이터 표시 -->
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col" class="text-sm">번호</th>
            <th scope="col" class="text-sm">접수일</th>
            <th scope="col" class="text-sm d-none d-md-table-cell company-column">회사</th>
            <th scope="col" class="text-sm d-none d-lg-table-cell sector-column">부문</th>
            <th scope="col" class="text-sm d-none d-xl-table-cell title-column">제목</th>
            <th scope="col" class="text-sm d-none d-xxl-table-cell name-column">이름</th>
            <th scope="col" class="text-sm long-text">이메일</th>
            <th scope="col" class="text-sm">상태</th>
            <th scope="col" class="text-sm">수정</th>
            <th scope="col" class="text-sm">상세</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="report in reports" :key="report.id">
            <tr>
              <td class="align-middle text-sm">{{ report.id }}</td>
              <td class="align-middle text-sm date-column">{{ report.receivedDate }}</td>
              <td class="align-middle text-sm d-none d-md-table-cell company-column">{{ report.company }}</td>
              <td class="align-middle text-sm d-none d-lg-table-cell sector-column">{{ report.sector }}</td>
              <td class="align-middle text-sm d-none d-xl-table-cell title-column">{{ report.title }}</td>
              <td class="align-middle text-sm d-none d-xxl-table-cell name-column">{{ report.name }}</td>
              <td class="align-middle text-sm long-text">{{ report.email }}</td>
              <td :class="['text-sm', statusClass(report.status)]">{{ report.status || '미분류' }}</td>
              <!-- 수정 열: 드롭다운 구조 변경 -->
              <td class="align-middle text-center text-sm edit-column">
                <button
                  class="btn btn-warning btn-sm edit-button dropdown-toggle"
                  type="button"
                  :id="'dropdownMenuButton-' + report.id"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  수정
                </button>
                <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButton-' + report.id">
                  <li v-for="option in statusOptions" :key="option">
                    <a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, option)">
                      {{ option }}
                    </a>
                  </li>
                </ul>
              </td>
              <td class="text-sm">
                <button
                  class="btn btn-sm btn-info toggle-button"
                  @click="emitToggleDetails(report.id)"
                  :aria-expanded="report.showDetails"
                  :aria-controls="'detail-' + report.id"
                  :aria-label="report.showDetails ? '상세 정보 숨기기' : '상세 정보 보기'"
                >
                  {{ report.showDetails ? '-' : '+' }}
                </button>
              </td>
            </tr>
            <!-- 단일 상세 정보 박스 -->
            <tr v-if="report.showDetails" :key="'detail-' + report.id">
              <td colspan="11">
                <div v-if="!isMobile" class="detail-box p-3 bg-light rounded">
                  <div class="row">
                    <div class="col-md-3"><strong>발신자:</strong></div>
                    <div class="col-md-9">{{ report.details.sender }}</div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-3"><strong>제목:</strong></div>
                    <div class="col-md-9">{{ report.details.subject }}</div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-3"><strong>첨부파일:</strong></div>
                    <div class="col-md-9">{{ report.details.attachment }}</div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-3"><strong>URL:</strong></div>
                    <div class="col-md-9">
                      <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a>
                    </div>
                  </div>
                </div>
                <div v-else class="mobile-info-box">
                  <div><strong>발신자:</strong> {{ report.details.sender }}</div>
                  <div><strong>제목:</strong> {{ report.details.subject }}</div>
                  <div><strong>첨부파일:</strong> {{ report.details.attachment }}</div>
                  <div><strong>URL:</strong> <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a></div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- 페이징 -->
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center mt-3">
        <!-- 이전 페이지 버튼 -->
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
        </li>

        <!-- 동적으로 페이지 버튼 생성 -->
        <li
          v-for="page in visiblePages"
          :key="page"
          :class="['page-item', { active: currentPage === page }]"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>

        <!-- 다음 페이지 버튼 -->
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// Props
const props = defineProps({
  reports: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});

// Emit events
const emit = defineEmits(["update:currentPage", "toggle-details", "update-status"]);

// 상태 옵션 배열
const statusOptions = ["피싱", "악성코드", "캠페인", "오신고"];

// 수정 핸들러
function handleEdit(reportId, selectedOption) {
  // Emit event to parent to handle status update
  emit("update-status", { reportId, newStatus: selectedOption });
}

// 상세 보기 토글
function emitToggleDetails(reportId) {
  emit("toggle-details", reportId);
}

// 상태 클래스 반환
function statusClass(status) {
  const classes = {
    피싱: "text-danger fw-bold",
    악성코드: "text-warning fw-bold",
    캠페인: "text-info fw-bold",
    오신고: "text-secondary fw-bold",
  };
  return classes[status] || "text-muted fw-bold"; // Default class if status is null
}

// 페이징 계산
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));

// 최대 표시할 페이지 버튼 수
const maxPageButtons = 10;

// 현재 페이지에 따라 표시할 페이지 번호 계산
const visiblePages = computed(() => {
  const pages = [];
  let startPage = Math.max(1, props.currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 페이지 변경 함수
function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  emit("update:currentPage", page);
}

// Mobile Detection
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 576;
});
</script>

<style scoped>
.detail-box {
  border-left: 4px solid #0d6efd;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.pagination .page-link {
  cursor: pointer;
}

.mobile-info-box {
  padding: 10px;
  font-size: 0.85rem;
  line-height: 1.4;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  margin: 10px auto;
}

.mobile-info-box div {
  margin-bottom: 8px;
  word-break: break-word; /* Prevent text overflow */
}

.gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
}

.red-gradient-text {
  background: linear-gradient(135deg, #ff0000, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
}

.btn-sm {
  padding: 0.5rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* 드롭다운 메뉴의 z-index 조정 */
.dropdown-menu {
  z-index: 1000;
}

/* Scoped CSS에서 드롭다운 화살표를 방해하지 않도록 조정 */
.dropdown-toggle::after {
  content: "";
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-left: 0.3em solid transparent;
}

/* 드롭다운 버튼의 위치 조정 */
.btn-warning.dropdown-toggle,
.btn-secondary.dropdown-toggle {
  position: relative;
}

/* 추가 스타일: edit-column */
.edit-column {
  position: relative;
}

/* 드롭다운 메뉴 항목 스타일 */
.dropdown-item {
  cursor: pointer;
}

/* Responsive Column Classes */
@media (max-width: 1200px) {
  .title-column {
    display: none;
  }
}

@media (max-width: 992px) {
  .sector-column {
    display: none;
  }
}

@media (max-width: 768px) {
  .company-column {
    display: none;
  }
}

@media (max-width: 576px) {
  .name-column {
    display: none;
  }

  /* 첨부파일과 URL 열 숨기기 */
  .attachment-column,
  .url-column {
    display: none;
  }

  .btn-sm {
    padding: 0.1rem 0.4rem;
    font-size: 0.775rem;
  }

  /* 테이블 셀의 텍스트 크기 조정 */
  .table th,
  .table td {
    padding: 8px;
    font-size: 12px;
    word-break: break-word; /* Prevent text overflow */
  }

  /* 모바일 정보 박스 텍스트 크기 조정 */
  .mobile-info-box {
    font-size: 0.75rem;
  }

  /* 날짜 셀에서 줄 바꿈 허용 (이미 위에서 정의) */
}

/* date-column 클래스: 모바일에서 줄 바꿈 허용 */
.date-column {
  white-space: nowrap;
}

@media (max-width: 576px) {
  .date-column {
    white-space: normal;
    word-break: break-word;
  }
}

/* long-text 클래스: 긴 텍스트가 잘리지 않고 표시되도록 함 */
.long-text {
  max-width: 200px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  word-break: break-word; /* Prevent text overflow */
}

/* 그라데이션 텍스트 스타일 */
.gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
}

.red-gradient-text {
  background: linear-gradient(135deg, #ff0000, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
}

.toggle-button {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
  padding: 0.25rem 0.4rem;
  font-size: 1rem;
  line-height: 1;
  border-radius: 0.2rem;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.toggle-button:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.toggle-button:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.5);
}
</style>
