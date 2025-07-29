# 字段监听功能使用指南

## 概述

字段监听功能允许您监听表单字段的变化，并在字段值发生改变时执行相应的任务。这是一个非常强大的功能，可以用于：

- 自动计算派生字段
- 数据验证和校验
- 智能推荐和提示
- 动态表单行为
- 实时反馈和通知

## 实现方式

### 1. 使用 useEffect 监听

```jsx
import React, { useState, useEffect, useRef } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({});
  const previousFormData = useRef({});

  useEffect(() => {
    const prev = previousFormData.current;
    const current = formData;

    // 监听特定字段变化
    if (prev.userType !== current.userType && current.userType) {
      console.log('用户类型变化:', current.userType);
      // 执行相应任务
      handleUserTypeChange(current.userType);
    }

    // 更新之前的数据
    previousFormData.current = { ...current };
  }, [formData]);

  const handleUserTypeChange = (userType) => {
    // 执行任务：推荐技能、计算费用等
    if (userType === 'student') {
      // 为学生推荐基础技能
      recommendSkills(['JavaScript', 'React']);
    }
  };
};
```

### 2. 在 onChange 中处理

```jsx
const handleChange = ({ formData }) => {
  // 立即响应变化
  if (formData.experience !== undefined) {
    const calculatedRisk = calculateRisk(formData.experience);
    formData.riskLevel = calculatedRisk;
  }
  
  setFormData(formData);
};
```

### 3. 配置监听器系统

```jsx
const fieldListeners = {
  salary: {
    name: "薪资监听器",
    handler: (newValue, oldValue, formData) => {
      if (newValue > 50) {
        notification.warning({
          message: '薪资较高',
          description: '建议展示更多技能证明'
        });
      }
    }
  }
};
```

## 常见用例

### 1. 自动计算字段

```jsx
// 根据工作经验和技能自动计算推荐薪资
const calculateSalary = (experience, skills) => {
  const baseSalary = 20;
  const experienceBonus = experience * 3;
  const skillsBonus = skills.length * 1.5;
  return baseSalary + experienceBonus + skillsBonus;
};

useEffect(() => {
  if (formData.experience !== undefined && formData.skills) {
    const estimated = calculateSalary(formData.experience, formData.skills);
    setFormData(prev => ({
      ...prev,
      estimatedSalary: estimated
    }));
  }
}, [formData.experience, formData.skills]);
```

### 2. 条件验证

```jsx
useEffect(() => {
  // 当选择高级职位时，要求更多工作经验
  if (formData.position === 'senior' && formData.experience < 5) {
    setErrors({
      experience: '高级职位需要至少5年工作经验'
    });
  }
}, [formData.position, formData.experience]);
```

### 3. 智能推荐

```jsx
const skillRecommendations = {
  frontend: ['JavaScript', 'React', 'CSS'],
  backend: ['Node.js', 'Python', 'Database'],
  fullstack: ['JavaScript', 'React', 'Node.js']
};

useEffect(() => {
  if (formData.role && !formData.skills?.length) {
    const recommended = skillRecommendations[formData.role];
    notification.info({
      message: '技能推荐',
      description: `建议添加：${recommended.join(', ')}`
    });
  }
}, [formData.role]);
```

### 4. 数据同步

```jsx
useEffect(() => {
  // 当用户信息变化时，同步到其他系统
  if (formData.email && formData.email !== previousFormData.current.email) {
    syncUserProfile(formData);
  }
}, [formData.email]);
```

### 5. 表单完整度计算

```jsx
const calculateCompleteness = (data) => {
  const requiredFields = ['name', 'email', 'phone', 'experience'];
  const filledFields = requiredFields.filter(field => data[field]);
  return (filledFields.length / requiredFields.length) * 100;
};

useEffect(() => {
  const completeness = calculateCompleteness(formData);
  setFormData(prev => ({
    ...prev,
    completeness
  }));
}, [formData]);
```

## 最佳实践

### 1. 防止无限循环

```jsx
// ❌ 错误：可能导致无限循环
useEffect(() => {
  setFormData(prev => ({
    ...prev,
    calculated: prev.input * 2
  }));
}, [formData]); // 依赖整个 formData

// ✅ 正确：只依赖需要的字段
useEffect(() => {
  setFormData(prev => ({
    ...prev,
    calculated: prev.input * 2
  }));
}, [formData.input]); // 只依赖 input 字段
```

### 2. 使用 useCallback 优化性能

```jsx
const handleFieldChange = useCallback((fieldName, newValue, oldValue) => {
  // 处理字段变化
}, []);

useEffect(() => {
  // 监听逻辑
}, [formData.specificField]);
```

### 3. 异步处理

```jsx
useEffect(() => {
  const fetchRecommendations = async () => {
    if (formData.skills?.length > 0) {
      try {
        const recommendations = await api.getRecommendations(formData.skills);
        setRecommendations(recommendations);
      } catch (error) {
        console.error('获取推荐失败:', error);
      }
    }
  };

  fetchRecommendations();
}, [formData.skills]);
```

### 4. 防抖处理

```jsx
import { debounce } from 'lodash';

const debouncedCalculate = useCallback(
  debounce((data) => {
    // 执行复杂计算
    const result = heavyCalculation(data);
    setCalculatedValue(result);
  }, 300),
  []
);

useEffect(() => {
  debouncedCalculate(formData);
}, [formData, debouncedCalculate]);
```

## 实际应用场景

### 1. 电商订单表单
- 监听商品数量变化，自动计算总价
- 监听收货地址，自动计算运费
- 监听优惠券输入，验证并应用折扣

### 2. 求职申请表单
- 监听职位选择，推荐相关技能
- 监听工作经验，计算匹配度
- 监听薪资期望，给出市场建议

### 3. 项目配置表单
- 监听项目类型，推荐技术栈
- 监听团队规模，计算预算范围
- 监听截止日期，评估项目风险

### 4. 用户注册表单
- 监听邮箱输入，验证域名有效性
- 监听密码输入，实时强度检测
- 监听用户名，检查可用性

## 调试技巧

### 1. 添加日志

```jsx
useEffect(() => {
  console.log('字段变化监听:', {
    field: 'userType',
    oldValue: previousFormData.current.userType,
    newValue: formData.userType,
    timestamp: new Date().toISOString()
  });
}, [formData.userType]);
```

### 2. 可视化监听状态

```jsx
const [listenedFields, setListenedFields] = useState(new Set());

useEffect(() => {
  setListenedFields(prev => new Set([...prev, 'userType']));
}, [formData.userType]);
```

### 3. 错误处理

```jsx
useEffect(() => {
  try {
    // 监听处理逻辑
  } catch (error) {
    console.error('字段监听处理错误:', error);
    notification.error({
      message: '处理失败',
      description: error.message
    });
  }
}, [formData]);
```

## 总结

字段监听是构建智能表单的核心功能，通过合理使用可以：

- 提升用户体验
- 减少用户输入错误
- 提供智能化建议
- 实现复杂的业务逻辑
- 创建响应式的表单界面

记住要遵循最佳实践，避免性能问题和无限循环，合理使用防抖和异步处理来优化用户体验。
