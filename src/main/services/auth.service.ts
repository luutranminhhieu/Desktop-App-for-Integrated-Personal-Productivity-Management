import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// In a real application, you should put this in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'default_super_secret_jwt_key_123!';

export class AuthService {
  /**
   * Register a new user
   * @param email User's email
   * @param password User's plain text password
   * @param name User's name
   * @returns JWT token and user info
   */
  public async register(email: string, password: string, name: string): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required.');
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Save new user to the database
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    const savedUser = await newUser.save();

    // 4. Generate JWT Token
    const payload = {
      userId: savedUser._id,
      email: savedUser.email,
    };

    // Token expires in 7 days
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: String(savedUser._id),
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }

  /**
   * Login an existing user
   * @param email User's email
   * @param password User's plain text password
   * @returns JWT token and user info
   */
  public async login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      throw new Error('Invalid email or password.');
    }

    // 2. Compare the provided password with the hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    // 3. Generate JWT Token
    const payload = {
      userId: user._id,
      email: user.email,
    };

    // Token expires in 7 days
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Verify an existing JWT token
   * @param token JWT string
   * @returns Decoded payload if valid
   */
  public verifyToken(token: string): string | jwt.JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch {
      throw new Error('Invalid or expired token.');
    }
  }
}

export const authService = new AuthService();