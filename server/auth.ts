import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

export interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Silakan login terlebih dahulu.' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string }
    next()
  } catch {
    res.status(401).json({ message: 'Sesi login tidak valid atau sudah berakhir.' })
  }
}

export const createToken = (user: { id: bigint; email: string }) => jwt.sign(
  { id: user.id.toString(), email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' }
)
