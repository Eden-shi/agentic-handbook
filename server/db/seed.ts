import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { users, learningStages, practiceProjects, learningResources, experiments } from './schema';

async function seed() {
  console.log('开始种子数据初始化...');

  const adminExists = await db.select().from(users).where(eq(users.email, 'admin@example.com')).limit(1);
  if (adminExists.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({ email: 'admin@example.com', username: 'admin', passwordHash });
    console.log('  ✓ 创建默认账号 admin / admin123');
  }

  const stages = [
    {
      stageNumber: 1, title: '智能体核心概念与生态', subtitle: '理解什么是智能体，以及2026年的框架格局', duration: '3-5天',
      topics: ['智能体定义', '感知-决策-行动循环', 'LLM 作为推理引擎', '2026年框架格局', 'MCP 协议概览'],
      resources: ['LLM 智能体综述', 'LangGraph vs CrewAI 2026'],
      description: '从最基础的概念出发，建立对智能体的整体认知，了解2026年主流框架的定位和选择。',
      content: `## 什么是智能体

智能体（Agent）是以大语言模型为推理核心，能够**感知环境、自主决策、调用工具、执行行动**的系统。

和传统程序的区别：
- **传统程序**：流程是人写死的
- **智能体**：流程是模型动态决策的

## 核心循环

感知 → 思考 → 行动，不断重复直到任务完成。

## 2026年框架格局

截至2026年，智能体框架市场已经整合：

| 框架 | 定位 | 适合场景 |
|------|------|----------|
| **LangGraph** | 有状态工作流运行时 | 生产级复杂流程，需要checkpoint和人工审批 |
| **CrewAI** | 角色化多智能体 | 快速原型，按角色分工的团队模式 |
| **OpenAI Agents SDK** | 官方轻量框架 | 基于OpenAI模型的快速开发 |
| **LlamaIndex Workflows** | 事件驱动管道 | RAG和数据处理流水线 |
| **AG2 (AutoGen)** | 对话式编排 | 多智能体对话和研究场景 |

**生产选择建议**：复杂有状态流程选 LangGraph；快速原型选 CrewAI；纯OpenAI生态选 Agents SDK。

## MCP 协议（Model Context Protocol）

Anthropic 2024年底推出的开放标准，2025-2026年成为事实标准——OpenAI、Google都已支持。

**MCP 解决什么问题**：以前每个AI应用要对接每个工具都要写一遍集成，就像每个手机都用不同充电器。MCP 就是 AI 的"USB-C"——写一个MCP server，所有支持MCP的客户端都能连。

截至2026年，MCP SDK月下载量超过9700万，生态工具覆盖文件系统、数据库、浏览器、API等。`,
    },
    {
      stageNumber: 2, title: '提示工程与结构化输出', subtitle: '写出可控、可复现、结构化的提示词', duration: '2-4天',
      topics: ['系统提示词设计', '角色与约束', 'Few-shot 示例', '思维链 CoT', '结构化输出 JSON mode'],
      resources: ['提示工程最佳实践', 'OpenAI Structured Outputs 文档'],
      description: '掌握提示词工程的核心技巧。2026年主流模型都支持结构化输出，可控性大幅提升。',
      content: `## 为什么提示词是智能体的"代码"

智能体的行为逻辑主要写在提示词里。同一个模型，不同提示词，行为天差地别。

## 系统提示词四要素

1. **角色**：你是谁
2. **任务**：你要做什么
3. **约束**：不能做什么（如"不要编造"）
4. **输出格式**：2026年主流模型都支持 JSON mode，直接用 schema 约束输出

## Few-shot：给例子比讲道理管用

给 2-3 个输入→输出示例，比写一大段描述效果好得多。

## 思维链（Chain of Thought）

多步推理任务让模型"一步步想"，准确率显著提升。这是后续规划阶段的基础。

## 2026年新实践

- **结构化输出**：主流模型原生支持 JSON Schema，不需要靠提示词"硬约束"
- **Prompt 版本管理**：用 Langfuse/LangSmith 管理提示词版本，支持 A/B 测试
- **Prompt Caching**：长系统提示词可以缓存，降低成本和延迟`,
    },
    {
      stageNumber: 3, title: '工具调用与 MCP', subtitle: '让智能体能调用外部能力，掌握 MCP 标准', duration: '4-6天',
      topics: ['Function Calling', 'MCP 模型上下文协议', '工具描述规范', '错误处理与重试', 'MCP Server 开发'],
      resources: ['MCP 官方文档', 'Function Calling 文档', '接入计算器工具实验'],
      description: '学习如何为智能体接入真实工具。2026年 MCP 已成为工具接入的事实标准。',
      content: `## Function Calling

你告诉模型有哪些工具可用（名称、描述、参数 schema），模型在需要时输出结构化的工具调用请求。

## MCP 协议（重点）

MCP（Model Context Protocol）是 Anthropic 推出的开放标准，2026年已成为 AI 工具接入的事实标准。

**为什么学 MCP**：
- 不用 MCP：每个工具都要写定制集成，N个工具 × M个应用 = NM 次集成
- 用 MCP：工具实现一次 MCP server，所有支持 MCP 的应用都能连

**MCP 核心概念**：
- **Resources**：数据（文件、数据库记录）
- **Tools**：可执行的操作（查询、计算、API调用）
- **Prompts**：预定义提示词模板

**传输方式**：Stdio（本地进程）、HTTP SSE、Streamable HTTP

## 工具描述怎么写

工具描述是写给模型看的——模型靠它决定什么时候用。要说清楚做什么、什么时候该用、什么时候不该用。

## 错误处理

工具失败时把错误信息原样喂回模型，让模型自己判断重试、换参数还是告知用户失败。设置最大重试次数防止死循环。`,
    },
    {
      stageNumber: 4, title: '记忆与 RAG', subtitle: '让智能体记住历史，检索相关知识', duration: '3-5天',
      topics: ['短期对话记忆', '长期记忆存储', '上下文窗口优化', 'RAG 检索增强生成', '记忆淘汰策略'],
      resources: ['RAG 评测指南', '记忆系统设计模式', '上下文窗口实验'],
      description: '理解智能体的记忆机制。2026年 RAG 已经从简单向量检索进化到混合检索+重排序。',
      content: `## 记忆的三个层次

1. **短期记忆**：当前对话历史，存在上下文窗口
2. **长期记忆**：用户偏好、事实结论，存外部数据库
3. **工作记忆**：当前任务中间结果

## 上下文窗口策略

对话一长早期消息会被挤出去。常见策略：摘要压缩、截断最近N轮、RAG按需检索。

## RAG（检索增强生成）2026实践

RAG 不只是"向量相似度搜索"了，2026年的生产级 RAG 通常包含：

1. **混合检索**：向量搜索 + 关键词搜索（BM25）结合
2. **重排序（Rerank）**：用 Cross-encoder 对初步结果重排序
3. **上下文压缩**：把检索到的长文档压缩成相关片段
4. **评测**：分别评测检索质量（context precision）和生成质量（faithfulness）

## 不要什么都记

噪声记忆会干扰模型。好的记忆系统：只存值得记住的、有遗忘机制、检索时只注入最相关的。`,
    },
    {
      stageNumber: 5, title: '规划与工作流编排', subtitle: '用 LangGraph 构建可控的智能体工作流', duration: '4-7天',
      topics: ['Plan-and-Execute', 'LangGraph 状态图', 'Checkpoint 与回放', '人工审批节点', '反思与自我修正'],
      resources: ['ReAct 论文', 'LangGraph 官方教程', '任务分解练习实验'],
      description: '构建能处理复杂任务的智能体。2026年 LangGraph 是生产级有状态工作流的事实标准。',
      content: `## 为什么需要规划

复杂任务需要拆步骤执行。直接丢给模型容易跑偏或遗漏。

## LangGraph：2026年生产级首选

LangGraph 用**状态图**（State Graph）来建模智能体流程：
- 节点 = 处理步骤（LLM调用、工具调用、人工审批）
- 边 = 状态转移条件
- **Checkpointing**：自动保存每步状态，出错可以回放/从断点恢复
- **Human-in-the-loop**：在关键节点暂停，等人审批再继续

**为什么是生产首选**：
- Uber、LinkedIn、JPMorgan 在用
- 比 CrewAI 低 30-47% token 成本
- 确定性的图结构，便于调试和审计

## 其他模式

- **ReAct**：思考→行动→观察循环，灵活但可能跑偏
- **Plan-and-Execute**：先出计划再执行，可控
- **Deep Agents**：长运行工作流，支持持久化和恢复`,
    },
    {
      stageNumber: 6, title: '多智能体协作', subtitle: '多个智能体如何分工配合', duration: '5-8天',
      topics: ['角色分工设计', 'CrewAI 团队模式', '消息传递与上下文隔离', '评审与对抗', '终止条件'],
      resources: ['多智能体系统综述', '两个智能体对话实验'],
      description: '从单智能体到多智能体系统。2026年 CrewAI 是快速原型首选，LangGraph 用于生产级编排。',
      content: `## 为什么需要多个智能体

- 一个提示词塞太多角色，模型容易精神分裂
- 没有自我批判，容易一本正经胡说
- 上下文窗口被多角色共用，很快塞满

## 2026年多智能体框架选择

| 需求 | 推荐框架 |
|------|----------|
| 快速原型、角色化团队 | CrewAI（最易上手） |
| 生产级、需要checkpoint | LangGraph |
| 对话式研究 | AG2 (AutoGen) |
| 微软生态 | Microsoft Agent Framework |

## 常见角色模式

- **流水线型**：A调研 → B写稿 → C审稿
- **辩论/评审型**：A写方案 → B挑毛病 → A修改 → B再审
- **路由型**：调度员判断该把任务分给谁

## 关键设计问题

- **上下文怎么传**：全量传快但爆得快；摘要传省空间但可能丢信息
- **怎么终止**：固定轮数、评审通过、模型自判完成
- **成本控制**：多智能体传话消耗大量token，必须设终止条件`,
    },
    {
      stageNumber: 7, title: '评测、监控与上线', subtitle: '用 Langfuse/LangSmith 让智能体可观测、可迭代', duration: '3-6天',
      topics: ['评测集构建', 'Langfuse/LangSmith 可观测性', 'Trace 调试', '成功率与成本监控', '灰度发布'],
      resources: ['LLM 应用评测指南', 'Langfuse 官方文档', '跑一个评测集实验'],
      description: '把智能体从 demo 带到生产。2026年可观测性工具已经很成熟，Langfuse 开源自托管，LangSmith 深度集成 LangChain。',
      content: `## 为什么智能体需要评测

普通软件输入确定输出确定。智能体同一个问题可能给出不同回答，你需要知道**大多数情况下它做得对不对**。

## 关键指标

- **成功率**：多少比例的任务完成了
- **平均步数**：完成一个任务用了几轮（越多越贵越慢）
- **延迟和成本**：用户等多久、花了多少token
- **RAG质量**：检索相关度（context precision）、生成忠实度（faithfulness）

## 2026年主流可观测性工具

| 工具 | 特点 | 部署方式 |
|------|------|----------|
| **Langfuse** | 开源、自托管、OpenTelemetry支持 | Docker部署 |
| **LangSmith** | LangChain官方、深度集成 | SaaS |
| **Braintrust** | 快速原型、协作友好 | SaaS |

**核心功能都一样**：
- **Trace**：记录每一步LLM调用、工具调用、检索结果
- **Eval**：跑评测集，对比不同版本
- **监控**：成本、延迟、错误率看板

## 迭代节奏

收集失败案例 → 分析Trace定位问题 → 改提示词/工具 → 跑评测确认没改坏 → 上线`,
    },
  ];

  for (const s of stages) {
    const existing = await db.select().from(learningStages).where(eq(learningStages.stageNumber, s.stageNumber)).limit(1);
    if (existing.length === 0) { await db.insert(learningStages).values(s); console.log(`  ✓ 阶段 ${s.stageNumber}: ${s.title}`); }
  }

  const projects = [
    { projectNumber: 1, title: '个人知识问答助手', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段1', '阶段2'], deliverables: ['可用的问答 Demo', '可复用的提示词模板'], description: '基于 RAG 做一个能回答你个人笔记问题的问答助手。', content: '## 项目目标\n做一个简单的 RAG 问答助手：你给它一些文档，它能基于内容回答问题。\n\n## 验收标准\n- 文档里有的问题回答基本正确\n- 文档里没有的问题会说"不知道"而不是编\n- 用 JSON mode 约束输出格式' },
    { projectNumber: 2, title: 'MCP 工具接入实战', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段3'], deliverables: ['一个 MCP Server', '错误处理流程'], description: '写一个 MCP Server 暴露天气查询工具，让任何 MCP 客户端都能用。', content: '## 项目目标\n用 FastMCP 或原生 SDK 写一个天气查询 MCP Server。\n\n## 验收标准\n- 用任意 MCP 客户端能连接并调用工具\n- 支持错误处理和超时\n- 工具描述清晰，模型知道什么时候用' },
    { projectNumber: 3, title: '笔记整理助手', category: '主线', difficulty: '中级', duration: '3天', prerequisites: ['阶段4'], deliverables: ['记忆持久化', '多轮对话一致性'], description: '做一个能记住你之前说过什么的笔记助手，支持长期记忆。', content: '## 项目目标\n多轮对话笔记助手，能记住之前的对话内容。\n\n## 验收标准\n- 多轮对话中能记住前面的关键信息\n- 对话很长时不会爆上下文\n- 能从历史中检索特定信息' },
    { projectNumber: 4, title: 'LangGraph 工作流', category: '主线', difficulty: '中级', duration: '4天', prerequisites: ['阶段5'], deliverables: ['有状态工作流', 'Human-in-the-loop'], description: '用 LangGraph 构建一个带 checkpoint 和人工审批的研究报告生成器。', content: '## 项目目标\n输入一个主题，LangGraph 自动拆解调研步骤，关键节点人工审批后继续。\n\n## 验收标准\n- 用 LangGraph State Graph 建模流程\n- 支持 checkpoint，出错能回放\n- 关键步骤有人工审批节点' },
    { projectNumber: 5, title: '代码审查搭档', category: '主线', difficulty: '高级', duration: '5天', prerequisites: ['阶段3', '阶段5'], deliverables: ['Git 集成', '结构化评审报告'], description: '读取 Git diff，用 MCP 工具调用，输出代码审查意见。', content: '## 项目目标\n输入一个 Git 分支，智能体自动分析改动并输出审查报告。\n\n## 验收标准\n- 能识别真实代码问题\n- 报告按文件/严重程度分组\n- 不编造不存在的代码' },
    { projectNumber: 6, title: 'CrewAI 多角色客服', category: '主线', difficulty: '高级', duration: '6天', prerequisites: ['阶段6'], deliverables: ['智能路由+专员处理', '问题升级机制'], description: '用 CrewAI 模拟客服团队：接待员、技术支持、退款专员。', content: '## 项目目标\n用 CrewAI 的角色化DSL构建客服团队。\n\n## 验收标准\n- 问题能被正确路由到对应角色\n- 不同角色回答风格符合定位\n- 处理不了的能正确升级' },
    { projectNumber: 7, title: '自动化数据分析师', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段3', '阶段5'], deliverables: ['数据分析链', '图表/表格输出'], description: '给智能体一个 CSV，它自动分析数据、发现趋势、输出结论。', content: '## 项目目标\n上传 CSV，智能体自动理解数据、做统计、输出洞察。\n\n## 验收标准\n- 能正确描述基本统计量\n- 能发现明显趋势或异常\n- 关键数字有代码输出支撑' },
    { projectNumber: 8, title: '论文阅读伙伴', category: '专项', difficulty: '中级', duration: '4天', prerequisites: ['阶段2', '阶段4'], deliverables: ['RAG 文档问答', '摘要与追问'], description: '基于 RAG 做一个论文阅读助手，支持长文档分段和追问。', content: '## 项目目标\n输入论文 PDF，输出结构化笔记并支持追问。\n\n## 验收标准\n- 长文档分段处理不丢失信息\n- 能基于论文内容回答追问\n- 不把摘要当结论' },
    { projectNumber: 9, title: '生产级可观测性', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段7'], deliverables: ['Langfuse 接入', '评测脚本'], description: '用 Langfuse 给你的智能体项目加上完整的可观测性和评测。', content: '## 项目目标\n选前面做过的项目，接入 Langfuse，加上评测集和监控。\n\n## 验收标准\n- Langfuse 能 trace 到每一步\n- 评测脚本能一键跑，输出通过率\n- 出问题能从 Trace 定位到哪一步错了' },
  ];

  for (const p of projects) {
    const existing = await db.select().from(practiceProjects).where(eq(practiceProjects.projectNumber, p.projectNumber)).limit(1);
    if (existing.length === 0) { await db.insert(practiceProjects).values(p); console.log(`  ✓ 项目 ${p.projectNumber}: ${p.title}`); }
  }

  const resources = [
    { title: 'LLM 智能体综述', category: '综述', type: '论文', stageNumber: 1, description: '智能体领域经典综述，介绍分类、架构和应用场景。' },
    { title: 'LangGraph 官方教程', category: '框架', type: '官方文档', stageNumber: 5, description: 'LangGraph 状态图、checkpoint、human-in-the-loop 官方教程。' },
    { title: 'CrewAI 官方文档', category: '框架', type: '官方文档', stageNumber: 6, description: '基于角色的多智能体框架，快速原型首选。' },
    { title: 'MCP 官方文档', category: '工具调用', type: '官方文档', stageNumber: 3, description: 'Model Context Protocol 官方文档，2026年工具接入事实标准。' },
    { title: 'OpenAI Agents SDK', category: '框架', type: '官方文档', stageNumber: 1, description: 'OpenAI 官方智能体框架，轻量快速。' },
    { title: '提示工程最佳实践', category: '提示工程', type: '指南', stageNumber: 2, description: '主流模型厂商官方提示工程指南。' },
    { title: 'RAG 评测指南', category: 'RAG', type: '指南', stageNumber: 4, description: '混合检索、重排序、RAG 质量评测最佳实践。' },
    { title: 'Langfuse 官方文档', category: '评测', type: '官方文档', stageNumber: 7, description: '开源 LLM 可观测性平台，支持自托管和 OpenTelemetry。' },
    { title: 'LangSmith 文档', category: '评测', type: '官方文档', stageNumber: 7, description: 'LangChain 官方可观测性和评测平台。' },
    { title: 'ReAct 论文', category: '规划', type: '论文', stageNumber: 5, description: '推理与行动结合的经典论文。' },
    { title: '多智能体系统综述', category: '多智能体', type: '论文', stageNumber: 6, description: '多智能体协作范式综述。' },
    { title: 'FastMCP 快速入门', category: '工具调用', type: '教程', stageNumber: 3, description: '用 Python 快速开发 MCP Server 的教程。' },
  ];
  for (const r of resources) {
    const existing = await db.select().from(learningResources).where(eq(learningResources.title, r.title)).limit(1);
    if (existing.length === 0) await db.insert(learningResources).values(r);
  }

  const exps = [
    { expNumber: 1, title: '第一个 Hello Agent', category: '入门', difficulty: '简单', duration: '30分钟', description: '用最少代码跑通一个智能体循环。', content: '20行以内脚本，输入问题调用模型返回回答。' },
    { expNumber: 2, title: '设计你的提示词', category: '提示工程', difficulty: '简单', duration: '1小时', description: '对比不同提示词的效果。', content: '同一任务测试3种提示词写法。' },
    { expNumber: 3, title: '写第一个 MCP Server', category: 'MCP', difficulty: '中等', duration: '1.5小时', description: '用 FastMCP 写一个简单的工具服务。', content: '实现一个计算器 MCP Server，用 MCP Inspector 测试。' },
    { expNumber: 4, title: '上下文窗口实验', category: '记忆', difficulty: '中等', duration: '1小时', description: '观察长对话中的遗忘现象。', content: '连续对话20轮观察何时"失忆"。' },
    { expNumber: 5, title: 'LangGraph 第一个图', category: '规划', difficulty: '中等', duration: '2小时', description: '用 LangGraph 构建第一个有状态工作流。', content: '实现一个简单的调研→写作工作流，加 checkpoint。' },
    { expNumber: 6, title: 'CrewAI 双角色对话', category: '多智能体', difficulty: '困难', duration: '2小时', description: '用 CrewAI 实现评审循环。', content: 'A写初稿B挑毛病，观察最终质量。' },
    { expNumber: 7, title: '接入 Langfuse Trace', category: '评测', difficulty: '中等', duration: '1.5小时', description: '给你的智能体加上完整追踪。', content: '接入 Langfuse，查看每一步 LLM 调用和工具调用。' },
    { expNumber: 8, title: '跑一个评测集', category: '评测', difficulty: '中等', duration: '1.5小时', description: '用固定测试集衡量智能体表现。', content: '10条用例，统计通过率。' },
  ];
  for (const e of exps) {
    const existing = await db.select().from(experiments).where(eq(experiments.expNumber, e.expNumber)).limit(1);
    if (existing.length === 0) await db.insert(experiments).values(e);
  }

  console.log('种子数据初始化完成！');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
