import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { SignupSchema } from "./schema/users";

const app: Express = express();

// express 미들웨어 설정
// 미들웨어 json본문 파서를 사용하여 express의 중간에 json을 내장시킴
app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

// 예외처리
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App working!", PORT);
});
