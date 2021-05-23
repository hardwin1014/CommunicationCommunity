<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{comment.aut_name}}</div>
      <van-button
        class="like-btn"
        icon="good-job-o"
      >{{comment.like_count > 0 ? comment.like_count : '赞' }}</van-button>
    </div>
    <div slot="label">
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button
          class="reply-btn"
          round
        >回复 {{comment.reply_count}}</van-button>
      </div>
          <!-- @click="$emit('click-reply')" -->
    </div> 
  </van-cell>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['comment'],
  data () {
    return { 
      
    }
  },
  methods:{
    async huifu () { 
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
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
</style>
