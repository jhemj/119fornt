<script setup>
import AuthorsTable from "./components/AuthorsTable.vue";
import ProjectsTable from "./components/ProjectsTable.vue";
</script>

<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-12 mb-4">
        <projects-table />
      </div>
      <div class="col-12">
        <authors-table />
      </div>
    </div>
  </div>
</template>