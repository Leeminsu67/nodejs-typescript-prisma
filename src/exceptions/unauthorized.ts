import { HttpException } from "./root";

// 로그인되지 않은 사용자
export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
