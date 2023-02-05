import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/pd.user.module';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { IdService } from '@app/moinda-pd/service/pd.id.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtService, IdService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
