<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="['返回']" @change="headerChange"></header-content>
    <div class="box-item">
      <span class="title">姓名：</span>
      <span class="des">{{ form.userName }}</span>
    </div>
    <div class="box-item">
      <span class="title">手机号码：</span>
      <span class="des">{{ form.phone }}</span>
    </div>
    <div class="box-item">
      <span class="title">医院：</span>
      <span class="des">{{ form.hospital }}</span>
    </div>
    <div class="box-item">
      <span class="title">科室：</span>
      <span class="des">{{ form.office }}</span>
    </div>
    <div class="box-item">
      <span class="title">作品名称：</span>
      <span class="des">{{ form.videoName }}</span>
    </div>
    <div class="box-item">
      <span class="title">上传时间：</span>
      <span class="des">{{ form.createTime | formatDates}}</span>
    </div>
    <div class="box-item">
      <span class="title">封面：</span>
      <span class="des">{{ form.videoImg }}</span>
      <el-button @click="dialogImg = true" type="primary" size="small" style="margin-left:10px">查看</el-button>
    </div>
    <div class="box-item">
      <span class="title">视频：</span>
      <span class="des">{{ videoUrl }}</span>
      <el-button @click="dialogVideo = true" type="primary" size="small" style="margin-left:10px">查看</el-button>
    </div>
    <div class="box-item">
      <span class="title">审核：</span>
      <el-button v-if="form.audit == 0" @click="auditHandle(1)" type="success">通过</el-button>
      <el-button v-if="form.audit == 0" @click="auditHandle(2)" type="danger">不通过</el-button>
      <span v-if="form.audit != 0" class="des">{{ form.audit | getState}}</span>
    </div>

    <el-dialog
      :visible.sync="dialogVideo"
      title="视频"
      width="30%"
      :before-close="dialogVideoClose"
    >
      <div class="dialog-content">
        <video id="videoId" controls="controls" controlslist="nodownload" :src="form.videoUrl"></video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVideoClose">确定</el-button>
        <el-button @click="dialogVideoClose">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogImg"
      title="封面"
      width="30%"
    >
      <div class="dialog-content">
          <img :src="form.videoImg">        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImg = false">确定</el-button>
        <el-button @click="dialogImg = false">取消</el-button>
      </span>
    </el-dialog>



  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
export default {
  name: "matchAudit",
  components: {
    HeaderContent
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatDates(time) {
      var date = new Date(time);
      if (time) {
        return formatDate(date, "yyyy-MM-dd hh:mm");
      } else {
        ("");
      }
    },
    getState(state) {
      switch (state) {
        case 0:
          return "待审核";
        case 1:
          return "审核通过";
        case 2:
          return "审核未通过";
      }
    }
  },
  data() {
    return {
      headerTitle: "参赛作品审核详情",
      auditList: [
        {
          label: "全部",
          status: null
        },
        {
          label: "待审核",
          status: 0
        },
        {
          label: "审核通过",
          status: 1
        },
        {
          label: "审核未通过",
          status: 2
        }
      ],
      form: {
        userName: "",
        phone: "",
        audit: null,
        hospital: "",
        office: "",
        videoName: "",
        createTime: "",
        videoImg: "",
        videoUrl: ""
      },
      videoUrl: "",
      dialogVideo: false,
      dialogImg: false,
    };
  },
  async mounted() {
    await this.getAuditDetail();
  },
  created() {},
  methods: {
    dialogVideoClose(){
      this.dialogVideo = false;
      this.form.videoUrl = "";
    },
    auditHandle: async function(val){
      let params = {
        id: this.$route.params.id,
        audit: val
      }
      const res = await http.post(api.matchAudit, params);
      if (res.data.code === 0) {
        this.$message.success("操作成功");
        this.getAuditDetail();
      } else {
        this.$message.error(res.data.message);
      }
    },
    headerChange(item) {
        if (item === '返回') {
          this.$router.back()
        }
    },
    getAuditDetail: async function(pageNum) {
      const res = await http.get(
        api.matchAuditDetail + "/" + this.$route.params.id
      );
      if (res.data.code === 0) {
        this.form = res.data.data;
        this.videoUrl = res.data.data.videoUrl;
      } else {
        this.$message.error(res.data.message);
      }
    }
  }
};
</script>

<style scoped>
.box-item {
  margin: 0 0 20px 0;
}
.title {
  display: inline-block;
  width: 100px;
  margin-right: 20px;
  font-size: 14px;
  text-align: right;
}
.des {
  font-size: 14px;
}
.des img {
  width: 300px;
}
.des video {
  width: 300px;
}
.dialog-content{
  overflow: hidden;
}
.dialog-content img{
  width: 100%;
}
.dialog-content video{
  width: 100%;
}
</style>
