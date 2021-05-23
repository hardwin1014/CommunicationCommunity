<template>
  <van-button
    v-if="is_followed"
    class="follow-btn"
    round
    size="small"
    :loading="isFollowed"
    @click="doFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="isFollowed"
    @click="doFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user.js'
export default {
  // 定义属性
  data () {
    return {
      isFollowed: false
    }
  },
  model: {
    prop: 'is_followed',
    event: 'updateFollow'
  },
  props: {
    is_followed: {
      type: Boolean,
      required: true
    },
    aut_id: {
      type: Number,
      required: true
    }
  },
  methods: {
    async doFollow () {
      this.isFollowed = true
      try {
        // 如果已关注，则取消关注,获取作者的Id
        if (this.is_followed) {
          await deleteFollow(this.aut_id)
        } else {
          // 否则添加关注
          await addFollow(this.aut_id)
        }

        // 这样是直接改父组件的值，然后再传给子组件，不允许
        // this.is_followed = !this.is_followed

        // 更新父组件
        this.$emit('updateFollow', !this.is_followed)
        this.$toast('操作成功')
      } catch (error) {
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          this.$toast.fail('自己不能关注自己')
        }
      }
      // 关闭按钮的loading状态
      this.isFollowed = false
    }
  }
}
</script>

<style lang='less'>

</style>
