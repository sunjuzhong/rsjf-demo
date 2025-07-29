import React, { useState } from 'react';
import { ConfigProvider, Tabs, Card, Divider, Typography, Space, Button } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

// 导入各种演示表单
import BasicFormDemo from './components/BasicFormDemo';
import AdvancedFormDemo from './components/AdvancedFormDemo';
import ArrayFormDemo from './components/ArrayFormDemo';
import ConditionalFormDemo from './components/ConditionalFormDemo';
import CustomWidgetsDemo from './components/CustomWidgetsDemo';
import ValidationDemo from './components/ValidationDemo';
import NestedObjectDemo from './components/NestedObjectDemo';
import FileUploadDemo from './components/FileUploadDemo';
import FieldListenerDemo from './components/FieldListenerDemo';
import CustomTemplatesDemo from './components/CustomTemplatesDemo';

const { Title, Paragraph } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('1');

  const tabItems = [
    {
      key: '1',
      label: '基础表单',
      children: <BasicFormDemo />,
    },
    {
      key: '2',
      label: '高级表单',
      children: <AdvancedFormDemo />,
    },
    {
      key: '3',
      label: '字段监听',
      children: <FieldListenerDemo />,
    },
    {
      key: '4',
      label: '数组表单',
      children: <ArrayFormDemo />,
    },
    {
      key: '5',
      label: '条件表单',
      children: <ConditionalFormDemo />,
    },
    {
      key: '6',
      label: '嵌套对象',
      children: <NestedObjectDemo />,
    },
    {
      key: '7',
      label: '自定义组件',
      children: <CustomWidgetsDemo />,
    },
    {
      key: '8',
      label: '表单验证',
      children: <ValidationDemo />,
    },
    {
      key: '9',
      label: '文件上传',
      children: <FileUploadDemo />,
    },
    {
      key: '10',
      label: '自定义模板',
      children: <CustomTemplatesDemo />,
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="demo-container">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={1}>React JSON Schema Form with Antd</Title>
              <Paragraph>
                这是一个完整的 react-jsonschema-form 演示，展示了与 Ant Design 的集成。
                该库允许您通过 JSON Schema 自动生成 React 表单。
              </Paragraph>
            </div>
            
            <Divider />
            
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              centered
            />
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default App;
