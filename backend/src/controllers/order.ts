import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (
      !payment ||
      !email ||
      !phone ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return next(new BadRequestError("Некорректные данные заказа"));
    }

    if (!["card", "online"].includes(payment)) {
      return next(new BadRequestError("Некорректный способ оплаты"));
    }

    const itemIds = items.map((i: any) => i.id);

    const products = await Product.find({ _id: { $in: itemIds } });

    if (products.length !== itemIds.length) {
      return next(new BadRequestError("Некоторые товары не найдены"));
    }

    let totalFromDB = 0;

    for (const p of products) {
      if (p.price === null || typeof p.price !== "number") {
        return next(new BadRequestError(`Товар "${p.title}" не продается`));
      }

      totalFromDB += p.price;
    }

    if (totalFromDB !== total) {
      return next(
        new BadRequestError("Сумма заказа не совпадает с ценами товаров")
      );
    }

    const orderId = faker.string.uuid();

    res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export default { createOrder };