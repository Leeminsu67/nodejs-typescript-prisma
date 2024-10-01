import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. 헤더에서 토큰 추출
  const token = req.headers.authorization;
  // 2. 승인되지 않은 토큰이 있는 경우
  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    // 3. 토큰이 있는 경우 해당 토큰을 추출
    const payload = jwt.verify(token!, JWT_SECRET) as any;
    // 4. 페이로드 단계에서 유저를 사져오는 것
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    // 5. 사용자를 현재 요청 개체에 연결하는 것
    req.user = user!;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
