import { Router, Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import {
  learningStages, practiceProjects, learningResources, experiments,
  userProgress, learningNotes,
} from '../db/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ===== 公开接口（无需登录）=====

// 学习阶段列表
router.get('/stages', async (_req, res: Response) => {
  const stages = await db.select().from(learningStages).orderBy(learningStages.stageNumber);
  res.json(stages);
});

// 阶段详情
router.get('/stages/:id', async (req, res: Response) => {
  const [stage] = await db.select().from(learningStages).where(eq(learningStages.id, req.params.id)).limit(1);
  if (!stage) return res.status(404).json({ error: '阶段不存在' });
  res.json(stage);
});

// 实践项目列表
router.get('/projects', async (_req, res: Response) => {
  const projects = await db.select().from(practiceProjects).orderBy(practiceProjects.projectNumber);
  res.json(projects);
});

// 项目详情
router.get('/projects/:id', async (req, res: Response) => {
  const [project] = await db.select().from(practiceProjects).where(eq(practiceProjects.id, req.params.id)).limit(1);
  if (!project) return res.status(404).json({ error: '项目不存在' });
  res.json(project);
});

// 资料列表
router.get('/resources', async (req, res: Response) => {
  const { category, stage } = req.query;
  let query = db.select().from(learningResources);
  const results = await query;
  let filtered = results;
  if (category) filtered = filtered.filter(r => r.category === category);
  if (stage) filtered = filtered.filter(r => r.stageNumber === Number(stage));
  res.json(filtered);
});

// 实验列表
router.get('/experiments', async (_req, res: Response) => {
  const exps = await db.select().from(experiments).orderBy(experiments.expNumber);
  res.json(exps);
});

// ===== 需登录接口 =====

// 获取我的进度
router.get('/my-progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  const progress = await db.select().from(userProgress).where(eq(userProgress.userId, req.userId!));
  res.json(progress);
});

// 更新进度（标记完成/取消完成）
router.post('/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { itemType, itemId, isCompleted } = req.body;
  if (!itemType || !itemId) return res.status(400).json({ error: '参数不完整' });
  const existing = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, req.userId!), eq(userProgress.itemType, itemType), eq(userProgress.itemId, itemId)))
    .limit(1);
  if (existing.length > 0) {
    const [updated] = await db.update(userProgress)
      .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
      .where(eq(userProgress.id, existing[0].id))
      .returning();
    return res.json(updated);
  }
  const [created] = await db.insert(userProgress).values({
    userId: req.userId!, itemType, itemId,
    isCompleted: isCompleted || false,
    completedAt: isCompleted ? new Date() : null,
  }).returning();
  res.json(created);
});

// 笔记列表
router.get('/notes', authMiddleware, async (req: AuthRequest, res: Response) => {
  const notes = await db.select().from(learningNotes)
    .where(eq(learningNotes.userId, req.userId!))
    .orderBy(desc(learningNotes.updatedAt));
  res.json(notes);
});

// 笔记详情
router.get('/notes/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const [note] = await db.select().from(learningNotes)
    .where(and(eq(learningNotes.id, req.params.id as any), eq(learningNotes.userId, req.userId!)))
    .limit(1);
  if (!note) return res.status(404).json({ error: '笔记不存在' });
  res.json(note);
});

// 创建笔记
router.post('/notes', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, content, relatedType, relatedId, relatedTitle } = req.body;
  if (!title || !content) return res.status(400).json({ error: '标题和内容不能为空' });
  const [note] = await db.insert(learningNotes).values({
    userId: req.userId!, title, content, relatedType, relatedId, relatedTitle,
  }).returning();
  res.json(note);
});

// 更新笔记
router.put('/notes/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, content, relatedType, relatedId, relatedTitle } = req.body;
  const [note] = await db.update(learningNotes)
    .set({ title, content, relatedType, relatedId, relatedTitle, updatedAt: new Date() })
    .where(and(eq(learningNotes.id, req.params.id as any), eq(learningNotes.userId, req.userId!)))
    .returning();
  if (!note) return res.status(404).json({ error: '笔记不存在' });
  res.json(note);
});

// 删除笔记
router.delete('/notes/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await db.delete(learningNotes)
    .where(and(eq(learningNotes.id, req.params.id as any), eq(learningNotes.userId, req.userId!)));
  res.json({ success: true });
});

export default router;
