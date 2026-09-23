import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: '邮箱、用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: '该邮箱已注册' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email, username, passwordHash }).returning();
    const token = generateToken(user.id, user.email, user.username);
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (e: any) {
    if (e.code === '23505') {
      return res.status(409).json({ error: '邮箱或用户名已存在' });
    }
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    const token = generateToken(user.id, user.email, user.username);
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch {
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ id: req.userId, email: req.userEmail, username: req.username });
});

export default router;
