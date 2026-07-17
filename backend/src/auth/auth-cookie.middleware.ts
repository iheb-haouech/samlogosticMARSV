import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);
    
    res.send = (body: any) => {
      try {
        const data = typeof body === 'string' ? JSON.parse(body) : body;
        
        if (data?.accessToken && data?.refreshToken) {
          res.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict' as const,
          });
          res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict' as const,
          });
          
          delete data.accessToken;
          delete data.refreshToken;
          body = JSON.stringify(data);
        }
      } catch (e) {
        // Not JSON, continue
      }
      
      return originalSend(body);
    };
    
    next();
  }
}