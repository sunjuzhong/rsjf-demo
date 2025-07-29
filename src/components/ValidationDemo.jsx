import React, { useState } from 'react';
import { Card, Typography, Row, Col, Alert, List, Badge } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { InfoCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ValidationDemo = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);

  const schema = {
    title: "表单验证演示",
    type: "object",
    required: ["username", "email", "password", "confirmPassword", "age", "website"],
    properties: {
      username: {
        type: "string",
        title: "用户名",
        description: "3-20个字符，只能包含字母、数字和下划线",
        minLength: 3,
        maxLength: 20,
        pattern: "^[a-zA-Z0-9_]+$"
      },
      email: {
        type: "string",
        format: "email",
        title: "邮箱地址",
        description: "请输入有效的邮箱地址"
      },
      password: {
        type: "string",
        title: "密码",
        description: "密码长度至少8位，包含大小写字母和数字",
        minLength: 8,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$"
      },
      confirmPassword: {
        type: "string",
        title: "确认密码",
        description: "请再次输入密码"
      },
      age: {
        type: "integer",
        title: "年龄",
        description: "年龄必须在18-65之间",
        minimum: 18,
        maximum: 65
      },
      phone: {
        type: "string",
        title: "手机号码",
        description: "请输入有效的中国大陆手机号",
        pattern: "^1[3-9]\\d{9}$"
      },
      website: {
        type: "string",
        format: "uri",
        title: "个人网站",
        description: "请输入有效的网址"
      },
      idCard: {
        type: "string",
        title: "身份证号",
        description: "18位身份证号码",
        pattern: "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$"
      },
      salary: {
        type: "number",
        title: "期望薪资",
        description: "月薪范围：5000-50000元",
        minimum: 5000,
        maximum: 50000,
        multipleOf: 100
      },
      skills: {
        type: "array",
        title: "技能列表",
        description: "至少选择2项技能",
        minItems: 2,
        maxItems: 8,
        items: {
          type: "string",
          enum: [
            "JavaScript",
            "TypeScript",
            "React",
            "Vue",
            "Angular",
            "Node.js",
            "Python",
            "Java",
            "Go",
            "Docker"
          ]
        },
        uniqueItems: true
      },
      experience: {
        type: "array",
        title: "工作经历",
        description: "至少添加一条工作经历",
        minItems: 1,
        items: {
          type: "object",
          required: ["company", "position", "duration"],
          properties: {
            company: {
              type: "string",
              title: "公司名称",
              minLength: 2,
              maxLength: 50
            },
            position: {
              type: "string",
              title: "职位",
              minLength: 2,
              maxLength: 30
            },
            duration: {
              type: "integer",
              title: "工作时长(月)",
              minimum: 1,
              maximum: 120
            }
          }
        }
      }
    }
  };

  const uiSchema = {
    username: {
      "ui:placeholder": "例如：user123"
    },
    email: {
      "ui:placeholder": "例如：user@example.com"
    },
    password: {
      "ui:widget": "password",
      "ui:placeholder": "至少8位，包含大小写字母和数字"
    },
    confirmPassword: {
      "ui:widget": "password",
      "ui:placeholder": "请再次输入密码"
    },
    phone: {
      "ui:placeholder": "例如：13812345678"
    },
    website: {
      "ui:placeholder": "例如：https://yourwebsite.com"
    },
    idCard: {
      "ui:placeholder": "例如：110101199001011234"
    },
    salary: {
      "ui:widget": "range",
      "ui:options": {
        step: 100
      }
    },
    skills: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: false
      }
    },
    experience: {
      items: {
        duration: {
          "ui:widget": "updown"
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

    // 验证年龄和工作经验的逻辑关系
    if (formData.age && formData.experience && formData.experience.length > 0) {
      const totalWorkMonths = formData.experience.reduce((sum, exp) => sum + (exp.duration || 0), 0);
      const maxPossibleWorkMonths = (formData.age - 18) * 12;
      
      if (totalWorkMonths > maxPossibleWorkMonths) {
        errors.experience.addError("工作经历总时长不能超过可工作年限");
      }
    }

    // 验证技能和工作经验的匹配
    if (formData.skills && formData.skills.length > 0 && formData.experience && formData.experience.length === 0) {
      errors.experience.addError("有技能但无工作经验，请添加工作经历或实习经历");
    }

    return errors;
  };

  const handleSubmit = ({ formData }, event) => {
    console.log("Validation form submitted:", formData);
    setFormData(formData);
    setErrors([]);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  const handleError = (errors) => {
    console.log("Form validation errors:", errors);
    setErrors(errors);
  };

  // 解析错误信息
  const parseErrors = (errors) => {
    const errorList = [];
    
    const addError = (path, message) => {
      errorList.push({
        path,
        message,
        type: 'error'
      });
    };

    const parseErrorObj = (obj, basePath = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = basePath ? `${basePath}.${key}` : key;
        
        if (value.__errors && value.__errors.length > 0) {
          value.__errors.forEach(error => {
            addError(currentPath, error);
          });
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value.__errors)) {
          parseErrorObj(value, currentPath);
        }
      }
    };

    parseErrorObj(errors);
    return errorList;
  };

  const errorList = parseErrors(errors);

  return (
    <div>
      <Title level={3}>表单验证演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示各种表单验证功能：必填字段、格式验证、长度限制、数值范围、正则表达式、自定义验证等。
        </Text>
      </Paragraph>

      {errorList.length > 0 && (
        <Alert
          message="表单验证错误"
          description={
            <List
              size="small"
              dataSource={errorList}
              renderItem={item => (
                <List.Item>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  <Text strong>{item.path}:</Text> {item.message}
                </List.Item>
              )}
            />
          }
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="验证表单" size="small">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              validator={validator}
              customValidate={customValidate}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              showErrorList={false} // 使用自定义错误显示
            />
          </Card>
        </Col>
        
        <Col span={10}>
          <Card title="验证规则说明" size="small">
            <List
              size="small"
              dataSource={[
                { icon: <InfoCircleOutlined />, text: "用户名: 3-20字符，字母数字下划线" },
                { icon: <InfoCircleOutlined />, text: "邮箱: 有效邮箱格式" },
                { icon: <InfoCircleOutlined />, text: "密码: 8位以上，含大小写字母和数字" },
                { icon: <InfoCircleOutlined />, text: "年龄: 18-65岁" },
                { icon: <InfoCircleOutlined />, text: "手机: 中国大陆手机号格式" },
                { icon: <InfoCircleOutlined />, text: "技能: 至少选择2项" },
                { icon: <WarningOutlined />, text: "密码确认必须与密码一致" },
                { icon: <WarningOutlined />, text: "工作经历不能超过可工作年限" }
              ]}
              renderItem={item => (
                <List.Item>
                  {item.icon} <Text>{item.text}</Text>
                </List.Item>
              )}
            />
          </Card>
          
          <Card title="表单状态" size="small" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Badge 
                status={errorList.length === 0 ? "success" : "error"} 
                text={errorList.length === 0 ? "验证通过" : `${errorList.length} 个错误`}
              />
            </div>
            
            <div className="json-output" style={{ maxHeight: 200 }}>
              {JSON.stringify(formData, null, 2)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ValidationDemo;
