<template>
  <div class="modelist">
    <header-content title="二维码管理"></header-content>
    <div class="ulbox">
      <div class="libox" v-if="weChat">
        <h3>微信公众号图片</h3>
        <div v-if="!weChaBol">
          <img :src="weChat" alt class="wxImg" @error="imgLoadError(1)">
          <a :href="weChat" download>下载</a>
        </div>
        <div class="el-image__error" v-if="weChaBol">图片加载失败。。</div>
      </div>
      <div class="libox" v-if="applet">
        <h3>微信小程序图片</h3>
        <div v-if="!appletBol">
          <img :src="applet" alt class="wxImg" @error="imgLoadError(2)">
          <a :href="applet" download>下载</a>
        </div>
        <div class="el-image__error" v-if="appletBol">图片加载失败。。</div>
      </div>
      <div class="libox" v-if="!weChat && !applet">
        <div class="el-image__error">暂无配置二维码图片</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import { mapGetters } from "vuex";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";

export default {
  data() {
    return {
      weChat: "",
      applet: "",
      weChaBol: false,
      appletBol: false
    };
  },
  created: function() {
    this.getQr();
  },
  methods: {
    imgLoadError(n) {
      if (n === 1) {
        this.weChaBol = true;
      } else {
        this.appletBol = true;
      }
    },
    getQr() {
      http
        .post(api.getWXqr, { companyId: this.companyid })
        .then(respons => {
          if (respons.data.code === 0) {
            this.weChat = respons.data.data.weChat;
            this.applet = respons.data.data.applet;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    ...mapGetters(["companyid"])
  },
  components: {
    HeaderContent
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.ulbox {
  display: flex;
}

.libox {
  width: 200px;
  text-align: center;
  h2 {
    color: #666666;
  }
  .wxImg {
    width: 150px;
    height: 150px;
    display: inline-block;
    border: 1px solid #999999;
    margin-bottom: 30px;
  }
  a {
    border-color: $c-theme;
    background: $c-theme;
    font-size: 14px;
    display: inline-block;
    padding: 10px 15px;
    color: #ffffff;
    border-radius: 4px;
  }
  a:hover{
    color: #ffffff !important;
  }
  .el-image__error {
    margin: 20px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #c0c4cc;
    vertical-align: middle;
    background: #f5f7fa;
    width: 150px;
    height: 150px;
  }
}
</style>
