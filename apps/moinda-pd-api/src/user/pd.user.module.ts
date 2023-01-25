import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { UserController } from './pd.user.controller';
import { UserService } from './pd.user.service';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.TOKENKEY,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, IdService],
  exports: [UserService],
})
export class UserModule {}
