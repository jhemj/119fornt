<!-- AuthorsTable.vue -->

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>미분류 신고 리스트</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-container p-0">
        <table class="table align-items-center mb-0">
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
              <th class="text-xs attachment-column">첨부파일</th>
              <th class="text-xs url-column">URL</th>
              <th class="text-xs ai-assistant-header">AI Assistant</th>
              <th class="text-xs">저장</th>
              <th class="text-xs">수정</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="report in reports" :key="report.id">
              <tr>
                <td class="align-middle text-sm">{{ report.id }}</td>
                <td class="align-middle text-sm">{{ report.receivedDate }}</td>
                <td class="align-middle text-sm company-column">{{ report.company }}</td>
                <td class="align-middle text-sm sector-column">{{ report.sector }}</td>
                <td class="align-middle text-sm title-column">{{ report.title }}</td>
                <td class="align-middle text-sm name-column">{{ report.name }}</td>
                <td class="align-middle text-sm long-text">{{ report.email }}</td>
                <td class="align-middle text-sm long-text">{{ report.subject }}</td>
                <td class="align-middle text-sm attachment-column">{{ report.details.attachment }}</td>
                <td class="align-middle text-sm url-column">
                  <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a>
                </td>
                <td class="align-middle text-sm ai-assistant-cell">
                  <span :class="['gradient-text', {'red-gradient-text': report.aiAnalysis === '피싱' || report.aiAnalysis === '악성코드'}]">
                    {{ report.aiAnalysis }}
                  </span>
                </td>
                <td class="align-middle text-center">
                  <button class="btn btn-success btn-sm" @click="handleSave(report.id)">저장</button>
                </td>
                <td class="align-middle text-center edit-column">
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
              </tr>
              <!-- 모바일에서만 보이는 첨부파일 및 URL 박스 -->
              <tr v-show="isMobile" class="mobile-info-row">
                <td colspan="13">
                  <div class="mobile-info-box">
                    <div><strong>첨부파일:</strong> {{ report.details.attachment }}</div>
                    <div><strong>URL:</strong> <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a></div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!-- 페이지네이션 컨트롤 추가 -->
      <nav aria-label="Page navigation example" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: !pagination.previous }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: !pagination.next }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Removed 'computed' from imports
import { useToast } from 'vue-toastification';
import axios from 'axios';

// 토스트 알림 설정
const toast = useToast();

// 모바일 여부 판단
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 576;
});

// 상태 옵션 배열
const statusOptions = ['피싱', '악성코드', '캠페인', '오신고'];

// 신고 리스트 상태
const reports = ref([]);

// 페이지네이션 상태
const currentPage = ref(1);
const totalPages = ref(1);
const pagination = ref({
  count: 0,
  next: null,
  previous: null,
});

// "저장" 버튼 클릭 시 호출되는 함수
const handleSave = async (id) => {
  const report = reports.value.find((r) => r.id === id);
  if (report) {
    try {
      // API 호출: 상태 업데이트
      await axios.patch(`http://52.231.104.51/api/reports/update-status/${id}/`, {
        status: report.aiAnalysis, // AI 분석 상태로 저장
      });
      report.status = report.aiAnalysis; // 상태 업데이트
      toast.success(`${report.aiAnalysis}으로 저장되었습니다.`, {
        timeout: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      // 페이지 새로고침 (옵션)
      fetchReports(currentPage.value);
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
      console.error(error);
    }
  }
};

// "수정" 버튼 클릭 시 호출되는 함수
const handleEdit = async (id, selectedOption) => {
  const report = reports.value.find((r) => r.id === id);
  if (report) {
    try {
      // API 호출: 상태 업데이트
      await axios.patch(`http://52.231.104.51/api/reports/update-status/${id}/`, {
        status: selectedOption,
      });
      report.status = selectedOption; // 상태 업데이트
      toast.success(`${selectedOption}으로 수정, 저장되었습니다.`, {
        timeout: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      // 페이지 새로고침 (옵션)
      fetchReports(currentPage.value);
    } catch (error) {
      toast.error('수정 중 오류가 발생했습니다.');
      console.error(error);
    }
  }
};

// 백엔드에서 데이터 가져오기 (페이지네이션 반영)
const fetchReports = async (page = 1) => {
  try {
    const response = await axios.get('http://52.231.104.51/api/reports/', {
      params: {
        status__isnull: true,
        page: page,
      },
    });
    console.log(response);
    reports.value = response.data.results.map((report) => ({
      id: report.id,
      receivedDate: report.receivedDate,
      company: report.company || 'Unknown',
      sector: report.sector || 'Unknown',
      title: report.title || 'Unknown',
      name: report.name || 'Unknown',
      email: report.email || 'unknown@example.com',
      subject: report.subject || 'No Subject',
      aiAnalysis: report.ai_classification || 'Unknown',
      status: report.status || null,
      details: {
        sender: report.details?.sender || 'unknown@example.com',
        subject: report.details?.subject || 'No Details',
        attachment: report.details?.attachment || 'None',
        bodyUrl: report.details?.bodyUrl || '#',
      },
    }));
    // 페이지네이션 정보 업데이트
    pagination.value.count = response.data.count;
    pagination.value.next = response.data.next;
    pagination.value.previous = response.data.previous;
    totalPages.value = Math.ceil(response.data.count / 10); // 페이지 사이즈가 10인 경우
    currentPage.value = page;
  } catch (error) {
    toast.error('데이터를 가져오는 중 오류가 발생했습니다.');
    console.error(error);
  }
};

// 페이지 이동 함수
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchReports(page);
};

// 컴포넌트가 마운트될 때 첫 페이지 데이터 로드
onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
.table th,
.table td {
  padding: 10px;
  font-size: 14px;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  text-align: center;
}

.long-text {
  max-width: 200px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

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
}

/* 모바일 정보 박스 스타일 */
.mobile-info-box {
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

/* 페이지네이션 스타일 조정 (옵션) */
.pagination .page-item .page-link {
  color: #6c757d;
}

.pagination .page-item.active .page-link {
  background-color: #6a11cb;
  border-color: #6a11cb;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
