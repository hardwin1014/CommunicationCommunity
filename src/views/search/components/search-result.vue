<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 定义属性
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  methods: {
    // 异步获取数据的地方
    async onLoad () {
      // 异步更新数据
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.keywords
      })

      // 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 加载状态结束
      this.loading = false

      // 加载数据全部完成
      if (results.length) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.finished = true// 没有数据了，将加载状态设置结束，不在onLoad
      }
    }
  }
}
</script>

<style lang='less'>
</style>
