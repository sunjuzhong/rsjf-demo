import React, { useState } from 'react';
import { Card, Typography, Row, Col, Alert } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

const ConditionalFormDemo = () => {
  const [formData, setFormData] = useState({});

  const schema = {
    title: "条件表单演示",
    type: "object",
    required: ["userType"],
    properties: {
      userType: {
        type: "string",
        title: "用户类型",
        enum: ["student", "employee", "freelancer", "company"],
        enumNames: ["学生", "在职员工", "自由职业者", "企业用户"]
      }
    },
    allOf: [
      {
        if: {
          properties: { userType: { const: "student" } }
        },
        then: {
          properties: {
            school: {
              type: "string",
              title: "学校名称",
              minLength: 2
            },
            major: {
              type: "string",
              title: "专业"
            },
            graduationYear: {
              type: "integer",
              title: "预计毕业年份",
              minimum: 2024,
              maximum: 2030
            },
            studentId: {
              type: "string",
              title: "学号"
            },
            scholarship: {
              type: "boolean",
              title: "是否获得奖学金",
              default: false
            }
          },
          required: ["school", "major", "graduationYear"]
        }
      },
      {
        if: {
          properties: { userType: { const: "employee" } }
        },
        then: {
          properties: {
            company: {
              type: "string",
              title: "公司名称",
              minLength: 2
            },
            position: {
              type: "string",
              title: "职位"
            },
            workYears: {
              type: "integer",
              title: "工作年限",
              minimum: 0,
              maximum: 50
            },
            salary: {
              type: "number",
              title: "年薪 (万元)",
              minimum: 1,
              maximum: 500
            },
            employeeId: {
              type: "string",
              title: "工号"
            },
            department: {
              type: "string",
              title: "部门",
              enum: ["tech", "marketing", "sales", "hr", "finance"],
              enumNames: ["技术部", "市场部", "销售部", "人事部", "财务部"]
            }
          },
          required: ["company", "position", "workYears"]
        }
      },
      {
        if: {
          properties: { userType: { const: "freelancer" } }
        },
        then: {
          properties: {
            skills: {
              type: "array",
              title: "专业技能",
              items: {
                type: "string"
              },
              minItems: 1
            },
            hourlyRate: {
              type: "number",
              title: "时薪 (元/小时)",
              minimum: 50,
              maximum: 2000
            },
            portfolio: {
              type: "string",
              title: "作品集链接",
              format: "uri"
            },
            availability: {
              type: "string",
              title: "工作时间偏好",
              enum: ["fulltime", "parttime", "project"],
              enumNames: ["全职", "兼职", "项目制"]
            },
            workLocation: {
              type: "string",
              title: "工作地点偏好",
              enum: ["remote", "onsite", "hybrid"],
              enumNames: ["远程", "现场", "混合"]
            }
          },
          required: ["skills", "hourlyRate"]
        }
      },
      {
        if: {
          properties: { userType: { const: "company" } }
        },
        then: {
          properties: {
            companyName: {
              type: "string",
              title: "公司名称",
              minLength: 2
            },
            industry: {
              type: "string",
              title: "所属行业",
              enum: ["tech", "finance", "healthcare", "education", "retail", "manufacturing"],
              enumNames: ["科技", "金融", "医疗", "教育", "零售", "制造业"]
            },
            companySize: {
              type: "string",
              title: "公司规模",
              enum: ["startup", "small", "medium", "large", "enterprise"],
              enumNames: ["初创公司(1-10人)", "小型公司(11-50人)", "中型公司(51-200人)", "大型公司(201-1000人)", "企业级(1000+人)"]
            },
            foundedYear: {
              type: "integer",
              title: "成立年份",
              minimum: 1900,
              maximum: 2024
            },
            revenue: {
              type: "number",
              title: "年营收 (万元)",
              minimum: 0
            },
            isPublic: {
              type: "boolean",
              title: "是否为上市公司",
              default: false
            }
          },
          required: ["companyName", "industry", "companySize"]
        }
      }
    ]
  };

  const uiSchema = {
    userType: {
      "ui:widget": "radio",
      "ui:options": {
        inline: false
      }
    },
    skills: {
      "ui:options": {
        addable: true,
        removable: true
      }
    },
    hourlyRate: {
      "ui:widget": "range"
    },
    salary: {
      "ui:widget": "range"
    },
    revenue: {
      "ui:widget": "updown"
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Conditional form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  const getFormDescription = () => {
    const descriptions = {
      student: "学生用户需要填写学校、专业和毕业年份等信息",
      employee: "在职员工需要填写公司、职位和工作年限等信息", 
      freelancer: "自由职业者需要填写技能、时薪和作品集等信息",
      company: "企业用户需要填写公司名称、行业和规模等信息"
    };
    return descriptions[formData.userType] || "请先选择用户类型";
  };

  return (
    <div>
      <Title level={3}>条件表单演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示基于条件的动态表单：根据用户选择的类型，显示不同的表单字段。使用 JSON Schema 的 if/then/else 语法。
        </Text>
      </Paragraph>

      {formData.userType && (
        <Alert
          message="表单说明"
          description={getFormDescription()}
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="条件表单" size="small">
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
        
        <Col span={10}>
          <Card title="当前表单类型" size="small">
            <Paragraph>
              <Text strong>用户类型：</Text>
              <Text>{formData.userType ? 
                schema.properties.userType.enumNames[
                  schema.properties.userType.enum.indexOf(formData.userType)
                ] : '未选择'
              }</Text>
            </Paragraph>
            
            {formData.userType && (
              <Paragraph>
                <Text type="secondary">
                  根据选择的用户类型，表单会动态显示相应的字段。
                  这演示了 JSON Schema 的条件渲染功能。
                </Text>
              </Paragraph>
            )}
          </Card>
          
          <Card title="表单数据" size="small" style={{ marginTop: 16 }}>
            <div className="json-output">
              {JSON.stringify(formData, null, 2)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConditionalFormDemo;
