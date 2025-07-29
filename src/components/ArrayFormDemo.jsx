import React, { useState } from 'react';
import { Card, Typography, Row, Col, List, Badge } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

const ArrayFormDemo = () => {
  const [formData, setFormData] = useState({
    projects: []
  });

  const schema = {
    title: "项目经历管理",
    type: "object",
    properties: {
      projects: {
        type: "array",
        title: "项目列表",
        description: "添加您参与过的项目",
        items: {
          type: "object",
          title: "项目",
          required: ["name", "role", "status"],
          properties: {
            name: {
              type: "string",
              title: "项目名称",
              minLength: 2
            },
            description: {
              type: "string",
              title: "项目描述"
            },
            role: {
              type: "string",
              title: "担任角色",
              enum: ["lead", "member", "consultant", "intern"],
              enumNames: ["项目负责人", "团队成员", "技术顾问", "实习生"]
            },
            status: {
              type: "string",
              title: "项目状态",
              enum: ["planning", "development", "testing", "completed", "cancelled"],
              enumNames: ["规划中", "开发中", "测试中", "已完成", "已取消"]
            },
            startDate: {
              type: "string",
              format: "date",
              title: "开始日期"
            },
            endDate: {
              type: "string",
              format: "date",
              title: "结束日期"
            },
            technologies: {
              type: "array",
              title: "使用技术",
              items: {
                type: "string"
              },
              uniqueItems: true
            },
            team: {
              type: "object",
              title: "团队信息",
              properties: {
                size: {
                  type: "integer",
                  title: "团队规模",
                  minimum: 1,
                  maximum: 50
                },
                departments: {
                  type: "array",
                  title: "涉及部门",
                  items: {
                    type: "string",
                    enum: ["frontend", "backend", "mobile", "design", "qa", "devops", "pm"],
                    enumNames: ["前端", "后端", "移动端", "设计", "测试", "运维", "产品"]
                  },
                  uniqueItems: true
                }
              }
            },
            achievements: {
              type: "array",
              title: "项目成果",
              items: {
                type: "string"
              }
            }
          }
        }
      },
      totalProjects: {
        type: "integer",
        title: "总项目数量",
        readOnly: true
      }
    }
  };

  const uiSchema = {
    projects: {
      items: {
        description: {
          "ui:widget": "textarea",
          "ui:options": {
            rows: 3
          }
        },
        technologies: {
          "ui:options": {
            addable: true,
            removable: true
          }
        },
        team: {
          departments: {
            "ui:widget": "checkboxes",
            "ui:options": {
              inline: true
            }
          }
        },
        achievements: {
          "ui:options": {
            addable: true,
            removable: true
          }
        }
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Array form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    console.log("Array form changed:", formData);
    // 自动计算总项目数量
    const updatedFormData = {
      ...formData,
      totalProjects: formData.projects ? formData.projects.length : 0
    };
    setFormData(updatedFormData);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'orange',
      development: 'blue',
      testing: 'purple',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      planning: '规划中',
      development: '开发中',
      testing: '测试中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Title level={3}>数组表单演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示动态数组表单的功能：添加/删除项目、嵌套对象、数组内的数组等复杂数据结构。
        </Text>
      </Paragraph>
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="项目管理表单" size="small">
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
          <Card title="项目列表预览" size="small">
            {formData.projects && formData.projects.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={formData.projects}
                renderItem={(project, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div>
                          {project.name || `项目 ${index + 1}`}
                          {project.status && (
                            <Badge 
                              color={getStatusColor(project.status)}
                              text={getStatusText(project.status)}
                              style={{ marginLeft: 8 }}
                            />
                          )}
                        </div>
                      }
                      description={project.description}
                    />
                    {project.technologies && project.technologies.length > 0 && (
                      <div>
                        <Text strong>技术栈：</Text>
                        <Text>{project.technologies.join(', ')}</Text>
                      </div>
                    )}
                    {project.team && project.team.size && (
                      <div>
                        <Text strong>团队规模：</Text>
                        <Text>{project.team.size} 人</Text>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">暂无项目，请添加项目信息</Text>
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

export default ArrayFormDemo;
