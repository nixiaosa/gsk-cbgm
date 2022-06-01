<template>
    <div class="header-content">
        <div class="header-content-title">{{title}}</div>
        <div>
            <el-button v-for="(name, index) in props" @click="header_btn_click(name)" :key="index" type="primary">{{name}}</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            props: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        watch: {
        },
        data() {
            return {
            }
        },
        created: function() {
        },
        methods: {
            header_btn_click(name) {
                this.$emit('header-btn-click', name)
                this.$emit('change', name)
            }
        }
    }
</script>
<style scoped>
    .header-content {
        display: flex;
        justify-content: space-between;
        height: 70px;
        line-height: 90px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
    }
</style>
