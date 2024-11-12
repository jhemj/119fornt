import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Reports from "../views/Reports.vue";
import Campaign from "../views/Campaign.vue";
import Threats from "../views/Threats.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "대시보드",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "미분류",
    component: Tables,
  },
  {
    path: "/reports",
    name: "전체보기",
    component: Reports,
  },
  {
    path: "/campaign",
    name: "캠페인 현황",
    component: Campaign,
  },
  {
    path: "/threats",
    name: "보안 위협",
    component: Threats,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
