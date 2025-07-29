# 自定义Field和Template使用指南

本文档介绍了如何在React JSON Schema Form中使用自定义Field和Template组件。

## 目录

1. [自定义Field组件](#自定义field组件)
   - [自定义Field的基本结构](#自定义field的基本结构)
   - [实现PasswordField组件](#实现passwordfield组件)
   - [实现QuestionField组件](#实现questionfield组件)

2. [自定义Template](#自定义template)
   - [FieldTemplate基本结构](#fieldtemplate基本结构)
   - [ObjectFieldTemplate基本结构](#objectfieldtemplate基本结构)

3. [在表单中使用自定义组件](#在表单中使用自定义组件)
   - [注册自定义组件](#注册自定义组件)
   - [通过uiSchema指定自定义组件](#通过uischema指定自定义组件)
   - [传递配置选项](#传递配置选项)

## 自定义Field组件

### 自定义Field的基本结构

自定义Field组件接收以下主要props：

```jsx
const CustomField = (props) => {
  const {
    formData,        // 当前字段的值
    onChange,        // 更新字段值的函数
    schema,          // 字段的JSON Schema
    uiSchema,        // 字段的UI Schema
    errorSchema,     // 包含验证错误信息
    required,        // 字段是否必填
    disabled,        // 字段是否禁用
    readonly         // 字段是否只读
  } = props;
  
  // 实现自定义UI和逻辑
  
  return (
    <div>
      {/* 自定义UI */}
    </div>
  );
};
```

### 实现PasswordField组件

PasswordField组件是一个带有密码强度可视化反馈的自定义组件：

```jsx
const PasswordField = (props) => {
  const { formData, onChange, required, disabled, readonly } = props;
  
  // 计算密码强度逻辑...
  
  return (
    <div>
      <input
        type="password"
        value={formData || ''}
        onChange={(e) => onChange(e.target.value)}
        // 其他属性...
      />
      
      {/* 密码强度指示器 */}
      <div className="password-strength-meter">
        {/* 密码强度UI */}
      </div>
    </div>
  );
};
```

### 实现QuestionField组件

QuestionField组件使用Ant Design的Alert组件来展示安全问题：

```jsx
const QuestionField = (props) => {
  const { schema, uiSchema, formData, onChange, errorSchema } = props;
  
  return (
    <Alert
      icon={<QuestionCircleOutlined />}
      message={schema.title}
      description={
        <div>
          {/* 安全问题输入框 */}
          <input
            type="text"
            value={formData || ''}
            onChange={(e) => onChange(e.target.value)}
            // 其他属性...
          />
          
          {/* 错误显示 */}
        </div>
      }
      // 其他属性...
    />
  );
};
```

## 自定义Template

### FieldTemplate基本结构

FieldTemplate控制每个表单字段的布局和样式：

```jsx
const CustomFieldTemplate = (props) => {
  const {
    id,            // 字段ID
    label,         // 字段标签
    help,          // 帮助文本
    required,      // 是否必填
    description,   // 字段描述
    errors,        // 错误信息
    children,      // 字段内容（实际的input元素）
    schema,        // 字段的JSON Schema
    uiSchema       // 字段的UI Schema
  } = props;
  
  return (
    <div>
      {/* 字段标签 */}
      <label>{label}{required && "*"}</label>
      
      {/* 字段描述 */}
      {description && <div>{description}</div>}
      
      {/* 字段内容 */}
      <div>{children}</div>
      
      {/* 错误信息 */}
      {errors}
      
      {/* 帮助文本 */}
      {help && <div>{help}</div>}
    </div>
  );
};
```

### ObjectFieldTemplate基本结构

ObjectFieldTemplate控制对象类型字段的布局和样式：

```jsx
const CustomObjectFieldTemplate = (props) => {
  const {
    title,         // 对象标题
    description,   // 对象描述
    properties,    // 对象的属性列表
    required,      // 是否必填
    uiSchema       // 对象的UI Schema
  } = props;
  
  return (
    <div>
      {/* 对象标题 */}
      {title && <h4>{title}</h4>}
      
      {/* 对象描述 */}
      {description && <div>{description}</div>}
      
      {/* 对象属性 */}
      <div>
        {properties.map(prop => prop.content)}
      </div>
    </div>
  );
};
```

## 在表单中使用自定义组件

### 注册自定义组件

在Form组件中通过`fields`和`templates`属性注册自定义组件：

```jsx
// 自定义字段映射
const fields = {
  password: PasswordField,
  question: QuestionField
};

// 自定义模板映射
const templates = {
  FieldTemplate: CustomFieldTemplate,
  ObjectFieldTemplate: CustomObjectFieldTemplate
};

// 在表单中使用
<Form
  schema={schema}
  uiSchema={uiSchema}
  fields={fields}
  templates={templates}
  // 其他属性...
/>
```

### 通过uiSchema指定自定义组件

在uiSchema中通过`ui:field`指定使用哪个自定义Field：

```jsx
const uiSchema = {
  password: {
    "ui:field": "password",  // 使用名为"password"的自定义Field
    // 其他UI配置...
  },
  securityQuestion: {
    "ui:field": "question",  // 使用名为"question"的自定义Field
    // 其他UI配置...
  }
};
```

### 传递配置选项

通过`ui:options`向自定义组件传递额外配置：

```jsx
const uiSchema = {
  username: {
    "ui:options": {
      priority: "high"  // 自定义配置，传递给模板
    }
  },
  contactInfo: {
    "ui:options": {
      backgroundColor: "#f0f7ff",  // 自定义背景色
      layout: "horizontal"         // 自定义布局方式
    },
    email: {
      "ui:options": {
        span: 12  // 在栅格系统中占据的列数
      }
    }
  }
};
```

这些配置可以在自定义组件中通过`props.uiSchema["ui:options"]`访问。

## 完整示例

请参考`CustomTemplatesDemo.jsx`文件中的完整实现示例，该示例展示了如何：

1. 创建带有密码强度指示器的自定义PasswordField
2. 创建带有特殊样式的QuestionField
3. 创建支持优先级标记的CustomFieldTemplate
4. 创建支持多种布局的CustomObjectFieldTemplate
5. 注册并使用这些自定义组件
6. 通过uiSchema配置组件的行为和外观
