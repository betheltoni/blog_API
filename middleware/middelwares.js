import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Set the decoded user information in the request object
    req.user = decoded;

    // Call the next middleware
    next();
  });
};

export function calculateReadingTime(content, wordsPerMinute = 100) {
  // Count words (split by spaces)
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;

  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime;
}