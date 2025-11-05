import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new HttpException(
        'JWT_SECRET is not defined in .env',
        HttpStatus.BAD_REQUEST,
      );
    }

    super({
      jwtFromRequest: (req) => {
        this.logger.debug('Headers:', req.headers);
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.debug(`JWT Secret Loaded: ${secret ? 'V' : 'X'}`);
    this.logger.debug(
      `JWT Secret Loaded: ${ExtractJwt.fromAuthHeaderAsBearerToken() ? 'V' : 'X'}`,
    );
    this.logger.debug(ExtractJwt.fromAuthHeaderAsBearerToken().toString());
  }

  async validate(payload: any) {
    this.logger.debug(payload);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }
    return { user_id: payload.sub, username: payload.username };
  }
}
