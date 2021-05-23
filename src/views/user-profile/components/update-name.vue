<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="修改昵称"  
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-file-wrod">
      <van-field
        v-model="localName"
        rows="2"
        autosize 
        type="textarea"
        maxlength="7"
        show-word-limit
        placeholder="请输入留言"
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
export default { 
  // 定义属性
  data() {
    return {
      // 将props数据映射到本地data数据中，只是将值给了localName
      localName: this.value
    }
  },
  props: ['value'],
  // 方法集合
  methods: {
    async onConfirm(){
      // 提交更新用户昵称
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, //禁止背景点击
      })
      //请求提交更新用户昵称
      // 修改谁传谁
      try {
        await updateUserProfile({
          name: this.localName
        })
        // 提示保存成功
        // 更新成功-》修改父组件的name，-->关闭弹出层
        this.$emit('update-name',this.localName)
        this.$emit('close')
        this.$toast.success('保存成功')
      } catch (error) {
        if(error && error.response && err.response.status===409){
          this.$toast.fail('昵称已存在')
        }
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    
  }
}
</script>

<style lang='less'>
.name-file-wrod{
  padding: 10px;
}
</style>