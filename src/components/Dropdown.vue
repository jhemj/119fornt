<!-- Dropdown.vue -->
<template>
    <div class="dropdown" ref="dropdown">
      <div @click="toggle" class="dropdown-toggle">
        <slot name="toggle">
          <!-- 기본 토글 내용 -->
          <span>옵션 선택</span>
          <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#000" stroke-width="1.5"/>
          </svg>
        </slot>
      </div>
      <div v-if="isOpen" class="dropdown-menu">
        <slot name="menu"></slot>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  export default {
    name: 'Dropdown',
    setup() {
      const isOpen = ref(false);
      const dropdown = ref(null);
  
      const toggle = () => {
        isOpen.value = !isOpen.value;
      };
  
      const handleClickOutside = (event) => {
        if (dropdown.value && !dropdown.value.contains(event.target)) {
          isOpen.value = false;
        }
      };
  
      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });
  
      onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
      });
  
      return { isOpen, toggle, dropdown };
    },
  };
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-toggle {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .dropdown-arrow {
    margin-left: 5px;
    transition: transform 0.3s;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    min-width: 160px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
    z-index: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .dropdown-menu a {
    color: black;
    padding: 8px 12px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-menu a:hover {
    background-color: #f1f1f1;
  }
  
  .dropdown.open .dropdown-arrow {
    transform: rotate(180deg);
  }
  </style>