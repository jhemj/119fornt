<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';

const store = useStore();
const body = document.getElementsByTagName('body')[0];

// 변수 선언
const ip = ref('');
const username = ref('');
const emailAddress = ref('');
const team = ref('');
const company = ref('');
const task = ref('');

// 로컬 스토리지 키
const storageKey = ref('');

// 사용자 데이터 로드
function loadUserData() {
  const data = localStorage.getItem(storageKey.value);
  if (data) {
    const userData = JSON.parse(data);
    username.value = userData.username;
    emailAddress.value = userData.emailAddress;
    team.value = userData.team;
    company.value = userData.company;
    task.value = userData.task;
  }
}

// 사용자 데이터 저장
function saveUserData() {
  const userData = {
    username: username.value,
    emailAddress: emailAddress.value,
    team: team.value,
    company: company.value,
    task: task.value,
  };
  localStorage.setItem(storageKey.value, JSON.stringify(userData));
  alert('사용자 정보가 저장되었습니다.');
}

onMounted(async () => {
  store.state.isAbsolute = true;

  // IP 주소 가져오기
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip.value = data.ip;
    storageKey.value = `user_${ip.value}`;
    loadUserData();
  } catch (error) {
    console.error('IP 주소를 가져오는 중 오류 발생:', error);
  }
});

onBeforeMount(() => {
  store.state.imageLayout = 'profile-overview';
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add('profile-overview');
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = 'default';
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove('profile-overview');
});
</script>

<template>
  <main>
    <div class="container-fluid">
      <div
        class="page-header min-height-300"
        style="
          background-image: url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  src="../assets/img/team-1.jpg"
                  alt="profile_image"
                  class="shadow-sm w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ username }}</h5>
                <p class="mb-0 font-weight-bold text-sm">{{ ip }}</p>
              </div>
            </div>
            <!-- 추가적인 내용이 필요하면 여기에 추가 -->
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Edit Profile</p>
                <argon-button
                  color="success"
                  size="sm"
                  class="ms-auto"
                  @click="saveUserData"
                >
                  Save
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">Username</label>
                  <argon-input
                    v-model="username"
                    type="text"
                    placeholder="Enter username"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">Email address</label>
                  <argon-input
                    v-model="emailAddress"
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">Team</label>
                  <argon-input
                    v-model="team"
                    type="text"
                    placeholder="Enter team"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">Company</label>
                  <argon-input
                    v-model="company"
                    type="text"
                    placeholder="Enter company"
                  />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">Task</p>
              <div class="row">
                <div class="col-md-12">
                  <label class="form-control-label">Task</label>
                  <argon-input
                    v-model="task"
                    type="text"
                    placeholder="Enter task"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 오른쪽 프로필 카드가 제거되었습니다 -->
      </div>
    </div>
  </main>
</template>