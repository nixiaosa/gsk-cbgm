<!--查看pdf票据-->
<template>
  <div class="pdfBox">
    <div class="pdfBack">
      <el-button plain type="primary" @click="$router.back()">返回</el-button>
      <el-button plain type="primary" @click="maxPdf">放大</el-button>
      <el-button plain type="primary" @click="miniPdf">缩小</el-button>
      <el-button plain type="primary" @click="addNum">上一页</el-button>
      <span style="color: #666666">{{num}} / {{pages}}</span>
      <el-button plain type="primary" @click="minusNum">下一下</el-button>
    </div>
    <canvas id="the-canvas"></canvas>
  </div>
</template>

<script>
  import PDFJS from 'pdfjs-dist'

  export default {
    mounted() {
      this._loadFile(this.$route.query.url)
    },
    data() {
      return {
        num: 1,
        loading2: true,
        pdfData: '', // PDF的base64
        scale: 1, // 缩放值
        pages: ''
      }
    },
    methods: {
      miniPdf() {
        if (this.scale < 1) {
          return
        }
        this._renderPage(this.num)
        this.scale = this.scale - 0.5
      },
      maxPdf() {
        if (this.scale > 12) {
          return
        }
        this._renderPage(this.num)
        this.scale = this.scale + 0.5
      },
      minusNum() {
        this.num++
        this._renderPage(this.num)
      },
      addNum() {
        this.num--
        this._renderPage(this.num)
      },
      _renderPage(num) {
        this.pdfDoc.getPage(num).then((page) => {
          let canvas = document.getElementById('the-canvas')
          let ctx = canvas.getContext('2d')
          let dpr = window.devicePixelRatio || 1
          let bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1
          let ratio = dpr / bsr
          // var scale = 1//缩放倍数，1表示原始大小
          var viewport = page.getViewport(this.scale)
          canvas.height = viewport.height
          canvas.width = viewport.width
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext)
        })
      },
      _loadFile(url) {
        PDFJS.getDocument(url).then((pdf) => {
          this.pdfDoc = pdf
          this.pages = this.pdfDoc.numPages
          this.$nextTick(() => {
            this._renderPage(1)
          })
        })
      }
    }
  }
</script>

<style scoped>
  .pdfBox {
    text-align: center;
  }

  .pdfBack {
    position: fixed;
    top: 130px;
    right: 220px;
  }

  .pdf-container {
    width: 750px;
  }

  .canvas-container {
    border: 1px dashed black;
    position: relative;
  }
</style>
