import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessabeEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

// 회원가입
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupSchema.parse(req.body);

  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    // throw Error("User already exists!");
    next(
      new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS,
        null
      )
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.json(user);
};

// 로그인
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new NotFoundException(
      "Incorrect password!",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};

//  /me -> return the logged in user
// 로그인한 유저를 반환
export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.json(req.user);
};
