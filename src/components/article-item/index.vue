<template>
  <div class="item-contianer">
      <van-cell :to="'/article/'+article.art_id">
          <!--标题插槽-->
          <div slot="title" class="title van-multi-ellipsis--l2">{{article.title}}</div>
          <!--内容插槽-->
          <div slot="label">
              <div class="img-list" v-if="article.cover.type === 3">
                  <div class="img-item" v-for="(pic,index) in article.cover.images" :key="index">
                      <img class="cover-img" :src="pic">
                  </div>
              </div>
              <div class="marks">
                  <span>{{article.pubdate | dateFormat}}</span>
              </div>
          </div>
          <!--右侧插槽-->
          <div class="right-cover" slot="default" v-if="article.cover.type === 1">
              <van-image class="cover-img" fit="contain" :src="article.cover.images[0]" />
          </div>
      </van-cell>
  </div>
</template>

<script>
export default {
  // 定义属性
  data () {
    return {

    }
  },
  props: ['article'],
  // 计算属性，会监听依赖属性值随之变化
  computed: {

  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {

  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
  }
}
</script>

<style lang='less'>
.item-contianer{
  .title{
    font-size: 32px;
    letter-spacing: 2px;
    color:#3a3a3a;
  }
  .img-list{
      display: flex;
      justify-content: center;
      align-items: center;
      .img-item{
        flex: 1;
        height: 146px;
        .cover-img{
            width: auto;
            height: 146px;
        }
        &:not(:last-child){
          margin-right: 4px;
        }
    }

  }
  .right-cover{
      height: 146px;
      .cover-img{
          height: 146px;
          width: auto;
      }
  }
}
</style>
