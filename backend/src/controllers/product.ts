import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import { Error as MongooseError } from "mongoose";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find().lean();

    res.status(200).json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, category, description, price, image } = req.body;

    if (!image || !image.fileName || !image.originalName) {
      return next(new BadRequestError('Поле "image" заполнено некорректно'));
    }

    const product = await Product.create({
      title,
      category,
      description,
      price,
      image: {
        fileName: image.fileName,
        originalName: image.originalName,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError("Ошибка валидации данных при создании товара")
      );
    }

    if (error.code === 11000) {
      return next(new ConflictError("Товар с таким title уже существует"));
    }

    next(error);
  }
};

export default { getProducts, createProduct };