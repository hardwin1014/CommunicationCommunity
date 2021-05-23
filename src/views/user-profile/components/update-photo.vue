<template>
  <div class="update-photo">
    <img :src="image" alt="" ref="image" class="image">
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
     />
  </div>
</template>

<script>
import { updateUserPhoto } from "@/api/user";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
export default {
  // 定义属性
  data() {
    return {
      // 再这里转换为blob对象
      image: this.file
    }
  },
  props: {
    file: {
      type: [String, Object],
      required: true
    }
  },
  methods:{
    async onConfirm(){
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // 如果要求Content-Type是multipart /
      // form-data 则一定要提交FormDate数据对象
      // 专门用于文件上传的,不能提交{}
      const fd = new FormData()
      fd.append('photo',this.image)
      await updateUserPhoto(fd)

      // 更新父组件中的用户头像
      this.$emit('update-photo',this.image)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  },
  // 生命周期-挂载完成（可以访问DOM元素）
  mounted(){
    // 获取需要裁切的图片dom
    const pic = this.$refs.image

    const cropper = new Cropper(pic, {
      aspectRatio: 16 / 9,
      // crop(event) {
      //   console.log(event.detail.x);
      //   console.log(event.detail.y);
      //   console.log(event.detail.width);
      //   console.log(event.detail.height);
      //   console.log(event.detail.rotate);
      //   console.log(event.detail.scaleX);
      //   console.log(event.detail.scaleY);
      // }
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })

    console.log(cropper);
  }
}
</script>

<style lang='less'>
.toolbar{
  position:fixed;
  left: 0;
  right: 0;
  bottom: 0;
}   
.update-photo{
  height: 100%;
  .image{
    display: block;
    max-width: 100%; 
  }
}

</style>