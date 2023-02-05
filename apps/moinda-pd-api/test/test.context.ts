import { PdReadUserEntity } from '@app/moinda-pd/read/entity/pd.read.user.entity';
import { USER, DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { AuthController } from './../src/auth/auth.controller';
import { StudyController } from './../src/study/study.controller';
import { UserController } from './../src/user/pd.user.controller';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { AuthService } from './../src/auth/auth.service';
import { MainService } from './../src/main/main.service';
import { StudyService } from './../src/study/study.service';
import { UserService } from './../src/user/pd.user.service';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Connection, getConnectionManager, Repository } from 'typeorm';
import { INestApplication, Res } from '@nestjs/common';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';

export class TestContext {
  app: INestApplication;
  connection: Connection;
  idService: IdService;
  userService: UserService;
  studyService: StudyService;
  mainService: MainService;
  authService: AuthService;
  userController: UserController;
  studyController: StudyController;
  authController: AuthController;
  //   userRepository: UserRepository;
  //   userRepository: Repository<UserEntity>(UserEntity)
  //   manager = getConnectionManager().get('default');
  //   readManager = getConnectionManager().get(DB_READ_NAME);
  //   userRepository = this.manager.getRepository<UserEntity>(UserEntity);
  //   pdReadUserRepository =
  //     this.readManager.getRepository<PdReadUserEntity>(PdReadUserEntity);

  async init(testContext: TestContext, module: TestingModule) {
    testContext.app = module.createNestApplication();
    await testContext.app.init();
    testContext.connection = module.get<Connection>(Connection);
    testContext.userService = module.get<UserService>(UserService);
    testContext.studyService = module.get<StudyService>(StudyService);
    testContext.authService = module.get<AuthService>(AuthService);
    testContext.idService = module.get<IdService>(IdService);
    testContext.userController = module.get<UserController>(UserController);
    testContext.authController = module.get<AuthController>(AuthController);
    testContext.studyController = module.get<StudyController>(StudyController);
    // testContext.userRepository = module.get<UserRepository>(UserRepository);
    // testContext.pdReadUserRepository =
    //   module.get<Repository<PdReadUserEntity>>(PdReadUserEntity);
    // testContext.userRepository = module.get<Repository<UserEntity>>(UserEntity);
  }
  //   const manager = getConnectionManager().get('your_orm_name');
  //   const repository = manager.getRepository<AModel>(Model);

  //   async createUser(): Promise<UserEntity> {
  //     return this.createDummyUser();
  //   }

  //   async createDummyUser(): Promise<UserEntity> {
  //     const signUser = this.setOneMockSignup();
  //     const user = await this.userService.findUser(signUser);
  //     return this.userRepository
  //       .createQueryBuilder(USER)
  //       .where({ id: user.id })
  //       .getOne();
  //   }

  //   setOneMockSignup() {
  //     const resp = {
  //       nickname: 'test12',
  //       email: 'testUser12@test.com',
  //       password: 'test123',
  //     };
  //     jest
  //       .spyOn(this.userService, 'signup')
  //       .mockImplementation(async () => await this.userRepository.save(resp));
  //     return resp.nickname;
  //   }
}
