import { Injectable, UnauthorizedException, Res, Next } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Response, Request, NextFunction } from 'express';

interface Payload {
  nickname?: string;
  email?: string;
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('TOKENKEY'),
    });
  }

  // guard 에서 strategy를 실행시킨다.
  // 프론트에서 보내준 jwt를 읽고 판단한다.
  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);

    if (!user)
      return done(new UnauthorizedException({ message: '토큰 에러' }), false);

    return done(null, { id: user.id });
  }
}
