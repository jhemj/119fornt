<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>전체 신고 리스트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-container">
        <transition-group name="fade" tag="table" class="table align-items-center mb-0" style="table-layout: fixed; width: 100%;">
          <thead>
            <tr>
              <th class="text-xs number-column">번호</th>
              <th class="text-xs date-column">날짜</th>
              <th class="text-xs sender-column">발신자</th>
              <th class="text-xs title-column">제목</th>
              <th class="text-xs attachment-column">첨부파일</th>
              <th class="text-xs bodyurl-column">본문 URL</th>
              <th class="text-xs status-column">상태</th>
              <th class="text-xs edit-column">수정</th>
              <th class="text-xs response-column">대응</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="report in paginatedReports" :key="report.id">
              <tr>
                <td class="text-xs number-column">{{ report.id }}</td>
                <td class="text-xs date-column">{{ report.receivedDate }}</td>
                <td class="text-xs sender-column">{{ report.details.sender }}</td>
                <td class="text-xs title-column">{{ report.details.subject }}</td>
                <td class="text-xs attachment-column">{{ report.details.attachment }}</td>
                <td class="text-xs bodyurl-column">
                  <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a>
                </td>
                <td :class="['text-xs', { 'text-danger font-weight-bold': ['피싱', '악성코드'].includes(report.status) }]">
                  {{ report.status }}
                </td>
                <!-- 수정 드롭다운 -->
                <td class="edit-column">
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
                    <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '피싱')">피싱</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '악성코드')">악성코드</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '캠페인')">캠페인</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '오신고')">오신고</a></li>
                  </ul>
                </td>
                <!-- 대응 드롭다운 -->
                <td class="response-column">
                  <button
                    class="btn btn-secondary btn-sm response-button dropdown-toggle"
                    type="button"
                    :id="'responseDropdownButton-' + report.id"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    대응
                  </button>
                  <ul class="dropdown-menu" :aria-labelledby="'responseDropdownButton-' + report.id">
                    <li><a class="dropdown-item" href="#" @click.prevent="blockSender(report.id)">발신자 차단</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="blockUrl(report.id)">URL 차단</a></li>
                  </ul>
                </td>
              </tr>
              <!-- 모바일에서만 보이는 첨부파일 및 본문 URL 박스 -->
              <tr v-show="isMobile" class="mobile-info-row">
                <td colspan="9">
                  <div class="mobile-info-box">
                    <div><strong>첨부파일:</strong> {{ report.details.attachment }}</div>
                    <div><strong>본문 URL:</strong> <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a></div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </transition-group>
      </div>
      <div class="text-center mt-3">
        <ArgonPagination
          :totalItems="filteredReports.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          color="primary"
          size="sm"
          @update:currentPage="updateCurrentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ArgonPagination from '../../components/ArgonPagination.vue';
import { useToast } from 'vue-toastification'; // vue-toastification 임포트

const toast = useToast(); // 토스트 인스턴스 생성

// 모바일 여부 판단
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 576;
});

// 신고 데이터 설정
const reports = ref(generateDummyData());
const currentPage = ref(1);
const pageSize = 20;
const filteredReports = computed(() => {
  return reports.value.filter(report => ['피싱', '악성코드'].includes(report.status));
});
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredReports.value.slice(start, end);
});

// 더미 데이터 생성 함수
function generateDummyData() {
  const statuses = ['피싱', '악성코드', '캠페인', '오신고'];
  const companies = ['KT', 'KT cs', 'KT Cloud'];
  const sectors = ['기술혁신부문', '전략신사업부문', '대구경북광역본부', 'E부문'];
  const titles = ['사원', '대리', '과장', '차장', '부장'];
  const names = ['김철수', '이영희', '박지성', '최영미', '장민호', '윤소라', '서태지', '한가림', '주영훈', '남주리'];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    receivedDate: `20${String(Math.floor(Math.random() * 20 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    sector: sectors[Math.floor(Math.random() * sectors.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    name: names[Math.floor(Math.random() * names.length)],
    email: `${names[Math.floor(Math.random() * names.length)].toLowerCase()}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`,
    subject: '보안 위협 관련 문의',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    details: {
      sender: `${Math.random().toString(36).substring(7)}@example.com`,
      subject: '보안 위협 관련 문의',
      attachment: '문서.pdf',
      bodyUrl: 'http://example.com'
    },
    showResponse: false
  }));
}

function updateCurrentPage(newPage) {
  currentPage.value = newPage;
}

function handleEdit(reportId, selectedOption) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.status = selectedOption;

    // 토스트 알림 표시 (성공 메시지)
    toast.success(`상태가 "${selectedOption}"(으)로 수정되었습니다.`, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
}

function blockSender(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    // 발신자 차단 로직 (예: 데이터베이스 업데이트 등)
    // 여기서는 단순히 알림만 표시

    // 토스트 알림 표시 (오류 메시지)
    toast.error(`"${report.details.sender}" 가 차단되었습니다.`, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
}

function blockUrl(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    // URL 차단 로직 (예: 데이터베이스 업데이트 등)
    // 여기서는 단순히 알림만 표시

    // 토스트 알림 표시 (오류 메시지)
    toast.error(`"${report.details.bodyUrl}" 가 차단되었습니다.`, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
}
</script>

<style scoped>
/* 일반 스타일 */

.table-container {
  overflow-x: auto;
  width: 100%;
}

.table {
  width: 100%;
  table-layout: auto;
  box-sizing: border-box;
}

.table th,
.table td {
  box-sizing: border-box;
  text-align: center;
  font-size: 0.75rem;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  padding: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.response-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-icon {
  background: none;
  border: none;
  color: #5e72e4;
  font-size: 1rem;
  padding: 0;
}

.text-danger {
  color: #dc3545 !important;
}

.font-weight-bold {
  font-weight: bold;
}

/* 각 열의 최소 너비 설정 */

.number-column {
  min-width: 5%;
}

.date-column {
  min-width: 10%;
}

.sender-column {
  min-width: 15%;
}

.title-column {
  min-width: 15%;
}

.attachment-column {
  min-width: 12%;
}

.bodyurl-column {
  min-width: 5%;
}

.status-column {
  min-width: 10%;
}

.edit-column {
  min-width: 10%;
}

.response-column {
  min-width: 5%;
}

.edit-button,
.response-button {
  padding-left: 6px;
  padding-right: 6px;
}

.table th,
.table td {
  padding: 8px;
}

/* 모바일 스타일 */

@media (max-width: 576px) {
  .table-container {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    table-layout: fixed; /* 테이블 레이아웃을 고정으로 설정 */
  }

  /* 숨길 열의 th와 td를 완전히 숨기기 */
  .attachment-column,
  .bodyurl-column,
  .table th.attachment-column,
  .table td.attachment-column,
  .table th.bodyurl-column,
  .table td.bodyurl-column {
    display: none;
  }

  /* 남은 열의 너비를 재조정 */
  .number-column,
  .date-column,
  .sender-column,
  .title-column,
  .status-column,
  .edit-column,
  .response-column {
    width: 14.28%; /* 남은 7개의 열을 균등하게 분배 */
  }

  .table th,
  .table td {
    padding: 4px; /* 패딩 축소 */
    font-size: 0.7rem; /* 글꼴 크기 축소 */
    line-height: 1.2; /* 라인 높이 조정으로 행 높이 감소 */
  }

  /* 버튼 크기 조정 */
  .btn {
    padding: 2px 4px;
    font-size: 0.65rem;
  }

  .dropdown-menu {
    font-size: 0.75rem;
  }

  /* 모바일 정보 박스 레이아웃 조정 */
  .mobile-info-row .mobile-info-box {
    padding: 6px;
    font-size: 0.7rem;
    line-height: 1.2;
    background-color: #f1f3f5;
    border: 1px solid #ddd;
    margin: 5px auto;
  }

  .mobile-info-box div {
    margin-bottom: 5px;
  }
}
</style>