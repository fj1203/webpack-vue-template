<!--  -->
<template>
  <div>
    <el-tag>yoooo</el-tag>
  </div>
</template>

<script>
export default {
    data: () => ({}),

    components: {},

    mounted () {
        console.log('测试控制台打印')
        console.log(process.env.api)
        // 添加注释
    },

    methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>
