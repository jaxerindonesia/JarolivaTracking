import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Silakan login terlebih dahulu.' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Sesi login tidak valid atau sudah berakhir.' })
  }
}

export const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' }
)
