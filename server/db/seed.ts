import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { users, learningStages, practiceProjects, learningResources, experiments } from './schema';

async function seed() {
  console.log('开始种子数据初始化...');

  // 默认管理员账号
  const adminExists = await db.select().from(users).where(eq(users.email, 'admin@example.com')).limit(1);
  if (adminExists.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      email: 'admin@example.com',
      username: 'admin',
      passwordHash,
    });
    console.log('  ✓ 创建默认账号 admin / admin123');
  }

  // 7 个学习阶段
  const stages = [
    { stageNumber: 1, title: '智能体核心概念', subtitle: '理解什么是智能体，与传统程序的区别', duration: '3-5天', topics: ['智能体定义', '感知-决策-行动循环', 'LLM 作为推理引擎', '工具调用基础'], description: '从最基础的概念出发，建立对智能体的整体认知。' },
    { stageNumber: 2, title: '提示工程基础', subtitle: '写出可控、可复现的提示词', duration: '2-4天', topics: ['系统提示词设计', 'Few-shot 示例', '思维链 CoT', '结构化输出'], description: '掌握提示词工程的核心技巧。' },
    { stageNumber: 3, title: '工具与函数调用', subtitle: '让智能体能调用外部能力', duration: '4-6天', topics: ['Function Calling 协议', '工具描述规范', '错误处理与重试', '多工具编排'], description: '学习如何为智能体接入真实工具。' },
    { stageNumber: 4, title: '记忆与上下文管理', subtitle: '让智能体记住并善用历史', duration: '3-5天', topics: ['短期记忆', '长期记忆存储', '上下文窗口优化', '记忆检索'], description: '理解智能体的记忆机制。' },
    { stageNumber: 5, title: '规划与任务分解', subtitle: '让智能体自主拆解复杂任务', duration: '4-7天', topics: ['任务分解策略', 'Plan-and-Execute', '反思与自我修正', '子任务编排'], description: '构建能处理复杂任务的智能体。' },
    { stageNumber: 6, title: '多智能体协作', subtitle: '多个智能体如何分工配合', duration: '5-8天', topics: ['角色分工', '消息传递', '评审与对抗', '团队模式'], description: '从单智能体到多智能体系统。' },
    { stageNumber: 7, title: '评测与上线', subtitle: '让智能体可度量、可维护', duration: '3-6天', topics: ['评测集构建', '成功率与延迟', '监控与日志', '灰度发布'], description: '把智能体从demo带到生产。' },
  ];

  for (const s of stages) {
    const existing = await db.select().from(learningStages).where(eq(learningStages.stageNumber, s.stageNumber)).limit(1);
    if (existing.length === 0) {
      await db.insert(learningStages).values(s);
      console.log(`  ✓ 阶段 ${s.stageNumber}: ${s.title}`);
    }
  }

  // 9 个实践项目
  const projects = [
    { projectNumber: 1, title: '个人知识问答助手', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段1-2'], deliverables: ['可用的问答 Demo', '提示词模板'] },
    { projectNumber: 2, title: '天气查询智能体', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段3'], deliverables: ['接入真实 API', '错误处理'] },
    { projectNumber: 3, title: '笔记整理助手', category: '主线', difficulty: '中级', duration: '3天', prerequisites: ['阶段4'], deliverables: ['记忆持久化', '多轮对话'] },
    { projectNumber: 4, title: '研究报告生成器', category: '主线', difficulty: '中级', duration: '4天', prerequisites: ['阶段5'], deliverables: ['任务分解', '多步执行'] },
    { projectNumber: 5, title: '代码审查搭档', category: '主线', difficulty: '高级', duration: '5天', prerequisites: ['阶段3-5'], deliverables: ['Git 集成', '评审报告'] },
    { projectNumber: 6, title: '多角色客服团队', category: '主线', difficulty: '高级', duration: '6天', prerequisites: ['阶段6'], deliverables: ['路由+专员', '升级机制'] },
    { projectNumber: 7, title: '自动化数据分析师', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段3,5'], deliverables: ['数据分析链', '图表输出'] },
    { projectNumber: 8, title: '论文阅读伙伴', category: '专项', difficulty: '中级', duration: '4天', prerequisites: ['阶段2,4'], deliverables: ['PDF 解析', '摘要问答'] },
    { projectNumber: 9, title: '生产级智能体运维', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段7'], deliverables: ['评测脚本', '监控面板'] },
  ];

  for (const p of projects) {
    const existing = await db.select().from(practiceProjects).where(eq(practiceProjects.projectNumber, p.projectNumber)).limit(1);
    if (existing.length === 0) {
      await db.insert(practiceProjects).values(p);
      console.log(`  ✓ 项目 ${p.projectNumber}: ${p.title}`);
    }
  }

  // 资料
  const resources = [
    { title: 'LLM 智能体综述', category: '综述', type: '论文', stageNumber: 1, description: '智能体领域经典综述论文' },
    { title: '提示工程最佳实践', category: '提示工程', type: '指南', stageNumber: 2, description: 'OpenAI 官方提示工程指南' },
    { title: 'Function Calling 文档', category: '工具调用', type: '文档', stageNumber: 3, description: '主流模型函数调用接口说明' },
    { title: '记忆系统设计模式', category: '记忆', type: '文章', stageNumber: 4, description: '智能体记忆架构综述' },
    { title: 'ReAct 论文', category: '规划', type: '论文', stageNumber: 5, description: '推理与行动结合的经典论文' },
    { title: '多智能体系统综述', category: '多智能体', type: '论文', stageNumber: 6, description: '多智能体协作范式' },
    { title: 'LLM 应用评测指南', category: '评测', type: '指南', stageNumber: 7, description: '如何科学评测智能体' },
  ];
  for (const r of resources) {
    const existing = await db.select().from(learningResources).where(eq(learningResources.title, r.title)).limit(1);
    if (existing.length === 0) {
      await db.insert(learningResources).values(r);
    }
  }

  // 实验
  const exps = [
    { expNumber: 1, title: '第一个 Hello Agent', category: '入门', difficulty: '简单', duration: '30分钟', description: '用最少代码跑通一个智能体循环' },
    { expNumber: 2, title: '设计你的提示词', category: '提示工程', difficulty: '简单', duration: '1小时', description: '对比不同提示词的效果' },
    { expNumber: 3, title: '接入计算器工具', category: '工具调用', difficulty: '中等', duration: '1.5小时', description: '实现一个带计算能力的智能体' },
    { expNumber: 4, title: '上下文窗口实验', category: '记忆', difficulty: '中等', duration: '1小时', description: '观察长对话中的遗忘现象' },
    { expNumber: 5, title: '任务分解练习', category: '规划', difficulty: '中等', duration: '2小时', description: '让智能体拆解一个真实任务' },
    { expNumber: 6, title: '两个智能体对话', category: '多智能体', difficulty: '困难', duration: '2小时', description: '实现一个讨论-评审循环' },
    { expNumber: 7, title: '跑一个评测集', category: '评测', difficulty: '中等', duration: '1.5小时', description: '用固定测试集衡量智能体表现' },
    { expNumber: 8, title: '调试失败案例', category: '工程实践', difficulty: '困难', duration: '2小时', description: '分析真实失败 trace 并修复' },
  ];
  for (const e of exps) {
    const existing = await db.select().from(experiments).where(eq(experiments.expNumber, e.expNumber)).limit(1);
    if (existing.length === 0) {
      await db.insert(experiments).values(e);
    }
  }

  console.log('种子数据初始化完成！');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
