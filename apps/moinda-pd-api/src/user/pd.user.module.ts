import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { UserController } from './pd.user.controller';
import { UserService } from './pd.user.service';
import { IdService } from '@app/moinda-pd/service/pd.id.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService, IdService],
  exports: [UserService],
})
export class UserModule {}