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
      stageNumber: 1, title: '智能体核心概念', subtitle: '理解什么是智能体，与传统程序的区别', duration: '3-5天',
      topics: ['智能体定义', '感知-决策-行动循环', 'LLM 作为推理引擎', '工具调用基础', '自主 vs 半自动'],
      resources: ['LLM 智能体综述', 'ReAct 论文'],
      description: '从最基础的概念出发，建立对智能体的整体认知。理解智能体和传统聊天机器人、自动化脚本的本质区别。',
      content: `## 什么是智能体

智能体（Agent）是一个以大语言模型为推理核心，能够**感知环境、自主决策、调用工具、执行行动**的系统。

它和传统程序的区别：
- **传统程序**：流程是人写死的，输入→固定逻辑→输出
- **智能体**：流程是模型动态决策的，模型根据目标和观察自己决定下一步做什么

## 核心循环：感知 → 思考 → 行动

一个最小的智能体循环：
1. **感知**：接收用户输入、工具返回结果、环境状态
2. **思考**：LLM 根据当前观察和目标，决定下一步做什么
3. **行动**：需要调工具就生成调用，任务完成就输出答案

这个循环不断重复，直到任务完成或达到步数上限。

## LLM 在其中扮演什么角色

LLM 不是在"写代码"，而是在做**推理和决策**：理解用户要什么、判断进展到哪一步、决定下一步调哪个工具、综合结果形成回答。

## 本阶段目标

完成后你应该能：
- 用自己的话解释智能体和普通聊天机器人的区别
- 画出智能体的核心循环图
- 说清楚 LLM 负责什么、不负责什么`,
    },
    {
      stageNumber: 2, title: '提示工程基础', subtitle: '写出可控、可复现的提示词', duration: '2-4天',
      topics: ['系统提示词设计', '角色设定', 'Few-shot 示例', '思维链 CoT', '结构化输出约束'],
      resources: ['提示工程最佳实践'],
      description: '掌握提示词工程的核心技巧。好的提示词是智能体行为可控、结果可复现的基础。',
      content: `## 为什么提示词是智能体的"代码"

在传统程序里逻辑写在代码里；在智能体里，**逻辑写在提示词里**。同一个模型，不同提示词，行为天差地别。

## 系统提示词的结构

一个靠谱的系统提示词通常包含：
1. **角色**：你是谁
2. **任务**：你要做什么
3. **约束**：不能做什么
4. **输出格式**：怎么输出

## Few-shot：给例子比讲道理管用

当你希望模型按某种格式或风格输出时，给 2-3 个输入→输出示例，比写一大段描述效果好得多。

## 思维链（Chain of Thought）

当任务需要多步推理时，让模型"一步步想"，准确率会显著提升。这也是后续"规划"阶段的基础。

## 常见坑

- 提示词太长导致关键指令被忽略 → 把最重要的放开头和结尾
- 约束太模糊 → 用具体的正反例
- 一次塞太多任务 → 拆成多个子任务`,
    },
    {
      stageNumber: 3, title: '工具与函数调用', subtitle: '让智能体能调用外部能力', duration: '4-6天',
      topics: ['Function Calling 协议', '工具描述规范', '参数 schema 设计', '错误处理与重试', '多工具编排'],
      resources: ['Function Calling 文档', '接入计算器工具实验'],
      description: '学习如何为智能体接入真实工具。工具是智能体从"只会说话"变成"能做事"的关键。',
      content: `## Function Calling 是什么

Function Calling 是现代 LLM 的一种能力：你告诉模型有哪些工具可用（名称、描述、参数 schema），模型在需要时输出结构化的工具调用请求，而不是直接生成文字。

## 一次完整的工具调用流程

1. 把工具定义传给模型
2. 模型判断需要调用，返回 \`{name, arguments}\`
3. 你的代码执行工具，把结果传回模型
4. 模型根据结果继续推理或给出最终回答

## 工具描述怎么写才好

工具描述是**写给模型看的**——模型靠它决定什么时候用。好的描述应该：
- 说清楚做什么
- 说清楚什么时候该用、什么时候不该用
- 参数名有意义，description 具体

## 错误处理

工具可能失败。智能体的健壮性取决于你怎么把错误信息喂回给模型：
- 不要吞掉错误，原样传回
- 让模型自己判断重试、换参数还是告知用户失败
- 设置最大重试次数，防止死循环`,
    },
    {
      stageNumber: 4, title: '记忆与上下文管理', subtitle: '让智能体记住并善用历史', duration: '3-5天',
      topics: ['短期对话记忆', '长期记忆存储', '上下文窗口优化', '记忆检索 RAG', '记忆淘汰策略'],
      resources: ['记忆系统设计模式', '上下文窗口实验'],
      description: '理解智能体的记忆机制。没有记忆的智能体每轮对话都从零开始，无法完成复杂任务。',
      content: `## 记忆的三个层次

1. **短期记忆**：当前对话历史，存在上下文窗口里
2. **长期记忆**：用户偏好、过去结论，存在外部数据库
3. **工作记忆**：当前任务的中间结果、计划草稿

## 上下文窗口不是无限的

LLM 上下文窗口有限。对话一长，早期消息就被挤出去。常见策略：
- **摘要**：把早期对话总结成一段
- **截断**：只保留最近 N 轮
- **RAG**：历史对话向量化，按需检索

## 长期记忆怎么做

- 用户偏好 → 存入用户档案，每轮自动注入
- 事实性结论 → 存入知识库，按需检索
- 对话历史 → 向量化，相似度检索

## 不要什么都记

记忆不是越多越好。噪声记忆会干扰模型。好的记忆系统：
- 只存值得记住的信息
- 有遗忘/更新机制
- 检索时只注入最相关的几条`,
    },
    {
      stageNumber: 5, title: '规划与任务分解', subtitle: '让智能体自主拆解复杂任务', duration: '4-7天',
      topics: ['任务分解策略', 'Plan-and-Execute', '反思与自我修正', '子任务编排', '进度追踪'],
      resources: ['ReAct 论文', '任务分解练习实验'],
      description: '构建能处理复杂任务的智能体。复杂任务一步做不完，需要拆成小步骤、按计划执行、随时调整。',
      content: `## 为什么需要规划

简单任务一步完成。复杂任务（如"调研三个竞品写对比报告"）需要查 A、查 B、查 C、整理对比、写报告。直接丢给模型容易跑偏或遗漏。

## 两种主流模式

### Plan-and-Execute
模型先输出完整计划 → 按步骤执行 → 执行完检查。

### ReAct（推理+行动）
每一步：思考 → 行动 → 观察 → 再思考。更灵活但可能跑偏。

## 反思机制

执行完一步后让模型自评：结果对吗？和预期一致吗？需要调整计划吗？这能显著降低"一条路走到黑"的错误率。

## 进度追踪

复杂任务可能跑几十步，需要记录当前到第几步、每步结果、哪些还没做。通常用一个状态对象维护。`,
    },
    {
      stageNumber: 6, title: '多智能体协作', subtitle: '多个智能体如何分工配合', duration: '5-8天',
      topics: ['角色分工', '消息传递', '评审与对抗', '团队模式', '上下文隔离'],
      resources: ['多智能体系统综述', '两个智能体对话实验'],
      description: '从单智能体到多智能体系统。当一个智能体处理不过来或需要不同视角时，多个智能体分工协作效果更好。',
      content: `## 为什么需要多个智能体

- 一个提示词塞太多角色，模型容易精神分裂
- 没有自我批判，容易一本正经地胡说
- 上下文窗口被多个角色共用，很快塞满

多智能体的思路：**每个智能体只干一件事，用专门的提示词。**

## 常见角色模式

- **流水线型**：A 调研 → B 写稿 → C 审稿 → 定稿
- **辩论/评审型**：A 写方案 → B 挑毛病 → A 修改 → B 再审
- **路由型**：调度员判断该把任务分给谁

## 关键设计问题

- **上下文怎么传**：全量传简单但爆得快；摘要传省空间但可能丢信息
- **怎么终止**：固定轮数、评审通过就停、模型自判完成

## 注意事项

多智能体 ≠ 一定更好。简单任务一个智能体就够。智能体之间传话消耗大量 token，一定要有终止条件。`,
    },
    {
      stageNumber: 7, title: '评测与上线', subtitle: '让智能体可度量、可维护', duration: '3-6天',
      topics: ['评测集构建', '成功率与延迟', '监控与日志', '灰度发布', '成本控制'],
      resources: ['LLM 应用评测指南', '跑一个评测集实验', '调试失败案例实验'],
      description: '把智能体从 demo 带到生产。能跑起来和能用住是两回事，需要评测、监控、迭代。',
      content: `## 为什么智能体需要评测

普通软件输入确定输出确定。智能体同一个问题可能给出不同回答，你需要知道**大多数情况下它做得对不对**。

## 怎么构建评测集

1. 收集真实用户问题或设计典型场景
2. 每个问题标注期望结果或评分标准
3. 跑批量测试，统计通过率

## 关键指标

- **成功率**：多少比例的任务完成了
- **平均步数**：完成一个任务用了几轮（越多越贵越慢）
- **延迟**：用户等多久
- **成本**：每个任务消耗多少 token

## 上线后监控

- 记录每轮对话和工具调用（出问题能回溯）
- 监控失败率、耗时、token 消耗
- 定期收集 bad case，加入评测集

## 迭代节奏

收集失败案例 → 分析原因 → 改提示词/工具/模型 → 跑评测确认没改坏 → 上线。`,
    },
  ];

  for (const s of stages) {
    const existing = await db.select().from(learningStages).where(eq(learningStages.stageNumber, s.stageNumber)).limit(1);
    if (existing.length === 0) { await db.insert(learningStages).values(s); console.log(`  ✓ 阶段 ${s.stageNumber}: ${s.title}`); }
  }

  const projects = [
    { projectNumber: 1, title: '个人知识问答助手', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段1', '阶段2'], deliverables: ['可用的问答 Demo', '可复用的提示词模板'], description: '做一个能回答你个人笔记/文档问题的问答助手。重点练习提示词设计。', content: '## 项目目标\n做一个简单的问答助手：你给它一段文本，它能基于内容回答问题。\n\n## 验收标准\n- 文档里有的问题回答基本正确\n- 文档里没有的问题助手会说"不知道"而不是编\n- 提示词整理成可复用模板' },
    { projectNumber: 2, title: '天气查询智能体', category: '主线', difficulty: '入门', duration: '2天', prerequisites: ['阶段3'], deliverables: ['接入真实 API', '错误处理流程'], description: '给智能体接入一个真实天气 API，让它能回答"北京今天天气怎么样"。', content: '## 项目目标\n实现一个能调用天气 API 的智能体。\n\n## 验收标准\n- 能正确查询 3 个城市的天气\n- API 报错时友好提示不崩溃\n- 用户不需要知道背后调了 API' },
    { projectNumber: 3, title: '笔记整理助手', category: '主线', difficulty: '中级', duration: '3天', prerequisites: ['阶段4'], deliverables: ['记忆持久化', '多轮对话一致性'], description: '做一个能记住你之前说过什么的笔记助手。重点练习记忆管理。', content: '## 项目目标\n多轮对话的笔记助手，能记住之前的对话内容。\n\n## 验收标准\n- 多轮对话中能记住前面的关键信息\n- 对话很长时不会爆上下文\n- 能从历史中检索特定信息' },
    { projectNumber: 4, title: '研究报告生成器', category: '主线', difficulty: '中级', duration: '4天', prerequisites: ['阶段5'], deliverables: ['任务分解能力', '多步执行流程'], description: '输入一个主题，智能体自动调研并生成结构化报告。重点练习任务规划。', content: '## 项目目标\n输入"对比 React 和 Vue"，智能体自动拆解调研步骤、执行、输出报告。\n\n## 验收标准\n- 先拆解任务再执行，不是一步到位\n- 报告有清晰结构\n- 执行过程可追溯' },
    { projectNumber: 5, title: '代码审查搭档', category: '主线', difficulty: '高级', duration: '5天', prerequisites: ['阶段3', '阶段5'], deliverables: ['Git 集成', '结构化评审报告'], description: '读取 Git diff，输出代码审查意见。综合运用工具调用和规划。', content: '## 项目目标\n输入一个 Git 分支，智能体自动分析改动并输出审查报告。\n\n## 验收标准\n- 能识别真实代码问题\n- 报告按文件/严重程度分组\n- 不编造不存在的代码' },
    { projectNumber: 6, title: '多角色客服团队', category: '主线', difficulty: '高级', duration: '6天', prerequisites: ['阶段6'], deliverables: ['智能路由+专员处理', '问题升级机制'], description: '模拟客服团队：接待员、技术支持、退款专员多智能体协作。', content: '## 项目目标\n用户问题进来，路由智能体判断类型，转给对应专员处理。\n\n## 验收标准\n- 问题能被正确路由\n- 不同角色回答风格符合定位\n- 处理不了的能正确升级' },
    { projectNumber: 7, title: '自动化数据分析师', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段3', '阶段5'], deliverables: ['数据分析链', '图表/表格输出'], description: '给智能体一个 CSV，它自动分析数据、发现趋势、输出结论。', content: '## 项目目标\n上传 CSV，智能体自动理解数据、做统计、输出洞察。\n\n## 验收标准\n- 能正确描述基本统计量\n- 能发现明显趋势或异常\n- 关键数字有代码输出支撑' },
    { projectNumber: 8, title: '论文阅读伙伴', category: '专项', difficulty: '中级', duration: '4天', prerequisites: ['阶段2', '阶段4'], deliverables: ['PDF 解析能力', '摘要与问答'], description: '丢一篇论文 PDF，帮你快速理解核心贡献、方法和结论。', content: '## 项目目标\n输入论文 PDF，输出结构化笔记：研究问题、方法、实验、结论、疑问。\n\n## 验收标准\n- 输出结构完整\n- 能基于论文回答追问\n- 不把摘要当结论' },
    { projectNumber: 9, title: '生产级智能体运维', category: '专项', difficulty: '高级', duration: '5天', prerequisites: ['阶段7'], deliverables: ['评测脚本', '基础监控面板'], description: '把前面做的项目加上评测、日志、监控，达到能上线的水平。', content: '## 项目目标\n选前面做过的项目，加上生产级"保护伞"：评测集、日志、错误告警。\n\n## 验收标准\n- 评测脚本能一键跑，输出通过率\n- 出问题能从日志定位\n- 改完代码跑一遍评测确认没改坏' },
  ];

  for (const p of projects) {
    const existing = await db.select().from(practiceProjects).where(eq(practiceProjects.projectNumber, p.projectNumber)).limit(1);
    if (existing.length === 0) { await db.insert(practiceProjects).values(p); console.log(`  ✓ 项目 ${p.projectNumber}: ${p.title}`); }
  }

  const resources = [
    { title: 'LLM 智能体综述', category: '综述', type: '论文', stageNumber: 1, description: '智能体领域经典综述，介绍分类、架构和应用场景。' },
    { title: '提示工程最佳实践', category: '提示工程', type: '指南', stageNumber: 2, description: '主流模型厂商官方提示工程指南。' },
    { title: 'Function Calling 文档', category: '工具调用', type: '官方文档', stageNumber: 3, description: '主流模型 Function Calling 接口说明。' },
    { title: '记忆系统设计模式', category: '记忆', type: '文章', stageNumber: 4, description: '智能体记忆架构综述：短期/长期/RAG/淘汰。' },
    { title: 'ReAct 论文', category: '规划', type: '论文', stageNumber: 5, description: '推理与行动结合的经典论文。' },
    { title: '多智能体系统综述', category: '多智能体', type: '论文', stageNumber: 6, description: '多智能体协作范式综述。' },
    { title: 'LLM 应用评测指南', category: '评测', type: '指南', stageNumber: 7, description: '评测集构建、指标、回归测试指南。' },
    { title: 'OpenAI Agents 文档', category: '工具调用', type: '官方文档', stageNumber: 3, description: 'OpenAI Agents SDK 官方文档。' },
    { title: 'LangChain 概念指南', category: '框架', type: '教程', stageNumber: 1, description: 'LangChain 核心概念快速入门。' },
    { title: 'Drizzle ORM 文档', category: '工程', type: '官方文档', stageNumber: 7, description: 'TypeScript ORM 官方文档。' },
  ];
  for (const r of resources) {
    const existing = await db.select().from(learningResources).where(eq(learningResources.title, r.title)).limit(1);
    if (existing.length === 0) await db.insert(learningResources).values(r);
  }

  const exps = [
    { expNumber: 1, title: '第一个 Hello Agent', category: '入门', difficulty: '简单', duration: '30分钟', description: '用最少代码跑通一个智能体循环。', content: '20行以内脚本，输入问题调用模型返回回答。' },
    { expNumber: 2, title: '设计你的提示词', category: '提示工程', difficulty: '简单', duration: '1小时', description: '对比不同提示词的效果。', content: '同一任务测试3种提示词写法。' },
    { expNumber: 3, title: '接入计算器工具', category: '工具调用', difficulty: '中等', duration: '1.5小时', description: '实现带计算能力的智能体。', content: '写 calculate 工具，处理数学题。' },
    { expNumber: 4, title: '上下文窗口实验', category: '记忆', difficulty: '中等', duration: '1小时', description: '观察长对话中的遗忘现象。', content: '连续对话20轮观察何时"失忆"。' },
    { expNumber: 5, title: '任务分解练习', category: '规划', difficulty: '中等', duration: '2小时', description: '让智能体拆解真实任务。', content: '给复杂任务，观察规划能力。' },
    { expNumber: 6, title: '两个智能体对话', category: '多智能体', difficulty: '困难', duration: '2小时', description: '实现讨论-评审循环。', content: 'A写初稿B挑毛病，观察最终质量。' },
    { expNumber: 7, title: '跑一个评测集', category: '评测', difficulty: '中等', duration: '1.5小时', description: '用固定测试集衡量智能体表现。', content: '10条用例，统计通过率。' },
    { expNumber: 8, title: '调试失败案例', category: '工程实践', difficulty: '困难', duration: '2小时', description: '分析真实失败 trace 并修复。', content: '逐步 trace，定位问题类型。' },
  ];
  for (const e of exps) {
    const existing = await db.select().from(experiments).where(eq(experiments.expNumber, e.expNumber)).limit(1);
    if (existing.length === 0) await db.insert(experiments).values(e);
  }

  console.log('种子数据初始化完成！');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
