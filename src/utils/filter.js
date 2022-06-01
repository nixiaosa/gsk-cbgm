/*
 * @Author       : liuchang
 * @Date         : 2020-07-28
 */
/**
 * 用于前端列表（无分页）数据筛选
 *
 * =============================Example=================================
 *  字典数据:
 *    options[{code:xx,name:'xxx'},...]
 *  el-select与options的code双向绑定，假设v-model="taskName"
 *  el-table-column的prop：task
 *
 * doFilter 参数:
 *    products：传入完整列表数组
 *    conditions：{
 *      chooses: [{
          key: task,  //选择全部时传null
          value: taskName
        },{
          key: '',
          value: ''
        }...],
        others:[],... //其他类型的筛选条件
 *    }
 * =============================Example=================================
 */
const ProductFilters = {
  /**
   * 用于非选择框数据筛选
   * @param {array<Product>} products
   * @param {array<{type: String, low: number, high: number}>} ranges
   */
  rangesFilter: function(products, ranges) {},
  /**
   * 选择类型筛选
   * @param {array<Product>} products
   * @param {array<{type: String, value: String}>} chooses
   */
  choosesFilter: function(products, chooses) {
    let tmpProducts = products
    if (chooses.length !== 0) {
      for (const choice of chooses) {
        if (choice.key === null || choice.key === undefined) continue
        if (choice.value instanceof Array) {
          tmpProducts = tmpProducts.filter(item => choice.value.includes(item[choice.key]))
        } else {
          tmpProducts = tmpProducts.filter(item => +item[choice.key] === +choice.value)
        }
      }
    }
    return tmpProducts
  }
}

export function doFilter(products, conditions) {
  products = JSON.parse(JSON.stringify(products))
  // 根据条件(conditions)循环调用筛选器里的方法
  for (const key in conditions) {
    // 判断是否有需要的过滤方法
    if (ProductFilters.hasOwnProperty(key + 'Filter') && typeof ProductFilters[key + 'Filter'] === 'function') {
      products = ProductFilters[key + 'Filter'](products, conditions[key])
    }
  }
  return products
}
