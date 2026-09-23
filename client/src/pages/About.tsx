export default function About() {
  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">产品简介</span></div>
      <div className="page-header"><h2>智能体工程手册</h2></div>
      <div className="card">
        <p style={{ fontSize: 15, lineHeight: 1.8 }}>
          这是一个面向智能体（Agentic AI）工程师的学习平台。内容从核心概念出发，经过提示工程、工具调用、记忆、规划、多智能体协作，最终到评测与上线。
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
          学习路线分为两部分：<strong>基础学习路线</strong>（7 个阶段）建立系统理解；<strong>应用实践路线</strong>（9 个项目）用可验收的成果巩固所学。
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
          注册账号后，你可以标记学习进度、写学习笔记，数据会保存在你的账户中。
        </p>
      </div>
    </div>
  );
}
