import React, { useState } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text } = Typography;

const BasicFormDemo = () => {
  const [formData, setFormData] = useState({});

  const schema = {
    title: "基础用户信息表单",
    type: "object",
    required: ["name", "email", "age"],
    properties: {
      name: {
        type: "string",
        title: "姓名",
        description: "请输入您的姓名"
      },
      email: {
        type: "string",
        format: "email",
        title: "邮箱",
        description: "请输入有效的邮箱地址"
      },
      age: {
        type: "integer",
        title: "年龄",
        minimum: 18,
        maximum: 100,
        description: "年龄必须在18-100之间"
      },
      bio: {
        type: "string",
        title: "个人简介",
        description: "简单介绍一下您自己"
      },
      active: {
        type: "boolean",
        title: "是否激活账户",
        default: true
      },
      gender: {
        type: "string",
        title: "性别",
        enum: ["male", "female", "other"],
        enumNames: ["男", "女", "其他"]
      },
      birthDate: {
        type: "string",
        format: "date",
        title: "出生日期"
      }
    }
  };

  const uiSchema = {
    bio: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 4
      }
    },
    age: {
      "ui:widget": "updown"
    },
    gender: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true
      }
    },
    birthDate: {
      "ui:widget": "date"
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    console.log("Form changed:", formData);
    setFormData(formData);
  };

  return (
    <div>
      <Title level={3}>基础表单演示</Title>
      <Text type="secondary">
        展示基本的表单字段类型：字符串、数字、布尔值、枚举、日期等。
      </Text>
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="表单" size="small">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              validator={validator}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="表单数据" size="small">
            <div className="json-output">
              {JSON.stringify(formData, null, 2)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BasicFormDemo;
