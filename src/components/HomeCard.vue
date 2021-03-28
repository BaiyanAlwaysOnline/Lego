<template>
  <div class="home-card">
    <a-card hoverable style="width: 240px">
      <template #cover>
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      </template>
      <div class="meta">
        <a-card-meta description="作者：柏言" />
        <a-card-meta description="309">
          <template #avatar>
            <a-avatar size="small">
              <template #icon><UserOutlined /></template>
            </a-avatar>
          </template>
        </a-card-meta>
      </div>
    </a-card>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeCard",
});
</script>

<style lang="scss" scoped>
.meta {
  display: flex;
  justify-content: space-between;
}
</style>
