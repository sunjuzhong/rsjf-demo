# React JSON Schema Form with Antd Demo

这是一个完整的 `react-jsonschema-form` 演示项目，展示了与 Ant Design 的集成功能。

## 🌐 在线演示

访问 [GitHub Pages 演示页面](https://sunjuzhong.github.io/rsjf-demo/) 查看在线演示。

## 功能特性

### 🎯 基础功能
- ✅ 基础表单字段（字符串、数字、布尔值、日期等）
- ✅ 高级表单组件（范围选择器、多选框、日期时间选择器）
- ✅ 动态数组表单（可添加/删除项目）
- ✅ 条件表单（基于用户选择显示不同字段）
- ✅ 嵌套对象表单（多层级数据结构）

### 🔧 高级功能
- ✅ 自定义组件（评分、颜色选择器、标签输入器）
- ✅ 表单验证（必填、格式验证、自定义验证）
- ✅ 文件上传（单文件、多文件、图片上传、拖拽上传）
- ✅ 中文本地化支持
- ✅ Ant Design 主题集成

## 技术栈

- **React 18** - 前端框架
- **Ant Design 5** - UI 组件库
- **@rjsf/antd** - React JSON Schema Form 的 Antd 主题
- **@rjsf/validator-ajv8** - JSON Schema 验证器
- **Vite** - 构建工具

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看演示。

### 构建生产版本

```bash
npm run build
```

## 🚀 部署到GitHub Pages

本项目已配置自动部署到GitHub Pages。当您推送代码到`main`分支时，GitHub Actions会自动构建并部署项目。

### 手动部署步骤

1. 确保您的GitHub仓库已启用Pages功能：
   - 进入仓库设置 → Pages
   - Source选择"GitHub Actions"

2. 推送代码到main分支：
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. 等待GitHub Actions完成构建和部署

4. 访问 `https://sunjuzhong.github.io/rsjf-demo/` 查看部署结果

### 本地预览构建结果

```bash
npm run build
npm run preview
```

## 演示内容

### 1. 基础表单
- 文本输入框
- 数字输入框
- 日期选择器
- 单选按钮
- 复选框
- 下拉选择

### 2. 高级表单
- 滑动条
- 评分组件
- 多选框组
- URL 验证
- 嵌套对象

### 3. 数组表单
- 动态添加/删除项目
- 数组内的复杂对象
- 数组验证规则

### 4. 条件表单
- 基于 if/then/else 的条件渲染
- 动态字段显示/隐藏
- 条件验证

### 5. 嵌套对象
- 多层级数据结构
- 对象内的数组
- 复杂数据关系

### 6. 自定义组件
- 自定义评分组件
- 颜色选择器
- 标签输入器
- 组件注册和使用

### 7. 表单验证
- 必填字段验证
- 格式验证（邮箱、手机号、身份证等）
- 长度和数值范围验证
- 正则表达式验证
- 自定义验证逻辑

### 8. 文件上传
- 单文件上传
- 多文件上传
- 图片上传和预览
- 拖拽上传
- 文件类型和大小限制

### 9. 字段监听
- 监听字段值变化
- 实时响应和通知
- 字段间联动效果
- 自定义回调处理

### 10. 自定义模板
- 自定义Field组件
- 自定义Template模板
- 密码强度指示器
- 优先级标记和布局控制

## 项目结构

```
src/
├── components/                 # 演示组件
│   ├── BasicFormDemo.jsx      # 基础表单演示
│   ├── AdvancedFormDemo.jsx   # 高级表单演示
│   ├── ArrayFormDemo.jsx      # 数组表单演示
│   ├── ConditionalFormDemo.jsx # 条件表单演示
│   ├── NestedObjectDemo.jsx   # 嵌套对象演示
│   ├── CustomWidgetsDemo.jsx  # 自定义组件演示
│   ├── ValidationDemo.jsx     # 表单验证演示
│   ├── FileUploadDemo.jsx     # 文件上传演示
│   ├── FieldListenerDemo.jsx  # 字段监听演示
│   └── CustomTemplatesDemo.jsx # 自定义模板演示
├── App.jsx                    # 主应用组件
├── main.jsx                   # 应用入口
└── index.css                  # 全局样式
```

## JSON Schema 示例

### 基础 Schema

```json
{
  "title": "用户信息",
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": {
      "type": "string",
      "title": "姓名",
      "minLength": 2
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "邮箱"
    },
    "age": {
      "type": "integer",
      "title": "年龄",
      "minimum": 18,
      "maximum": 100
    }
  }
}
```

### UI Schema 定制

```json
{
  "name": {
    "ui:placeholder": "请输入您的姓名"
  },
  "age": {
    "ui:widget": "updown"
  },
  "bio": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 4
    }
  }
}
```

## 自定义组件开发

### 创建自定义组件

```jsx
const CustomRatingWidget = (props) => {
  const { value, onChange, options } = props;
  
  return (
    <Rate
      value={value}
      onChange={onChange}
      count={options.count || 5}
    />
  );
};
```

### 注册自定义组件

```jsx
const widgets = {
  RatingWidget: CustomRatingWidget,
};

<Form
  schema={schema}
  widgets={widgets}
  // ...其他属性
/>
```

## 表单验证

### 自定义验证函数

```jsx
const customValidate = (formData, errors) => {
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword.addError("密码不匹配");
  }
  return errors;
};

<Form
  schema={schema}
  customValidate={customValidate}
  // ...其他属性
/>
```

## 自定义Field和Template

### 创建自定义Field组件

```jsx
const PasswordField = (props) => {
  const { formData, onChange, required, disabled, readonly } = props;
  
  // 实现密码强度计算逻辑
  const calculateStrength = (password) => {
    // 强度计算逻辑...
  };
  
  return (
    <div>
      <input
        type="password"
        value={formData || ''}
        onChange={(e) => onChange(e.target.value)}
        // 其他属性...
      />
      {/* 密码强度指示器 */}
    </div>
  );
};
```

### 注册自定义组件

```jsx
const fields = {
  password: PasswordField,
  question: QuestionField
};

const templates = {
  FieldTemplate: CustomFieldTemplate,
  ObjectFieldTemplate: CustomObjectFieldTemplate
};

<Form
  schema={schema}
  uiSchema={uiSchema}
  fields={fields}
  templates={templates}
  // ...其他属性
/>
```

### 在uiSchema中使用

```jsx
const uiSchema = {
  password: {
    "ui:field": "password",
    "ui:options": {
      priority: "high"
    }
  }
};
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个演示项目。

## 许可证

MIT

## 相关链接

- [react-jsonschema-form 官方文档](https://rjsf-team.github.io/react-jsonschema-form/)
- [Ant Design 官方文档](https://ant.design/)
- [JSON Schema 规范](https://json-schema.org/)
