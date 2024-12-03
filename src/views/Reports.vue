<!-- Reports.vue -->
<template>
  <div class="container-fluid mt-4">
    <!-- 필터링 컨트롤 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card p-3 shadow-sm">
          <h5 class="mb-3">신고 필터링</h5>
          <div class="d-flex flex-wrap align-items-center gap-3">
            <div class="flex-grow-1">
              <label for="start-date" class="form-label">시작 날짜</label>
              <input
                type="date"
                id="start-date"
                class="form-control"
                v-model="filterPeriod.start"
              />
            </div>
            <div class="flex-grow-1">
              <label for="end-date" class="form-label">종료 날짜</label>
              <input
                type="date"
                id="end-date"
                class="form-control"
                v-model="filterPeriod.end"
              />
            </div>
            <!-- 검색 키워드 입력 -->
            <div class="flex-grow-1">
              <label for="search-keywords" class="form-label">검색 키워드 (다중 키워드는 space로 구분)</label>
              <input
                type="text"
                id="search-keywords"
                class="form-control"
                v-model="searchKeywords"
                placeholder="예: 피싱 긴급"
              />
            </div>
            <div class="mt-4">
              <button class="btn btn-primary me-2" @click="applyFilters">
                필터 적용
              </button>
              <button class="btn btn-secondary" @click="resetFilters">
                리셋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 분석 및 테이블 컴포넌트 -->
    <div class="row">
      <div class="col-12">
        <reports-analyze 
          :reports="reports" 
          :status-aggregations="statusAggregations"
          :company-aggregations="companyAggregations"
        />
      </div>
      <div class="col-12 mt-4">
        <reports-table
          :reports="reports"
          :current-page="currentPage"
          :page-size="pageSize"
          :total-items="totalItems"
          :total-pages="totalPages"
          @toggle-details="toggleDetails"
          @update-status="handleUpdateStatus"
          @update:currentPage="updateCurrentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReportsTable from "./components/ReportsTable.vue";
import ReportsAnalyze from "./components/ReportsAnalyze.vue";

// Toast for notifications
import { useToast } from "vue-toastification";
const toast = useToast();

// 데이터 상태
const reports = ref([]);
const totalItems = ref(0);

// 집계 데이터 상태
const statusAggregations = ref([]);
const companyAggregations = ref([]);

// 필터 상태
const filterPeriod = ref({ start: "", end: "" });
const searchKeywords = ref("");

// 페이징 상태
const currentPage = ref(1);
const pageSize = ref(20); // reactive로 변경하여 필요 시 동적으로 변경 가능
const totalPages = ref(1);

// Axios 가져오기
import axios from "axios";

// 데이터 가져오기 함수
async function fetchReports() {
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
    };

    // 날짜 필터 추가
    if (filterPeriod.value.start) {
      params['receivedDate__gte'] = filterPeriod.value.start;
    }
    if (filterPeriod.value.end) {
      params['receivedDate__lte'] = filterPeriod.value.end;
    }

    // 검색 키워드 추가
    if (searchKeywords.value.trim()) {
      params.search = searchKeywords.value;
    }

    const response = await axios.get("http://52.231.104.51/api/reports/", {
      params,
    });

    // 응답 데이터가 페이지네이션된 객체라고 가정
    const data = response.data;
    reports.value = data.results.map((report) => ({
      id: report.id,
      receivedDate: report.receivedDate || randomDate(),
      company: report.company || "Unknown",
      sector: report.sector || "Unknown",
      title: report.subject || "Unknown",
      name: report.name || "Unknown",
      email: report.email || "unknown@example.com",
      subject: report.subject || "문의 제목 없음",
      status: report.status || "Unknown",
      details: {
        sender: report.sender_email || "unknown@example.com",
        subject: report.subject || "세부 주제 관련 없음",
        attachments:
          report.attachments && report.attachments.length > 0
            ? report.attachments.map((att) => att.filename).join(", ")
            : "없음",
        bodyUrls:
          report.urls && report.urls.length > 0
            ? report.urls.map((url) => url.url).join(", ")
            : "없음",
      },
      showDetails: false, // 상세보기 초기화
    }));

    totalItems.value = data.count || 0; // 전체 아이템 수 설정
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
  } catch (error) {
    console.error(
      "Failed to fetch reports:",
      error.response ? error.response.data : error.message
    );
    toast.error("데이터를 불러오는 데 실패했습니다.");
  }
}

// 상태별 집계 데이터 가져오기 함수
async function fetchStatusAggregations() {
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
    };

    // 날짜 필터 추가
    if (filterPeriod.value.start) {
      params['receivedDate__gte'] = filterPeriod.value.start;
    }
    if (filterPeriod.value.end) {
      params['receivedDate__lte'] = filterPeriod.value.end;
    }

    // 검색 키워드 추가
    if (searchKeywords.value.trim()) {
      params.search = searchKeywords.value;
    }

    const response = await axios.get("http://52.231.104.51/api/reports/report-status-aggregation", {
      params,
    });

    statusAggregations.value = response.data;
  } catch (error) {
    console.error(
      "Failed to fetch status aggregations:",
      error.response ? error.response.data : error.message
    );
    toast.error("상태별 집계 데이터를 불러오는 데 실패했습니다.");
  }
}

// 회사별 집계 데이터 가져오기 함수
async function fetchCompanyAggregations() {
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
    };

    // 날짜 필터 추가
    if (filterPeriod.value.start) {
      params['receivedDate__gte'] = filterPeriod.value.start;
    }
    if (filterPeriod.value.end) {
      params['receivedDate__lte'] = filterPeriod.value.end;
    }

    // 검색 키워드 추가
    if (searchKeywords.value.trim()) {
      params.search = searchKeywords.value;
    }

    const response = await axios.get("http://52.231.104.51/api/reports/report-company-aggregation", {
      params,
    });

    companyAggregations.value = response.data;
  } catch (error) {
    console.error(
      "Failed to fetch company aggregations:",
      error.response ? error.response.data : error.message
    );
    toast.error("회사별 집계 데이터를 불러오는 데 실패했습니다.");
  }
}

// 전체 집계 데이터 가져오기 함수
async function fetchAggregations() {
  await Promise.all([
    fetchStatusAggregations(),
    fetchCompanyAggregations(),
  ]);
}

// 필터 적용 함수
function applyFilters() {
  currentPage.value = 1;
  fetchReports();
  fetchAggregations(); // 필터 변경 시 집계 데이터도 갱신
}

// 필터 리셋 함수
function resetFilters() {
  filterPeriod.value = { start: "", end: "" };
  searchKeywords.value = "";
  currentPage.value = 1;
  fetchReports();
  fetchAggregations();
}

// 페이지 업데이트 함수
function updateCurrentPage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchReports();
    fetchAggregations(); // 페이지 변경 시 집계 데이터도 갱신
  }
}

// 상세 보기 토글
function toggleDetails(reportId) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    report.showDetails = !report.showDetails;
  }
}

// 상태 업데이트 처리
async function handleUpdateStatus({ reportId, newStatus }) {
  try {
    const response = await axios.patch(
      `http://52.231.104.51/api/reports/${reportId}/`,
      {
        status: newStatus,
      }
    );
    const report = reports.value.find((r) => r.id === reportId);
    if (report) {
      report.status = response.data.status || newStatus;
      toast.success(`상태가 "${newStatus}"(으)로 수정되었습니다.`, {
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    // 집계 데이터도 업데이트 필요 시 fetchAggregations() 호출
    fetchAggregations();
  } catch (error) {
    console.error("Failed to update status:", error);
    toast.error("상태 업데이트에 실패했습니다.");
  }
}

// 랜덤 날짜 생성 (더미 데이터용)
function randomDate() {
  const year = 2000 + Math.floor(Math.random() * 24);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식
}

// 초기화 호출
onMounted(() => {
  fetchReports();
  fetchAggregations(); // 컴포넌트 마운트 시 집계 데이터도 초기 로드
});
</script>

<style>
/* Global Styles */
.card {
  border: none;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
