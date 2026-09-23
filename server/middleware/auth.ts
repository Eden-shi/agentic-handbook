import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  username?: string;
  userRole?: string;
}

export function generateToken(userId: string, email: string, username: string, role: string = 'user'): string {
  return jwt.sign({ userId, email, username, role }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.username = decoded.username;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}
