<template>
  <div style="margin-top: 20px">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="统计说明" name="0">
        <div class="message">
          <img src="https://saas-material-1252497236.cos.ap-beijing.myqcloud.com/cbgm/platformStats/platformStats.png" alt="">
          <p class="title">数据统计说明</p>
          <p>欢迎使用平台统计服务，数据质量的高低直接影响统计信息的有用性及统计信息价值的大小。</p>
          <p>因平台用户行为的不同，统计相关数据可能会造成数据完整度不足，统计结果难免有误差，请您注意。</p>
          <p>平台统计中使用的用户数据为完整用户数据，信息包括姓名、性别、省份、城市、医院、科室、职称。</p>
          <p>影响各统计分析中用户分布、省份分布与排行、科室分布与排行、职称分布与排行等数据展示维度。</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="大屏看板" name="100"/>
      <el-tab-pane label="平台用户分析" name="101"/>
      <el-tab-pane v-if="businessList.indexOf('2') >= 0" label="空中课堂分析" name="2"/>
      <el-tab-pane v-if="businessList.indexOf('1') >= 0" label="店员培训分析" name="1"/>
      <el-tab-pane v-if="businessList.indexOf('4') >= 0" label="线上公开课分析" name="4"/>
      <el-tab-pane v-if="businessList.indexOf('5') >= 0" label="学术会议分析" name="5"/>
      <el-tab-pane v-if="businessList.indexOf('9') >= 0" label="互动课堂分析" name="9"/>
    </el-tabs>
    <h1 style="color: red" v-show="isTest && activeName !== '0'">开发环境不支持本功能</h1>
    <iframe
        v-show="activeName !== '0'"
        frameborder="0"
        importance="high"
        allowFullScreen="true"
        width="100%"
        :height="height"
        :src="openUrl"
    >
    </iframe>

  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "platformStats",
  data() {
    return {
      isShow: true,
      isTest: false,
      businessList: '',
      activeName: '0',
      isLoding: true,
      openUrl: '',
      height: document.documentElement.clientHeight - 100
    }
  },
  computed: {
    ...mapGetters(["existBusiness"])
  },
  mounted() {
    // const loading = this.$loading({
    //   lock: true,
    //   text: '加载中...',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    // setTimeout(() => {
    //   loading.close();
    // }, 4000)
    // setTimeout(() => {
    //   // 已此方法调用两次  配合解决问题
    //   setTimeout(() => {
    //     this.isLoding = false
    //   }, 300)
    //   this.getCodeGenerate()
    // }, 4000)
    this.getCodeGenerate()
    this.existBusiness.forEach(item => {
      this.businessList += item.businessId
    })
  },
  methods: {
    handleClick() {
      this.getCodeGenerate()
    },
    getCodeGenerate() {
      let params = {
        redirectUri: this.showHengShi()
      }
      this.$http.post(this.$api.getCodeGenerate, params).then(res => {
        let {code, data} = res.data
        if (code === 200) {
          this.openUrl = this.showHengShi() + '&code=' + data
        }
      })
    },
    showHengShi() {
      const href = window.location.href
      let openUrl = ''
      const hengShiUrl = {
        test: {
          '0': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/EF8F279DE2EA2BD6134780D7168D16566?header=false&chartAccessible=false',
          '100': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/EF8F279DE2EA2BD6134780D7168D16566?header=false&chartAccessible=false',
          '101': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/EB31CE9E85FCF3E06EA1798350D55F7B5?header=false&chartAccessible=false',
          '1': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/EBA6391C0A1EC9830200ABBF8117616D8?header=false&chartAccessible=false',
          '2': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/EBD9AFB5BA13B8EBF0875719BF8C53035?header=false&chartAccessible=false',
          '4': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/E9BEBD790BB93F39058297A740A808F3C?header=false&chartAccessible=false',
          '5': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/ED2B871CEDA2DDAB432E7852038F3B655?header=false&chartAccessible=false',
          '9': 'https://test.bi.100doc.net/#/private/share/EC1103AFD32A73C2FC6277A983DD07DDA/dashboard/E960F0ECF5E3D5B1670259300DD879CD6?header=false&chartAccessible=false'
        },
        production: {
          // 数据看板
          '0': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E97B47C4D674C86A06B49FC212629B3B1?header=false&chartAccessible=false',
          '100': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E97B47C4D674C86A06B49FC212629B3B1?header=false&chartAccessible=false',
          // 用户平台分析
          '101': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E52EFCF4626AFBDF88297041F9AF7C500?header=false&chartAccessible=false',
          // 店员培训
          '1': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E997D25B09D9CA1490D0731BFA442B0BE?header=false&chartAccessible=false',
          // 空中课堂
          '2': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/EA52CC67C77F2B8797724299127E04292?header=false&chartAccessible=false',
          // 线上共开可
          '4': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/ECA7179421AC161243E4D0FF3DBD74C79?header=false&chartAccessible=false',
          // 学术会议
          '5': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E2DD325C823FC6510BB3D34E9DF9D188A?header=false&chartAccessible=false',
          // 互动课堂
          '9': 'https://bi.100doc.net/#/private/share/E8BF54EC4D45836396EDC1EFD78A5D8AC/dashboard/E8512D594AB4216BC481D0C8AA02D6A7E?header=false&chartAccessible=false',
        }
      }
      if (href.indexOf('localhost') >= 0 || window.location.port === '9004') {
        // 本地
        this.isTest = true
        openUrl = `https://test.bi.100doc.net/oauth2/callback?hengshiOriginReqUrl=${encodeURIComponent(hengShiUrl.test[this.activeName])}&client_name=oauth2`
      } else if (href.indexOf('.test.') >= 0) {
        // 开发
        this.isTest = true
        openUrl = `https://test.bi.100doc.net/oauth2/callback?hengshiOriginReqUrl=${encodeURIComponent(hengShiUrl.test[this.activeName])}&client_name=oauth2`
      } else if (href.indexOf('.100live.') >= 0 || href.indexOf('saas-test.') >= 0) {
        // 测试
        openUrl = `https://test.bi.100doc.net/oauth2/callback?hengshiOriginReqUrl=${encodeURIComponent(hengShiUrl.test[this.activeName])}&client_name=oauth2`
      } else if (href.indexOf('.100doc.') >= 0) {
        //  线上
        openUrl = `https://bi.100doc.net/oauth2/callback?hengshiOriginReqUrl=${encodeURIComponent(hengShiUrl.production[this.activeName])}&client_name=oauth2`
      }
      return openUrl
    },
    pushTo() {
      window.open(this.openUrl)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.message {
  p {
    font-size: 14px;
    color: #999999;
  }
  .title {
    font-size: 16px;
    color: #333333;
  }
  img{
    width: 360px;
    height: 180px;
    margin-top: 25px;
  }
}
.main {
  text-align: center;
  margin-top: 40px;
}

.icon-box {
  text-align: center;

  img {
    width: 600px;
  }
}

::v-deep .el-tabs--card>.el-tabs__header {
    border-bottom: 0px solid #E4E7ED;
}

::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 0px solid #E4E7ED;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    box-sizing: border-box;
}

::v-deep .el-tabs__item {
    padding: 8px 22px;
    height: auto;
    box-sizing: border-box;
    line-height: 1;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
    border: 1px solid #E4E7ED !important;
    margin-right: 16px;
    border-radius: 4px;
}

::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  //  border-bottom: 1px solid transparent;
  background: rgba(26, 179, 112, 0.1);
  border: 1px solid #1AB370;
  color: #00B070;
}
</style>
