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
                @change="currentPage = 1"
              />
            </div>
            <div class="flex-grow-1">
              <label for="end-date" class="form-label">종료 날짜</label>
              <input
                type="date"
                id="end-date"
                class="form-control"
                v-model="filterPeriod.end"
                @change="currentPage = 1"
              />
            </div>
            <div class="mt-4">
              <button class="btn btn-primary me-2" @click="currentPage = 1">
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
        <reports-analyze :reports="filteredReports" />
      </div>
      <div class="col-12 mt-4">
        <reports-table
          :reports="paginatedReports"
          :current-page="currentPage"
          :page-size="pageSize"
          :total-items="filteredReports.length"
          @toggle-details="toggleDetails"
          @update-status="handleUpdateStatus"
          @update:currentPage="updateCurrentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ReportsTable from "./components/ReportsTable.vue";
import ReportsAnalyze from "./components/ReportsAnalyze.vue";

// Toast for notifications
import { useToast } from "vue-toastification";
const toast = useToast();

// 데이터 상태
const reports = ref([]);

// 필터 상태
const filterPeriod = ref({ start: "", end: "" });

// 페이징 상태
const currentPage = ref(1);
const pageSize = 20;

// 데이터 초기화
function initializeReports() {
  reports.value = generateDummyData();
}

// 더미 데이터 생성
function generateDummyData() {
  const statuses = ["피싱", "악성코드", "캠페인", "오신고"];
  const companies = ["KT", "KT CS", "KT Cloud"];
  const sectors = ["기술혁신부문", "전략신사업부문", "대구경북광역본부", "E부문"];
  const titles = ["사원", "대리", "과장", "차장", "부장"];
  const names = ["김철수", "이영희", "박지성", "최영미", "장민호", "윤소라"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    receivedDate: randomDate(), // 'YYYY-MM-DD' 형식
    company: randomItem(companies),
    sector: randomItem(sectors),
    title: randomItem(titles),
    name: randomItem(names),
    email: `${randomItem(names).toLowerCase().replace(" ", "")}@${randomItem(companies).toLowerCase().replace(" ", "")}.com`,
    subject: "보안 위협 관련 문의",
    status: randomItem(statuses),
    details: {
      sender: `${Math.random().toString(36).substring(7)}@example.com`,
      subject: "세부 주제 관련 문의",
      attachment: "문서.pdf",
      bodyUrl: "http://example.com",
    },
    showDetails: false, // 상세보기 초기화
  }));
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate() {
  const year = 2000 + Math.floor(Math.random() * 24);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식
}

// 필터 적용을 위한 계산된 속성
const filteredReports = computed(() => {
  const { start, end } = filterPeriod.value;
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      toast.error("시작 날짜가 종료 날짜보다 이후일 수 없습니다.");
      return reports.value; // 필터 적용 안 함
    }
    return reports.value.filter((report) => {
      const reportDate = new Date(report.receivedDate);
      return reportDate >= startDate && reportDate <= endDate;
    });
  } else {
    return reports.value;
  }
});

// 필터 리셋
function resetFilters() {
  filterPeriod.value = { start: "", end: "" };
  currentPage.value = 1;
}

// 페이징 계산
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredReports.value.slice(start, end);
});

// 페이지 업데이트
function updateCurrentPage(newPage) {
  currentPage.value = newPage;
}

// 상세 보기 토글
function toggleDetails(reportId) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    report.showDetails = !report.showDetails;
  }
}

// 상태 업데이트 처리
function handleUpdateStatus({ reportId, newStatus }) {
  const report = reports.value.find((r) => r.id === reportId);
  if (report) {
    report.status = newStatus;
    toast.success(`상태가 "${newStatus}"(으)로 수정되었습니다.`, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }
}

// 초기화 호출
onMounted(() => {
  initializeReports();
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