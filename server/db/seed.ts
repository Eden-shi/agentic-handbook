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
    // ===== 阶段1：零代码，建立直觉 =====
    {
      stageNumber: 1,
      title: '认识智能体',
      subtitle: '不用写代码，先搞懂智能体是什么',
      duration: '1-2天',
      topics: ['智能体 vs 聊天机器人', '感知-决策-行动循环', 'LLM 扮演什么角色', '为什么需要工具'],
      resources: ['LLM 智能体综述'],
      description: '完全零代码入门。先建立直觉：智能体到底是什么，和你平时用的ChatGPT有什么区别，它为什么需要"工具"。',
      content: `## 这一阶段你要学什么

这一阶段**不用写代码**。目标只有一个：搞懂"智能体"这个词到底指什么，以及它和你平时用的聊天机器人有什么本质区别。

## 先做个小实验

打开任意一个聊天AI（ChatGPT、Claude、豆包都行），问它：

> "帮我算一下 12345 × 67890 等于多少？"

观察它的回答。它可能会：
- 给出一个计算结果，但可能算错
- 或者说"我帮你算一下"然后给出一个数字

问题来了：**它真的"算"了吗？** 没有。它只是在"猜"答案——根据训练数据中类似的计算模式，生成一个看起来对的数字。这就是为什么大模型做数学题经常出错。

## 智能体和聊天机器人的区别

普通聊天机器人：你问一句，它答一句。它不知道现在几点、不知道你的数据库里有什么、不能帮你发邮件。

智能体：它有**手**和**眼睛**。它能：
- 查日历知道今天是什么日子
- 查数据库知道你的订单状态
- 调用计算器真的算出 12345 × 67890
- 调用搜索查最新的新闻

## 智能体的核心循环

一个最小的智能体，一直在做这三件事的循环：

1. **感知**：看看现在的情况（用户说了什么、工具返回了什么结果）
2. **思考**：LLM 想一下，下一步该干嘛
3. **行动**：如果需要调工具就调工具，不需要就直接回答用户

这个循环一直重复，直到模型说"任务完成了，这是最终答案"。

## 为什么要先学这个再写代码

很多人一上来就写代码，结果写了一堆但不知道自己在干嘛。先把这个循环想清楚，后面每写一行代码你都知道它在循环里扮演什么角色。

## 本阶段练习（不用写代码）

1. 想三个你平时用聊天AI做不到、但"如果它能调用工具就能做到"的事情
2. 把这三件事分别对应到"感知→思考→行动"循环里
3. 想一下：哪一步是LLM做的，哪一步是你的代码做的？

## 常见误区

- ❌ "智能体就是更聪明的聊天机器人"——不对，核心区别是能不能**调用外部能力**
- ❌ "LLM自己什么都能做"——不对，LLM只会生成文字，工具是你的代码提供的
- ❌ "智能体很复杂"——最小的智能体循环其实就20行代码，下一阶段就写`,
    },

    // ===== 阶段2：第一次代码，调API =====
    {
      stageNumber: 2,
      title: '第一次调用 LLM API',
      subtitle: '写人生第一段智能体代码，跑通一个最简单的调用',
      duration: '2-3天',
      topics: ['选模型和获取API Key', '第一个Hello World', 'temperature 参数', 'system vs user 消息'],
      resources: ['OpenAI API 快速开始'],
      description: '从这一阶段开始写代码。目标是用最少的代码跑通一次LLM调用，理解最基本的参数含义。',
      content: `## 这一阶段你要学什么

写出你的**第一行智能体代码**：用几行代码，让LLM回答你的问题。不接工具、不搞复杂架构，先把最基本的调用跑通。

## 第一步：选一个模型平台

你需要一个能调用大模型API的账号。2026年主流选择：

| 平台 | 特点 | 适合 |
|------|------|------|
| OpenAI | 生态最成熟，文档全 | 有信用卡、能访问海外 |
| Anthropic Claude | 长文本和推理强 | 同上 |
| 国产模型（DeepSeek/通义/豆包） | 国内直连，便宜 | 国内用户首选 |

不管选哪个，调用方式都差不多——HTTP请求，传messages，拿回复。

## 第二步：写第一个调用

以 OpenAI SDK 为例（其他平台用法几乎一样）：

\`\`\`typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: '你是一个友好的助手。' },
      { role: 'user', content: '你好，介绍一下你自己。' },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
\`\`\`

跑起来，你应该能看到模型的自我介绍。恭喜，你已经跑通了最基本的LLM调用！

## 关键参数理解

**system 消息 vs user 消息：**
- system：给模型的"角色设定"和规则，在对话开始前设定好
- user：用户说的话

**temperature：**
- 0 = 每次回答基本一样，适合需要稳定输出的场景
- 1 = 更有创意，但也更容易胡说
- 刚开始学就用 0.7 左右

**max_tokens：**
- 控制回答最长多长。新手不用管，用默认值就行。

## 练习任务

1. 写一个程序，让模型扮演某个角色（比如"你是一个Python老师"），然后和它对话3轮
2. 试试把 temperature 调到 0 和 1，问同一个问题5次，对比回答有什么不同
3. 试试写一个system prompt："你只能回答Python相关的问题，其他问题说不知道"

## 常见坑

- API Key 放代码里提交到GitHub了 → **永远用环境变量**
- 网络不通 → 国内用海外模型可能需要代理，或者换国产模型
- 401错误 → API Key错了或者没填对
- 429错误 → 额度用完了或者请求太频繁

## 下一阶段预告

这一阶段你只是"调模型聊天"。下一阶段我们学怎么写好提示词，让模型输出更可控。`,
    },

    // ===== 阶段3：提示词工程 =====
    {
      stageNumber: 3,
      title: '提示词工程',
      subtitle: '学会怎么"和模型说话"，让输出可控可复现',
      duration: '3-4天',
      topics: ['系统提示词结构', 'Few-shot 示例', '结构化输出 JSON', '思维链提示', '常见提示词坑'],
      resources: ['提示工程最佳实践', '结构化输出指南'],
      description: '还是纯对话（不接工具），但学会写好提示词。这是智能体开发的基本功——提示词写不好，后面接再多工具也白搭。',
      content: `## 这一阶段你要学什么

上一阶段你已经能调模型了。这一阶段解决一个问题：**怎么让模型输出你想要的东西，而不是自由发挥。**

智能体的行为很大程度上由提示词决定。提示词就是智能体的"代码"——写得好，模型听话；写得烂，模型胡说八道。

## 系统提示词的四要素

一个靠谱的系统提示词，通常包含四部分：

\`\`\`
# 角色
你是一个代码审查助手。

# 任务
用户给你一段代码，你找出其中的bug和改进建议。

# 约束
- 不要编造不存在的API
- 不确定的地方说"不确定"，不要猜
- 只说真正的问题，不要泛泛而谈

# 输出格式
用JSON输出，格式：
{
  "issues": [{"severity": "high/medium/low", "description": "..."}],
  "summary": "..."
}
\`\`\`

把这四部分写清楚，模型的输出质量会立刻提升一个档次。

## Few-shot：给例子比讲道理管用

光靠文字描述要求，模型可能不理解。最好的办法是给一两个例子：

\`\`\`
用户: 计算 2+3
助手: {"result": 5}

用户: 计算 10*4
助手: {"result": 40}

用户: 计算 8+1
助手:
\`\`\`

模型一看例子就知道该怎么输出了。**给2-3个例子，比写一大段描述效果好得多。**

## 结构化输出（2026年新方式）

以前要让模型输出JSON，得在提示词里反复强调"请输出JSON格式"，模型还经常不遵守。

现在主流模型都支持**结构化输出**——你直接给它一个JSON Schema，模型会严格按格式输出，不会出错。

Python示例：
\`\`\`python
from pydantic import BaseModel

class ReviewResult(BaseModel):
    issues: list[str]
    severity: str

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "审查这段代码..."}],
    response_format=ReviewResult,  # 直接传schema
)
\`\`\`

这比在提示词里写"请输出JSON"可靠多了。

## 思维链（Chain of Thought）

当任务需要多步推理时，直接问模型答案，它容易跳步出错。

技巧：在提示词里加一句"请一步步思考"，或者让它先输出推理过程再给答案：

\`\`\`
请先分析问题，一步步思考，最后给出答案。
\`\`\`

这叫思维链提示，准确率会显著提升。

## 练习任务

1. 写一个系统提示词，让模型扮演"英语老师"，纠正用户的语法错误
2. 用 Few-shot 教模型把自由文本转换成固定格式
3. 试试结构化输出，让模型输出一个包含标题和摘要的JSON
4. 拿同一个问题，用不同的提示词问3次，对比输出差异

## 常见坑

- **提示词太长**：重要指令被淹没了 → 把最重要的放开头和结尾
- **约束太模糊**："写得好一点"不算约束 → 用具体的例子说明什么叫好
- **一次塞太多任务**：让模型同时做好几件事，结果每件都做不好 → 拆成多个任务

## 下一阶段预告

现在你已经能让模型输出可控了。下一阶段我们让模型**调用工具**——从"只会说话"变成"能做事"。`,
    },

    // ===== 阶段4：工具调用入门 =====
    {
      stageNumber: 4,
      title: '工具调用入门',
      subtitle: '让智能体第一次"动手做事"——Function Calling',
      duration: '4-5天',
      topics: ['Function Calling 原理', '定义第一个工具', '处理工具调用响应', '工具结果回传', '错误处理'],
      resources: ['Function Calling 官方文档'],
      description: '从这一阶段开始，你的智能体不再只会聊天了。学会怎么定义工具、怎么让模型决定调工具、怎么把结果喂回去。',
      content: `## 这一阶段你要学什么

到目前为止，你的智能体只会"说"。这一阶段让它第一次"做"——学会调用工具。

我们从最简单的工具开始：**计算器**。让模型遇到数学问题时，真的调用计算器算，而不是自己瞎猜。

## Function Calling 是什么

普通对话：你发消息 → 模型回消息

工具调用：你发消息（附带可用工具列表）→ 模型说"我要调用XX工具" → 你执行工具 → 把结果给模型 → 模型基于结果回答

## 第一步：定义一个工具

你需要告诉模型有哪些工具可用，每个工具接受什么参数：

\`\`\`python
tools = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "计算两个数字的运算。当用户问数学问题时使用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {"type": "number", "description": "第一个数字"},
                    "b": {"type": "number", "description": "第二个数字"},
                    "operation": {
                        "type": "string",
                        "enum": ["add", "subtract", "multiply", "divide"],
                        "description": "运算类型"
                    }
                },
                "required": ["a", "b", "operation"]
            }
        }
    }
]
\`\`\`

注意几个关键点：
- **description 是写给模型看的**，模型靠它判断什么时候用这个工具
- 参数名要有意义，description 要具体
- required 里的参数必须填上

## 第二步：调用模型，看它要不要用工具

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "帮我算一下 123 * 456"}],
    tools=tools,
)

msg = response.choices[0].message
print(msg.tool_calls)  # 模型要调用工具
\`\`\`

模型会返回类似这样的结构：
\`\`\`json
{
  "tool_calls": [{
    "id": "call_abc123",
    "function": {
      "name": "calculator",
      "arguments": '{"a": 123, "b": 456, "operation": "multiply"}'
    }
  }]
}
\`\`\`

## 第三步：执行工具，把结果喂回去

\`\`\`python
# 把模型的决定加入对话历史
messages.append(msg)

# 执行计算器
args = json.loads(msg.tool_calls[0].function.arguments)
result = calculate(args["a"], args["b"], args["operation"])

# 把工具结果作为新消息发给模型
messages.append({
    "role": "tool",
    "tool_call_id": msg.tool_calls[0].id,
    "content": str(result),  # 56088
})

# 再调一次模型，让它基于工具结果回答
final_response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
)
print(final_response.choices[0].message.content)
\`\`\`

这就是一个完整的"感知→思考→行动"循环！

## 错误处理

工具可能失败（API超时、参数不对、数据库连不上）。关键原则：

**不要吞掉错误，把错误信息原样传回给模型。**

\`\`\`python
try:
    result = call_external_api(...)
except Exception as e:
    result = f"调用失败: {str(e)}"  # 把错误给模型看

messages.append({
    "role": "tool",
    "tool_call_id": ...,
    "content": result,
})
\`\`\`

模型看到错误后，会自己决定：重试？换个参数？还是告诉用户失败了。这比你硬编码"失败了就报错"智能多了。

但要加个**最大重试次数**，防止模型陷入死循环。

## 练习任务

1. 实现一个计算器工具，支持加减乘除
2. 实现一个天气查询工具（调用一个免费天气API）
3. 测试：故意问一个需要调工具的问题，观察模型的决策过程
4. 测试：工具报错时，模型会怎么处理

## 常见坑

- 工具描述写得不清楚 → 模型不知道什么时候用，或者乱用
- 参数名是 a, b, c → 模型不知道该传什么，改成有意义的名字
- 忘了把 tool 消息加回 messages → 模型不知道工具调用的结果
- 没有最大步数限制 → 模型一直调工具停不下来

## 下一阶段预告

你已经会写一个工具了。但如果有10个工具呢？每个都写一遍集成？下一阶段学 MCP——一个标准协议，写一次到处用。`,
    },

    // ===== 阶段5：MCP协议 =====
    {
      stageNumber: 5,
      title: 'MCP 协议与工具生态',
      subtitle: '用标准协议接入工具，写一次到处用',
      duration: '4-6天',
      topics: ['MCP 是什么', 'MCP 核心概念', '写一个 MCP Server', '连接现有 MCP 工具', 'MCP 安全与权限'],
      resources: ['MCP 官方文档', 'FastMCP 快速入门'],
      description: '上一阶段你写了一个计算器工具。但如果每个工具都要单独写集成，N个工具×M个应用=NM次工作。MCP 解决的就是这个问题。',
      content: `## 这一阶段你要学什么

上一阶段你学会了怎么给模型加一个工具。现在想一个问题：

你写了一个天气查询工具，很好用。但如果以后你做另一个智能体项目，又要重新写一遍天气集成？如果别人写的工具你也想用呢？

**MCP（Model Context Protocol）就是解决这个问题的标准协议。**

## MCP 解决了什么问题

没有 MCP 的世界：
- 你给 Claude 写了一个 GitHub 集成
- 又给 Cursor 写了一个 GitHub 集成
- 又给另一个AI写了一个 GitHub 集成
- 每个AI应用都要单独对接每个工具

有 MCP 的世界：
- 工具开发者写一个 MCP Server（GitHub MCP Server）
- 所有支持 MCP 的AI应用（Claude/Cursor/OpenAI/...）都能直接用
- 就像 USB-C 接口——一个线充所有手机

截至2026年，MCP 已经是事实标准，Anthropic、OpenAI、Google 都已支持，SDK 月下载量超过9700万。

## MCP 三个核心概念

**Resources（资源）**：能读取的数据。比如文件内容、数据库记录、网页。
**Tools（工具）**：能执行的操作。比如发邮件、创建issue、查询天气。
**Prompts（提示模板）**：预定义的提示词模板。

你的智能体作为 **MCP Client**，连接各种 **MCP Server**，Server 提供工具，Client 调用。

## 写一个最简单的 MCP Server

用 FastMCP（Python）写一个计算器 MCP Server：

\`\`\`python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")

@mcp.tool()
def add(a: float, b: float) -> float:
    """计算两个数的和"""
    return a + b

@mcp.tool()
def multiply(a: float, b: float) -> float:
    """计算两个数的乘积"""
    return a * b

if __name__ == "__main__":
    mcp.run()  # 默认 stdio 传输
\`\`\`

就这么简单！这个 Server 跑起来后，任何支持 MCP 的客户端都能连接它，发现 add 和 multiply 两个工具。

## 连接 MCP Server

在你的智能体代码里，连接这个 MCP Server：

\`\`\`python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # 连接到计算器 MCP Server
    server_params = StdioServerParameters(
        command="python",
        args=["calculator_server.py"],
    )
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            # 发现可用工具
            tools = await session.list_tools()
            # 调用工具
            result = await session.call_tool("add", {"a": 3, "b": 5})
            print(result.content[0].text)  # 8
\`\`\`

## 现成的 MCP 工具

不用什么都自己写。社区已经有大量现成的 MCP Server：
- 文件系统 MCP（读写本地文件）
- GitHub MCP（操作仓库、issues）
- 数据库 MCP（查询PostgreSQL/SQLite）
- 浏览器 MCP（自动化操作网页）
- 搜索 MCP（调用搜索API）

你直接连接这些 MCP Server，就能立刻获得这些能力。

## 练习任务

1. 用 FastMCP 写一个计算器 MCP Server
2. 用 MCP Inspector 连接并测试你的 Server
3. 找一个现成的开源 MCP Server（比如文件系统），连接到你的智能体
4. 让你的智能体能读取本地文件内容

## 常见坑

- MCP 工具的 description 写不清楚 → 模型不知道什么时候用
- 传输方式搞错 → stdio 是本地进程，HTTP SSE 是远程服务
- 安全问题 → MCP Server 能操作你的文件系统，不要连不信任的Server

## 下一阶段预告

现在你的智能体能调用各种工具了。但它"记性不好"——每次对话都从零开始。下一阶段加记忆和知识库。`,
    },

    // ===== 阶段6：记忆与RAG =====
    {
      stageNumber: 6,
      title: '记忆与 RAG',
      subtitle: '让智能体记住历史，查阅资料',
      duration: '5-7天',
      topics: ['对话历史管理', '上下文窗口优化', 'RAG 基础知识', '向量检索', '记忆存储策略'],
      resources: ['RAG 实战指南', 'LangChain RAG 教程'],
      description: '现在你的智能体每次对话都从零开始。这一阶段让它"记住"之前说过什么，还能从你的文档里查资料。',
      content: `## 这一阶段你要学什么

到目前为止，你的智能体每次回答都是"失忆"的——它不记得上一句你说了什么。这一阶段解决两个问题：

1. **对话记忆**：让它记住你们之前聊过什么
2. **知识检索**：让它能从你的文档/数据库里查资料来回答

## 对话记忆：最简单的做法

最简单的记忆就是把所有历史消息都传给模型：

\`\`\`python
messages = [
    {"role": "system", "content": "你是一个助手"},
    {"role": "user", "content": "我叫小明"},
    {"role": "assistant", "content": "你好小明！"},
    {"role": "user", "content": "我叫什么名字？"},
]
# 模型应该回答"小明"
\`\`\`

这就是记忆——把之前的对话历史都包含在请求里。

## 问题：上下文窗口有限

模型的上下文窗口是有限的（比如128k token）。对话一长，早期的消息就会被"挤出去"，模型就开始忘事。

解决策略：

**策略1：只保留最近N轮**
最简单粗暴。比如只保留最近10轮对话。简单但可能丢掉重要信息。

**策略2：摘要压缩**
把早期对话总结成一段摘要，代替原始消息。

\`\`\`python
# 对话太长时，让模型把前10轮总结一下
summary = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": f"请总结以下对话的关键信息：{earlier_messages}"}
    ]
)
# 然后用 [summary] + 最近几轮 代替全部历史
\`\`\`

## RAG：让智能体能查资料

对话记忆是"记住你们聊了什么"。RAG 是"让它能查你的知识库"。

典型场景：你有一堆产品文档，用户问问题时，先从文档里找相关段落，再让模型基于这些段落回答。

### RAG 的基本流程

1. **准备阶段**：把文档切块 → 每块生成向量（embedding）→ 存到向量数据库
2. **查询阶段**：
   - 用户问题也生成向量
   - 从向量数据库找最相似的文档块
   - 把这些文档块放进提示词
   - 让模型基于文档回答

### 最简单的 RAG 代码

\`\`\`python
# 1. 准备：把文档切块并生成向量
chunks = split_document(document, chunk_size=500)
embeddings = [embed(chunk) for chunk in chunks]

# 2. 查询：找最相关的块
query_embedding = embed(user_question)
similar_chunks = vector_db.search(query_embedding, top_k=3)

# 3. 把相关块放进提示词
prompt = f"""
根据以下资料回答问题。如果资料里没有答案，说不知道。

资料：
{similar_chunks}

问题：{user_question}
"""

# 4. 调用模型回答
answer = llm.call(prompt)
\`\`\`

## 2026年 RAG 实践提示

生产级 RAG 不只是简单向量搜索：
- **混合检索**：向量搜索 + 关键词搜索（BM25）结合，召回更全
- **重排序**：初步搜出10条，用 Reranker 重新排序取前3条
- **评测**：分别评测"检索到的相关吗"和"回答忠实于原文吗"

新手先跑通最简单的向量检索，再逐步加这些优化。

## 练习任务

1. 实现一个带对话记忆的聊天机器人，能记住用户名字
2. 对话超过20轮时，用摘要压缩历史
3. 选3个文档，实现一个最简单的RAG问答
4. 测试：问一个文档里有的问题和一个文档里没有的问题

## 常见坑

- 记忆无限增长 → 一定要有截断或摘要策略
- RAG 把不相关的文档塞给模型 → 检索质量决定回答质量
- 模型编造文档里没有的内容 → 提示词里加"只根据提供的资料回答"

## 下一阶段预告

现在你有工具、有记忆、有知识库了。最后一步：把这些组合起来，编排成复杂的工作流，并加上监控和评测。`,
    },

    // ===== 阶段7：工作流与上线 =====
    {
      stageNumber: 7,
      title: '工作流编排与上线',
      subtitle: '从Demo到生产：编排、监控、评测',
      duration: '6-8天',
      topics: ['LangGraph 工作流', 'Human-in-the-loop', 'Langfuse 监控', '评测集构建', '成本与稳定性'],
      resources: ['LangGraph 官方教程', 'Langfuse 文档'],
      description: '最后一个阶段。把前面学的组装成完整的应用，加上监控和评测，真正能上线用。',
      content: `## 这一阶段你要学什么

前面6个阶段你分别学了：调API、写提示词、调工具、用MCP、加记忆。现在把它们组合起来，做成一个完整的、能上线的应用。

## 为什么需要工作流编排

如果智能体流程很简单（用户问→调一个工具→回答），不用框架也行。

但复杂流程呢？比如：
1. 先理解用户意图
2. 如果需要查资料，调搜索工具
3. 整理结果
4. 写初稿
5. 自己审查一遍
6. 有问题就改，没问题就输出

这种多步骤、有分支的流程，用代码硬写很容易乱。**工作流框架**就是帮你把流程可视化、可调试、可恢复。

## LangGraph：2026年生产级首选

LangGraph 把流程建模成**状态图**：
- **节点**：每一步做什么（调LLM、调工具、人工审批）
- **边**：从哪一步到哪一步，什么条件下走哪条路
- **状态**：整个流程共享的数据（当前结果、历史等）

\`\`\`python
from langgraph.graph import StateGraph, MessagesState

# 定义工作流
workflow = StateGraph(MessagesState)

# 添加节点
workflow.add_node("understand", understand_intent)
workflow.add_node("search", search_info)
workflow.add_node("draft", write_draft)
workflow.add_node("review", review_draft)

# 连接节点
workflow.set_entry_point("understand")
workflow.add_edge("understand", "search")
workflow.add_edge("search", "draft")
workflow.add_edge("draft", "review")
# review 后根据结果决定是定稿还是重写
workflow.add_conditional_edges("review", should_revise)

app = workflow.compile()
\`\`\`

LangGraph 的杀手锏：
- **Checkpoint**：自动保存每一步状态，出错可以从断点恢复
- **Human-in-the-loop**：在关键步骤暂停，等人确认再继续
- **可观测**：每一步都有trace，知道发生了什么

## 为什么需要监控和评测

Demo 阶段：你手动跑，看结果对不对。
上线之后：你不可能手动检查每一个请求。你需要：
- **监控**：知道每天有多少请求、成功率多少、花了多少钱
- **评测**：改了提示词后，自动跑一遍测试集，确认没改坏

## Langfuse：开源自托管的可观测性工具

Langfuse 能记录你的智能体的每一步：
- 每次 LLM 调用的输入输出
- 每次工具调用的参数和结果
- 总耗时、总token、成本

接入很简单：
\`\`\`python
from langfuse import Langfuse

langfuse = Langfuse()

# 装饰一个函数，自动记录trace
@langfuse.observe()
def my_agent(input):
    # 你的智能体逻辑
    return result
\`\`\`

然后打开 Langfuse 面板，就能看到每一步发生了什么。

## 评测集怎么建

1. 收集20-50个典型问题（正常+异常）
2. 每个问题写清楚什么算"回答对了"
3. 跑一遍智能体，人工标注哪些通过哪些没通过
4. 以后每次改了代码，跑一遍评测集对比

## 练习任务

1. 用 LangGraph 把前面做过的某个项目重构成有状态工作流
2. 接入 Langfuse，查看完整的执行 trace
3. 建一个10条用例的评测集，跑一遍看通过率
4. 故意改坏一个提示词，看评测能不能抓到

## 上线 Checklist

- [ ] 有评测集，改代码后能回归测试
- [ ] 有监控，知道成功率和成本
- [ ] 错误不会让整个系统崩，有兜底回复
- [ ] 有最大步数限制，不会无限循环
- [ ] 关键操作有人工审批（涉及钱/发邮件等高风险动作）

## 恭喜你学完了！

到这里，你已经掌握了智能体开发的完整链路：
- 能调模型
- 能写好提示词
- 能接工具（包括MCP）
- 能加记忆和知识库
- 能编排复杂工作流
- 能监控和评测

接下来就是在真实项目里练手，越做越熟。`,
    },
  ];

  for (const s of stages) {
    const existing = await db.select().from(learningStages).where(eq(learningStages.stageNumber, s.stageNumber)).limit(1);
    if (existing.length === 0) { await db.insert(learningStages).values(s); console.log(`  ✓ 阶段 ${s.stageNumber}: ${s.title}`); }
  }

  const projects = [
    { projectNumber: 1, title: '第一个 LLM 调用', category: '主线', difficulty: '入门', duration: '半天', prerequisites: ['阶段1-2'], deliverables: ['跑通API调用', '理解基本参数'], description: '最简单的入门项目：写一个程序调用LLM，完成第一次对话。', content: '## 目标\n用最少代码调通一次LLM API，完成一次对话。\n\n## 步骤\n1. 注册模型平台账号，获取API Key\n2. 安装SDK\n3. 写一个Hello World调用\n4. 试试不同的system prompt\n\n## 验收\n- 程序能运行并输出模型回复\n- 能解释system和user消息的区别\n- 知道temperature大概影响什么' },
    { projectNumber: 2, title: '提示词实验室', category: '主线', difficulty: '入门', duration: '1天', prerequisites: ['阶段3'], deliverables: ['提示词模板库', '结构化输出Demo'], description: '练习写提示词，掌握结构化输出。', content: '## 目标\n写一个工具，根据用户输入生成结构化的JSON回答。\n\n## 步骤\n1. 选一个任务（如邮件分类）\n2. 写system提示词\n3. 用结构化输出约束格式\n4. 测10个不同输入\n\n## 验收\n- 输出始终是合法JSON\n- 分类准确率满意' },
    { projectNumber: 3, title: '计算器智能体', category: '主线', difficulty: '入门', duration: '1天', prerequisites: ['阶段4'], deliverables: ['第一个工具调用循环'], description: '让智能体遇到数学问题时调用计算器工具。', content: '## 目标\n实现Function Calling，让模型调用计算器。\n\n## 步骤\n1. 定义计算器工具\n2. 实现完整的调用循环\n3. 处理工具调用结果\n4. 测试数学问题\n\n## 验收\n- 模型能正确决定什么时候调计算器\n- 大数字计算不会出错\n- 工具报错时能友好处理' },
    { projectNumber: 4, title: 'MCP 工具 Server', category: '主线', difficulty: '中级', duration: '2天', prerequisites: ['阶段5'], deliverables: ['一个MCP Server', '能被客户端连接'], description: '用FastMCP写一个自己的工具服务，供任何MCP客户端使用。', content: '## 目标\n写一个自定义MCP Server，比如待办事项管理工具。\n\n## 步骤\n1. 用FastMCP定义几个工具（添加/查看/删除待办）\n2. 本地存储数据\n3. 用MCP Inspector测试\n4. 连接到你的智能体应用\n\n## 验收\n- MCP客户端能发现并调用你的工具\n- 工具能正确读写数据\n- 多个客户端连同一个Server正常工作' },
    { projectNumber: 5, title: '带记忆的聊天助手', category: '主线', difficulty: '中级', duration: '2天', prerequisites: ['阶段6'], deliverables: ['对话记忆功能'], description: '做一个能记住多轮对话的聊天助手。', content: '## 目标\n实现一个多轮对话助手，能记住之前聊过的内容。\n\n## 步骤\n1. 维护对话历史\n2. 实现摘要压缩（对话太长时）\n3. 加入用户偏好记忆\n4. 测试长对话\n\n## 验收\n- 对话20轮后还记得早期信息\n- 上下文不会爆\n- 用户偏好能跨对话记住' },
    { projectNumber: 6, title: 'RAG 文档问答', category: '主线', difficulty: '中级', duration: '3天', prerequisites: ['阶段6'], deliverables: ['知识库问答系统'], description: '基于RAG做一个能回答你文档问题的助手。', content: '## 目标\n上传几份文档，做一个能基于文档内容回答问题的助手。\n\n## 步骤\n1. 准备文档并切块\n2. 实现向量检索\n3. 把检索结果放进提示词\n4. 测试文档内和文档外问题\n\n## 验收\n- 文档内问题回答准确\n- 文档外问题会说不知道\n- 回答能引用来源' },
    { projectNumber: 7, title: 'LangGraph 工作流', category: '主线', difficulty: '高级', duration: '4天', prerequisites: ['阶段7'], deliverables: ['有状态工作流', 'Human-in-the-loop'], description: '用LangGraph构建一个多步骤的研究报告生成器。', content: '## 目标\n输入一个主题，自动调研→写初稿→审查→定稿。\n\n## 步骤\n1. 用LangGraph StateGraph建模流程\n2. 实现调研节点（调搜索工具）\n3. 实现写作节点\n4. 加入审查节点和条件跳转\n5. 加checkpoint\n\n## 验收\n- 流程能完整跑完\n- 某一步失败能从checkpoint恢复\n- 审查不通过会自动重写' },
    { projectNumber: 8, title: '智能体监控面板', category: '专项', difficulty: '高级', duration: '3天', prerequisites: ['阶段7'], deliverables: ['Langfuse接入', '基础指标看板'], description: '给你的智能体项目加上完整的监控和评测。', content: '## 目标\n接入Langfuse，建立评测集。\n\n## 步骤\n1. 接入Langfuse SDK\n2. 记录所有LLM调用和工具调用\n3. 建10条测试用例的评测集\n4. 跑一遍评测，查看通过率\n5. 在Langfuse面板查看trace\n\n## 验收\n- 能在Langfuse看到完整trace\n- 评测脚本能一键跑\n- 改了提示词能对比效果' },
    { projectNumber: 9, title: '完整产品实战', category: '专项', difficulty: '高级', duration: '7天', prerequisites: ['全部'], deliverables: ['一个完整可用的智能体应用'], description: '综合运用所有知识，做一个完整的智能体产品。', content: '## 目标\n从零做一个完整的智能体应用：有工具、有记忆、有知识库、有监控。\n\n## 建议方向\n- 个人知识助手\n- 代码审查机器人\n- 邮件处理智能体\n- 数据查询助手\n\n## 验收\n- 功能完整可用\n- 有评测集能跑回归\n- 有监控能看trace\n- 错误不会崩，有兜底' },
  ];

  for (const p of projects) {
    const existing = await db.select().from(practiceProjects).where(eq(practiceProjects.projectNumber, p.projectNumber)).limit(1);
    if (existing.length === 0) { await db.insert(practiceProjects).values(p); console.log(`  ✓ 项目 ${p.projectNumber}: ${p.title}`); }
  }

  const resources = [
    { title: 'OpenAI API 快速开始', category: '官方文档', type: '教程', stageNumber: 2, description: 'OpenAI 官方API调用教程，最快跑通第一次调用。' },
    { title: '提示工程最佳实践', category: '提示工程', type: '指南', stageNumber: 3, description: '主流模型厂商官方提示工程指南。' },
    { title: '结构化输出指南', category: '提示工程', type: '指南', stageNumber: 3, description: '用JSON Schema约束模型输出格式。' },
    { title: 'Function Calling 文档', category: '工具调用', type: '官方文档', stageNumber: 4, description: '主流模型函数调用接口说明。' },
    { title: 'MCP 官方文档', category: 'MCP', type: '官方文档', stageNumber: 5, description: 'Model Context Protocol 官方文档。' },
    { title: 'FastMCP 快速入门', category: 'MCP', type: '教程', stageNumber: 5, description: '用Python快速开发MCP Server。' },
    { title: 'LangGraph 官方教程', category: '框架', type: '教程', stageNumber: 7, description: 'LangGraph 状态图、checkpoint、human-in-the-loop。' },
    { title: 'Langfuse 文档', category: '评测', type: '官方文档', stageNumber: 7, description: '开源LLM可观测性平台，支持自托管。' },
    { title: 'RAG 实战指南', category: 'RAG', type: '指南', stageNumber: 6, description: '从简单向量检索到生产级RAG的完整指南。' },
    { title: 'ReAct 论文', category: '理论', type: '论文', stageNumber: 7, description: '推理与行动结合的经典论文。' },
  ];
  for (const r of resources) {
    const existing = await db.select().from(learningResources).where(eq(learningResources.title, r.title)).limit(1);
    if (existing.length === 0) await db.insert(learningResources).values(r);
  }

  const exps = [
    { expNumber: 1, title: '第一次调API', category: '入门', difficulty: '简单', duration: '30分钟', description: '跑通第一次LLM调用。', content: '写10行代码调用模型API。' },
    { expNumber: 2, title: 'Temperature 对比实验', category: '提示工程', difficulty: '简单', duration: '30分钟', description: '对比不同temperature的输出差异。', content: '同一问题跑5次，temperature 0 vs 1。' },
    { expNumber: 3, title: '计算器工具', category: '工具调用', difficulty: '中等', duration: '1小时', description: '实现第一个Function Calling工具。', content: '实现计算器，测试数学问题。' },
    { expNumber: 4, title: '第一个 MCP Server', category: 'MCP', difficulty: '中等', duration: '1.5小时', description: '用FastMCP写一个工具服务。', content: '写一个简单的MCP Server并用Inspector测试。' },
    { expNumber: 5, title: '对话记忆实验', category: '记忆', difficulty: '中等', duration: '1小时', description: '观察长对话中的遗忘现象。', content: '连续对话20轮，观察何时开始忘事。' },
    { expNumber: 6, title: '简单 RAG 实验', category: 'RAG', difficulty: '中等', duration: '2小时', description: '基于文档问答。', content: '上传文档，实现最简单的向量检索问答。' },
    { expNumber: 7, title: 'LangGraph 第一个图', category: '工作流', difficulty: '困难', duration: '2小时', description: '构建一个有状态工作流。', content: '实现一个两步工作流，加checkpoint。' },
    { expNumber: 8, title: '接入 Langfuse', category: '评测', difficulty: '中等', duration: '1小时', description: '给智能体加上追踪。', content: '接入Langfuse，查看完整trace。' },
  ];
  for (const e of exps) {
    const existing = await db.select().from(experiments).where(eq(experiments.expNumber, e.expNumber)).limit(1);
    if (existing.length === 0) await db.insert(experiments).values(e);
  }

  console.log('种子数据初始化完成！');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
