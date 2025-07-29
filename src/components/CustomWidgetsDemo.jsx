import React, { useState } from 'react';
import { Card, Typography, Row, Col, Slider, Rate, ColorPicker, Tag } from 'antd';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;

// 自定义评分组件
const CustomRatingWidget = (props) => {
  const { value, onChange, options } = props;
  
  return (
    <Rate
      value={value}
      onChange={(val) => onChange(val)}
      count={options.count || 5}
      allowHalf={options.allowHalf}
      character={options.character}
    />
  );
};

// 自定义颜色选择器组件
const CustomColorWidget = (props) => {
  const { value, onChange } = props;
  
  return (
    <ColorPicker
      value={value}
      onChange={(color) => onChange(color.toHexString())}
      showText
      size="large"
      presets={[
        {
          label: '推荐颜色',
          colors: [
            '#F5222D',
            '#FA8C16',
            '#FADB14',
            '#8BBB11',
            '#52C41A',
            '#13A8A8',
            '#1677FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96',
          ],
        },
      ]}
    />
  );
};

// 自定义标签输入组件
const CustomTagsWidget = (props) => {
  const { value = [], onChange } = props;
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue && !value.includes(inputValue)) {
      onChange([...value, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        {value.map(tag => (
          <Tag
            key={tag}
            closable
            onClose={() => handleRemoveTag(tag)}
            style={{ marginBottom: 4 }}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
        placeholder="输入标签并按回车添加"
        style={{ width: '100%', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }}
      />
    </div>
  );
};

const CustomWidgetsDemo = () => {
  const [formData, setFormData] = useState({});

  const schema = {
    title: "自定义组件演示",
    type: "object",
    properties: {
      userRating: {
        type: "number",
        title: "用户评分",
        description: "请为我们的服务打分",
        minimum: 1,
        maximum: 5
      },
      serviceRating: {
        type: "number",
        title: "服务质量评分",
        description: "支持半分评分",
        minimum: 0,
        maximum: 10
      },
      brandColor: {
        type: "string",
        title: "品牌主色调",
        description: "选择您的品牌主色调",
        default: "#1677FF"
      },
      themeColor: {
        type: "string",
        title: "主题颜色",
        description: "页面主题颜色",
        default: "#52C41A"
      },
      interests: {
        type: "array",
        title: "兴趣标签",
        description: "添加您的兴趣标签",
        items: {
          type: "string"
        }
      },
      skills: {
        type: "array",
        title: "技能标签",
        description: "添加您的技能标签",
        items: {
          type: "string"
        }
      },
      satisfaction: {
        type: "integer",
        title: "满意度",
        description: "拖拽滑块选择满意度",
        minimum: 0,
        maximum: 100,
        default: 80
      },
      priority: {
        type: "integer", 
        title: "优先级",
        description: "项目优先级设置",
        minimum: 1,
        maximum: 5,
        default: 3
      },
      feedback: {
        type: "string",
        title: "详细反馈",
        description: "请提供详细的反馈意见"
      }
    }
  };

  // 注册自定义组件
  const widgets = {
    RatingWidget: CustomRatingWidget,
    ColorWidget: CustomColorWidget,
    TagsWidget: CustomTagsWidget,
  };

  const uiSchema = {
    userRating: {
      "ui:widget": "RatingWidget",
      "ui:options": {
        count: 5,
        allowHalf: false,
        character: "★"
      }
    },
    serviceRating: {
      "ui:widget": "RatingWidget",
      "ui:options": {
        count: 10,
        allowHalf: true,
        character: "♥"
      }
    },
    brandColor: {
      "ui:widget": "ColorWidget"
    },
    themeColor: {
      "ui:widget": "ColorWidget"
    },
    interests: {
      "ui:widget": "TagsWidget"
    },
    skills: {
      "ui:widget": "TagsWidget"
    },
    satisfaction: {
      "ui:widget": "range",
      "ui:options": {
        step: 5
      }
    },
    priority: {
      "ui:widget": "range",
      "ui:options": {
        step: 1,
        marks: {
          1: "低",
          2: "较低", 
          3: "中等",
          4: "较高",
          5: "高"
        }
      }
    },
    feedback: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 6
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("Custom widgets form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  return (
    <div>
      <Title level={3}>自定义组件演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示如何创建和使用自定义表单组件：评分组件、颜色选择器、标签输入器等。
          这些组件扩展了标准表单的功能，提供更丰富的用户交互体验。
        </Text>
      </Paragraph>
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="自定义组件表单" size="small">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              widgets={widgets}
              formData={formData}
              validator={validator}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </Card>
        </Col>
        
        <Col span={10}>
          <Card title="组件预览" size="small">
            {formData.brandColor && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>品牌色预览：</Text>
                <div
                  style={{
                    width: 60,
                    height: 20,
                    backgroundColor: formData.brandColor,
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    display: 'inline-block',
                    marginLeft: 8
                  }}
                />
                <Text style={{ marginLeft: 8 }}>{formData.brandColor}</Text>
              </div>
            )}
            
            {formData.themeColor && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>主题色预览：</Text>
                <div
                  style={{
                    width: 60,
                    height: 20,
                    backgroundColor: formData.themeColor,
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    display: 'inline-block',
                    marginLeft: 8
                  }}
                />
                <Text style={{ marginLeft: 8 }}>{formData.themeColor}</Text>
              </div>
            )}

            {formData.userRating && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>用户评分：</Text>
                <Rate disabled value={formData.userRating} style={{ marginLeft: 8 }} />
              </div>
            )}

            {formData.serviceRating && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>服务评分：</Text>
                <Rate 
                  disabled 
                  value={formData.serviceRating} 
                  count={10}
                  allowHalf
                  character="♥"
                  style={{ marginLeft: 8, color: '#ff4d4f' }}
                />
              </div>
            )}

            {formData.satisfaction && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>满意度：</Text>
                <Text style={{ marginLeft: 8 }}>{formData.satisfaction}%</Text>
                <Slider 
                  value={formData.satisfaction} 
                  disabled
                  style={{ marginTop: 8 }}
                />
              </div>
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

export default CustomWidgetsDemo;
