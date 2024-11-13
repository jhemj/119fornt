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
              <th class="text-xs">승인</th>
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
                  <button class="btn btn-success btn-sm">승인</button>
                </td>
                <td class="align-middle text-center">
                  <div class="dropdown">
                    <button class="btn btn-warning btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      수정
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '피싱')">피싱</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '악성코드')">악성코드</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '캠페인')">캠페인</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="handleEdit(report.id, '오신고')">오신고</a></li>
                    </ul>
                  </div>
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
import { ref } from 'vue';

// 모바일 여부 판단
const isMobile = ref(window.innerWidth <= 576);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 576;
});

// 예시 데이터
const reports = ref([
  {
    id: 1,
    receivedDate: '23/04/18',
    company: 'KT',
    sector: '마케팅',
    title: '사원',
    name: '김민수',
    email: 'kimms@kt.com',
    subject: '보안 위협 관련 문의',
    aiAnalysis: '피싱',
    details: {
      sender: 'phishing@example.com',
      subject: '긴급: 계정 정보 업데이트 필요',
      attachment: '없음',
      bodyUrl: 'http://malicious-site.com',
    },
  },
  {
    id: 2,
    receivedDate: '11/01/19',
    company: 'KT',
    sector: '개발',
    title: '대리',
    name: '이영희',
    email: 'leeyh@kt.com',
    subject: '악성코드 발견 보고',
    aiAnalysis: '악성코드',
    details: {
      sender: 'malware@example.com',
      subject: '악성 파일 첨부됨',
      attachment: 'virus.exe',
      bodyUrl: 'http://malware-download.com',
    },
  },
  {
    id: 3,
    receivedDate: '19/09/17',
    company: 'KT',
    sector: '프로젝트',
    title: '과장',
    name: '박준호',
    email: 'parkjh@kt.com',
    subject: '캠페인 관련 제안',
    aiAnalysis: '캠페인',
    details: {
      sender: 'campaign@example.com',
      subject: '새로운 마케팅 전략',
      attachment: 'campaign.pdf',
      bodyUrl: 'http://campaign-site.com',
    },
  },
  {
    id: 4,
    receivedDate: '05/06/20',
    company: 'KT Cloud',
    sector: '지원',
    title: '사원',
    name: '최수진',
    email: 'choisj@ktcloud.com',
    subject: '오신고 확인 요청',
    aiAnalysis: '오신고',
    details: {
      sender: 'noreply@example.com',
      subject: '자동 응답 메일',
      attachment: '없음',
      bodyUrl: 'http://example.com',
    },
  },
  {
    id: 5,
    receivedDate: '22/08/21',
    company: 'KT cs',
    sector: '영업',
    title: '차장',
    name: '정민아',
    email: 'jungma@ktcs.com',
    subject: '캠페인 문의',
    aiAnalysis: '캠페인',
    details: {
      sender: 'sales@ktcs.com',
      subject: '신제품 소개',
      attachment: 'product-info.docx',
      bodyUrl: 'http://ktcs-sales.com',
    },
  },
  {
    id: 6,
    receivedDate: '30/11/22',
    company: 'KT',
    sector: 'HR',
    title: '사원',
    name: '홍길동',
    email: 'honggd@kt.com',
    subject: '채용 관련 문의',
    aiAnalysis: '피싱',
    details: {
      sender: 'hr@example.com',
      subject: '이력서 제출 요청',
      attachment: 'resume.pdf',
      bodyUrl: 'http://fake-hr-site.com',
    },
  },
  {
    id: 7,
    receivedDate: '15/02/23',
    company: 'KT',
    sector: '연구소',
    title: '연구원',
    name: '신예은',
    email: 'shinye@kt.com',
    subject: '보안 업데이트 문의',
    aiAnalysis: '악성코드',
    details: {
      sender: 'update@example.com',
      subject: '시스템 업데이트 필요',
      attachment: 'update.exe',
      bodyUrl: 'http://fake-update.com',
    },
  },
  {
    id: 8,
    receivedDate: '07/07/21',
    company: 'KT cs',
    sector: '고객센터',
    title: '팀장',
    name: '김지훈',
    email: 'kimjh@ktcs.com',
    subject: '고객 불만 사항 접수',
    aiAnalysis: '오신고',
    details: {
      sender: 'customer@example.com',
      subject: '서비스 불만',
      attachment: '없음',
      bodyUrl: 'http://customer-feedback.com',
    },
  },
  {
    id: 9,
    receivedDate: '12/05/20',
    company: 'KT Cloud',
    sector: '기술지원',
    title: '대리',
    name: '이수민',
    email: 'leesm@ktcloud.com',
    subject: '서버 장애 보고',
    aiAnalysis: '캠페인',
    details: {
      sender: 'server@example.com',
      subject: '서버 상태 확인 요청',
      attachment: 'log.txt',
      bodyUrl: 'http://server-status.com',
    },
  },
  {
    id: 10,
    receivedDate: '25/12/22',
    company: 'KT',
    sector: '재무',
    title: '부장',
    name: '오지은',
    email: 'ohje@kt.com',
    subject: '회계 자료 제출',
    aiAnalysis: '피싱',
    details: {
      sender: 'finance@example.com',
      subject: '회계 연말 정산',
      attachment: 'accounting.xls',
      bodyUrl: 'http://fake-finance.com',
    },
  },
]);

const handleEdit = (id, selectedOption) => {
  const report = reports.value.find((r) => r.id === id);
  if (report) {
    report.aiAnalysis = selectedOption;
  }
};
</script>
<style scoped>
.table th, .table td {
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
    padding: .1rem .4rem;
    font-size: .775rem;
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

.ai-assistant-header strong {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
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
  padding: .5rem .5rem;
  font-size: .875rem;
  white-space: nowrap;
}
</style>