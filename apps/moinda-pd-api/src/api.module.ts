import { MoindaPdModule } from '@app/moinda-pd';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { PdReadUserRepository } from '@app/moinda-pd/read/repository/pd.read.user.repository';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    MoindaPdModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([PdReadUserRepository], DB_READ_NAME),
    // HttpModule.registerAsync({
    //   useFactory: () => ({
    //     timeout: 1000,
    //     maxRedirects: 3,
    //   }),
    // }),
  ],
  controllers: [],
  providers: [IdService],
})
export class ApiModule {}
