import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      // Explicitly type the decoded token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  
      // Log the decoded token to inspect its structure
      console.log("Decoded token:", decoded);
  
      // Check if `sub` exists or fallback to another identifier (e.g., `id`)
      const userId = decoded.id // Adjust this based on your token's structure
      if (!userId) return res.status(401).json({ message: 'Invalid token structure' });
  
  
      // Fetch the user from the database using the appropriate identifier
      const user = await User.findById(userId);
      if (!user) return res.status(401).json({ message: 'User not found' });
        console.log("user found")
      req.user = user; // Assign the user to req.user
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  export const authorize = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || (req.user as IUser).role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  };
