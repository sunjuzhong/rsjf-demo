import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tree } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

const NestedObjectDemo = () => {
  const [formData, setFormData] = useState({});

  const schema = {
    title: "员工档案管理",
    type: "object",
    required: ["personalInfo", "employment"],
    properties: {
      personalInfo: {
        type: "object",
        title: "个人信息",
        required: ["name", "contact"],
        properties: {
          name: {
            type: "object",
            title: "姓名",
            required: ["first", "last"],
            properties: {
              first: {
                type: "string",
                title: "名",
                minLength: 1
              },
              last: {
                type: "string", 
                title: "姓",
                minLength: 1
              },
              middle: {
                type: "string",
                title: "中间名"
              }
            }
          },
          contact: {
            type: "object",
            title: "联系方式",
            required: ["phone", "email"],
            properties: {
              phone: {
                type: "string",
                title: "电话号码",
                pattern: "^1[3-9]\\d{9}$"
              },
              email: {
                type: "string",
                title: "邮箱",
                format: "email"
              },
              address: {
                type: "object",
                title: "地址",
                properties: {
                  street: {
                    type: "string",
                    title: "街道地址"
                  },
                  city: {
                    type: "string",
                    title: "城市"
                  },
                  province: {
                    type: "string",
                    title: "省份",
                    enum: ["北京", "上海", "广东", "浙江", "江苏", "四川", "湖北", "山东"]
                  },
                  zipCode: {
                    type: "string",
                    title: "邮政编码",
                    pattern: "^\\d{6}$"
                  }
                }
              },
              emergency: {
                type: "object",
                title: "紧急联系人",
                properties: {
                  name: {
                    type: "string",
                    title: "姓名"
                  },
                  relationship: {
                    type: "string",
                    title: "关系",
                    enum: ["spouse", "parent", "sibling", "friend", "other"],
                    enumNames: ["配偶", "父母", "兄弟姐妹", "朋友", "其他"]
                  },
                  phone: {
                    type: "string",
                    title: "电话"
                  }
                }
              }
            }
          },
          demographics: {
            type: "object",
            title: "基本信息",
            properties: {
              birthDate: {
                type: "string",
                format: "date",
                title: "出生日期"
              },
              gender: {
                type: "string",
                title: "性别",
                enum: ["male", "female", "other"],
                enumNames: ["男", "女", "其他"]
              },
              nationality: {
                type: "string",
                title: "国籍",
                default: "中国"
              },
              maritalStatus: {
                type: "string",
                title: "婚姻状况",
                enum: ["single", "married", "divorced", "widowed"],
                enumNames: ["单身", "已婚", "离异", "丧偶"]
              }
            }
          }
        }
      },
      employment: {
        type: "object",
        title: "工作信息",
        required: ["department", "position"],
        properties: {
          department: {
            type: "object",
            title: "部门信息",
            required: ["name"],
            properties: {
              name: {
                type: "string",
                title: "部门名称",
                enum: ["engineering", "marketing", "sales", "hr", "finance", "operations"],
                enumNames: ["工程部", "市场部", "销售部", "人事部", "财务部", "运营部"]
              },
              manager: {
                type: "string",
                title: "直属上级"
              },
              location: {
                type: "string",
                title: "办公地点",
                enum: ["beijing", "shanghai", "guangzhou", "shenzhen", "hangzhou"],
                enumNames: ["北京", "上海", "广州", "深圳", "杭州"]
              }
            }
          },
          position: {
            type: "object",
            title: "职位信息",
            required: ["title", "level"],
            properties: {
              title: {
                type: "string",
                title: "职位名称"
              },
              level: {
                type: "string",
                title: "职级",
                enum: ["junior", "middle", "senior", "lead", "manager", "director"],
                enumNames: ["初级", "中级", "高级", "技术负责人", "经理", "总监"]
              },
              startDate: {
                type: "string",
                format: "date",
                title: "入职日期"
              },
              probationEndDate: {
                type: "string",
                format: "date",
                title: "试用期结束日期"
              }
            }
          },
          compensation: {
            type: "object",
            title: "薪酬信息",
            properties: {
              baseSalary: {
                type: "number",
                title: "基本工资 (元/月)",
                minimum: 5000
              },
              bonus: {
                type: "number",
                title: "年终奖 (元)",
                minimum: 0
              },
              benefits: {
                type: "array",
                title: "福利待遇",
                items: {
                  type: "string",
                  enum: ["insurance", "housing", "meal", "transport", "gym", "training"],
                  enumNames: ["五险一金", "住房补贴", "餐补", "交通补贴", "健身房", "培训津贴"]
                },
                uniqueItems: true
              }
            }
          }
        }
      }
    }
  };

  const uiSchema = {
    personalInfo: {
      contact: {
        address: {
          street: {
            "ui:widget": "textarea",
            "ui:options": {
              rows: 2
            }
          }
        }
      },
      demographics: {
        gender: {
          "ui:widget": "radio",
          "ui:options": {
            inline: true
          }
        },
        maritalStatus: {
          "ui:widget": "select"
        }
      }
    },
    employment: {
      compensation: {
        baseSalary: {
          "ui:widget": "updown"
        },
        benefits: {
          "ui:widget": "checkboxes",
          "ui:options": {
            inline: false
          }
        }
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Nested form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  // 生成树形数据结构用于显示
  const generateTreeData = (obj, parentKey = '') => {
    const result = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const nodeKey = parentKey ? `${parentKey}-${key}` : key;
      const node = {
        title: key,
        key: nodeKey,
      };

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        node.children = generateTreeData(value, nodeKey);
      } else {
        node.title = `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
      }

      result.push(node);
    }
    
    return result;
  };

  const treeData = formData && Object.keys(formData).length > 0 
    ? generateTreeData(formData) 
    : [];

  return (
    <div>
      <Title level={3}>嵌套对象演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示深层嵌套的对象结构：员工档案包含个人信息、联系方式、工作信息等多层嵌套数据。
        </Text>
      </Paragraph>
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="员工档案表单" size="small">
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
          <Card title="数据结构树" size="small">
            {treeData.length > 0 ? (
              <Tree
                treeData={treeData}
                defaultExpandAll
                showLine
                showIcon={false}
              />
            ) : (
              <Text type="secondary">暂无数据，请填写表单</Text>
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

export default NestedObjectDemo;
