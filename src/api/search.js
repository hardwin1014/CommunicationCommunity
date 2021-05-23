import request from '@/utils/request'

// 搜索建议
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q // 联想的关键词
    }
  })
}

// 搜索结果
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}

// 获取用户搜索历史
export const getSearchHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}

// 删除历史记录
// export const delSearchHistories= () => {
//   return request ({
//     method: "DELETE",
//     url: "/app/v1_0/search/histories"
//   });
// }
