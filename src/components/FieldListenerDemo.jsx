import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, notification, Alert, Tag, Progress, Button, Space } from 'antd';
import { 
  BellOutlined, 
  CalculatorOutlined, 
  EyeOutlined, 
  SyncOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

const FieldListenerDemo = () => {
  const [formData, setFormData] = useState({});
  const [listeners, setListeners] = useState([]);
  const [calculations, setCalculations] = useState({});
  const [watchedFields, setWatchedFields] = useState(new Set());
  const previousFormData = useRef({});

  const schema = {
    title: "字段监听演示",
    type: "object",
    properties: {
      userType: {
        type: "string",
        title: "用户类型",
        enum: ["student", "professional", "freelancer"],
        enumNames: ["学生", "专业人士", "自由职业者"]
      },
      experience: {
        type: "integer",
        title: "工作经验 (年)",
        minimum: 0,
        maximum: 20
      },
      skills: {
        type: "array",
        title: "技能列表",
        items: {
          type: "string",
          enum: ["JavaScript", "React", "Node.js", "Python", "Java", "Go", "Docker"]
        },
        uniqueItems: true
      },
      budget: {
        type: "number",
        title: "预算 (万元)",
        minimum: 1,
        maximum: 100
      },
      priority: {
        type: "string",
        title: "优先级",
        enum: ["low", "medium", "high", "urgent"],
        enumNames: ["低", "中", "高", "紧急"]
      },
      // 自动计算字段
      riskLevel: {
        type: "string",
        title: "风险等级",
        readOnly: true
      },
      estimatedCost: {
        type: "number",
        title: "预估成本 (万元)",
        readOnly: true
      },
      recommendation: {
        type: "string",
        title: "系统建议",
        readOnly: true
      }
    }
  };

  const uiSchema = {
    userType: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true
      }
    },
    experience: {
      "ui:widget": "range"
    },
    skills: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: false
      }
    },
    budget: {
      "ui:widget": "range"
    },
    priority: {
      "ui:widget": "select"
    },
    riskLevel: {
      "ui:disabled": true
    },
    estimatedCost: {
      "ui:disabled": true
    },
    recommendation: {
      "ui:widget": "textarea",
      "ui:disabled": true,
      "ui:options": {
        rows: 3
      }
    }
  };

  // 字段监听器配置
  const fieldListeners = {
    userType: {
      name: "用户类型监听器",
      description: "监听用户类型变化，推荐相应的技能",
      handler: (newValue, oldValue, formData) => {
        if (newValue && newValue !== oldValue) {
          const recommendations = {
            student: ["JavaScript", "React"],
            professional: ["JavaScript", "React", "Node.js", "Docker"],
            freelancer: ["JavaScript", "Python", "Go"]
          };
          
          const recommended = recommendations[newValue] || [];
          return {
            type: 'success',
            message: `用户类型变更为 "${schema.properties.userType.enumNames[schema.properties.userType.enum.indexOf(newValue)]}"`,
            action: `推荐技能: ${recommended.join(', ')}`,
            data: { recommendedSkills: recommended }
          };
        }
        return null;
      }
    },
    experience: {
      name: "工作经验监听器",
      description: "监听工作经验变化，调整风险等级",
      handler: (newValue, oldValue, formData) => {
        if (newValue !== oldValue && newValue !== undefined) {
          let riskLevel = 'low';
          let message = '';
          
          if (newValue < 2) {
            riskLevel = 'high';
            message = '经验较少，项目风险较高';
          } else if (newValue < 5) {
            riskLevel = 'medium';
            message = '经验适中，风险可控';
          } else {
            riskLevel = 'low';
            message = '经验丰富，风险较低';
          }
          
          return {
            type: 'info',
            message: `工作经验: ${newValue} 年`,
            action: message,
            calculation: { riskLevel }
          };
        }
        return null;
      }
    },
    skills: {
      name: "技能列表监听器",
      description: "监听技能变化，计算预估成本",
      handler: (newValue, oldValue, formData) => {
        const newCount = newValue?.length || 0;
        const oldCount = oldValue?.length || 0;
        
        if (newCount !== oldCount) {
          const baseCost = 10;
          const skillCost = newCount * 3;
          const experienceMultiplier = (formData.experience || 0) * 0.5;
          const estimatedCost = baseCost + skillCost + experienceMultiplier;
          
          return {
            type: 'info',
            message: `技能数量: ${oldCount} → ${newCount}`,
            action: `预估成本更新为 ${estimatedCost.toFixed(1)} 万元`,
            calculation: { estimatedCost: estimatedCost.toFixed(1) }
          };
        }
        return null;
      }
    },
    priority: {
      name: "优先级监听器",
      description: "监听优先级变化，给出时间建议",
      handler: (newValue, oldValue, formData) => {
        if (newValue && newValue !== oldValue) {
          const timeframes = {
            low: "建议时间: 3-6个月",
            medium: "建议时间: 1-3个月", 
            high: "建议时间: 2-4周",
            urgent: "建议时间: 1-2周"
          };
          
          const priorityName = schema.properties.priority.enumNames[
            schema.properties.priority.enum.indexOf(newValue)
          ];
          
          return {
            type: newValue === 'urgent' ? 'warning' : 'info',
            message: `优先级设为 "${priorityName}"`,
            action: timeframes[newValue],
            calculation: { 
              recommendation: `优先级: ${priorityName}。${timeframes[newValue]}。${newValue === 'urgent' ? '建议增加团队规模。' : ''}` 
            }
          };
        }
        return null;
      }
    }
  };

  // 执行字段监听
  useEffect(() => {
    const prev = previousFormData.current;
    const current = formData;
    const newListeners = [];
    const newCalculations = { ...calculations };

    // 遍历所有监听器
    for (const [fieldName, listener] of Object.entries(fieldListeners)) {
      const oldValue = prev[fieldName];
      const newValue = current[fieldName];
      
      // 标记被监听的字段
      if (newValue !== undefined) {
        setWatchedFields(prev => new Set([...prev, fieldName]));
      }

      // 执行监听器
      const result = listener.handler(newValue, oldValue, current);
      if (result) {
        newListeners.push({
          id: Date.now() + Math.random(),
          timestamp: new Date(),
          field: fieldName,
          listener: listener.name,
          ...result
        });

        // 更新计算字段
        if (result.calculation) {
          Object.assign(newCalculations, result.calculation);
        }

        // 显示通知
        notification[result.type]({
          message: result.message,
          description: result.action,
          duration: 4,
          icon: result.type === 'success' ? <CheckCircleOutlined /> : 
                result.type === 'warning' ? <BellOutlined /> : <InfoCircleOutlined />
        });
      }
    }

    if (newListeners.length > 0) {
      setListeners(prev => [...prev, ...newListeners].slice(-10)); // 保留最近10条
    }

    if (Object.keys(newCalculations).length > 0) {
      setCalculations(newCalculations);
    }

    previousFormData.current = { ...current };
  }, [formData]);

  const handleChange = ({ formData }) => {
    // 合并自动计算的字段
    const updatedFormData = {
      ...formData,
      ...calculations
    };
    
    setFormData(updatedFormData);
  };

  const handleSubmit = ({ formData }) => {
    console.log("Field listener demo submitted:", formData);
  };

  const clearListeners = () => {
    setListeners([]);
    setWatchedFields(new Set());
  };

  const getRiskColor = (level) => {
    const colors = {
      low: '#52c41a',
      medium: '#faad14', 
      high: '#ff4d4f'
    };
    return colors[level] || '#666';
  };

  return (
    <div>
      <Title level={3}>字段监听与自动计算演示</Title>
      <Paragraph>
        <Text type="secondary">
          演示如何监听表单字段的变化并执行相应的任务：自动计算、数据验证、智能推荐等。
          每个字段都配置了专门的监听器来处理变化事件。
        </Text>
      </Paragraph>

      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                监听表单
                <Tag color="blue">{watchedFields.size} 个字段被监听</Tag>
              </Space>
            } 
            size="small"
          >
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              validator={validator}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </Card>

          {/* 监听器配置显示 */}
          <Card title="配置的监听器" size="small" style={{ marginTop: 16 }}>
            {Object.entries(fieldListeners).map(([field, listener]) => (
              <div key={field} style={{ marginBottom: 12, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <div>
                  <Tag color={watchedFields.has(field) ? 'green' : 'default'}>
                    {watchedFields.has(field) ? <CheckCircleOutlined /> : <SyncOutlined />}
                  </Tag>
                  <Text strong>{listener.name}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {listener.description}
                </Text>
              </div>
            ))}
          </Card>
        </Col>

        <Col span={10}>
          {/* 自动计算结果 */}
          {Object.keys(calculations).length > 0 && (
            <Card 
              title={
                <Space>
                  <CalculatorOutlined />
                  自动计算结果
                </Space>
              } 
              size="small" 
              style={{ marginBottom: 16 }}
            >
              {calculations.riskLevel && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>风险等级: </Text>
                  <Tag color={calculations.riskLevel === 'low' ? 'green' : 
                              calculations.riskLevel === 'medium' ? 'orange' : 'red'}>
                    {calculations.riskLevel.toUpperCase()}
                  </Tag>
                </div>
              )}
              {calculations.estimatedCost && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>预估成本: </Text>
                  <Text type="success">{calculations.estimatedCost} 万元</Text>
                </div>
              )}
              {calculations.recommendation && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>系统建议: </Text>
                  <Text>{calculations.recommendation}</Text>
                </div>
              )}
            </Card>
          )}

          {/* 监听事件日志 */}
          <Card 
            title={
              <Space>
                <BellOutlined />
                监听事件日志
                <Button size="small" onClick={clearListeners}>清空</Button>
              </Space>
            } 
            size="small"
          >
            {listeners.length > 0 ? (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {listeners.slice().reverse().map(listener => (
                  <div key={listener.id} style={{ 
                    marginBottom: 12, 
                    padding: 8, 
                    border: '1px solid #d9d9d9', 
                    borderRadius: 4,
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                      {listener.timestamp.toLocaleTimeString()} - {listener.listener}
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                      {listener.message}
                    </div>
                    <div style={{ fontSize: '12px', color: '#1890ff' }}>
                      {listener.action}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无监听事件，请修改表单字段触发监听器</Text>
            )}
          </Card>

          {/* 表单数据 */}
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

export default FieldListenerDemo;
