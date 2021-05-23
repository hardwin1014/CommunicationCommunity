<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="请求失败，点击重新加载"
                @load="onLoad">
      <article-item v-for="(article,index) in list"
                    :key="index"
                    :article="article"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesByType } from '@/api/article.js'
import ArticleItem from '../components/article-item/index'
export default {
  name: 'Article-list',
  // 定义属性
  data () {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的loading状态
      finished: false, // 是否加载结束
      error: false, // 是否加载失败
      cur_timestamp: Date.now(), // 当期时间去请求最新数据，第一页
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: ''// 下拉刷新成功提示
    }
  },
  props: {
    channelId: {
      type: Number,
      require: true
    }
  },
  components: {
    ArticleItem
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 当触发上拉加载更多的时候调用该函数
    async onLoad () {
      // 1. 异步执行ajax操作，返回数据4
      try {
        // 数据
        const params = {
          channel_id: this.channelId,
          timestamp: this.cur_timestamp, // 当前时间去请求最新的数据l第一页
          with_top: 0
        }
        // 请求数据
        const rows = await getArticlesByType(params)
        const pageList = rows.data.data.results// 获取当前页面的数据

        this.list.push(...pageList)
        // 更新时间戳
        this.cur_timestamp = rows.data.data.pre_timestamp
        // 加载状态结束
        this.loading = false
        // 判断是否是最后一页，数据全部加载完成
        if (pageList.length === 0) {
          this.finished = true
        } else {
          this.finished = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false // 关闭loading效果
        this.error = true// 开启错误提示
      }
    },
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const params = {
          channel_id: this.channelId, // 频道 id
          timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        }
        const rows = await getArticlesByType(params)
        // 2. 将数据追加到列表的顶部
        const pageList = rows.data.data.results// 获取当前页面的数据
        this.list.push(...pageList)

        // 3. 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${pageList.length}条数据`
      } catch (err) {
        console.log(err)
        this.isRefreshLoading = false // 关闭下拉刷新的 loading 状态
        this.$toast('刷新失败')
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  }
}

// 2. 把返回的数据追加到list    错误：this.list=result  正确写法：this.list.push(...result)

// 加载状态结束,
// 1.非加载中loading为false，此时会根据列表滚动位置判断是否触发load事件（列表内容不足一屏幕时，会直接触发）
// 2.加载中loading为true表示正在发送异步请求，此时不会触发load事件

// 数据全部加载完成
// 1.finished属性：控制加载结束的状态
// 每次请求完毕后，需要手动将loading设置为false，表示本次加载结束
// false表示数据加载结束，finished为true，此时不会触发load事件

</script>

<style lang='less'>
.article-list {
  height: 79vh;
  left: 0;
  overflow-y: auto;
}
</style>
