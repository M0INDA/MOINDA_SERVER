import { USER } from '@app/moinda-pd/constant.model';
import { AuthController } from './../src/auth/auth.controller';
import { StudyController } from './../src/study/study.controller';
import { UserController } from './../src/user/pd.user.controller';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { AuthService } from './../src/auth/auth.service';
import { MainService } from './../src/main/main.service';
import { StudyService } from './../src/study/study.service';
import { UserService } from './../src/user/pd.user.service';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Connection, Repository } from 'typeorm';
import { INestApplication, Res } from '@nestjs/common';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { nanoid } from 'nanoid';
import e from 'express';

export class TestContext {
  app: INestApplication;
  connection: Connection;
  idService: IdService;
  userService: UserService;
  studyService: StudyService;
  mainService: MainService;
  authService: AuthService;
  userRepository: Repository<UserEntity>;
  studyRepository: Repository<StudyEntity>;
  userController: UserController;
  studyController: StudyController;
  authController: AuthController;

  async init(testContext: TestContext, module: TestingModule) {
    testContext.app = module.createNestApplication();
    testContext.connection = module.get<Connection>(Connection);
    testContext.userService = module.get<UserService>(UserService);
    testContext.studyService = module.get<StudyService>(StudyService);
    testContext.authService = module.get<AuthService>(AuthService);
    testContext.idService = module.get<IdService>(IdService);
    testContext.userController = module.get<UserController>(UserController);
    testContext.authController = module.get<AuthController>(AuthController);
    testContext.studyController = module.get<StudyController>(StudyController);
  }

  async createUser(): Promise<UserEntity> {
    return this.createDummyUser();
  }

  async createDummyUser(): Promise<UserEntity> {
    this.setMockValidateUser();
    const user = this.setMockGetProfile();
    return this.userRepository
      .createQueryBuilder(USER)
      .where({ id: user })
      .getOne();
  }

  setMockValidateUser() {
    const accessToken = 'test123';
    const refreshToken = 'test1234';
    jest
      .spyOn(this.userService, 'validateUser')
      .mockImplementation(
        async (): Promise<{ accessToken: string; refreshToken: string }> =>
          Promise.resolve({ accessToken, refreshToken }),
      );
  }

  async setMockGetProfile() {
    await this.userRepository.create();
    const resp = {
      id: nanoid(10),
      nickname: 'test',
      email: 'testUser',
      password: 'test123',
    };
    await this.userRepository.save(resp);
    jest
      .spyOn(this.userService, 'findId')
      .mockResolvedValue(this.userRepository.findOneBy({ id: resp.id }));
    return resp.id;
  }
}
