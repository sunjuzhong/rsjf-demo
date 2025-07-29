import React from 'react';
import { Card, Typography, Row, Col, Divider, Space, Alert, Tag } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 自定义密码强度Field组件
const PasswordField = (props) => {
  const { formData, onChange, required, disabled, readonly } = props;
  
  // 计算密码强度
  const calculateStrength = (password) => {
    if (!password) return { score: 0, text: '未设置', color: '#d9d9d9' };
    
    let score = 0;
    
    // 长度检查
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // 复杂度检查
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // 计算最终得分 (0-5)
    let strengthText, strengthColor;
    
    switch (true) {
      case (score === 0):
        strengthText = '未设置';
        strengthColor = '#d9d9d9';
        break;
      case (score < 2):
        strengthText = '非常弱';
        strengthColor = '#f5222d';
        break;
      case (score < 3):
        strengthText = '弱';
        strengthColor = '#fa541c';
        break;
      case (score < 4):
        strengthText = '中等';
        strengthColor = '#faad14';
        break;
      case (score < 5):
        strengthText = '强';
        strengthColor = '#52c41a';
        break;
      default:
        strengthText = '非常强';
        strengthColor = '#389e0d';
    }
    
    return { score, text: strengthText, color: strengthColor };
  };
  
  const strength = calculateStrength(formData);
  
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="password"
          className="ant-input"
          value={formData || ''}
          required={required}
          disabled={disabled || readonly}
          onChange={(event) => onChange(event.target.value)}
          placeholder="请输入密码"
          style={{ marginBottom: 8 }}
        />
      </div>
      
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: 5
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              height: 4, 
              background: '#f0f0f0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(strength.score / 6) * 100}%`, 
                height: '100%', 
                background: strength.color,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
          <div style={{ marginLeft: 12 }}>
            <Tag color={strength.color}>{strength.text}</Tag>
          </div>
        </div>
        
        <Text type="secondary" style={{ fontSize: 12 }}>
          强密码至少需要：12个字符、大小写字母、数字和特殊符号
        </Text>
      </div>
    </div>
  );
};

// 自定义问题Field组件
const QuestionField = (props) => {
  const { schema, uiSchema, formData, onChange, errorSchema } = props;
  const hasError = errorSchema && errorSchema.__errors && errorSchema.__errors.length > 0;
  
  return (
    <div className="custom-question-field">
      <Alert
        icon={<QuestionCircleOutlined />}
        message={schema.title}
        description={
          <div>
            <Paragraph type="secondary" style={{ marginBottom: 12 }}>
              {schema.description || "请回答以下问题:"}
            </Paragraph>
            
            <input
              type="text"
              className={`ant-input ${hasError ? 'ant-input-status-error' : ''}`}
              value={formData || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={uiSchema["ui:placeholder"] || "请输入您的答案"}
            />
            
            {hasError && (
              <div className="ant-form-item-explain-error" style={{ marginTop: 4 }}>
                {errorSchema.__errors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            )}
          </div>
        }
        type={hasError ? "error" : "info"}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

// 自定义字段模板
const CustomFieldTemplate = (props) => {
  const {
    id,
    label,
    help,
    required,
    description,
    errors,
    children,
    schema,
    uiSchema,
    formData
  } = props;
  
  // 获取自定义的UI配置
  const uiOptions = uiSchema["ui:options"] || {};
  const priority = uiOptions.priority || "normal";
  
  // 根据priority设置不同的样式
  let priorityTag = null;
  if (priority === "high") {
    priorityTag = <Tag color="red">重要</Tag>;
  } else if (priority === "low") {
    priorityTag = <Tag color="blue">次要</Tag>;
  }
  
  // 判断字段验证状态
  const hasErrors = errors && errors.props.errors && errors.props.errors.length > 0;
  
  return (
    <div className={`custom-field-template priority-${priority}`}>
      <div className="field-header" style={{ 
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <Text strong>{label}{required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}</Text>
          {priorityTag && <span style={{ marginLeft: 8 }}>{priorityTag}</span>}
        </div>
        
        {hasErrors ? (
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
        ) : (
          children && children.props && children.props.value && <CheckCircleOutlined style={{ color: '#52c41a' }} />
        )}
      </div>
      
      {description && (
        <Paragraph type="secondary" style={{ margin: '0 0 8px' }}>
          {description}
        </Paragraph>
      )}
      
      <div className="field-content">
        {children}
      </div>
      
      {errors}
      
      {help && (
        <div className="help-text" style={{ 
          marginTop: 4, 
          fontSize: '12px',
          color: '#888'
        }}>
          {help}
        </div>
      )}
    </div>
  );
};

// 自定义对象字段模板
const CustomObjectFieldTemplate = (props) => {
  const { title, description, properties, required, uiSchema } = props;
  
  const uiOptions = uiSchema["ui:options"] || {};
  const layout = uiOptions.layout || "vertical"; // vertical 或 horizontal
  const backgroundColor = uiOptions.backgroundColor || "#ffffff";
  
  return (
    <div className="custom-object-field" style={{ 
      padding: 16, 
      backgroundColor,
      borderRadius: 4,
      border: '1px solid #f0f0f0',
      marginBottom: 16
    }}>
      {title && (
        <Title level={4} style={{ marginTop: 0 }}>
          {title}
          {required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
        </Title>
      )}
      
      {description && (
        <Paragraph type="secondary">
          {description}
        </Paragraph>
      )}
      
      <div className={`object-properties-layout-${layout}`}>
        {layout === "horizontal" ? (
          <Row gutter={16}>
            {properties.map((prop) => (
              <Col span={prop.content.props.uiSchema && prop.content.props.uiSchema["ui:options"] ? 
                    prop.content.props.uiSchema["ui:options"].span || 24 : 24} key={prop.name}>
                {prop.content}
              </Col>
            ))}
          </Row>
        ) : (
          properties.map((prop) => prop.content)
        )}
      </div>
    </div>
  );
};

const CustomTemplatesDemo = () => {
  // 定义表单的模式
  const schema = {
    title: "用户安全信息设置",
    type: "object",
    required: ["username", "password", "confirmPassword"],
    properties: {
      username: {
        type: "string",
        title: "用户名",
        description: "请输入您的用户名，长度3-20个字符",
        minLength: 3,
        maxLength: 20
      },
      password: {
        type: "string",
        title: "密码",
        description: "请设置安全密码"
      },
      confirmPassword: {
        type: "string",
        title: "确认密码",
        description: "请再次输入密码确认"
      },
      securityInfo: {
        type: "object",
        title: "安全验证信息",
        description: "请设置您的安全问题，用于账号找回",
        properties: {
          securityQuestion1: {
            type: "string",
            title: "您的第一个宠物的名字是什么？",
            description: "请如实回答此安全问题",
            minLength: 2
          },
          securityQuestion2: {
            type: "string",
            title: "您最喜欢的书籍名称是什么？",
            description: "请如实回答此安全问题",
            minLength: 2
          }
        },
        required: ["securityQuestion1", "securityQuestion2"]
      },
      contactInfo: {
        type: "object",
        title: "联系方式",
        description: "请填写您的联系信息，用于账号找回和重要通知",
        properties: {
          email: {
            type: "string",
            format: "email",
            title: "电子邮箱"
          },
          phone: {
            type: "string",
            title: "手机号码",
            pattern: "^1[3-9]\\d{9}$"
          }
        },
        required: ["email"]
      }
    }
  };

  // 定义UI模式
  const uiSchema = {
    username: {
      "ui:options": {
        priority: "high"
      }
    },
    password: {
      "ui:field": "password",
      "ui:options": {
        priority: "high"
      }
    },
    confirmPassword: {
      "ui:field": "password",
      "ui:options": {
        priority: "high"
      }
    },
    securityInfo: {
      "ui:options": {
        backgroundColor: "#f9f9f9",
        layout: "vertical"
      },
      securityQuestion1: {
        "ui:field": "question",
        "ui:placeholder": "例如：Kitty",
        "ui:options": {
          priority: "normal"
        }
      },
      securityQuestion2: {
        "ui:field": "question",
        "ui:placeholder": "例如：《西游记》",
        "ui:options": {
          priority: "normal"
        }
      }
    },
    contactInfo: {
      "ui:options": {
        backgroundColor: "#f0f7ff",
        layout: "horizontal"
      },
      email: {
        "ui:options": {
          priority: "high",
          span: 12
        }
      },
      phone: {
        "ui:options": {
          priority: "low",
          span: 12
        }
      }
    }
  };

  // 自定义验证函数
  const customValidate = (formData, errors) => {
    // 验证密码确认
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword.addError("两次输入的密码不一致");
      }
    }
    
    // 验证安全问题不能相同
    if (formData.securityInfo) {
      const { securityQuestion1, securityQuestion2 } = formData.securityInfo;
      if (securityQuestion1 && securityQuestion2 && 
          securityQuestion1.toLowerCase() === securityQuestion2.toLowerCase()) {
        errors.securityInfo.securityQuestion2.addError("两个安全问题的答案不能相同");
      }
    }
    
    return errors;
  };

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

  // 处理表单提交
  const handleSubmit = ({ formData }) => {
    console.log("Form submitted:", formData);
    alert("表单提交成功！");
  };

  return (
    <div>
      <Title level={3}>自定义Field和Template演示</Title>
      <Paragraph>
        <Text type="secondary">
          这个示例展示了如何创建和使用自定义Field组件和自定义模板。通过自定义这些组件，您可以完全控制表单的外观和行为。
        </Text>
      </Paragraph>
      
      <Divider />
      
      <Row gutter={24}>
        <Col span={16}>
          <Card title="自定义组件表单" size="small">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              validator={validator}
              customValidate={customValidate}
              fields={fields}
              templates={templates}
              onSubmit={handleSubmit}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="自定义Field组件" size="small">
              <Paragraph>
                <strong>PasswordField:</strong> 自定义密码输入组件，具有密码强度视觉反馈功能。
              </Paragraph>
              <Paragraph>
                <strong>QuestionField:</strong> 自定义问题回答组件，使用特殊样式展示安全问题。
              </Paragraph>
            </Card>
            
            <Card title="自定义Template" size="small" style={{ marginTop: 16 }}>
              <Paragraph>
                <strong>CustomFieldTemplate:</strong> 自定义字段模板，支持优先级标记和验证状态图标。
              </Paragraph>
              <Paragraph>
                <strong>CustomObjectFieldTemplate:</strong> 自定义对象模板，支持水平和垂直布局以及自定义背景色。
              </Paragraph>
            </Card>
            
            <Alert
              message="使用说明"
              description={
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li>通过 <code>fields</code> 属性将自定义Field组件映射到特定字段</li>
                  <li>通过 <code>templates</code> 属性覆盖默认模板</li>
                  <li>在 <code>uiSchema</code> 中使用 <code>"ui:field"</code> 指定使用哪个自定义Field</li>
                  <li>通过 <code>"ui:options"</code> 向模板传递额外配置</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default CustomTemplatesDemo;
