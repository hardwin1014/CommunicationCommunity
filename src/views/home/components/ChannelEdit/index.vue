<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button size="mini" round type="danger" plain @click="isEdit = !isEdit">{{isEdit?"完成":"编辑"}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item class="channel-item" v-for="(channel,index) in userChannels" :key="channel.id">
        <van-icon slot="icon" name="close"
                  v-show="isEdit&channel.name !== '推荐'"
                  @click="onUserChannelClick(channel,index)"/>
        <div slot="text" class="text-wrap">
          <span :class="{active:index===activeIndex}">{{channel.name}}</span>
        </div>
      </van-grid-item>
    </van-grid>
    <van-cell class="recomPd" title="频道推荐" :border="false"></van-cell>
    <van-grid :gutter="10">
      <van-grid-item class="channel-item"
                     v-for="channel in recommendChannels"
                     :key="channel.id"
                     @click="onAddChannel(channel)">
        <van-icon slot="icon" name="plus" />
        <div slot="text" class="text-wrap">
          <span>{{channel.name}}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel } from '@/api/channels'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  data () {
    return {
      isEdit: false,
      allChannels: []// 所有频道
    }
  },
  props: {
    userChannels: {
      type: Array,
      require: true
    },
    activeIndex: {
      type: Number,
      require: true
    }
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        console.log(error)
        this.$toast('获取所有频道数据失败！')
      }
      // try {
      //   let channels = []
      //   if (this.user) {
      //     // 已登录，请求获取线上的频道数据
      //     const { data } = await getChannels()
      //     channels = data.data.channels
      //   } else {
      //     // 未登录
      //     const localChannels = getItem('channels')
      //     if (localChannels) {
      //       // 有本地频道数据，则使用
      //       channels = localChannels
      //     } else {
      //       // 没有本地频道数据，则请求获取默认推荐的频道列表
      //       const { data } = await getChannels()
      //       channels = data.data.channels
      //     }
      //   }

      // 将数据更新到组件中
      //   this.allChannels = channels
      // } catch (err) {
      //   console.log(err)
      //   this.$toast('数据获取失败')
      // }
    },
    async onUserChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态，执行删除频道操作
        if (channel.name === '推荐') {
          return
        }
        if (index <= this.activeIndex) {
          this.$emit('update:active-index', this.activeIndex - 1)
        }
        this.userChannels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道操作
        this.$emit('update:active-index', index)
        this.$emit('close-popup')
      }
      // async deleteChannel (channel) {
      // try {
      //   if (this.user) {
      //     // 已登录，将数据存储到线上
      //     await deleteUserChannel(channel.id)
      //   } else {
      //     // 未登录，将数据存储到本地
      //     setItem('channles', this.userChannels)
      //   }
      // } catch (err) {
      //   console.log(err)
      //   this.$toast('删除频道失败，请稍后重试')
      // }
      // }
    },
    async onAddChannel (channel) {
      // 向我的频道数据中添加数据
      // this.userChannels.push(channel)
      try {
        this.userChannels.push(channel)
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([{
            id: channel.id, // 频道 id
            seq: this.userChannels.length // 频道的 序号
          }])
        } else {
          // 未登录，数据存储到本地
          setItem('channels', this.userChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('添加频道失败')
      }
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    recommendChannels () {
      // 思路：所有频道-我的频道=推荐频道
      // 数组的filter方法：遍历数组，根据函数的返回值决定是否收集遍历项
      // 返回值：一个数组，所有的条件为true
      return this.allChannels.filter(item => {
        const obj = this.userChannels.find(userItem => {
          return userItem.id === item.id
        })
        // 条件为undefined证明没有找到一样的
        return obj === undefined
      })
    }
  }
}
</script>
<style lang="less">
.channel-edit {
  .channel-item {
    height: 86px;
    .van-grid-item__content {
      flex-direction: row;
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 28px;
      }
    }
  }
}
.van-button--mini {
  width: 97px;
}
.van-cell__title {
  font-size: 32px;
  color: #333;
}
.recomPd {
  margin-top: 55px;
}
.van-icon-plus {
  font-size: 24px;
  line-height: 86px;
}
.text-wrap{
  font-size: 24px;
  color: #222222;
  overflow: hidden;
}
.van-icon-close{
  font-size: 20px;
  position: absolute;
  top: -0.15rem;
  right: -0.15rem;
}
.van-hairline{
  position:inherit;
}
.van-grid-item__icon-wrapper{
  position:static;
}
.van-grid-item__content{
  padding: 0;
}
</style>
