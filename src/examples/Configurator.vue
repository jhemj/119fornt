<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// State
const isRTL = computed(() => store.state.isRTL);

// Methods
const toggleConfigurator = () => store.commit("toggleConfigurator");
</script>

<template>
  <div class="fixed-plugin">
    <a class="px-3 py-2 fixed-plugin-button text-dark position-fixed" @click="toggleConfigurator">
      <i class="py-2 fa fa-cog"></i>
    </a>
    <div class="shadow-lg card">
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div :class="isRTL ? 'float-end' : 'float-start'">
          <h5 class="mt-3 mb-0">Configurator</h5>
          <p>See dashboard options.</p>
        </div>
        <div class="mt-4" @click="toggleConfigurator" :class="isRTL ? 'float-start' : 'float-end'">
          <button class="p-0 btn btn-link text-dark fixed-plugin-close-button">
            <i class="fa fa-close"></i>
          </button>
        </div>
      </div>
      <hr class="my-1 horizontal dark" />
      <div class="pt-0 card-body pt-sm-3">
        <!-- Light / Dark Toggle UI Removed -->
      </div>
    </div>
  </div>
</template>