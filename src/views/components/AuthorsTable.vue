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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>번호</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>접수일</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>회사</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>부문</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>호칭</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>이름</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>이메일</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>제목</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ai-assistant-header">
                <strong>AI Assistant</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>승인</strong>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <strong>수정</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="report in reports" :key="report.id">
              <tr :class="{'text-danger': report.aiAnalysis === '피싱' || report.aiAnalysis === '악성코드'}">
                <td class="align-middle text-sm">{{ report.id }}</td>
                <td class="align-middle text-sm">{{ report.receivedDate }}</td>
                <td class="align-middle text-sm">{{ report.company }}</td>
                <td class="align-middle text-sm">{{ report.sector }}</td>
                <td class="align-middle text-sm">{{ report.title }}</td>
                <td class="align-middle text-sm">{{ report.name }}</td>
                <td class="align-middle text-sm long-text">{{ report.email }}</td>
                <td class="align-middle text-sm long-text">{{ report.subject }}</td>
                <td class="align-middle text-sm ai-assistant-cell">
                  <span class="gradient-text">{{ report.aiAnalysis }}</span>
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
              <tr>
                <td colspan="11" class="p-0">
                  <div class="detail-box">
                    <h6>보안위협 상세정보</h6>
                    <div class="row">
                      <div class="col-md-3 col-sm-6 mb-2 long-text">
                        <strong>발신자:</strong> {{ report.details.sender }}
                      </div>
                      <div class="col-md-3 col-sm-6 mb-2 long-text">
                        <strong>제목:</strong> {{ report.details.subject }}
                      </div>
                      <div class="col-md-3 col-sm-6 mb-2 long-text">
                        <strong>첨부파일:</strong> {{ report.details.attachment }}
                      </div>
                      <div class="col-md-3 col-sm-6 mb-2 long-text">
                        <strong>URL:</strong> 
                        <a :href="report.details.bodyUrl" target="_blank">{{ report.details.bodyUrl }}</a>
                      </div>
                    </div>
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

// 예시 데이터 (총 6개)
const reports = ref([
  {
    id: 1,
    receivedDate: '23/04/18',
    company: 'KT',
    sector: '마케팅',
    title: '사원',
    name: '이진혁',
    email: 'john@creative-tim.com',
    subject: '보안 위협 관련 문의',
    aiAnalysis: '피싱',
    details: {
      sender: 'sender@example.com',
      subject: '피싱 이메일 관련',
      attachment: '없음',
      bodyUrl: 'http://example.com',
    },
  },
  {
    id: 2,
    receivedDate: '11/01/19',
    company: 'KT',
    sector: '개발',
    title: '대리',
    name: '최다인',
    email: 'alexa@creative-tim.com',
    subject: '악성코드 관련 문의',
    aiAnalysis: '악성코드',
    details: {
      sender: 'malware@example.com',
      subject: '악성코드 탐지',
      attachment: 'malware.exe',
      bodyUrl: 'http://malware.com',
    },
  },
  {
    id: 3,
    receivedDate: '19/09/17',
    company: 'KT',
    sector: '프로젝트',
    title: '과장',
    name: '최민주',
    email: 'laurent@creative-tim.com',
    subject: '프로젝트 관련 문의',
    aiAnalysis: '캠페인',
    details: {
      sender: 'campaign@example.com',
      subject: '캠페인 이메일 관련',
      attachment: '캠페인자료.pdf',
      bodyUrl: 'http://campaign.com',
    },
  },
  {
    id: 4,
    receivedDate: '05/06/20',
    company: 'KT Cloud',
    sector: '지원',
    title: '사원',
    name: '김수완',
    email: 'emily@techsolutions.com',
    subject: '오신고 관련 문의',
    aiAnalysis: '오신고',
    details: {
      sender: 'incorrect@example.com',
      subject: '잘못된 신고 관련',
      attachment: '없음',
      bodyUrl: 'http://incorrect.com',
    },
  },
  {
    id: 5,
    receivedDate: '22/08/21',
    company: 'KT cs',
    sector: '영업',
    title: '디자이너',
    name: '김수미',
    email: 'david@innovatex.com',
    subject: '캠페인 관련 문의',
    aiAnalysis: '캠페인',
    details: {
      sender: 'sales@innovatex.com',
      subject: '새로운 캠페인 제안',
      attachment: '캠페인제안.docx; 캠페인제안.docx; 캠페인제안.docx; 캠페인제안.docx',
      bodyUrl: 'http://innovatex.com/campaign',
    },
  },
  {
    id: 6,
    receivedDate: '30/11/22',
    company: 'KT',
    sector: 'HR',
    title: '사원',
    name: 'Sophia Lee',
    email: 'sophia@alphacorp.com',
    subject: '피싱 의심 이메일',
    aiAnalysis: '피싱',
    details: {
      sender: 'hr@alphacorp.com',
      subject: '채용 관련 문의',
      attachment: '채용공고.pdf',
      bodyUrl: 'http://alphacorp.com/hr',
    },
  },
]);

// 수정 버튼 클릭 시 실행되는 함수 (AI Assistant 값에 영향 주지 않음)
const handleEdit = (id, selectedOption) => {
  const report = reports.value.find(r => r.id === id);
  if (report) {
    console.log(`수정 버튼 클릭됨: 신고 번호 ${id}, 선택된 옵션: ${selectedOption}`);
    // 필요한 경우 다른 로직을 추가하세요.
    // 예: 모달을 열어 추가 정보를 편집할 수 있도록 구현
  }
};

// 승인 버튼 클릭 시 실행되는 함수 (필요 시 구현)
// const approveReport = (id) => {
//   // 승인 로직 구현
//   alert(`신고 번호 ${id}가 승인되었습니다.`);
// };
</script>

<style scoped>
/* table-responsive 클래스의 오버플로우 숨기기 */
.table-responsive {
  overflow: hidden;
}

/* 테이블 셀 내용이 길어질 경우 줄 바꿈 적용 */
.table th,
.table td {
  padding: 10px;
  font-size: 14px;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-all;
}

.long-text {
  max-width: 200px; /* Set a maximum width */
  white-space: normal; /* Allow text to wrap */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Optional: show ellipsis for overflow */
}


/* 테이블 헤더 볼드 처리 */
.table th strong {
  font-weight: bold;
}

/* "AI Assistant" 제목 텍스트 그라데이션 */
.ai-assistant-header strong {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00); /* Apple AI 스타일의 다채로운 그라데이션 */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* 그라데이션 적용을 위해 텍스트 색상을 투명하게 설정 */
}

/* "AI Assistant" 셀 내용에 그라데이션 적용 */
.ai-assistant-cell .gradient-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc, #ff6a00); /* Apple AI 스타일의 다채로운 그라데이션 */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* 그라데이션 적용을 위해 텍스트 색상을 투명하게 설정 */
  font-weight: bold;
}

/* AI 분석 결과에 따른 행 텍스트 색상 변경 */
.text-danger {
  color: #dc3545 !important; /* Bootstrap의 danger 색상 */
}

/* 상세 정보 박스 스타일 */
.detail-box {
  background-color: #f8f9fa;
  padding: 8px 16px; /* 패딩 원상복구 */
  border-left: 4px solid #b7b7b7; /* 색상 조절 가능 */
  margin: 4px 3% 4px 3%; /* 좌우 마진을 줄여서 박스 너비 줄이기 및 왼쪽 정렬 */
  border-radius: 0px; /* 모서리 둥글게 제거하여 자연스럽게 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 12px; /* 글자 크기 유지 */
  text-align: left; /* 왼쪽 정렬 */
}

/* 제목 스타일 */
.detail-box h6 {
  margin-bottom: 8px;
  color: #333;
  font-size: 13px; /* 글자 크ㅁ기 유지 */
}

/* 링크 스타일 */
.detail-box a {
  color: #007bff;
  text-decoration: none;
}

.detail-box a:hover {
  text-decoration: underline;
}

/* 버튼 간격 조정 */
.btn {
  margin: 0 2px;
}

/* 상세 정보 내용의 컬럼 간격 조정 */
.detail-box .row > div {
  display: flex;
  align-items: center;
  padding-left: 16px; /* 탭 간격 추가 */
}

/* 반응형 디자인 조정 */
@media (max-width: 768px) {
  .detail-box .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
    padding-left: 8px; /* 작은 화면에서는 좌우 여백 줄이기 */
  }
}
</style>