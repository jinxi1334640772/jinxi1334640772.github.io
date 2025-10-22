---
title: vxe-grid 高级用法指南
description: 深入探讨 vxe-grid 表格组件的高级特性、性能优化和企业级应用，掌握复杂表格场景的解决方案
outline: deep
---

# 📊 vxe-grid 高级用法指南

vxe-grid 是 vxe-table 的高级封装组件，提供了更强大的功能和更便捷的配置方式，适用于企业级复杂表格场景。

::: tip 📚 本章内容
深入理解 vxe-grid 的高级特性、性能优化策略和企业级应用场景，帮助开发者构建高性能的复杂表格系统。
:::

## 1. 虚拟滚动与性能优化

### 1.1 大数据虚拟滚动

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :data="tableData"
    height="600"
  >
  </vxe-grid>
</template>

<script setup>
import { ref, reactive } from 'vue';

/**
 * 大数据虚拟滚动配置
 * 适用于 10万+ 数据量的表格渲染
 */
const gridOptions = reactive({
  border: true,
  resizable: true,
  showOverflow: true,
  highlightHoverRow: true,
  
  // 虚拟滚动配置（核心）
  scrollY: {
    enabled: true,
    gt: 100, // 数据量大于 100 时启用虚拟滚动
    oSize: 5 // 额外渲染的行数
  },
  
  scrollX: {
    enabled: true,
    gt: 20 // 列数大于 20 时启用横向虚拟滚动
  },
  
  // 列配置
  columns: [
    { field: 'id', title: 'ID', width: 80, fixed: 'left' },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'email', title: '邮箱', width: 200 },
    { field: 'phone', title: '电话', width: 150 },
    { field: 'address', title: '地址', width: 300 },
    { field: 'createTime', title: '创建时间', width: 180 },
    { field: 'status', title: '状态', width: 100, fixed: 'right' }
  ],
  
  // 性能优化配置
  optimization: {
    // 列宽优化：禁用列宽自适应
    animat: false,
    // 滚动渲染优化
    scrollX: { gt: 20 },
    scrollY: { gt: 100 }
  }
});

/**
 * 模拟大数据
 */
const tableData = ref(
  Array.from({ length: 100000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    phone: `138${String(index).padStart(8, '0')}`,
    address: `北京市朝阳区某街道${index + 1}号`,
    createTime: new Date().toISOString(),
    status: index % 2 === 0 ? '启用' : '禁用'
  }))
);
</script>
```

### 1.2 懒加载与分页优化

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :proxy-config="proxyConfig"
  >
  </vxe-grid>
</template>

<script setup>
/**
 * 服务端分页 + 懒加载配置
 */
const gridOptions = reactive({
  border: true,
  height: 600,
  columns: [
    { type: 'seq', width: 60, title: '序号' },
    { field: 'name', title: '姓名' },
    { field: 'role', title: '角色' },
    { field: 'email', title: '邮箱' }
  ],
  
  // 分页配置
  pagerConfig: {
    enabled: true,
    currentPage: 1,
    pageSize: 50,
    pageSizes: [20, 50, 100, 200],
    layouts: [
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'Sizes',
      'FullJump',
      'Total'
    ]
  },
  
  // 工具栏配置
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: {
      buttons: 'toolbar-buttons'
    }
  }
});

/**
 * 代理配置：实现服务端分页
 */
const proxyConfig = reactive({
  // 响应结果配置
  props: {
    result: 'data.list',
    total: 'data.total'
  },
  
  // Ajax 配置
  ajax: {
    // 查询接口
    query: async ({ page, sorts, filters }) => {
      const params = {
        page: page.currentPage,
        pageSize: page.pageSize,
        sortField: sorts[0]?.field,
        sortOrder: sorts[0]?.order,
        ...filters.reduce((acc, filter) => {
          acc[filter.field] = filter.value;
          return acc;
        }, {})
      };
      
      const response = await fetch('/api/users?' + new URLSearchParams(params));
      return response.json();
    },
    
    // 删除接口
    delete: async ({ body }) => {
      const response = await fetch('/api/users/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: body.removeRecords.map(r => r.id) })
      });
      return response.json();
    },
    
    // 保存接口
    save: async ({ body }) => {
      const response = await fetch('/api/users/batch-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insertRecords: body.insertRecords,
          updateRecords: body.updateRecords,
          removeRecords: body.removeRecords
        })
      });
      return response.json();
    }
  }
});
</script>
```

## 2. 高级编辑功能

### 2.1 单元格编辑模式

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :data="tableData"
    :edit-config="editConfig"
    @edit-closed="handleEditClosed"
    @edit-actived="handleEditActived"
  >
  </vxe-grid>
</template>

<script setup>
/**
 * 单元格编辑配置
 */
const editConfig = reactive({
  trigger: 'click', // 触发方式: click | dblclick | manual
  mode: 'cell', // 编辑模式: cell | row
  showStatus: true, // 显示编辑状态
  autoClear: true, // 自动清除编辑状态
  
  // 激活编辑前的校验
  activeMethod: ({ row, column }) => {
    // 返回 false 禁止编辑该单元格
    if (row.locked) {
      return false;
    }
    return true;
  }
});

const gridOptions = reactive({
  border: true,
  showOverflow: true,
  keepSource: true, // 保留原始数据
  columns: [
    { field: 'name', title: '姓名', editRender: { name: 'input' } },
    { 
      field: 'age', 
      title: '年龄', 
      editRender: { 
        name: 'input',
        props: { type: 'number', min: 0, max: 150 }
      }
    },
    {
      field: 'role',
      title: '角色',
      editRender: {
        name: 'select',
        options: [
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
          { label: '访客', value: 'guest' }
        ]
      }
    },
    {
      field: 'birthday',
      title: '生日',
      editRender: {
        name: 'input',
        props: { type: 'date' }
      }
    },
    {
      field: 'hobby',
      title: '爱好',
      editRender: {
        name: 'select',
        props: { multiple: true },
        options: [
          { label: '阅读', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' }
        ]
      }
    }
  ]
});

/**
 * 编辑激活事件
 */
function handleEditActived({ row, column }) {
  console.log('开始编辑:', row, column);
}

/**
 * 编辑关闭事件
 */
function handleEditClosed({ row, column }) {
  console.log('结束编辑:', row, column);
  // 可在此处进行数据验证和保存
}
</script>
```

### 2.2 自定义编辑器

```vue
<template>
  <vxe-grid ref="gridRef" v-bind="gridOptions" :data="tableData">
    <!-- 自定义编辑器插槽 -->
    <template #edit_content="{ row }">
      <MyCustomEditor v-model="row.content" />
    </template>
    
    <!-- 自定义富文本编辑器 -->
    <template #edit_description="{ row }">
      <TinyMCE v-model="row.description" />
    </template>
  </vxe-grid>
</template>

<script setup>
import MyCustomEditor from './MyCustomEditor.vue';
import TinyMCE from './TinyMCE.vue';

const gridOptions = reactive({
  columns: [
    { field: 'title', title: '标题', editRender: { name: 'input' } },
    {
      field: 'content',
      title: '内容',
      width: 300,
      slots: { edit: 'edit_content' }
    },
    {
      field: 'description',
      title: '描述',
      width: 400,
      slots: { edit: 'edit_description' }
    }
  ]
});
</script>
```

## 3. 数据验证与校验

### 3.1 表单验证规则

```vue
<script setup>
/**
 * 完整的数据验证配置
 */
const gridOptions = reactive({
  editRules: {
    // 必填验证
    name: [
      { required: true, message: '姓名不能为空' }
    ],
    
    // 多规则验证
    email: [
      { required: true, message: '邮箱不能为空' },
      { 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        message: '邮箱格式不正确' 
      }
    ],
    
    // 自定义验证函数
    age: [
      { required: true, message: '年龄不能为空' },
      {
        validator: ({ cellValue }) => {
          if (cellValue < 0 || cellValue > 150) {
            return new Error('年龄必须在 0-150 之间');
          }
        }
      }
    ],
    
    // 异步验证
    username: [
      { required: true, message: '用户名不能为空' },
      {
        async validator({ cellValue }) {
          if (cellValue) {
            const response = await fetch(`/api/check-username?name=${cellValue}`);
            const { exists } = await response.json();
            if (exists) {
              return new Error('用户名已存在');
            }
          }
        }
      }
    ],
    
    // 条件验证
    phone: [
      {
        validator({ row, cellValue }) {
          // 如果选择了手机号登录方式，则手机号必填
          if (row.loginType === 'phone' && !cellValue) {
            return new Error('请填写手机号');
          }
          if (cellValue && !/^1[3-9]\d{9}$/.test(cellValue)) {
            return new Error('手机号格式不正确');
          }
        }
      }
    ]
  },
  
  // 编辑配置
  editConfig: {
    trigger: 'click',
    mode: 'row',
    showStatus: true
  }
});

/**
 * 手动触发验证
 */
const gridRef = ref();

async function validateAll() {
  const $grid = gridRef.value;
  const errMap = await $grid.validate();
  
  if (errMap) {
    console.log('验证失败:', errMap);
    return false;
  }
  
  console.log('验证通过');
  return true;
}

/**
 * 验证指定行
 */
async function validateRow(row) {
  const $grid = gridRef.value;
  const errMap = await $grid.validateRow(row);
  return !errMap;
}

/**
 * 清除验证
 */
function clearValidate() {
  gridRef.value.clearValidate();
}
</script>
```

### 3.2 自定义验证器

```javascript
/**
 * validators.js - 自定义验证器集合
 */

/**
 * 身份证验证
 */
export function validateIdCard({ cellValue }) {
  const pattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  
  if (!pattern.test(cellValue)) {
    return new Error('身份证号格式不正确');
  }
  
  // 校验位验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  const sum = cellValue
    .slice(0, 17)
    .split('')
    .reduce((acc, num, index) => acc + parseInt(num) * weights[index], 0);
  
  const checkCode = checkCodes[sum % 11];
  
  if (cellValue[17].toUpperCase() !== checkCode) {
    return new Error('身份证号校验位错误');
  }
}

/**
 * 价格范围验证
 */
export function validatePriceRange(min, max) {
  return ({ cellValue }) => {
    const value = parseFloat(cellValue);
    if (isNaN(value)) {
      return new Error('请输入有效的价格');
    }
    if (value < min || value > max) {
      return new Error(`价格必须在 ${min}-${max} 之间`);
    }
  };
}

/**
 * 唯一性验证
 */
export function validateUnique(field, message = '该值已存在') {
  return async ({ row, cellValue, $grid }) => {
    const { fullData } = $grid.getTableData();
    const exists = fullData.some(
      item => item !== row && item[field] === cellValue
    );
    
    if (exists) {
      return new Error(message);
    }
  };
}
```

## 4. 复杂表头与合并

### 4.1 多级表头

```javascript
const gridOptions = reactive({
  columns: [
    {
      title: '基本信息',
      children: [
        { field: 'name', title: '姓名', width: 100 },
        { field: 'age', title: '年龄', width: 80 },
        {
          title: '联系方式',
          children: [
            { field: 'email', title: '邮箱', width: 180 },
            { field: 'phone', title: '电话', width: 120 }
          ]
        }
      ]
    },
    {
      title: '工作信息',
      children: [
        { field: 'company', title: '公司', width: 150 },
        { field: 'position', title: '职位', width: 120 },
        { field: 'salary', title: '薪资', width: 100 }
      ]
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'action' }
    }
  ]
});
```

### 4.2 动态合并单元格

```vue
<script setup>
/**
 * 单元格合并配置
 */
const gridOptions = reactive({
  spanMethod({ row, rowIndex, column, columnIndex, data }) {
    // 按部门合并第一列
    if (columnIndex === 0) {
      const prevRow = data[rowIndex - 1];
      const nextRow = data[rowIndex + 1];
      
      if (prevRow && prevRow.department === row.department) {
        return { rowspan: 0, colspan: 0 }; // 被合并的单元格
      }
      
      // 计算相同部门的行数
      let rowspan = 1;
      for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i].department === row.department) {
          rowspan++;
        } else {
          break;
        }
      }
      
      return { rowspan, colspan: 1 };
    }
  },
  
  footerSpanMethod({ columnIndex }) {
    // 合并统计行
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 2 };
    } else if (columnIndex === 1) {
      return { rowspan: 0, colspan: 0 };
    }
  }
});

/**
 * 数据格式示例
 */
const tableData = ref([
  { id: 1, department: '技术部', name: '张三', salary: 10000 },
  { id: 2, department: '技术部', name: '李四', salary: 12000 },
  { id: 3, department: '技术部', name: '王五', salary: 15000 },
  { id: 4, department: '市场部', name: '赵六', salary: 9000 },
  { id: 5, department: '市场部', name: '孙七', salary: 11000 }
]);
</script>
```

## 5. 树形表格

### 5.1 树形数据展示

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :data="treeData"
    :tree-config="treeConfig"
  >
  </vxe-grid>
</template>

<script setup>
/**
 * 树形表格配置
 */
const treeConfig = reactive({
  transform: true, // 自动将列表转为树结构
  rowField: 'id', // 行数据的唯一主键字段名
  parentField: 'parentId', // 父节点字段名
  children: 'children', // 子节点字段名
  expandAll: false, // 默认展开所有节点
  expandRowKeys: [1, 2], // 默认展开指定节点
  accordion: false, // 手风琴模式
  line: true, // 显示连接线
  iconOpen: 'vxe-icon-square-minus', // 自定义展开图标
  iconClose: 'vxe-icon-square-plus', // 自定义折叠图标
  
  // 懒加载子节点
  lazy: true,
  loadMethod({ row }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const children = [
          { id: `${row.id}-1`, name: `${row.name}-子节点1`, parentId: row.id },
          { id: `${row.id}-2`, name: `${row.name}-子节点2`, parentId: row.id }
        ];
        resolve(children);
      }, 500);
    });
  }
});

const gridOptions = reactive({
  border: true,
  resizable: true,
  columns: [
    { field: 'name', title: '名称', treeNode: true, width: 300 },
    { field: 'type', title: '类型', width: 100 },
    { field: 'size', title: '大小', width: 100 },
    { field: 'date', title: '修改日期', width: 180 }
  ]
});

/**
 * 树形数据示例
 */
const treeData = ref([
  {
    id: 1,
    name: '根目录',
    type: '文件夹',
    children: [
      {
        id: 11,
        name: '子目录1',
        type: '文件夹',
        children: [
          { id: 111, name: '文件1.txt', type: '文件', size: '1KB' },
          { id: 112, name: '文件2.doc', type: '文件', size: '2MB' }
        ]
      },
      { id: 12, name: '文件3.pdf', type: '文件', size: '500KB' }
    ]
  },
  {
    id: 2,
    name: '其他目录',
    type: '文件夹',
    children: [
      { id: 21, name: '图片1.png', type: '图片', size: '300KB' }
    ]
  }
]);

/**
 * 树形表格操作方法
 */
const gridRef = ref();

// 展开所有节点
function expandAll() {
  gridRef.value.setAllTreeExpand(true);
}

// 折叠所有节点
function collapseAll() {
  gridRef.value.clearTreeExpand();
}

// 展开指定节点
function expandRow(row) {
  gridRef.value.setTreeExpand(row, true);
}

// 获取树形数据
function getTreeData() {
  return gridRef.value.getTableData().fullData;
}
</script>
```

## 6. 导出与打印

### 6.1 高级导出功能

```vue
<script setup>
/**
 * 导出配置
 */
const exportConfig = reactive({
  // 导出类型
  types: ['html', 'xml', 'csv', 'txt'],
  
  // 导出模式
  modes: ['current', 'selected', 'all'],
  
  // 文件名
  filename: '数据导出',
  
  // 工作表名称
  sheetName: 'Sheet1',
  
  // 是否导出表头
  isHeader: true,
  
  // 是否导出表尾
  isFooter: true,
  
  // 导出数据处理
  dataFilterMethod({ row, column }) {
    // 排除敏感字段
    if (column.field === 'password') {
      return '******';
    }
    return row[column.field];
  },
  
  // 列过滤
  columnFilterMethod({ column }) {
    // 不导出操作列
    return column.field !== 'action';
  },
  
  // 自定义导出样式（仅支持 xlsx）
  styleMethod({ row, column, cellValue }) {
    // 根据条件设置样式
    if (column.field === 'status' && cellValue === '禁用') {
      return {
        color: '#ff0000',
        backgroundColor: '#ffeeee'
      };
    }
  }
});

/**
 * 导出方法
 */
const gridRef = ref();

// 导出 Excel
async function exportExcel() {
  const $grid = gridRef.value;
  await $grid.exportData({
    type: 'xlsx',
    filename: `数据导出_${Date.now()}`,
    sheetName: '用户数据',
    mode: 'all',
    ...exportConfig
  });
}

// 导出 CSV
async function exportCsv() {
  await gridRef.value.exportData({
    type: 'csv',
    filename: '用户数据',
    mode: 'selected' // 只导出选中的行
  });
}

// 导出 HTML
async function exportHtml() {
  await gridRef.value.exportData({
    type: 'html',
    mode: 'current' // 只导出当前页
  });
}

// 高级导出：自定义数据处理
async function exportCustom() {
  const { fullData } = gridRef.value.getTableData();
  
  // 自定义处理数据
  const processedData = fullData.map(row => ({
    姓名: row.name,
    年龄: row.age,
    邮箱: row.email,
    注册时间: new Date(row.createTime).toLocaleDateString('zh-CN')
  }));
  
  // 导出处理后的数据
  await gridRef.value.exportData({
    data: processedData,
    type: 'xlsx',
    filename: '自定义导出'
  });
}
</script>
```

### 6.2 打印功能

```vue
<script setup>
/**
 * 打印配置
 */
const printConfig = reactive({
  // 打印模式
  mode: 'all', // current | selected | all
  
  // 是否打印表头
  isHeader: true,
  
  // 是否打印表尾
  isFooter: false,
  
  // 打印样式
  style: `
    .vxe-table {
      border: 1px solid #000;
    }
    .vxe-table th,
    .vxe-table td {
      border: 1px solid #ddd;
      padding: 8px;
    }
  `,
  
  // 自定义打印内容
  beforePrintMethod({ content }) {
    // 在打印内容前添加自定义内容
    return `
      <h1 style="text-align: center;">用户数据报表</h1>
      <p>打印时间: ${new Date().toLocaleString('zh-CN')}</p>
      ${content}
      <p style="text-align: center; margin-top: 20px;">--- 报表结束 ---</p>
    `;
  }
});

/**
 * 打印方法
 */
function handlePrint() {
  gridRef.value.print(printConfig);
}

/**
 * 高级打印：自定义内容
 */
function printWithCustomContent() {
  const $grid = gridRef.value;
  const { fullData } = $grid.getTableData();
  
  // 生成自定义 HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>数据报表</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>用户数据报表</h1>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>邮箱</th>
          </tr>
        </thead>
        <tbody>
          ${fullData.map(row => `
            <tr>
              <td>${row.name}</td>
              <td>${row.age}</td>
              <td>${row.email}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  // 打开新窗口并打印
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
</script>
```

## 7. 筛选与排序

### 7.1 高级筛选

```vue
<script setup>
/**
 * 筛选配置
 */
const gridOptions = reactive({
  columns: [
    {
      field: 'name',
      title: '姓名',
      sortable: true,
      filters: [
        { label: '包含"张"', value: '张' },
        { label: '包含"李"', value: '李' }
      ],
      filterMethod({ value, row }) {
        return row.name.includes(value);
      }
    },
    {
      field: 'age',
      title: '年龄',
      sortable: true,
      filters: [
        { label: '18-30岁', value: [18, 30] },
        { label: '30-50岁', value: [30, 50] },
        { label: '50岁以上', value: [50, 999] }
      ],
      filterMethod({ value, row }) {
        const [min, max] = value;
        return row.age >= min && row.age <= max;
      }
    },
    {
      field: 'status',
      title: '状态',
      filters: [
        { label: '启用', value: 'active', checked: false },
        { label: '禁用', value: 'inactive', checked: false }
      ],
      filterMultiple: true, // 支持多选
      filterMethod({ option, row }) {
        return row.status === option.value;
      }
    },
    {
      field: 'createTime',
      title: '创建时间',
      sortable: true,
      sortMethod(a, b) {
        // 自定义排序逻辑
        return new Date(a.createTime) - new Date(b.createTime);
      }
    }
  ],
  
  // 筛选配置
  filterConfig: {
    remote: true, // 是否服务端筛选
    iconNone: 'vxe-icon-funnel',
    iconMatch: 'vxe-icon-funnel-fill'
  },
  
  // 排序配置
  sortConfig: {
    remote: true, // 是否服务端排序
    multiple: true, // 多字段排序
    trigger: 'cell', // 触发方式: cell | default
    defaultSort: { field: 'createTime', order: 'desc' }
  }
});

/**
 * 服务端筛选和排序
 */
const proxyConfig = reactive({
  ajax: {
    query: async ({ page, sorts, filters }) => {
      const params = {
        page: page.currentPage,
        pageSize: page.pageSize,
        // 排序参数
        sorts: sorts.map(sort => ({
          field: sort.field,
          order: sort.order
        })),
        // 筛选参数
        filters: filters.map(filter => ({
          field: filter.field,
          values: filter.values
        }))
      };
      
      const response = await fetch('/api/users/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      return response.json();
    }
  }
});

/**
 * 手动筛选方法
 */
function filterData() {
  const $grid = gridRef.value;
  
  // 设置筛选条件
  $grid.setFilter([
    { field: 'name', values: ['张'] },
    { field: 'age', values: [[18, 30]] }
  ]);
  
  // 执行筛选
  $grid.updateData();
}

/**
 * 清除筛选
 */
function clearFilter() {
  gridRef.value.clearFilter();
}

/**
 * 获取筛选后的数据
 */
function getFilterData() {
  const { fullData, tableData } = gridRef.value.getTableData();
  console.log('完整数据:', fullData);
  console.log('筛选后数据:', tableData);
  return tableData;
}
</script>
```

### 7.2 自定义筛选面板

```vue
<template>
  <vxe-grid ref="gridRef" v-bind="gridOptions">
    <!-- 自定义筛选器插槽 -->
    <template #filter_name="{ column, $panel }">
      <div class="custom-filter">
        <input
          v-model="nameFilter"
          placeholder="输入姓名筛选"
          @input="handleNameFilter($panel)"
        />
        <button @click="confirmFilter($panel)">确定</button>
        <button @click="resetFilter($panel)">重置</button>
      </div>
    </template>
    
    <template #filter_date="{ column, $panel }">
      <div class="date-range-filter">
        <input type="date" v-model="dateRange.start" />
        <span>至</span>
        <input type="date" v-model="dateRange.end" />
        <button @click="confirmDateFilter($panel)">确定</button>
      </div>
    </template>
  </vxe-grid>
</template>

<script setup>
const nameFilter = ref('');
const dateRange = reactive({
  start: '',
  end: ''
});

/**
 * 处理姓名筛选
 */
function handleNameFilter($panel) {
  const filterList = $panel.getValues();
  // 实时筛选逻辑
}

/**
 * 确认筛选
 */
function confirmFilter($panel) {
  $panel.changeOption(null, true, { value: nameFilter.value });
  $panel.confirmFilter();
}

/**
 * 重置筛选
 */
function resetFilter($panel) {
  nameFilter.value = '';
  $panel.resetFilter();
}

/**
 * 日期范围筛选
 */
function confirmDateFilter($panel) {
  $panel.changeOption(null, true, { 
    value: [dateRange.start, dateRange.end] 
  });
  $panel.confirmFilter();
}
</script>
```

## 8. 工具栏与按钮

### 8.1 自定义工具栏

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :toolbar-config="toolbarConfig"
  >
    <!-- 自定义工具栏按钮 -->
    <template #toolbar_buttons>
      <vxe-button @click="handleAdd">
        <i class="vxe-icon-add"></i>
        新增
      </vxe-button>
      <vxe-button @click="handleBatchDelete">
        <i class="vxe-icon-delete"></i>
        批量删除
      </vxe-button>
      <vxe-button @click="handleExport">
        <i class="vxe-icon-download"></i>
        导出
      </vxe-button>
      <vxe-button @click="handleImport">
        <i class="vxe-icon-upload"></i>
        导入
      </vxe-button>
      <vxe-button @click="handleRefresh">
        <i class="vxe-icon-refresh"></i>
        刷新
      </vxe-button>
    </template>
    
    <!-- 自定义工具栏右侧内容 -->
    <template #toolbar_tools>
      <vxe-input
        v-model="searchText"
        placeholder="搜索..."
        @input="handleSearch"
      />
    </template>
  </vxe-grid>
</template>

<script setup>
/**
 * 工具栏配置
 */
const toolbarConfig = reactive({
  // 内置按钮
  refresh: true,
  export: true,
  print: true,
  zoom: true,
  custom: true,
  
  // 自定义按钮插槽
  slots: {
    buttons: 'toolbar_buttons',
    tools: 'toolbar_tools'
  }
});

const searchText = ref('');

/**
 * 新增行
 */
async function handleAdd() {
  const $grid = gridRef.value;
  const { row: newRow } = await $grid.insert({
    name: '',
    age: null,
    email: ''
  });
  
  // 激活第一个单元格编辑
  await $grid.setActiveCell(newRow, 'name');
}

/**
 * 批量删除
 */
async function handleBatchDelete() {
  const $grid = gridRef.value;
  const selectRecords = $grid.getCheckboxRecords();
  
  if (!selectRecords.length) {
    VXETable.modal.message({
      content: '请至少选择一条数据',
      status: 'warning'
    });
    return;
  }
  
  const confirm = await VXETable.modal.confirm('确定删除选中的数据吗？');
  if (confirm === 'confirm') {
    await $grid.remove(selectRecords);
  }
}

/**
 * 搜索功能
 */
function handleSearch() {
  const $grid = gridRef.value;
  const { fullData } = $grid.getTableData();
  
  if (!searchText.value) {
    $grid.reloadData(fullData);
    return;
  }
  
  const searchData = fullData.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchText.value.toLowerCase())
    );
  });
  
  $grid.reloadData(searchData);
}
</script>
```

## 9. 数据联动与级联

### 9.1 下拉框级联

```vue
<script setup>
/**
 * 省市区三级联动配置
 */
const gridOptions = reactive({
  columns: [
    {
      field: 'province',
      title: '省份',
      editRender: {
        name: 'select',
        options: [],
        events: {
          change: ({ row }) => {
            // 省份变化时清空市和区
            row.city = '';
            row.district = '';
            // 加载对应的城市列表
            loadCities(row.province);
          }
        }
      }
    },
    {
      field: 'city',
      title: '城市',
      editRender: {
        name: 'select',
        optionMethod: ({ row }) => {
          // 根据省份动态返回城市选项
          return getCitiesByProvince(row.province);
        },
        events: {
          change: ({ row }) => {
            row.district = '';
            loadDistricts(row.city);
          }
        }
      }
    },
    {
      field: 'district',
      title: '区县',
      editRender: {
        name: 'select',
        optionMethod: ({ row }) => {
          return getDistrictsByCity(row.city);
        }
      }
    }
  ]
});

/**
 * 获取城市列表
 */
function getCitiesByProvince(province) {
  const cityMap = {
    '北京': ['东城区', '西城区', '朝阳区', '海淀区'],
    '上海': ['黄浦区', '徐汇区', '长宁区', '静安区'],
    '广东': ['广州市', '深圳市', '珠海市', '东莞市']
  };
  return (cityMap[province] || []).map(city => ({
    label: city,
    value: city
  }));
}

/**
 * 获取区县列表
 */
function getDistrictsByCity(city) {
  // 模拟数据
  return [
    { label: `${city}区1`, value: `${city}区1` },
    { label: `${city}区2`, value: `${city}区2` }
  ];
}
</script>
```

### 9.2 主从表联动

```vue
<template>
  <div class="master-detail">
    <!-- 主表 -->
    <vxe-grid
      ref="masterGridRef"
      v-bind="masterOptions"
      :data="masterData"
      @current-change="handleMasterChange"
    >
    </vxe-grid>
    
    <!-- 从表 -->
    <vxe-grid
      ref="detailGridRef"
      v-bind="detailOptions"
      :data="detailData"
      class="detail-grid"
    >
    </vxe-grid>
  </div>
</template>

<script setup>
/**
 * 主表配置
 */
const masterOptions = reactive({
  border: true,
  highlightCurrentRow: true,
  columns: [
    { type: 'radio', width: 60 },
    { field: 'orderId', title: '订单ID', width: 120 },
    { field: 'customer', title: '客户', width: 150 },
    { field: 'totalAmount', title: '总金额', width: 120 },
    { field: 'orderDate', title: '订单日期', width: 180 }
  ]
});

/**
 * 从表配置
 */
const detailOptions = reactive({
  border: true,
  columns: [
    { field: 'productName', title: '商品名称', width: 200 },
    { field: 'quantity', title: '数量', width: 100 },
    { field: 'price', title: '单价', width: 120 },
    { field: 'amount', title: '小计', width: 120 }
  ]
});

const masterData = ref([]);
const detailData = ref([]);

/**
 * 主表行改变时加载从表数据
 */
async function handleMasterChange({ row }) {
  if (!row) {
    detailData.value = [];
    return;
  }
  
  // 加载订单详情
  const response = await fetch(`/api/orders/${row.orderId}/items`);
  const data = await response.json();
  detailData.value = data.items;
}
</script>

<style scoped>
.master-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-grid {
  height: 300px;
}
</style>
```

## 10. 右键菜单与快捷操作

### 10.1 自定义右键菜单

```vue
<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    :menu-config="menuConfig"
    @menu-click="handleMenuClick"
  >
  </vxe-grid>
</template>

<script setup>
/**
 * 右键菜单配置
 */
const menuConfig = reactive({
  header: {
    options: [
      [
        { code: 'exportAll', name: '导出所有数据', prefixIcon: 'vxe-icon-download' },
        { code: 'exportSelected', name: '导出选中数据' }
      ],
      [
        { code: 'hideColumn', name: '隐藏列', disabled: false },
        { code: 'resetColumn', name: '重置列' }
      ]
    ]
  },
  body: {
    options: [
      [
        { code: 'copy', name: '复制', prefixIcon: 'vxe-icon-copy' },
        { code: 'cut', name: '剪切' },
        { code: 'paste', name: '粘贴' }
      ],
      [
        { code: 'insert', name: '插入行', prefixIcon: 'vxe-icon-add' },
        { code: 'delete', name: '删除行', prefixIcon: 'vxe-icon-delete' }
      ],
      [
        { code: 'clearCell', name: '清空单元格内容' },
        { code: 'revert', name: '还原数据' }
      ],
      [
        { code: 'exportRow', name: '导出当前行' },
        { code: 'printRow', name: '打印当前行' }
      ]
    ]
  },
  footer: {
    options: [
      [
        { code: 'exportFooter', name: '导出统计数据' }
      ]
    ]
  },
  
  // 菜单显示前的回调
  visibleMethod({ type, options, row, column }) {
    // 动态控制菜单项的显示
    const disabledCodes = [];
    
    if (type === 'body') {
      // 如果是锁定行，禁用编辑相关菜单
      if (row && row.locked) {
        disabledCodes.push('insert', 'delete', 'paste');
      }
    }
    
    // 设置菜单项的禁用状态
    options.forEach(list => {
      list.forEach(item => {
        item.disabled = disabledCodes.includes(item.code);
      });
    });
    
    return true;
  }
});

/**
 * 菜单点击事件处理
 */
async function handleMenuClick({ menu, row, column, $grid }) {
  const { code } = menu;
  
  switch (code) {
    case 'copy':
      await handleCopy(row, column);
      break;
      
    case 'cut':
      await handleCut(row, column);
      break;
      
    case 'paste':
      await handlePaste(row, column);
      break;
      
    case 'insert':
      await $grid.insertAt({}, row);
      break;
      
    case 'delete':
      await $grid.remove(row);
      break;
      
    case 'clearCell':
      row[column.field] = null;
      break;
      
    case 'revert':
      await $grid.revertData(row);
      break;
      
    case 'exportRow':
      await $grid.exportData({
        data: [row],
        type: 'xlsx',
        filename: `行数据_${row.id}`
      });
      break;
      
    default:
      console.log('未处理的菜单:', code);
  }
}

// 剪贴板数据
let clipboardData = null;

async function handleCopy(row, column) {
  clipboardData = { row, column, value: row[column.field] };
  VXETable.modal.message({ content: '已复制', status: 'success' });
}

async function handleCut(row, column) {
  clipboardData = { row, column, value: row[column.field] };
  row[column.field] = null;
  VXETable.modal.message({ content: '已剪切', status: 'success' });
}

async function handlePaste(row, column) {
  if (clipboardData) {
    row[column.field] = clipboardData.value;
    VXETable.modal.message({ content: '已粘贴', status: 'success' });
  }
}
</script>
```

## 11. 事件处理与生命周期

```vue
<script setup>
/**
 * 完整的事件监听示例
 */
const gridRef = ref();

// 单元格点击
function handleCellClick({ row, column, cell }) {
  console.log('单元格点击:', { row, column, cell });
}

// 单元格双击
function handleCellDblclick({ row, column }) {
  console.log('单元格双击:', { row, column });
}

// 行点击
function handleRowClick({ row }) {
  console.log('行点击:', row);
}

// 复选框改变
function handleCheckboxChange({ checked, records }) {
  console.log('复选框状态:', checked);
  console.log('选中的行:', records);
}

// 排序改变
function handleSortChange({ sortList }) {
  console.log('排序条件:', sortList);
}

// 筛选改变
function handleFilterChange({ filterList }) {
  console.log('筛选条件:', filterList);
}

// 编辑激活
function handleEditActived({ row, column }) {
  console.log('编辑激活:', { row, column });
}

// 编辑关闭
function handleEditClosed({ row, column }) {
  console.log('编辑关闭:', { row, column });
  // 验证数据
  validateRow(row);
}

// 数据改变
function handleCellValueChange({ row, column }) {
  console.log('单元格值改变:', { row, column });
}

/**
 * 验证单行数据
 */
async function validateRow(row) {
  const errMap = await gridRef.value.validateRow(row);
  if (errMap) {
    VXETable.modal.message({
      content: '数据验证失败',
      status: 'error'
    });
  }
}
</script>
```

## 12. 参考资源

- [vxe-table 官方文档](https://vxetable.cn/)
- [vxe-table GitHub](https://github.com/x-extends/vxe-table)
- [在线示例](https://vxetable.cn/#/grid/api)
- [插件扩展](https://vxetable.cn/#/plugin/table/renderer/api)
