<!-- src/views/SecurityThreatsBoard.vue -->
<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-12">
        <ThreatsTable /> 
      </div>
    </div>
  </div>
</template>

<script setup>
import ThreatsTable from "./components/ThreatsTable.vue"; // 올바른 경로 확인
</script>

<style>
/* 필요에 따라 추가 스타일링 */
</style>