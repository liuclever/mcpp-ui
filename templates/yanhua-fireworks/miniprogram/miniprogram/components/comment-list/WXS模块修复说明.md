# 评论列表组件 WXS 模块修复说明

## 问题描述
用户反馈：点击"展开1条回复"按钮没有反应。

## 问题原因
在 WXML 模板中直接调用组件方法（如 `isExpanded(item.id)`、`formatNumber(num)`、`formatTime(time)`）是不支持的。小程序的 WXML 只能访问 data 中的数据，不能直接调用 methods 中的方法。

### 错误的写法
```xml
<!-- ❌ 不支持在模板中调用方法 -->
<text>{{formatNumber(item.likes)}}</text>
<text>{{formatTime(item.createTime)}}</text>
<view wx:if="{{isExpanded(item.id)}}">...</view>
```

## 解决方案
使用 WXS (WeiXin Script) 模块来实现模板中的逻辑处理。WXS 是小程序的一套脚本语言，可以在 WXML 中直接调用。

### 实现步骤

#### 1. 创建 WXS 文件
创建 `comment-list.wxs` 文件，实现工具函数：

```javascript
// comment-list.wxs
function formatNumber(num) {
  if (!num || num === 0) return '0';
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function formatTime(timeStr) {
  // 时间格式化逻辑
  // ...
}

function isExpanded(expandedComments, commentId) {
  // 判断是否展开
  for (var i = 0; i < expandedComments.length; i++) {
    if (expandedComments[i] === commentId) {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  isExpanded: isExpanded
};
```

#### 2. 在 WXML 中引入 WXS 模块
```xml
<wxs module="tools" src="./comment-list.wxs"></wxs>
```

#### 3. 使用 WXS 函数
```xml
<!-- ✅ 正确的写法 -->
<text>{{tools.formatNumber(item.likes)}}</text>
<text>{{tools.formatTime(item.createTime)}}</text>
<view wx:if="{{tools.isExpanded(expandedComments, item.id)}}">...</view>
```

#### 4. 清理 TypeScript 文件
从 `comment-list.ts` 中移除已迁移到 WXS 的方法：
- `formatNumber()` - 已移至 WXS
- `formatTime()` - 已移至 WXS
- `isExpanded()` - 已移至 WXS
- `getReplyText()` - 不再需要（直接在模板中判断）
- `hasChildren()` - 不再需要（直接在模板中判断）
- `getChildrenCount()` - 不再需要（直接使用 `item.children.length`）

保留的方法：
- `toggleExpand()` - 事件处理方法，需要修改数据
- `onReplyTap()` - 事件处理方法
- `onLikeTap()` - 事件处理方法
- `onLoadMore()` - 事件处理方法

## WXS vs TypeScript 方法

### 何时使用 WXS
- ✅ 需要在模板中进行数据格式化
- ✅ 需要在模板中进行简单的逻辑判断
- ✅ 需要在模板中进行数据转换

### 何时使用 TypeScript 方法
- ✅ 需要修改组件数据（setData）
- ✅ 需要触发事件（triggerEvent）
- ✅ 需要调用 API
- ✅ 复杂的业务逻辑

## WXS 限制

### 语法限制
- 不支持 ES6+ 语法（箭头函数、let/const、模板字符串等）
- 只能使用 var 声明变量
- 不能使用 Date 对象，需要使用 getDate() 函数
- 不能访问组件的 this

### 功能限制
- 不能调用小程序 API（wx.xxx）
- 不能修改组件数据
- 不能触发事件
- 运行环境与 JavaScript 隔离

## 修改的文件

### 新增文件
- `comment-list.wxs` - WXS 工具函数模块

### 修改文件
- `comment-list.wxml` - 引入 WXS 模块，使用 WXS 函数
- `comment-list.ts` - 移除已迁移到 WXS 的方法

## 测试验证

### 测试步骤
1. 打开产品详情页
2. 点击评论按钮打开评论弹窗
3. 查看评论列表
   - ✅ 时间应该显示为"X小时前"格式
   - ✅ 点赞数应该显示为"1.2k"格式
4. 点击"展开1条回复"按钮
   - ✅ 子评论应该展开显示
   - ✅ 按钮文字变为"收起1条回复"
   - ✅ 箭头图标旋转180度
5. 再次点击"收起1条回复"按钮
   - ✅ 子评论应该收起隐藏
   - ✅ 按钮文字变为"展开1条回复"
   - ✅ 箭头图标恢复原状

### 预期结果
- ✅ 所有格式化功能正常工作
- ✅ 展开/收起功能正常工作
- ✅ 性能良好，无卡顿

## 性能优化

### WXS 的性能优势
1. **运行在视图层**：WXS 代码运行在渲染线程，避免了逻辑层和视图层的通信开销
2. **减少 setData 调用**：格式化逻辑在视图层完成，不需要通过 setData 传递格式化后的数据
3. **提高渲染性能**：特别是在列表渲染时，WXS 可以显著提升性能

### 性能对比
```
使用 TypeScript 方法：
数据 → setData → 逻辑层处理 → setData → 视图层渲染
（多次通信，性能较差）

使用 WXS：
数据 → setData → 视图层直接处理和渲染
（一次通信，性能更好）
```

## 最佳实践

### 推荐的代码组织
```
component/
├── component.wxml    # 模板
├── component.wxss    # 样式
├── component.ts      # 逻辑（事件处理、数据管理）
├── component.wxs     # 工具函数（格式化、判断）
└── component.json    # 配置
```

### WXS 命名规范
- 模块名使用小写，如 `tools`、`utils`
- 函数名使用驼峰命名，如 `formatNumber`、`isExpanded`
- 文件名与组件名保持一致，如 `comment-list.wxs`

## 相关文档
- [WXS 官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/)
- [WXS 语法参考](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)
- [WXS 模块](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/01wxs-module.html)

## 修复时间
2024-01-02

## 修复状态
✅ 已修复并测试通过
