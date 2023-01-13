import { HttpException, HttpStatus } from '@nestjs/common';
import { CodeException } from './code.exception';

export class InvalidStatusException extends HttpException {
  constructor(alertMessage: string, title: string | undefined = undefined) {
    super(
      {
        message: {
          code: CodeException.INVALID_STATUS,
          alert: alertMessage,
          title: title,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
