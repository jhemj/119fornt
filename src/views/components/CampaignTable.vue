<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>캠페인 메일 조회</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-xs">번호</th>
              <th class="text-xs">전송일</th>
              <th class="text-xs company-column">발신자</th>
              <th class="text-xs sector-column">수신 대상</th>
              <th class="text-xs">내용</th>
              <th class="text-xs">신고율</th>
              <th class="text-xs">본문 보기</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="report in paginatedReports" :key="report.id">
              <tr>
                <td class="text-xs">{{ report.id }}</td>
                <td class="text-xs">{{ report.receivedDate }}</td>
                <td class="text-xs company-column">{{ report.sender }}</td>
                <td class="text-xs sector-column">{{ report.sector }}</td>
                <td class="text-xs title-column">{{ report.title }}</td>
                <td class="text-xs">{{ report.rate }}</td>
                <td>
                  <button class="btn btn-sm bg-gradient-primary" @click="toggleDetails(report.id)">
                    {{ report.showDetails ? '숨김' : '상세' }}
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
  const sender = ['cs.hong@ktit.com', 'minsu.choi@gmail.com', 'mano.kim@kts.com'];
  const titles = ['A사 이직제안', '연금상품 홍보', '복지몰 이벤트', '대출 권유'];
  const sectors = ['사원', '대리', '과장', '차장', '부장'];
  const rates = ['0.83', '0.97', '0.58', '0.71', '0.92'];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    receivedDate: `20${Math.floor(Math.random() * 20 + 1)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    sender: sender[Math.floor(Math.random() * sender.length)],
    sector: sectors[Math.floor(Math.random() * sectors.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    rate: rates[Math.floor(Math.random()*rates.length)],
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
}

.text-center {
  text-align: center;
}

/* 버튼 스타일 조정 */
.btn.bg-gradient-primary {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: #fff;
  border: none;
}

.text-danger {
  color: #dc3545 !important;
}

.font-weight-bold {
  font-weight: bold;
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