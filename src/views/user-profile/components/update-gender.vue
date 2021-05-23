<template>
  <div class="update-gender">
    <van-picker show-toolbar :columns="columns" @cancel="$emit('close')" @confirm="onConfirm" :defaultIndex="defaultIndex" @change="onGenderChange" />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
export default {
  // 定义属性
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.gender
    }
  },
  props: ['gender'],
  // 方法集合
  methods: {
    // vant的监听方法，有三个参数
    onGenderChange (piker,value,index) {
      console.log(piker,value,index);
      this.defaultIndex = index 
    },
    async onConfirm () {
      // 提交更新用户昵称
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, //禁止背景点击
      })
      //请求提交更新用户昵称
      // 修改谁传谁 
      
      await updateUserProfile({
        gender: this.defaultIndex
      })

      // 提示保存成功
      // 更新成功-》修改父组件的name，-->关闭弹出层
      this.$emit('update-gender', this.defaultIndex)
      this.$emit('close')
      this.$toast.success('保存成功') 
    }
  }
}
</script>

<style lang='less'>
</style>