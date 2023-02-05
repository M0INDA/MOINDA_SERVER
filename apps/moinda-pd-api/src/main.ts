import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { cors: true });
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
    // origin: function (origin, callback) {
    //   callback(null, true);
    // },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      //     whitelist: true, //decorator 없는 property object 거름
      //     forbidNonWhitelisted: true, //이상한 값 요청오면 요청 막음 보안상승
      transform: true, //id값 url로 보내면 string인데 이걸 원하는걸로 변환시켜주는옵션
      //     // transformOptions: {
      //     //   enableImplicitConversion: true,
      // },
    }),
  );
  await app.listen(3000);
}
bootstrap();
