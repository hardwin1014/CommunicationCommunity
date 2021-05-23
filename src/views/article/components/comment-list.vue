<template>
  <div class="comment-list">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <commentItem v-for="(item, index) in commentList" :key="index" :comment="item"></commentItem>
      <!--自定义commentItem自定义方法 @click-reply="isReplyShow=true" -->
    </van-list>
    <!-- <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 95%"
      >
      评论回复
    </van-popup> -->
  </div>
</template>

<script>
import { getComments2 } from '@/api/comment.js'
import commentItem from './comment-item.vue'
export default {
  // 定义属性
  data () {
    return {
      loading: false,
      finished: false,
      lastId: null
      // isReplyShow: false
    }
  },
  components: {
    commentItem
  },
  props: {
    artId: {
      type: [String, Number],
      required: true
    },
    commentList: {
      type: Array,
      required: true
    }
  },
  methods: {
    async onLoad () {
      try {
        // 异步更新数据
        const params = {
          type: 'a',
          source: this.artId,
          offset: this.lastId,
          limit: 10
        }
        const { data } = await getComments2(params)
        // console.log(data);
        // 当前页的数据
        this.commentList.push(...data.data.results)
        // 获取总条数,传递给父组件
        this.$emit('update_total_count', data.data.total_count)
        // 设置下一页的起始位置
        this.lastId = data.data.last_id
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.commentList.length === 0) {
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.onLoad()
  }
}
</script>

<style lang='less'>
</style>
