<template>
  <div class="search-suggestion">
    <van-cell v-for="(val, index) in resultList"
              :key="index"
              icon="search"
              @click="$emit('search',val)">
      <div slot="title" v-html="highlight(val)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
// 防抖
import { debounce } from 'lodash'
export default {
  // 定义属性
  data () {
    return {
      resultList: []
    }
  },
  props: {
    keywords: {
      type: String,
      require: true
    }
  },
  watch: {
    // 监听文本框内容变化
    keywords: {
      // 对这个请求做防抖处理
      // 当数据发生变化则会执行handler处理函数
      // 参数1：函数
      // 参数2：时间
      // 返回值：防抖处理的函数
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.keywords)
        this.resultList.push(...data.data.options)
      }, 1000),
      // 当数据发生变化则会执行handler函数
      // async handler () {
      //   const { data } = await getSearchSuggestions(this.keywords)
      //   this.resultList.push(...data.data.options)
      //   console.log(data.data.options);
      // },
      // 该回调将会侦听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    highlight (source) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(this.keywords, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${this.keywords}</span>`)
    }
  }
}
</script>

<style lang='less'>
</style>
