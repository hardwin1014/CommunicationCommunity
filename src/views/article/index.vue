<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
    ></van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.art_id">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}-{{article.art_id}}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- 传给关注子组件作者的id -->
          <doFollow v-model="article.is_followed" :aut_id="article.aut_id"></doFollow>
        </van-cell>

        <!-- 文章内容 -->
        <div class="article-content markdown-body" ref="content" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getDetail">点击重试</van-button>
      </div>
    </div>

    <!-- 传递文章id  父组件中定义评论数据  接收子组件的传值，来修改评论 将子组件获得的评论数给totalCount-->
    <commentList :artId="articleId" :commentList="commentList" @update_total_count="totalCount = $event"></commentList>

    <!-- 回复弹出层 -->
    <van-popup
      v-model="show"
      closeable
      position="bottom"
    >
    <!-- 传递文章id 和子组件传过来的新的评论 -->
    <comment-post :artId="this.articleId" @updateComments="updatRows($event)"></comment-post>
    </van-popup>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="show = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :info="totalCount"
        color="#777"
      />
      <van-icon
        color="#777"
        name="star-o"
        @click="onCollect()"
      />
      <van-icon color="#777" name="good-job-o" @click="isLike()"/>
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { getArticleById, addCollect, deleteCollect } from '@/api/article.js'
import { addLike, deleteLike } from '@/api/user.js'

import doFollow from '@/components/do-follow/index.vue'
import commentList from './components/comment-list.vue'
import commentPost from './components/comment-post.vue'

export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {},
      imgList: [],
      isLoading: true,
      errorStatus: 200,
      totalCount: 0,// 子组件获得评论数，获得的评论数给totalCount
      show: false,// 控住评论弹出层
      commentList: []
    }
  },
  components: {
    doFollow,
    commentList,
    commentPost
  },
  methods: {
    async getDetail () {
      try {
        // 是在页面网络不通畅的情况下，再次加载
        this.isLoading = false
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // 赋完值后，DOM加载需要时间，延迟一点时间处理图片
        setTimeout(() => {
          this.addImage()
        }, 10)
        // 关闭加载ing
        this.isLoading = false
      } catch (error) {
        // 先关闭加载
        this.isLoading = false
        if (error.response && error.response.status === 404) {
          this.errorStatus = 404
          console.log(this.errorStatus)
        }
      }
    },
    addImage () {
      // 获取文章内容的HTMLDOM对象
      const cont = this.$refs.content
      const list = cont.querySelectorAll('img')
      // 循环给图片添加点击事件
      list.forEach((item, index) => {
        // 将图片添加的预览组件的集合中
        this.imgList.push(item.src)
        // 点击图片
        item.onclick = () => {
          ImagePreview({
            images: this.imgList,
            startPosition: index
          })
        }
      })
    },
    // 接收子组件传过来的值
    updatRows (row) { 
      this.commentList.unshift(row)
      this.show = false
    },
    async onCollect () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '操作中.....',
        forbidClick: true
      })
      try {
        if (this.article.is_collected) {
          // 传入文章id
          await deleteCollect(this.articleId)
          this.$toast.success('取消收藏')
        } else {
          await addCollect(this.articleId)
          this.$toast.success('收藏成功')
        }
        this.article.is_collected = !this.article.is_collected
        // console.log(this.article.is_collected);
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    async isLike () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '操作中.....',
        forbidClick: true
      })
      // attitude 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
      // is_liking是否喜欢
      try {
        // 如果已经点赞，则取消点赞
        if (this.article.attitude === 1) { 
          await addLike(this.articleId)
          this.article.attitude = -1
          this.$toast('点赞成功')
        } else {
          // 否则添加点赞
          await deleteLike(this.articleId)
          this.article.attitude = 1
          this.$toast('取消点赞')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    }
  },
  // 可以访问当前this实例
  created () {
    this.getDetail()
  }
}
</script>

<style lang="less">
.article-container {
  .main-wrap {
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
} 
</style>
