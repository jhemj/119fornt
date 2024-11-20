<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// State
const showConfig = computed(() => store.state.showConfig);

// Methods
const toggleConfigurator = () => store.commit("toggleConfigurator");
</script>

<template>
  <div class="fixed-plugin">
    <!-- 설정 버튼 -->
    <a
      class="fixed-plugin-button text-dark position-fixed"
      @click="toggleConfigurator"
    >
      <i class="fa fa-cog"></i>
    </a>

    <!-- Configurator 창 -->
    <div v-if="showConfig" class="card shadow-lg">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mt-3 mb-0">Configurator</h5>
          <p>See dashboard options.</p>
        </div>
        <!-- x 버튼 -->
        <button
          class="btn btn-link text-dark p-0 m-0"
          @click="toggleConfigurator"
        >
          <i class="fa fa-times"></i>
        </button>
      </div>
      <hr class="my-1 horizontal dark" />
      <div class="card-body pt-sm-3">
        <!-- 추가적인 설정 내용이 여기에 들어갑니다 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-plugin {
  position: fixed;
  top: 100px;
  right: 0;
  z-index: 1031;
}

.fixed-plugin-button {
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.fixed-plugin-button i {
  font-size: 20px;
}

.card {
  width: 300px;
  margin-right: 20px;
}

.card-header {
  background-color: transparent;
}

.btn-link {
  text-decoration: none;
}

.btn-link i {
  font-size: 20px;
}
</style>