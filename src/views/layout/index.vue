<template>
  <div>
    <router-view />
    <van-tabbar route>
      <van-tabbar-item to="/">
        <i slot="icon" class="iconfont icon_shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/question">
        <i slot="icon" class="iconfont icon_wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="iconfont icon_shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="iconfont icon_wode"></i>
        <span class="text">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {}
}
</script>
<style lang="less">
.iconfont {
  font-size: 40px;
}
.text {
  font-size: 20px;
  font-weight: 400;
  color: #666666;
}
</style>
