//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Read the secret at verification time (runtime), not at construction
      // time, so it is always available regardless of .env load order.
      secretOrKeyProvider: (_request: any, _rawJwtToken: string, done: any) => {
        done(null, process.env.JWT_SECRET);
      },
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.usersService.findRawById(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
