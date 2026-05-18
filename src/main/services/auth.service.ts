import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { PasswordReset } from '../models/PasswordReset';
import { sendResetPasswordEmail } from './email.service';
import { randomBytes } from 'crypto';
import { createServer } from 'http';
import { shell } from 'electron';

const JWT_SECRET = process.env.JWT_SECRET;
const APP_DEEPLINK_SCHEME = process.env.APP_DEEPLINK_SCHEME || 'promos';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_PORT = process.env.GOOGLE_REDIRECT_PORT ? Number(process.env.GOOGLE_REDIRECT_PORT) : 53682;

export class AuthService {
  private buildToken(userId: string, email: string): string {
    const payload = { userId, email };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  private async openGoogleOAuth(): Promise<{ email: string; name: string }>{
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.');
    }

    const state = randomBytes(16).toString('hex');
    const server = createServer();
    const redirectUri = `http://127.0.0.1:${GOOGLE_REDIRECT_PORT}/oauth2/callback`;

    const authCode = await new Promise<string>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;

      const cleanup = (): void => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        server.close();
      };

      server.on('request', (req, res) => {
        const url = new URL(req.url || '/', `http://127.0.0.1:${GOOGLE_REDIRECT_PORT}`);
        if (url.pathname !== '/oauth2/callback') {
          res.writeHead(404);
          res.end();
          return;
        }

        const code = url.searchParams.get('code');
        const returnedState = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400);
          res.end('Google sign-in failed. You can close this window.');
          cleanup();
          reject(new Error(error));
          return;
        }

        if (!code || returnedState !== state) {
          res.writeHead(400);
          res.end('Invalid response. You can close this window.');
          cleanup();
          reject(new Error('Invalid Google OAuth response.'));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<p>Sign-in complete. You can close this window and return to the app.</p>');
        cleanup();
        resolve(code);
      });

      server.listen(GOOGLE_REDIRECT_PORT, '127.0.0.1', () => {
        const params = new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: 'openid email profile',
          access_type: 'offline',
          state
        });

        shell.openExternal(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
      });

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Google sign-in timeout.'));
      }, 120000);

      server.on('error', (error) => {
        cleanup();
        reject(error);
      });
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: authCode,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange Google OAuth code.');
    }

    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenData.access_token) {
      throw new Error('Missing access token from Google.');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Google profile.');
    }

    const profile = await profileResponse.json() as { email?: string; name?: string };
    if (!profile.email) {
      throw new Error('Google profile missing email.');
    }

    return { email: profile.email, name: profile.name || profile.email.split('@')[0] };
  }
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
    const token = this.buildToken(String(savedUser._id), savedUser.email);

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
    const token = this.buildToken(String(user._id), user.email);

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

  public async googleSignIn(): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
    const profile = await this.openGoogleOAuth();

    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await new User({ email: profile.email, name: profile.name }).save();
    }

    const token = this.buildToken(String(user._id), user.email);

    return {
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name
      }
    };
  }

  public async requestPasswordReset(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordReset.create({ userId: user._id, token, expiresAt, used: false });

    const resetLink = `${APP_DEEPLINK_SCHEME}://reset-password?token=${token}`;
    await sendResetPasswordEmail(email, resetLink);
  }

  public async resendPasswordReset(email: string): Promise<void> {
    return this.requestPasswordReset(email);
  }
}

export const authService = new AuthService();