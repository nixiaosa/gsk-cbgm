<!--
 * @Author: Chance Lau
 * @Date: 2021-08-12 19:12:14
 * @LastEditors: Chance Lau
 * @LastEditTime: 2021-08-23 10:51:38
 * @Description: file content
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'app',
  computed: {
    ...mapGetters(['companyid','caseTitleShow','themeColor'])
  },
  components: {
  },
  mounted() {
    this.setThemeColor('rgb(4, 190, 2)')
  },
  methods: {
    setThemeColor(themeColor) {

      document.getElementsByTagName('body')[0].style.setProperty('--reset', themeColor);
      document.getElementsByTagName('body')[0].style.setProperty('--reset2', this.rgbToRgba(themeColor, '0.1'));
      document.getElementsByTagName('body')[0].style.setProperty('--reset3', this.rgbToRgba(themeColor, '0.05'));
    },
    rgbToRgba (color, alp) {
      return color.replace('rgb', 'rgba').replace(')', ', ' + alp + ')')
    }
  },
  watch: {
    'themeColor' (val) {
      // console.log('lc',val)
      let themeColor = 'rgb(4, 190, 2)'
      if (val) {
        themeColor = val
      }
      this.setThemeColor(themeColor)
    }
  }
}
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';// normalize.css 样式格式化
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
