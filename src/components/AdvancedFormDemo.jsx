import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, Tag, Space, notification, Alert } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

const AdvancedFormDemo = () => {
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [autoCalculatedFields, setAutoCalculatedFields] = useState({});
  const previousFormData = useRef({});

  const schema = {
    title: "高级表单功能演示",
    type: "object",
    required: ["company", "position", "salary"],
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
        enum: [
          "frontend",
          "backend", 
          "fullstack",
          "mobile",
          "devops",
          "designer",
          "pm",
          "qa"
        ],
        enumNames: [
          "前端工程师",
          "后端工程师",
          "全栈工程师", 
          "移动端工程师",
          "运维工程师",
          "UI/UX设计师",
          "产品经理",
          "测试工程师"
        ]
      },
      salary: {
        type: "number",
        title: "期望薪资 (万元/年)",
        minimum: 5,
        maximum: 100,
        multipleOf: 0.5
      },
      workExperience: {
        type: "integer",
        title: "工作经验 (年)",
        minimum: 0,
        maximum: 30
      },
      skills: {
        type: "array",
        title: "技能标签",
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
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure"
          ]
        },
        uniqueItems: true
      },
      availability: {
        type: "string",
        title: "入职时间",
        format: "date-time"
      },
      remoteWork: {
        type: "boolean",
        title: "接受远程工作",
        default: false
      },
      portfolio: {
        type: "string",
        title: "作品集链接",
        format: "uri"
      },
      socialMedia: {
        type: "object",
        title: "社交媒体",
        properties: {
          github: {
            type: "string",
            title: "GitHub",
            format: "uri"
          },
          linkedin: {
            type: "string", 
            title: "LinkedIn",
            format: "uri"
          },
          twitter: {
            type: "string",
            title: "Twitter"
          }
        }
      },
      notes: {
        type: "string",
        title: "备注",
        description: "其他需要说明的信息"
      },
      // 新增：根据职位和经验自动计算的字段
      estimatedSalary: {
        type: "number",
        title: "系统推荐薪资 (万元/年)",
        description: "基于职位和工作经验自动计算",
        readOnly: true
      },
      skillsCount: {
        type: "integer",
        title: "技能数量",
        description: "自动统计选中的技能数量",
        readOnly: true
      },
      profileCompleteness: {
        type: "number",
        title: "资料完整度 (%)",
        description: "基于填写的字段自动计算",
        readOnly: true,
        minimum: 0,
        maximum: 100
      }
    }
  };

  const uiSchema = {
    salary: {
      "ui:widget": "range",
      "ui:options": {
        step: 0.5
      }
    },
    workExperience: {
      "ui:widget": "updown"
    },
    skills: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: false
      }
    },
    availability: {
      "ui:widget": "datetime"
    },
    portfolio: {
      "ui:placeholder": "https://your-portfolio.com"
    },
    socialMedia: {
      github: {
        "ui:placeholder": "https://github.com/username"
      },
      linkedin: {
        "ui:placeholder": "https://linkedin.com/in/username"
      },
      twitter: {
        "ui:placeholder": "@username"
      }
    },
    notes: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 4
      }
    },
    // 只读字段的样式
    estimatedSalary: {
      "ui:widget": "range",
      "ui:disabled": true
    },
    profileCompleteness: {
      "ui:widget": "range",
      "ui:disabled": true
    }
  };

  // 监听字段变化的逻辑
  useEffect(() => {
    const prev = previousFormData.current;
    const current = formData;

    // 监听职位变化
    if (prev.position !== current.position && current.position) {
      const positionName = schema.properties.position.enumNames[
        schema.properties.position.enum.indexOf(current.position)
      ];
      
      notification.info({
        message: '职位变化检测',
        description: `您选择了 "${positionName}" 职位，系统将为您推荐相关技能`,
        duration: 3,
      });

      // 根据职位推荐技能
      recommendSkillsForPosition(current.position);
    }

    // 监听工作经验变化
    if (prev.workExperience !== current.workExperience && current.workExperience !== undefined) {
      if (current.workExperience > 5) {
        notification.success({
          message: '经验丰富',
          description: '您的工作经验很丰富，薪资期望可以适当提高',
          duration: 3,
        });
      }
    }

    // 监听薪资变化
    if (prev.salary !== current.salary && current.salary) {
      if (current.salary > 50) {
        notification.warning({
          message: '薪资期望较高',
          description: '您的薪资期望较高，建议展示更多技能和项目经验',
          duration: 3,
        });
      }
    }

    // 更新previous数据
    previousFormData.current = { ...current };
  }, [formData]);

  // 根据职位推荐技能
  const recommendSkillsForPosition = (position) => {
    const skillRecommendations = {
      frontend: ['JavaScript', 'TypeScript', 'React', 'Vue'],
      backend: ['Node.js', 'Python', 'Java', 'Go'],
      fullstack: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      mobile: ['React', 'JavaScript', 'TypeScript'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
      designer: [],
      pm: [],
      qa: ['JavaScript', 'Python']
    };

    const recommended = skillRecommendations[position] || [];
    if (recommended.length > 0) {
      setNotifications(prev => [...prev, {
        type: 'info',
        message: `建议为 ${schema.properties.position.enumNames[schema.properties.position.enum.indexOf(position)]} 添加技能：${recommended.join(', ')}`
      }]);
    }
  };

  // 自动计算字段
  const calculateFields = (currentFormData) => {
    const calculated = {};

    // 计算推荐薪资
    if (currentFormData.position && currentFormData.workExperience !== undefined) {
      const baseSalary = {
        frontend: 20,
        backend: 22,
        fullstack: 25,
        mobile: 21,
        devops: 28,
        designer: 18,
        pm: 24,
        qa: 16
      };
      
      const base = baseSalary[currentFormData.position] || 20;
      const experienceBonus = (currentFormData.workExperience || 0) * 3;
      const skillsBonus = (currentFormData.skills?.length || 0) * 1.5;
      
      calculated.estimatedSalary = Math.round((base + experienceBonus + skillsBonus) * 100) / 100;
    }

    // 计算技能数量
    calculated.skillsCount = currentFormData.skills?.length || 0;

    // 计算资料完整度
    const totalFields = Object.keys(schema.properties).length - 3; // 减去只读字段
    const filledFields = Object.values(currentFormData).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== '');
      }
      return value !== undefined && value !== '';
    }).length;
    
    calculated.profileCompleteness = Math.round((filledFields / totalFields) * 100);

    return calculated;
  };

  const handleSubmit = ({ formData }) => {
    console.log("Advanced form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    // 计算自动字段
    const calculatedFields = calculateFields(formData);
    
    // 合并自动计算的字段
    const updatedFormData = {
      ...formData,
      ...calculatedFields
    };
    
    setFormData(updatedFormData);
    setAutoCalculatedFields(calculatedFields);
  };

  return (
    <div>
      <Title level={3}>高级表单演示 - 字段监听与自动计算</Title>
      <Paragraph>
        <Text type="secondary">
          展示字段变化监听功能：选择职位时推荐技能、工作经验变化时给出建议、自动计算推荐薪资和资料完整度等。
        </Text>
      </Paragraph>

      {/* 显示系统通知 */}
      {notifications.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {notifications.slice(-3).map((notif, index) => (
            <Alert
              key={index}
              message={notif.message}
              type={notif.type}
              showIcon
              closable
              onClose={() => {
                setNotifications(prev => prev.filter((_, i) => i !== notifications.length - 3 + index));
              }}
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
      )}
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="智能表单 (带监听功能)" size="small">
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
          {/* 自动计算字段显示 */}
          {Object.keys(autoCalculatedFields).length > 0 && (
            <Card title="自动计算字段" size="small" style={{ marginBottom: 16 }}>
              {autoCalculatedFields.estimatedSalary && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>系统推荐薪资: </Text>
                  <Text type="success">{autoCalculatedFields.estimatedSalary} 万元/年</Text>
                </div>
              )}
              {autoCalculatedFields.skillsCount !== undefined && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>技能数量: </Text>
                  <Text>{autoCalculatedFields.skillsCount} 项</Text>
                </div>
              )}
              {autoCalculatedFields.profileCompleteness !== undefined && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>资料完整度: </Text>
                  <Text style={{ 
                    color: autoCalculatedFields.profileCompleteness > 70 ? '#52c41a' : 
                           autoCalculatedFields.profileCompleteness > 40 ? '#faad14' : '#ff4d4f' 
                  }}>
                    {autoCalculatedFields.profileCompleteness}%
                  </Text>
                </div>
              )}
            </Card>
          )}

          <Card title="表单数据" size="small">
            <div className="json-output">
              {JSON.stringify(formData, null, 2)}
            </div>
          </Card>
          
          {formData.skills && formData.skills.length > 0 && (
            <Card title="选中的技能" size="small" style={{ marginTop: 16 }}>
              <Space wrap>
                {formData.skills.map(skill => (
                  <Tag key={skill} color="blue">{skill}</Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* 字段变化监听说明 */}
          <Card title="监听功能说明" size="small" style={{ marginTop: 16 }}>
            <div style={{ fontSize: '12px' }}>
              <div>🎯 <Text strong>职位变化:</Text> 自动推荐相关技能</div>
              <div>💰 <Text strong>薪资计算:</Text> 根据职位+经验+技能自动计算</div>
              <div>📊 <Text strong>完整度:</Text> 实时计算资料填写完整度</div>
              <div>🔔 <Text strong>智能提醒:</Text> 根据填写内容给出建议</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedFormDemo;
