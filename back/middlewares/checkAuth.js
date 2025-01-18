// /middleware/checkAuth.js
import jwt from 'jsonwebtoken';

export default function checkAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (!token) {
    return res.status(403).json({error: 'Token is missing'});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(403).json({error: 'Invalid or expired token'});
  }
}
