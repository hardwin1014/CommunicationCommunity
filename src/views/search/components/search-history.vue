<template>
  <div class="search-container">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow">
        <span @click="$emit('update-history', []);searchlist=[]" class="alldel">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in searchlist" :key="index" @click="onHistoryClick(item,index)">
      <van-icon name="close" v-show="isDeleteShow"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  // 定义属性
  data () {
    return {
      searchlist: this.historiesList,
      isDeleteShow: false
    }
  },
  // prop数据如果是引用类型(数组对象)可以修改子数据，但不能重新赋值
  // props数据不能重新赋值，如果想要prop数据=新数据：让父组件自己修改
  props: ['historiesList'],
  // 方法集合
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchlist.splice(index, 1)
        // 持久化处理，修改本地储存的数据
        // 请求接口删除线上的数据
        // setItem('search-histories', this.searchlist)
        return
      }
      // 非删除状态
      this.$emit('search', item)
    }
  },
  created () {

  }
}
</script>

<style lang='less'>
.alldel{
  margin-right: 10px;
}
</style>
