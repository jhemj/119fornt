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
              <th class="text-xs action-column">대응 / 수정</th>
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
                <td class="action-column">
                  <div class="action-buttons">
                    <button class="btn btn-sm bg-gradient-primary me-2" @click="toggleResponse(report.id)">
                      대응
                    </button>
                    <div class="dropdown">
                      <button
                        class="btn btn-warning btn-sm dropdown-toggle"
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
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="report.showResponse" class="response-row">
                <td colspan="8">
                  <div class="response-box">
                    <button class="btn btn-sm btn-danger me-2" @click="blockSender(report.id)">
                      <i class="fas fa-ban me-1"></i> 발신자 차단
                    </button>
                    <button class="btn btn-sm btn-secondary" @click="blockUrl(report.id)">
                      <i class="fas fa-link me-1"></i> URL 차단
                    </button>
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

// 신고 데이터 초기화
const reports = ref(generateDummyData());

// 현재 페이지와 페이지 당 항목 수 설정
const currentPage = ref(1);
const pageSize = 20;

// '피싱'과 '악성코드' 상태의 신고만 필터링
const filteredReports = computed(() => {
  return reports.value.filter(report => ['피싱', '악성코드'].includes(report.status));
});

// 페이징 처리된 신고 데이터
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

// 대응 정보 표시 토글 함수
function toggleResponse(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.showResponse = !report.showResponse;
  }
}

// 페이지 변경 핸들러
function updateCurrentPage(newPage) {
  currentPage.value = newPage;
}

// 상태 수정 핸들러 (현재는 '피싱', '악성코드', '캠페인', '오신고' 선택 가능)
function handleEdit(reportId, selectedOption) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.status = selectedOption;
  }
}

// 발신자 차단 핸들러
function blockSender(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    // 발신자 차단 로직 구현
    alert(`발신자 ${report.details.sender}을(를) 차단했습니다.`);
  }
}

// URL 차단 핸들러
function blockUrl(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    // URL 차단 로직 구현
    alert(`URL ${report.details.bodyUrl}을(를) 차단했습니다.`);
  }
}
</script>

<style scoped>
/* 박스 모델 설정 */
.table, .table th, .table td {
  box-sizing: border-box;
}

/* 페이드 트랜지션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 응답 박스 스타일 */
.response-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; /* 버튼 감싸기 허용 */
}

/* 버튼 색상 설정 */
.btn-danger {
  background-color: #dc3545;
  border: none;
}
.btn-secondary {
  background-color: #6c757d;
  border: none;
}

/* 응답 행 스타일 */
.response-row {
  background-color: #f1f3f5;
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 상세 박스 스타일 */
.detail-box {
  background-color: #f8f9fa;
  padding: 10px;
  border-left: 5px solid #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 0.875rem;
}
.detail-box table {
  margin: 0;
}

/* 테이블 글자 크기 및 줄 바꿈 */
.table th, .table td {
  font-size: 0.75rem;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* 텍스트 센터 정렬 */
.text-center {
  text-align: center;
}

/* 버튼 스타일 조정 */
.btn.bg-gradient-primary {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: #fff;
  border: none;
}

/* 상태 텍스트 스타일 */
.text-danger {
  color: #dc3545 !important;
}
.font-weight-bold {
  font-weight: bold;
}

/* 테이블 컨테이너 수정: 수평 스크롤 허용 */
.table-container {
  overflow-x: auto; /* 수평 스크롤 허용 */
}

/* 각 열에 대해 고정된 너비 설정 */
.number-column {
  width: 5%;
}
.date-column {
  width: 10%;
}
.sender-column {
  width: 18%;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
.title-column {
  width: 12%;
}
.attachment-column {
  width: 10%;
}
.bodyurl-column {
  width: 13%;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
.status-column {
  width: 10%;
}
.action-column {
  width: 14%; /* 대응과 수정 버튼을 포함한 열 너비 조정 */
}

/* 셀 패딩 조정 */
.table th, .table td {
  padding: 8px; /* 패딩 줄이기 */
}

/* 반응형 디자인: 작은 화면에서 열 숨기기 및 버튼 크기 조정 */
@media (max-width: 576px) {
  .table th, .table td {
    font-size: 0.65rem;
    padding: 6px; /* 패딩 더 줄이기 */
  }

  .btn {
    padding: 4px 6px;
    font-size: 0.65rem;
  }

  .dropdown-menu {
    font-size: 0.75rem;
  }

  /* 버튼 레이아웃 조정 */
  .action-buttons {
    flex-direction: column; /* 수직으로 쌓기 */
    align-items: stretch; /* 버튼을 전체 너비로 */
  }

  .action-buttons .btn,
  .action-buttons .dropdown {
    width: 100%; /* 전체 너비로 설정 */
    margin-bottom: 5px; /* 버튼 간격 추가 */
  }
}
</style>