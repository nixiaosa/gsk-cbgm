<template>
  <div class="formHeader">{{title}}</div>
</template>

<script>
export default {
  name: "PlateHeaderBar",
  props: {
    title: String,
  }
}
</script>

<style scoped>
.formHeader {
  color: #333333;
  text-align: left;
  width: 100%;
  padding: 14px 20px;
  background: rgba(242, 242, 242, 1);
}
</style>
