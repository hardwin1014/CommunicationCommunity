<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <!-- 上传照片 -->
    <input type="file" 
           hidden 
           ref="file"
           @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell class="avatar-cell" 
              title="头像" 
              is-link 
              center 
              @click="$refs.file.click()"
             >
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="user.photo"
        ref="img"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isEditNameShow = true"/>
    <van-cell title="性别" :value="user.gender === 0 ?'男':'女'" is-link @click="isEditGenderShow = true"/>
    <van-cell title="生日" :value="user.birthday" is-link @click="isEditBirthdayShow = true"/> 

    <!-- 弹出层 -->
    <van-popup 
      v-model="isEditNameShow"
      position="bottom"
      :style="{height: '100%'}"
    >
     
      <!-- 当你传递子组件的数据既要使用，又要修改，name
      发布自定义事件，
      
      这种情况下可以使用v-model简写
       -->
       <!-- 
          v-model = "user.name"  
          默认传递名字叫value的数据
          :value = "user.name" 默认名字叫value
          默认监听input事件
          @input = "user.name = $event"
        -->
      <update-name 
        @close="isEditNameShow=false" 
        :name="user.name"
        @update-name="user.name = $event"
        v-if="isEditNameShow"
      ></update-name>
    </van-popup>

    <!-- 修改性别 0是男 1是女 -->
    <van-popup 
      v-model="isEditGenderShow"
      position="bottom" 
    >
    <update-gender 
      @close="isEditGenderShow=false" 
      :gender='user.gender'
      @update-gender='user.gender = $event'
      v-if="isEditGenderShow"
    ></update-gender>
    </van-popup>

    <!-- 修改生日 -->
    <van-popup 
      v-model="isEditBirthdayShow"
      position="bottom" 
    >
    <update-birthday 
      @close="isEditBirthdayShow=false" 
      :birthday='user.birthday'
      @update-birthday='user.birthday = $event'
      v-if="isEditBirthdayShow"
    > 
    <!-- v-if是为了防止缓存，打开上次打开的数据 -->
    </update-birthday>
    </van-popup>

    <!-- 修改头像 -->
    <van-popup 
      v-model="isEditPhotoShow"
      closeable
      position="bottom" 
      :style="{height: '100%'}"
    > 
    <update-photo 
      :file="previewImage"
      @close="isEditPhotoShow = false"
      @updateImage="user.photo = $event"
    />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name";
import UpdateGender from "./components/update-gender";
import UpdateBirthday from "./components/update-birthday";
import UpdatePhoto from "./components/update-photo";
export default {
  name: 'UserProfile', 
  data () {
    return {
      user: {},
      isEditNameShow: false,
      isEditGenderShow: false,
      isEditBirthdayShow:false,
      isEditPhotoShow: false,
      previewImage: null // 上传预览图片
    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created () {
    // 先请求数据
    this.loadUserProfile()
  }, 
  methods: {
    async loadUserProfile(){
      try {
        const {data} = await getUserProfile() 
        this.user = data.data 
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange(){
      this.isEditPhotoShow = true

      // 在弹出层里面预览图片 //获取照片数据
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      // 文件对象
      const file = this.$refs.file.files[0]
      this.previewImage = window.URL.createObjectURL(file)
      // 显示裁剪组件
      this.isEditPhotoShow = true

      // 为了解决相同文件不触发change事件 所以这里手动 清空file的value
      this.$refs.file.value=''
    }
  }
}
</script>

<style lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }  
}
// .van-popup{
//   background-color: #f5f7f9;
// }
</style>
