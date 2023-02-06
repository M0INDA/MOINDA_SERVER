import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { UserProviderEnum } from '@app/moinda-pd/entity/enum/user.provider.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { createConnections, getConnection } from 'typeorm';
import { ApiModule } from '../src/api.module';
import { TestContext } from './test.context';

describe('UserTest', () => {
  const testContext = new TestContext();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();
    await testContext.init(testContext, module);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection(DB_READ_NAME).dropDatabase();
    await testContext.app?.close();
  });

  it('createUser test', async () => {
    const resp = {
      nickname: 'test12',
      email: 'testUser12@test.com',
      password: 'test123',
    };
    const user = await testContext.userService.signup(resp);
    console.log(user);
    expect(user.nickname).toBe('test12');
  });
});
