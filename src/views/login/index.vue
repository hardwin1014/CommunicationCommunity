<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="tage-nav-bar" title="登录">
    <!-- 登录左上角关闭按钮，点击一下回到上一级 -->
      <van-icon slot="left" name="cross" @click="$router.back()"/>
    </van-nav-bar>
    <!-- 登录表单
      表单验证

        // 1>给van-field组件配置rules 验证规则
            参考文档：

        // 2>当表单提交的时候会自动触发表单验证

            如果验证通过，会触发submit事件，
            验证失败，不会触发submit事件
     -->
    <van-form ref="loginForm" @submit="onLogin">
      <van-field
        v-model="user.mobile"
        name="mobile"
        left-icon="smile-o"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11">
        <i slot="left-icon" class="iconfont icon_shouji"></i>
      </van-field>
      <van-field
          v-model="user.code"
          type="number"
          name="code"
          left-icon="phone"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          maxlength="6">
        <i slot="left-icon" class="iconfont icon_yanzhengma"></i>
        <template #button>
          <!--
            倒计时时间
          -->
          <van-count-down
            v-if = "isCountDownShow"
            :time="1000*5"
            format="ss s"
            @finish="isCountDownShow = false"
            />
          <van-button
            v-else
            size="small"
            class="van-button--yzm"
            native-type="button"
            type="primary"
            @click='onSendSms'
            >发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button class="van-button--btn" round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, getSmsCode } from '@/api/user.js'
export default {
  name: 'index',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      // 验证规则，放到对象中
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        },
        {
          pattern: /1\d{10}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  // 钩子
  mounted () {
    // 打印token
    console.log(this.$store.state.user)
  },
  methods: {
    async onLogin () {
      // 1.获取表单数据
      // 2.表单验证
      // 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000毫秒，设置0，表示持续展示
      })

      // 3.提交表单请求登录
      try {
        const res = await login(this.user)
        // 打印提交成功的状态
        // console.log(res)
        this.$toast.success('登录成功')
        this.$router.push('/my')
        this.$store.commit('setUser', res.data.data)
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },

    // 发送验证的验证，因为要等待手机号验证之后才能校验手机号，所以要使用同步
    async onSendSms () {
      // 1.校验手机号---传参(传name)就代表验证某个表单项
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return console.log('验证失败', error)
      }

      // 2.请求发送验证码，接口
      try {
        await getSmsCode(this.user.mobile)
        this.$toast('发送成功')
        this.isCountDownShow = false
      } catch (error) {
        // 发送失败，关闭倒计时
        if (error.response.status === 429) {
          this.$toast('操作过于频繁，请稍后重试')
        } else {
          this.$toast('发送失败，稍后请重试')
        }
      }

      // 3.验证通过，显示倒计时
      this.isCountDownShow = true
    }
  }
}
</script>

<style lang="less">
.van-nav-bar__title {
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
}
.iconfont {
  font-size: 37px;
}
.icon_yanzhengma::before {
  line-height: 0.75rem;
}
.van-button--btn {
  width: 694px;
  height: 88px;
  background: #6db4fb;
  border-radius: 10px;
  border: none;
}
.van-button--yzm {
  width: 152px;
  height: 46px;
  background: #ededed;
  border-radius: 23px;
  border: none;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666666;
  line-height: 36px;
}
</style>
