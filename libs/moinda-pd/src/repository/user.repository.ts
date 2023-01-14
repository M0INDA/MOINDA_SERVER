import { Repository } from 'typeorm';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../../../../apps/moinda-pd-api/src/dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
