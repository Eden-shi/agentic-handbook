import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Overview() {
  const { user } = useAuth();
  const [stageDone, setStageDone] = useState(0);
  const [projDone, setProjDone] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/my-progress').then(r => {
        const done = r.data.filter((p: any) => p.isCompleted);
        setStageDone(done.filter((p: any) => p.itemType === 'stage').length);
        setProjDone(done.filter((p: any) => p.itemType === 'project').length);
      });
    }
  }, [user]);

  const stagePct = (stageDone / 10) * 100;
  const projPct = (projDone / 9) * 100;

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">学习总览</span></div>
      <div className="hero">
        <h1>从理解原理，到构建智能体。</h1>
        <p>先沿十个基础阶段建立理解，再选择应用实践路线，用可验收的项目成果巩固所学。</p>
      </div>

      <div className="card">
        <div className="card-label">学习方法</div>
        <h2>这本手册，怎么学？</h2>
        <p>初次学习先按基础阶段 01–10 推进，再进入应用实践路线；已有基础可直接选实践目标，遇到知识缺口再补对应阶段。专项按需选择，不必全部学完。</p>
        <div className="steps-grid">
          <div>
            <div className="step-num">01</div>
            <div className="step-title">带着问题阅读</div>
            <div className="step-desc">先读导读，明确当前练习要解决的问题，再按路线顺序阅读课程与必读资料、记下要采用的方法。不必读整个资料库才动手，进阶资料按需查阅。</div>
          </div>
          <div>
            <div className="step-num">02</div>
            <div className="step-title">用一个小任务验证</div>
            <div className="step-desc">按章节练习动手，记录预期、实际结果和验证步骤。卡住时记下已尝试的方法，回到对应基础章节补缺，再重做失败步骤。阶段 0 可结合 v0–v4 源码练习。</div>
          </div>
          <div>
            <div className="step-num">03</div>
            <div className="step-title">复盘后再往前走</div>
            <div className="step-desc">能用自己的话解释原理、独立完成小任务，并留下可复现的验证结果，再标记完成。可用 AI 辅助，但看懂或让 AI 代做一遍不等于掌握；在笔记中留下成果与未解决的问题。</div>
          </div>
        </div>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>基础学习进度</h3>
          <div className="progress-number">{stageDone} <span className="total">/ 10</span></div>
          <div className="progress-label">已完成基础阶段</div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${stagePct}%` }} /></div>
          <div className="progress-hint">完成阅读、练习与复盘后，手动标记阶段完成。</div>
        </div>
        <div className="progress-card">
          <h3>应用实践进度</h3>
          <div className="progress-number">{projDone} <span className="total">/ 9</span></div>
          <div className="progress-label">已完成实践路线 · 主线与专项合计</div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${projPct}%` }} /></div>
          <div className="progress-hint">完成练习并验收后手动标记；专项按需选择，不必全部完成。</div>
        </div>
      </div>
    </div>
  );
}
