// main.js
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js'; // 이 부분 추가
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";

const appInstance = createApp(App);

appInstance.use(Toast, {
    position: 'top-center',
    timeout: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
});

appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");