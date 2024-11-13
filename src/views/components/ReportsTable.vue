<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>전체 신고 리스트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0 text-center">
          <thead>
            <tr>
              <th class="text-xs">번호</th>
              <th class="text-xs">접수일</th>
              <th class="text-xs company-column">회사</th>
              <th class="text-xs sector-column">부문</th>
              <th class="text-xs title-column">호칭</th>
              <th class="text-xs name-column">이름</th>
              <th class="text-xs">이메일</th>
              <th class="text-xs">제목</th>
              <th class="text-xs">상태</th>
              <th class="text-xs">수정</th>
              <th class="text-xs">상세</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="report in paginatedReports" :key="report.id">
              <tr>
                <td class="text-xs">{{ report.id }}</td>
                <td class="text-xs">{{ report.receivedDate }}</td>
                <td class="text-xs company-column">{{ report.company }}</td>
                <td class="text-xs sector-column">{{ report.sector }}</td>
                <td class="text-xs title-column">{{ report.title }}</td>
                <td class="text-xs name-column">{{ report.name }}</td>
                <td class="text-xs">{{ report.email }}</td>
                <td class="text-xs">{{ report.subject }}</td>
                <td :class="['text-xs', { 'text-danger font-weight-bold': report.status === '피싱' || report.status === '악성코드' }]">
                  {{ report.status }}
                </td>
                <!-- 수정 버튼 -->
                <td>
                  <div class="dropdown">
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
                  </div>
                </td>
                <!-- 상세 버튼 -->
                <td>
                  <button @click="toggleDetails(report.id)" class="btn-icon">
                    <span class="gradient-icon">{{ report.showDetails ? '▴' : '▾' }}</span>
                  </button>
                </td>
              </tr>
              <tr v-if="report.showDetails">
                <td colspan="11">
                  <div class="detail-box">
                    <table class="table table-bordered">
                      <tbody>
                        <tr>
                          <th class="text-xs">발신자</th>
                          <td class="text-xs">{{ report.details.sender }}</td>
                        </tr>
                        <tr>
                          <th class="text-xs">제목</th>
                          <td class="text-xs">{{ report.details.subject }}</td>
                        </tr>
                        <tr>
                          <th class="text-xs">첨부파일</th>
                          <td class="text-xs">{{ report.details.attachment }}</td>
                        </tr>
                        <tr>
                          <th class="text-xs">URL</th>
                          <td class="text-xs"><a :href="report.details.bodyUrl">{{ report.details.bodyUrl }}</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="text-center">
        <ArgonPagination
          :totalItems="reports.length"
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

const reports = ref(generateDummyData());
const currentPage = ref(1);
const pageSize = 20;

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return reports.value.slice(start, end);
});

function generateDummyData() {
  const statuses = ['피싱', '악성코드', '캠페인', '오신고'];
  const companies = ['KT', 'KT cs', 'KT Cloud'];
  const sectors = ['기술혁신부문', '전략신사업부문', '대구경북광역본부', 'E부문'];
  const titles = ['사원', '대리', '과장', '차장', '부장'];
  const names = ['김철수', '이영희', '박지성', '최영미', '장민호', '윤소라', '서태지', '한가림', '주영훈', '남주리'];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    receivedDate: `20${Math.floor(Math.random() * 20 + 1)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    sector: sectors[Math.floor(Math.random() * sectors.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    name: names[Math.floor(Math.random() * names.length)],
    email: `${names[Math.floor(Math.random() * names.length)].toLowerCase()}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`,
    subject: '보안 위협 관련 문의',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    details: {
      sender: `${Math.random().toString(36).substring(7)}@example.com`,
      subject: '세부 주제 관련 문의',
      attachment: '문서.pdf',
      bodyUrl: 'http://example.com'
    },
    showDetails: false
  }));
}

function toggleDetails(reportId) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.showDetails = !report.showDetails;
  }
}

function updateCurrentPage(newPage) {
  currentPage.value = newPage;
}

function handleEdit(reportId, selectedOption) {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.status = selectedOption;
  }
}
</script>

<style scoped>
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

.table th, .table td {
  font-size: 0.75rem;
  white-space: normal;
  word-wrap: break-word;
  text-align: center; /* 데이터 중앙 정렬 */
}

.text-center {
  text-align: center;
}

/* 수정 버튼 패딩 조정 */
.edit-button {
  padding-left: 6px;
  padding-right: 6px;
}

/* 상세 버튼 스타일 */
.btn-icon {
  background: none;
  border: none;
  color: #5e72e4;
  font-size: 1rem;
  padding: 0;
}

/* 파란색 그라데이션 아이콘 스타일 */
.gradient-icon {
  background: linear-gradient(90deg, #0072ff, #0090ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 상태 텍스트 스타일 */
.text-danger {
  color: #dc3545 !important;
}
.font-weight-bold {
  font-weight: bold;
}

.table-responsive {
  overflow-x: hidden;
  overflow-y: hidden;
}

/* 반응형 디자인 */
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