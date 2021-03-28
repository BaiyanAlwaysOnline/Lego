<template>
  <div class="homepage-container">
    <a-layout>
      <a-layout-header>
        <div class="header">
          BY Lego
        </div>
      </a-layout-header>
      <a-layout-content>
        <div class="welcome-container"></div>
        <div class="content-container">
          <template-list />
        </div>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TemplateList from '../components/TemplateList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList,
  },
});
</script>

<style lang="scss" scoped>
  .header {
    color: white;
  }
</style>
