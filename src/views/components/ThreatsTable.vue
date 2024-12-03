<script setup>
import { ref, onMounted } from 'vue';
import ArgonPagination from '../../components/ArgonPagination.vue';
import { useToast } from 'vue-toastification';
import axios from 'axios'; // Axios 임포트

const toast = useToast(); // 토스트 인스턴스 생성

// 모바일 여부 판단
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 576;
});

// 신고 데이터 상태
const reports = ref([]);
const currentPage = ref(1);
const pageSize = 20;
const totalItems = ref(0);
const totalPages = ref(0);
const pagination = ref({
  next: null,
  previous: null,
});

// 환경 변수에서 API URL 가져오기 (Vue CLI 기준)
const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://52.231.104.51/api/reports/';

// 데이터 초기화 함수
const fetchReports = async (page = 1) => {
  try {
    const response = await axios.get(`${baseURL}`, {
      params: {
        status__in: '피싱,악성코드', // 필터 파라미터 수정
        page: page, // 페이지 번호
      },
    });

    // 응답 데이터 처리
    reports.value = response.data.results.map((report) => ({
      id: report.id,
      receivedDate: report.receivedDate,
      status: report.status || '미분류',
      sender: report.sender_email || 'unknown@example.com',
      subject: report.subject || 'No Subject',
      attachments: report.attachments?.map(a => a.filename).join(', ') || 'None',
      urls: report.urls?.map(u => u.url).join(', ') || '#',
    }));

    // 페이지네이션 정보 업데이트
    totalItems.value = response.data.count;
    totalPages.value = Math.ceil(totalItems.value / pageSize);
    currentPage.value = page;
    pagination.value.next = response.data.next;
    pagination.value.previous = response.data.previous;
  } catch (error) {
    toast.error('데이터를 가져오는 중 오류가 발생했습니다.');
    console.error(error);
  }
};

// 페이지 변경 함수
function updateCurrentPage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  fetchReports(newPage);
}

// 상태 수정 함수
async function handleEdit(reportId, selectedOption) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    try {
      await axios.patch(`${baseURL}update-status/${reportId}/`, {
        status: selectedOption,
      });
      report.status = selectedOption;
      toast.success(`상태가 "${selectedOption}"(으)로 수정되었습니다.`);
      fetchReports(currentPage.value);
    } catch (error) {
      toast.error('수정 중 오류가 발생했습니다.');
      console.error(error);
    }
  }
}

// 발신자 차단 함수
async function blockSender(reportId) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    try {
      await axios.post(`${baseURL}block-sender/`, { sender: report.sender });
      toast.success(`발신자 "${report.sender}"가 차단되었습니다.`);
    } catch (error) {
      toast.error('발신자 차단 중 오류가 발생했습니다.');
      console.error(error);
    }
  }
}

// URL 차단 함수
async function blockUrl(reportId) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    try {
      await axios.post(`${baseURL}block-url/`, { url: report.urls });
      toast.success(`URL "${report.urls}"가 차단되었습니다.`);
    } catch (error) {
      toast.error('URL 차단 중 오류가 발생했습니다.');
      console.error(error);
    }
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchReports();
});
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>전체 신고 리스트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <!-- 테이블 컨테이너 -->
      <div class="table-container">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th>번호</th>
              <th>날짜</th>
              <th>발신자</th>
              <th>제목</th>
              <th>첨부파일</th>
              <th>본문 URL</th>
              <th>상태</th>
              <th>수정</th>
              <th>대응</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.id }}</td>
              <td>{{ report.receivedDate }}</td>
              <td class="text-truncate">{{ report.sender }}</td>
              <td class="text-truncate">{{ report.subject }}</td>
              <td class="text-truncate">{{ report.attachments }}</td>
              <td class="text-truncate">
                <a :href="report.urls" target="_blank">{{ report.urls }}</a>
              </td>
              <td>{{ report.status }}</td>
              <td>
                <button
                  class="btn btn-warning btn-sm"
                  @click="handleEdit(report.id, '피싱')"
                >
                  수정
                </button>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <!-- 발신자 차단 버튼 -->
                  <button
                    class="btn btn-secondary btn-sm btn-block-sender"
                    @click="blockSender(report.id)"
                  >
                    발신자 차단
                  </button>
                  <!-- URL 차단 버튼 -->
                  <button
                    class="btn btn-secondary btn-sm btn-block-url"
                    @click="blockUrl(report.id)"
                  >
                    URL 차단
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 페이지네이션 -->
      <div class="mt-3">
        <ArgonPagination
          :totalItems="totalItems"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @update:currentPage="updateCurrentPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.table-container {
  width: 100%;
  overflow-x: auto; /* 필요 시 가로 스크롤 */
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* 모바일에서 동적으로 테이블 크기 조정 */
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 8px;
  font-size: 0.875rem;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.text-truncate {
  max-width: 150px; /* 넓이를 제한 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 버튼 그룹 스타일링 */
.btn-group {
  display: flex;
  gap: 4px; /* 버튼 간격 */
}

.btn-block-sender,
.btn-block-url {
  flex: 1; /* 버튼의 너비를 동일하게 분배 */
  font-size: 0.75rem; /* 작은 폰트 크기 */
}

@media (max-width: 576px) {
  .table {
    table-layout: auto; /* 모바일에서 레이아웃 조정 */
  }

  .table th,
  .table td {
    font-size: 0.75rem;
    padding: 4px; /* 패딩 축소 */
  }

  .btn-group {
    flex-direction: column; /* 모바일에서 버튼 세로 배치 */
    gap: 8px; /* 버튼 간 간격 */
  }

  .btn-block-sender,
  .btn-block-url {
    width: 100%; /* 버튼 너비를 100%로 */
  }
}
</style>
