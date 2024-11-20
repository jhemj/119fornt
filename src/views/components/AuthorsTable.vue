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
            <template v-for="report in filteredReports" :key="report.id">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

// 토스트 알림 사용 설정
const toast = useToast();

// 모바일 여부 판단
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 576;
});

// 상태 옵션 배열
const statusOptions = ['피싱', '악성코드', '캠페인', '오신고'];

// 유틸리티 함수: 랜덤 날짜 생성
const getRandomDate = () => {
  const start = new Date(2022, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${year}/${month}/${day}`;
};

// 유틸리티 함수: 랜덤 이메일 생성
const getRandomEmail = (name) => {
  const domains = ['example.com', 'mail.com', 'test.org', 'domain.net'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name.toLowerCase()}@${domain}`;
};

// 유틸리티 함수: 랜덤 URL 생성
const getRandomUrl = () => {
  const protocols = ['http', 'https'];
  const domains = ['malicious-site.com', 'phishing.com', 'virus-download.com', 'fake-finance.com'];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${protocol}://${domain}`;
};

// 유틸리티 함수: 랜덤 이름 생성
const getRandomName = () => {
  const firstNames = ['김민수', '이영희', '박지훈', '최수진', '정우성', '한지민', '오지은', '장동건', '수지', '이민호'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

// 유틸리티 함수: 랜덤 회사 및 부문 생성
const getRandomCompany = () => {
  const companies = ['KT', '삼성', 'LG', '현대', '카카오', '네이버', 'SK', '롯데', '포스코', '한화'];
  return companies[Math.floor(Math.random() * companies.length)];
};

const getRandomSector = () => {
  const sectors = ['마케팅', '개발', '재무', '인사', '영업', '고객지원', '운영', '디자인', '기획', 'IT'];
  return sectors[Math.floor(Math.random() * sectors.length)];
};

const getRandomTitle = () => {
  const titles = ['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무', '대표', '팀장'];
  return titles[Math.floor(Math.random() * titles.length)];
};

const getRandomAiAnalysis = () => {
  const analyses = ['피싱', '악성코드', '캠페인', '오신고'];
  return analyses[Math.floor(Math.random() * analyses.length)];
};

// 더미 데이터 생성 함수
const generateRandomReports = (count) => {
  const reports = [];
  for (let i = 1; i <= count; i++) {
    const name = getRandomName();
    const company = getRandomCompany();
    const sector = getRandomSector();
    const title = getRandomTitle();
    const aiAnalysis = getRandomAiAnalysis();
    const subject = aiAnalysis === '피싱' ? '보안 위협 관련 문의' :
                    aiAnalysis === '악성코드' ? '악성코드 발견 보고' :
                    aiAnalysis === '캠페인' ? '마케팅 캠페인 제안' :
                    '기타 신고';
    const attachment = aiAnalysis === '악성코드' ? 'virus.exe' :
                       aiAnalysis === '캠페인' ? 'campaign.pdf' :
                       aiAnalysis === '피싱' ? '없음' : 'document.docx';
    reports.push({
      id: i,
      receivedDate: getRandomDate(),
      company: company,
      sector: sector,
      title: title,
      name: name,
      email: getRandomEmail(name),
      subject: subject,
      aiAnalysis: aiAnalysis,
      status: null, // status 기본값을 null로 설정
      details: {
        sender: `${aiAnalysis.toLowerCase()}@example.com`,
        subject: subject,
        attachment: attachment,
        bodyUrl: getRandomUrl(),
      },
    });
  }
  return reports;
};

// 더미 데이터 초기화
const reports = ref(generateRandomReports(20));

// 계산된 속성: status가 null인 데이터만 필터링
const filteredReports = computed(() => {
  return reports.value.filter(report => report.status === null);
});

// "저장" 버튼 클릭 시 호출되는 함수
const handleSave = (id) => {
  const report = reports.value.find((r) => r.id === id);
  if (report) {
    // `status` 변수에 `aiAnalysis` 값 저장
    report.status = report.aiAnalysis;

    // 알림 메시지를 동적으로 설정
    toast.success(`${report.aiAnalysis}으로 저장되었습니다.`, {
      timeout: 3000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  }
};

// 수정 함수
const handleEdit = (id, selectedOption) => {
  const report = reports.value.find((r) => r.id === id);
  if (report) {

    // `status` 변수에도 수정된 값 저장
    report.status = selectedOption;

    // 알림 메시지 표시
    toast.success(`${selectedOption}으로 수정, 저장되었습니다.`, {
      timeout: 3000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  }
};
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
</style>