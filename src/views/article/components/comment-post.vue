<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="addComment">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'CommentPost',
  props: {
    artId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async addComment () { 
      // 判断非空
      if (this.message.trim().length === 0) {
        this.$toast('评论内容不能为空')
        return
      }
      const { data } = await addComment({
        target: this.artId,
        content: this.message
      })
      // 获取刚刚添加的评论对象
      const newComment = data.data.new_obj
      // 更新父组件的评论列表
      this.$emit('updateComments', newComment)
      // 请空历史数据
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
