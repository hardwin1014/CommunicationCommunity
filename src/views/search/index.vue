<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form action="/" class="header">
      <van-search v-model="searchText"
                  show-action placeholder="请输入搜索关键词"
                  background="#3296fa"
                  @search="onSearch(val)"
                  @cancel="onCancel"
                  @focus="isResultShow = false"/>
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow"
                   :keywords="searchText"/>

    <!-- 联想建议 如果搜索框有内容显示建议-->
    <search-suggestion v-else-if="searchText"
                       :keywords="searchText"
                       @search="onSearch"/>
    <!-- /联想建议 -->

    <!-- /搜索历史 -->
    <search-history v-else
                    :historiesList="searchHistories"
                    @search="onSearch"
                    @update-history="searchHistories=$event"/>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  // 定义属性
  data () {
    return {
      searchText: '', // 输入框中的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: [] // 搜索历史数据,第一次是null
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  // 方法集合
  methods: {
    onSearch (val) {
      try {
        // 让输入框展示搜索结果
        this.searchText = val
        const index = this.searchHistories.indexOf(val)

        // 如果不为-1，则代表重复
        if (index !== -1) {
          // 把重复项删除
          this.searchHistories.splice(index, 1)
        }

        // 把最新的搜索历史记录放到顶部 触发搜索，记录搜索历史记录
        this.searchHistories.unshift(val)

        // 如果用户已登录，则把搜索历史记录存储到线上
        //    只要调用获取搜索结果的数据接口，后端会自动存储用户的搜索历史记录
        // 如果没有登录，则把搜索历史记录存储到本地
        // setItem('search-histories',this.searchHistories)

        // 展示搜索结果
        this.isResultShow = true
      } catch (error) {
        console.log(error)
      }
    },
    onCancel () {
      this.$router.back()
    },
    // 搜索历史
    // 因为后端帮我们存储的用户搜索历史记录太少了，只有四条
    // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
    async loadSearchHistories () {
      const searchHistories = getItem('search-histories') || []
      // if(this.user){
      //   const { data } = await getSearchHistories()
      //   // 将set转为数组，数组合并
      //   searchHistories = [...new Set([...searchHistories,...data.data.keywords])];
      // }
      this.searchHistories.push(...searchHistories)
      // console.log(this.searchHistories);
    }
  },
  created () {
    this.loadSearchHistories()
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  }
}
</script>

<style lang='less'>
.search-container {
  margin-top: 121px;
  .van-search__action {
    color: #fff;
  }
}
.header{
  width: 750px;
  height: 121px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>
