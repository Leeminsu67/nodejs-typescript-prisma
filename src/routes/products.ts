import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();

// 생성
productsRoutes.post(
  "/",
  // 사용자 인증과 ADMIN 인증을 동시에
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

// 전체 조회
productsRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listProducts)
);

// 개별 조회
productsRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

// 수정
productsRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);

// 삭제
productsRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

export default productsRoutes;
