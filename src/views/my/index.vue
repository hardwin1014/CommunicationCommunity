<template>
  <div class="my-container">
    <!-- 登录内容 -->
    <div v-if="$store.state.user" class="header login">
      <div class="base-info">
        <div class="left">
          <van-image class="my-avatar" round :src='userInfo.photo' />
          <span class="text">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button class="editBtn" to='/user/profile' round type="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录状态 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <van-image class="mobile-img" round :src="require('@/assets/mobile.png')" />
        <span>登录 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid class="grid-nav" clickable :column-num="2">
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon_shoucang"></i>
        <!-- 需要加上具名插槽，不然就会覆盖所有的东西 -->
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon_lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 导航 -->
    <div class="cellMenu">
      <van-cell is-link>
        <span slot="title" class="title">消息通知</span>
      </van-cell>
      <van-cell is-link>
        <span slot="title" class="title">小智同学</span>
      </van-cell>
    </div>
    <van-cell v-if="$store.state.user" class="exit" @click="exitSystem">
      <span slot="title">退出登录</span>
    </van-cell>
  </div>
</template>
<script>
import { getUserInfo } from '@/api/user'
export default {
  name: 'index',
  data () {
    return {
      // 然后把上面的信息改为userInfo.什么什么
      userInfo: {}// 用户信息
    }
  },
  methods: {
    exitSystem () {
      this.$dialog.confirm({
        title: '您确认退出吗？'
      }).then(() => {
        // on confirm
        // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
        this.$store.commit('setUser', null)
      }).catch(() => {
        // on cancel
      })
    },
    async loadUser () {
      try {
        const { data } = await getUserInfo()
        // 把数据更新到user里面
        // console.log(data);
        this.userInfo = data.data
      } catch (error) {
        console.log(error)
        console.log('获取数据失败')
      }
    }
  },
  created () {
    // 登录成功之后，我才请求获取当前登录用户的信息
    if (this.$store.state.user) {
      this.loadUser()
    }
  }
}
</script>
<style lang="less">
.my-container {
  .header {
    height: 401px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      color: #fff;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
    }
  }
  .login {
    padding: 116px 33px 32px;
    box-sizing: border-box;
    .base-info {
      height: 150px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .left {
        font-size: 30px;
        display: flex;
        align-items: center;
        .my-avatar {
          width: 132px;
          height: 132px;
          margin-right: 22px;
          border: 4px solid #fff;
        }
        .text {
          font-size: 30px;
          color: #fff;
        }
      }
      .right {
        .editBtn {
          width: 115px;
          height: 32px;
          color: #666;
          background-color: #fff;
          font-size: 20px;
          border: none;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      .icon_shoucang {
        font-size: 45px;
        color: #eb5253;
      }
      .icon_lishi {
        font-size: 45px;
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
        color: #333333;
      }
    }
  }
  .cellMenu {
    margin-top: 9px;
    text-align: left;
    font-size: 30px;
    .title {
      color: #333;
    }
  }
  .exit {
    color: #d86262;
    margin-top: 9px;
    text-align: center;
  }
}
</style>
