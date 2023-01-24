import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();


@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt',session:false}),
    JwtModule.register({
      secret: process.env.TOKENKEY,
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, JwtStrategy,],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
