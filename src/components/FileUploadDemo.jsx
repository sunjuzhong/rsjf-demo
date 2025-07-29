import React, { useState } from 'react';
import { Card, Typography, Row, Col, Upload, Button, List, Image } from 'antd';
import { UploadOutlined, InboxOutlined, PictureOutlined } from '@ant-design/icons';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

// 自定义文件上传组件
const CustomFileWidget = (props) => {
  const { value, onChange, options } = props;
  const [fileList, setFileList] = useState([]);

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    // 转换文件信息为表单数据
    const files = newFileList.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uid: file.uid,
      url: file.url || file.thumbUrl,
      status: file.status
    }));
    
    onChange(files);
  };

  const uploadProps = {
    fileList,
    onChange: handleUpload,
    beforeUpload: () => false, // 阻止自动上传
    multiple: options.multiple || false,
    accept: options.accept,
    listType: options.listType || 'text',
    maxCount: options.maxCount,
  };

  if (options.dragger) {
    return (
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传。{options.accept && `支持格式：${options.accept}`}
        </p>
      </Dragger>
    );
  }

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>
        {options.buttonText || '选择文件'}
      </Button>
    </Upload>
  );
};

// 自定义图片上传组件
const CustomImageWidget = (props) => {
  const { value, onChange, options } = props;
  const [fileList, setFileList] = useState([]);

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    const images = newFileList.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uid: file.uid,
      url: file.url || file.thumbUrl,
      status: file.status
    }));
    
    onChange(images);
  };

  // 模拟获取图片预览URL
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadProps = {
    fileList,
    onChange: handleUpload,
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        console.error('只能上传图片文件!');
        return false;
      }
      
      // 获取预览URL
      try {
        const url = await getBase64(file);
        file.thumbUrl = url;
      } catch (error) {
        console.error('获取图片预览失败:', error);
      }
      
      return false; // 阻止自动上传
    },
    listType: 'picture-card',
    accept: 'image/*',
    multiple: options.multiple !== false,
  };

  const uploadButton = (
    <div>
      <PictureOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <Upload {...uploadProps}>
      {fileList.length >= (options.maxCount || 8) ? null : uploadButton}
    </Upload>
  );
};

const FileUploadDemo = () => {
  const [formData, setFormData] = useState({});

  const schema = {
    title: "文件上传演示",
    type: "object",
    properties: {
      resume: {
        type: "array",
        title: "简历文件",
        description: "上传您的简历，支持 PDF、DOC、DOCX 格式",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            size: { type: "number" },
            type: { type: "string" },
            url: { type: "string" }
          }
        }
      },
      portfolio: {
        type: "array",
        title: "作品集",
        description: "上传您的作品文件，支持多种格式",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            size: { type: "number" },
            type: { type: "string" },
            url: { type: "string" }
          }
        }
      },
      avatar: {
        type: "array",
        title: "头像照片",
        description: "上传您的头像照片",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            size: { type: "number" },
            type: { type: "string" },
            url: { type: "string" }
          }
        }
      },
      gallery: {
        type: "array",
        title: "图片画廊",
        description: "上传多张图片展示",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            size: { type: "number" },
            type: { type: "string" },
            url: { type: "string" }
          }
        }
      },
      documents: {
        type: "array",
        title: "相关文档",
        description: "拖拽文件到此区域上传",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            size: { type: "number" },
            type: { type: "string" },
            url: { type: "string" }
          }
        }
      }
    }
  };

  // 注册自定义组件
  const widgets = {
    FileWidget: CustomFileWidget,
    ImageWidget: CustomImageWidget,
  };

  const uiSchema = {
    resume: {
      "ui:widget": "FileWidget",
      "ui:options": {
        accept: ".pdf,.doc,.docx",
        maxCount: 1,
        buttonText: "选择简历文件"
      }
    },
    portfolio: {
      "ui:widget": "FileWidget",
      "ui:options": {
        multiple: true,
        maxCount: 5,
        buttonText: "选择作品文件"
      }
    },
    avatar: {
      "ui:widget": "ImageWidget",
      "ui:options": {
        multiple: false,
        maxCount: 1
      }
    },
    gallery: {
      "ui:widget": "ImageWidget",
      "ui:options": {
        multiple: true,
        maxCount: 8
      }
    },
    documents: {
      "ui:widget": "FileWidget",
      "ui:options": {
        dragger: true,
        multiple: true,
        buttonText: "选择文档"
      }
    }
  };

  const handleSubmit = ({ formData }) => {
    console.log("File upload form submitted:", formData);
    setFormData(formData);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  // 计算文件统计信息
  const getFileStats = () => {
    let totalFiles = 0;
    let totalSize = 0;
    
    Object.values(formData).forEach(files => {
      if (Array.isArray(files)) {
        totalFiles += files.length;
        totalSize += files.reduce((sum, file) => sum + (file.size || 0), 0);
      }
    });
    
    return {
      totalFiles,
      totalSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
    };
  };

  const stats = getFileStats();

  return (
    <div>
      <Title level={3}>文件上传演示</Title>
      <Paragraph>
        <Text type="secondary">
          展示各种文件上传功能：单文件上传、多文件上传、图片上传、拖拽上传等。
          包含文件类型限制、数量限制和预览功能。
        </Text>
      </Paragraph>
      
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="文件上传表单" size="small">
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
          <Card title="文件统计" size="small">
            <div style={{ marginBottom: 16 }}>
              <Text strong>总文件数：</Text>
              <Text>{stats.totalFiles}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>总大小：</Text>
              <Text>{stats.totalSize}</Text>
            </div>
          </Card>

          {formData.gallery && formData.gallery.length > 0 && (
            <Card title="图片预览" size="small" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {formData.gallery.map((image, index) => (
                  image.url && (
                    <Image
                      key={index}
                      width={60}
                      height={60}
                      src={image.url}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  )
                ))}
              </div>
            </Card>
          )}
          
          <Card title="上传的文件" size="small" style={{ marginTop: 16 }}>
            {Object.entries(formData).map(([key, files]) => (
              Array.isArray(files) && files.length > 0 && (
                <div key={key} style={{ marginBottom: 12 }}>
                  <Text strong>{schema.properties[key]?.title || key}：</Text>
                  <List
                    size="small"
                    dataSource={files}
                    renderItem={file => (
                      <List.Item>
                        <Text ellipsis style={{ maxWidth: 200 }}>
                          {file.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {file.size ? ` (${(file.size / 1024).toFixed(1)}KB)` : ''}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              )
            ))}
            
            {Object.values(formData).every(files => !Array.isArray(files) || files.length === 0) && (
              <Text type="secondary">暂无上传的文件</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FileUploadDemo;
