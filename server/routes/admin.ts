import { Router, Response } from 'express';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '../db';
import { users, learningStages, practiceProjects, userProgress, learningNotes } from '../db/schema';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 所有管理员接口都需要登录 + 管理员权限
router.use(authMiddleware, adminMiddleware);

// ===== 数据统计概览 =====
router.get('/stats', async (_req, res: Response) => {
  const userCount = await db.select({ count: count() }).from(users);
  const stageCount = await db.select({ count: count() }).from(learningStages);
  const projectCount = await db.select({ count: count() }).from(practiceProjects);
  const noteCount = await db.select({ count: count() }).from(learningNotes);
  const progressCount = await db.select({ count: count() }).from(userProgress);

  res.json({
    users: userCount[0].count,
    stages: stageCount[0].count,
    projects: projectCount[0].count,
    notes: noteCount[0].count,
    progressRecords: progressCount[0].count,
  });
});

// ===== 用户管理 =====
router.get('/users', async (_req, res: Response) => {
  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    username: users.username,
    role: users.role,
    banned: users.banned,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));
  res.json(allUsers);
});

router.put('/users/:id/ban', async (req: AuthRequest, res: Response) => {
  const [user] = await db.update(users)
    .set({ banned: true })
    .where(eq(users.id, req.params.id as any))
    .returning();
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

router.put('/users/:id/role', async (req: AuthRequest, res: Response) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: '角色只能是 user 或 admin' });
  }
  const [user] = await db.update(users)
    .set({ role })
    .where(eq(users.id, req.params.id as any))
    .returning();
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

router.put('/users/:id/unban', async (req: AuthRequest, res: Response) => {
  const [user] = await db.update(users)
    .set({ banned: false })
    .where(eq(users.id, req.params.id as any))
    .returning();
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  await db.delete(users).where(eq(users.id, req.params.id as any));
  res.json({ success: true });
});

// ===== 内容管理：课程阶段 =====
router.get('/stages', async (_req, res: Response) => {
  const stages = await db.select().from(learningStages).orderBy(learningStages.stageNumber);
  res.json(stages);
});

router.put('/stages/:id', async (req: AuthRequest, res: Response) => {
  const { title, subtitle, description, content, duration, topics, resources } = req.body;
  const [stage] = await db.update(learningStages)
    .set({ title, subtitle, description, content, duration, topics, resources })
    .where(eq(learningStages.id, req.params.id as any))
    .returning();
  if (!stage) return res.status(404).json({ error: '阶段不存在' });
  res.json(stage);
});

router.post('/stages', async (req: AuthRequest, res: Response) => {
  const { stageNumber, title, subtitle, description, content, duration, topics, resources } = req.body;
  const [stage] = await db.insert(learningStages)
    .values({ stageNumber, title, subtitle, description, content, duration, topics, resources })
    .returning();
  res.json(stage);
});

router.delete('/stages/:id', async (req: AuthRequest, res: Response) => {
  await db.delete(learningStages).where(eq(learningStages.id, req.params.id as any));
  res.json({ success: true });
});

// ===== 内容管理：实践项目 =====
router.get('/projects', async (_req, res: Response) => {
  const projects = await db.select().from(practiceProjects).orderBy(practiceProjects.projectNumber);
  res.json(projects);
});

router.put('/projects/:id', async (req: AuthRequest, res: Response) => {
  const { title, category, difficulty, description, content, duration, prerequisites, deliverables } = req.body;
  const [project] = await db.update(practiceProjects)
    .set({ title, category, difficulty, description, content, duration, prerequisites, deliverables })
    .where(eq(practiceProjects.id, req.params.id as any))
    .returning();
  if (!project) return res.status(404).json({ error: '项目不存在' });
  res.json(project);
});

router.post('/projects', async (req: AuthRequest, res: Response) => {
  const { projectNumber, title, category, difficulty, description, content, duration, prerequisites, deliverables } = req.body;
  const [project] = await db.insert(practiceProjects)
    .values({ projectNumber, title, category, difficulty, description, content, duration, prerequisites, deliverables })
    .returning();
  res.json(project);
});

router.delete('/projects/:id', async (req: AuthRequest, res: Response) => {
  await db.delete(practiceProjects).where(eq(practiceProjects.id, req.params.id as any));
  res.json({ success: true });
});

export default router;
