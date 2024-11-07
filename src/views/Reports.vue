<script setup>
import ReportsTable from "./components/ReportsTable.vue"; // ReportsTable 컴포넌트를 불러옵니다.

// 이 파일에서는 두 컴포넌트를 모두 사용할 예정입니다.
</script>

<template>
  <div class="container-fluid mt-4">
    <div class="row">

      <div class="col-12">
        <reports-table /> <!-- ReportsTable 컴포넌트를 이 위치에 배치하여 사용자가 보고서 테이블을 볼 수 있도록 합니다. -->
      </div>
    </div>
  </div>
</template>

<style>
/* 필요하다면 여기에 추가적인 스타일을 적용할 수 있습니다. */
</style>