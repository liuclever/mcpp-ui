// 在微信开发者工具的控制台中运行此代码来测试连接

console.log('=== 开始测试后端连接 ===')

// 测试1: 基础连接测试
console.log('\n测试1: 基础连接测试')
wx.request({
  url: 'http://192.168.100.1:8080/api/about/contact',
  method: 'GET',
  success: (res) => {
    console.log('✓ 连接成功!')
    console.log('状态码:', res.statusCode)
    console.log('返回数据:', res.data)
    
    if (res.data && res.data.code === 200) {
      console.log('✓ 数据格式正确')
      console.log('公司名称:', res.data.data.companyName)
      console.log('地址:', res.data.data.address)
      console.log('电话:', res.data.data.phone1)
    } else {
      console.log('✗ 数据格式错误')
    }
  },
  fail: (err) => {
    console.log('✗ 连接失败!')
    console.log('错误信息:', err)
    console.log('\n可能的原因:')
    console.log('1. 未勾选"不校验合法域名"')
    console.log('2. 后端服务未启动')
    console.log('3. IP地址不正确')
  }
})

// 测试2: 产品分类接口
console.log('\n测试2: 产品分类接口')
wx.request({
  url: 'http://192.168.100.1:8080/api/product/categories',
  method: 'GET',
  success: (res) => {
    console.log('✓ 产品分类接口正常')
    console.log('分类数量:', res.data.data ? res.data.data.length : 0)
  },
  fail: (err) => {
    console.log('✗ 产品分类接口失败:', err)
  }
})

// 测试3: 图片列表接口
console.log('\n测试3: 图片列表接口')
wx.request({
  url: 'http://192.168.100.1:8080/api/home-gallery/list',
  method: 'GET',
  data: {
    moduleType: 'about',
    limit: 6
  },
  success: (res) => {
    console.log('✓ 图片列表接口正常')
    console.log('图片数量:', res.data.data ? res.data.data.length : 0)
  },
  fail: (err) => {
    console.log('✗ 图片列表接口失败:', err)
  }
})

console.log('\n=== 测试完成，请查看上方结果 ===')
