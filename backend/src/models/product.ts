import mongoose, { Schema, Document } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" — 2'],
      maxlength: [30, 'Максимальная длина поля "title" — 30'],
    },
    image: {
      type: {
        fileName: {
          type: String,
          required: [true, 'Поле "image.fileName" обязательно'],
        },
        originalName: {
          type: String,
          required: [true, 'Поле "image.originalName" обязательно'],
        },
      },
      required: [true, 'Поле "image" должно быть заполнено'],
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>('product', productSchema);
