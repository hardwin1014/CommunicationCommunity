<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel='$emit("close")'
      @confirm ='onConfirm'
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from 'dayjs'
export default {
  // 定义属性
  data() {
    return {
      minDate: new Date(1970, 0, 1),// 最小生日
      maxDate: new Date(),// 最大值
      currentDate: new Date(this.birthday)// 日期对象，自己的生日
    }
  },
  props: ['birthday'],
  methods: {
    async onConfirm(){
      //请求提交更新用户生日
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, //禁止背景点击
      })  
       
      // const date =  `${this.currentDate.getFullYear()}-${this.currentDate.getMonth()+1}-${this.currentDate.getDate()}`

      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      // 更新父组件中的用户生日
      await updateUserProfile({
        birthday: date
      })

      // 关闭弹出层  
      // 提示保存成功
      // 更新成功-》传date-->关闭弹出层
      this.$emit('update-birthday', date)
      this.$emit('close')
      this.$toast.success('保存成功') 
    } 
  }
}
</script>

<style lang='less'>
  
</style>