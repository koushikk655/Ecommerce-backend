import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../src/models/User'; // Adjust the path if necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUser | JwtPayload; // Adjust the type as needed
    }
  }
}

