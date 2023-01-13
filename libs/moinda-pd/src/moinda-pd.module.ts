import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_READ_NAME } from './constant.model';
import { UserEntity } from './entity/user.entity';
import { MoindaPdService } from './moinda-pd.service';
import { PdReadUserEntity } from './read/entity/pd.read.user.entity';
import { PdReadUserRepository } from './read/repository/pd.read.user.repository';
import { UserRepository } from './repository/user.repository';
import { IdService } from './service/pd.id.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'ci'
          ? './libs/moinda-pd/environment/.env.ci'
          : './libs/moinda-pd/environment/.env.local',
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      keepConnectionAlive: true,
      logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [UserEntity],
    }),
    TypeOrmModule.forRoot({
      name: DB_READ_NAME,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      keepConnectionAlive: true,
      logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [PdReadUserEntity],
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([PdReadUserRepository], DB_READ_NAME),
  ],
  providers: [IdService],
  exports: [IdService],
})
export class MoindaPdModule {}
