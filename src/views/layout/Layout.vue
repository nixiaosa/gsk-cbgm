
<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <tophead></tophead>
    <div v-if="!isHidden" class="sidebar-wrapper">
      <sidebar class="sidebar-container"></sidebar>
    </div>
    <div v-if="!isHidden" class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
    <div style="width: 1200px;margin: 0 auto;">
      <app-main v-if="isHidden"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Tophead } from '@/views/layout'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Tophead
  },
  data() {
    return {
      isHidden: true
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  async created () {
    if (this.$route.meta.navbarHidden) {
      this.isHidden = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.hideSidebar {
            .sidebar-wrapper {
                // transform: translate(-140px, 0);
                 transform: translate(-200px, 0);
                .sidebar-container {
                    // transform: translate(132px, 0);
                    transform: translate(192px, 0);
                }
                &:hover {
                    transform: translate(0, 0);
                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
            .main-container {
                margin-left: 40px;
            }
        }
        .sidebar-wrapper {
            width: 240px;
            position: fixed;
            top: 72px;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow: hidden;
            transition: all .28s ease-out;
        }
        .sidebar-container {
            transition: all .28s ease-out;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: -17px;
            overflow-y: scroll;
        }
        .main-container {
            min-height: 100%;
            transition: all .28s ease-out;
            // margin-left: 180px;
            margin: 72px 0 0 240px;
            // background-color: #F5F5F5;
        }
    }
</style>
