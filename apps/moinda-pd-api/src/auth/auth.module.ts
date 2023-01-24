import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/pd.user.module';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, JwtStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
