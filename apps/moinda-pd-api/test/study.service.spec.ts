import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';
import { ApiModule } from '../src/api.module';
import { TestContext } from './test.context';

describe('StudyTest', () => {
  const testContext = new TestContext();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();
    await testContext.init(testContext, module);

    const resp = {
      nickname: 'test12',
      email: 'testUser12@test.com',
      password: 'test123',
    };
    await testContext.userService.signup(resp);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection(DB_READ_NAME).dropDatabase();
    await testContext.app?.close();
  });

  it('study test', async () => {
    const user = await testContext.userService.findUser('test12');
    console.log(user);
    expect(user.nickname).toBe('test12');
  });

  it('create study', async () => {});
});
