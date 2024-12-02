<script setup>
import { useRoute } from "vue-router";

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>

<template>
  <div class="collapse navbar-collapse w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <!-- 대시보드 -->
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          navText="대시보드"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-chart-bar-32 -->
            <i class="ni ni-chart-bar-32 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- 미분류 -->
      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          navText="미분류"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-folder-17 -->
            <i class="ni ni-folder-17 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- 전체보기 -->
      <li class="nav-item">
        <sidenav-item
          to="/reports"
          :class="getRoute() === 'reports' ? 'active' : ''"
          navText="전체보기"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-archive-2 -->
            <i class="ni ni-archive-2 text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- 캠페인 현황 -->
      <li class="nav-item">
        <sidenav-item
          to="/campaign"
          :class="getRoute() === 'campaign' ? 'active' : ''"
          navText="캠페인 현황"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-trophy -->
            <i class="ni ni-trophy text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- 보안 위협 -->
      <li class="nav-item">
        <sidenav-item
          to="/threats"
          :class="getRoute() === 'threats' ? 'active' : ''"
          navText="보안 위협"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-lock-circle-open -->
            <i class="ni ni-lock-circle-open text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- 구분선 및 프로필 -->
      <li class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6">
          ACCOUNT PAGES
        </h6>
      </li>

      <!-- Profile -->
      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          navText="Profile"
        >
          <template v-slot:icon>
            <!-- 아이콘: ni ni-single-02 -->
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <!-- 사이드바 하단 카드 -->
  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route: 'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route: 'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    />
  </div>
</template>
