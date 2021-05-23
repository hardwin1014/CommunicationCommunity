<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar">
      <van-button class="search-btn" slot="title" to="/search" type="info" size="small" round icon="search">搜索</van-button>
    </van-nav-bar>
    <van-tabs class="channels-tab" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 使用子组件 传过去id-->
        <articleList :channelId="item.id" />
      </van-tab>
      <!-- 右边插槽的内容 -->
      <div slot="nav-right" class="pos"></div>
      <div slot="nav-right" class="hamburger-bar" @click="show=true">
        <i class="iconfont icon_gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑 -->
    <van-popup class="edit-channel-popup" v-model="show" closeable position="bottom" :style="{ height: '100%' }" >
      <channel-edit :user-channels="channels" :active-index.sync="active" @close-popup="isEditChannelShow = false"></channel-edit>
    </van-popup>
  </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
import articleList from './components/article-list.vue'
import ChannelEdit from './components/ChannelEdit'
export default {
  name: 'index',
  data () {
    return {
      active: 0, // 频道控制点击滑动
      channels: [], // 频道列表
      list: [],
      show: false
    }
  },
  // 注册组件
  components: {
    articleList,
    ChannelEdit
  },
  // 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  // 调用方法
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        const { data } = await getUserChannels()
        // console.log(data);
        // 将获取的数据赋值给data中的数据
        this.channels = data.data.channels
        // console.log(this.channels);
      } catch (error) {
        this.$toast('获取频道数据失败')
      }
    }
  }
}
</script>
<style lang="less">
.home-container {
  padding-bottom: 100px;
  .van-nav-bar__content {
    background-color: #3296fa;
    .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
        color: #ffffff;
      }
    }
  }
  .channels-tab {
    .van-tab {
      width: 200px;
      height: 80px;
      color: #777777;
      font-size: 28px;
      border-right: 1px solid #edeff3;
    }
    .van-tab--active {
      color: #333;
      font-size: 30px;
    }
    .van-tabs__nav {
      align-items: center;
    }
    .van-tabs__nav--line {
      padding-bottom: unset;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      border-radius: 3px;
    }
    .hamburger-bar {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon_gengduo {
        font-size: 40px;
      }
    }
    .hamburger-bar:before {
      content: "";
      width: 2px;
      height: 58px;
      background: url("~@/assets/gradient-gray-line.png");
      background-size: contain;
      margin-right: 8px;
    }
    .pos {
      width: 60px;
      height: 83px;
      flex-shrink: 0;
    }
  }
}
.edit-channel-popup {
  padding-top: 100px;
	box-sizing: border-box;
}
</style>
