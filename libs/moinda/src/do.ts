import { BadRequestException } from '@nestjs/common';
import { InvalidStatusException } from '../../../apps/moinda-pd-api/src/exception/invalid-status.exception';

export class Do {
  static require(
    condition: boolean,
    message: string | undefined = undefined,
    title: string | undefined = undefined,
  ) {
    if (!condition) {
      if (!!message) {
        if (!!title) {
          throw new InvalidStatusException(message, title);
        }
        throw new BadRequestException(message);
      }
      throw new BadRequestException('이해할 수 없는 요청입니다.');
    }
  }
}
