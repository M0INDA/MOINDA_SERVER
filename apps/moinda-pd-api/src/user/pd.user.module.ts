import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { PdReadUserRepository } from '@app/moinda-pd/read/repository/pd.read.user.repository';
import { UserController } from './pd.user.controller';
import { UserService } from './pd.user.service';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { PdReadUserEntity } from '@app/moinda-pd/read/entity/pd.read.user.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PdReadUserEntity], DB_READ_NAME),
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
