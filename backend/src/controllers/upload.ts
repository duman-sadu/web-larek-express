import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tempPath = req.file.path;
    const { filename } = req.file;
    const originalName = req.file.originalname;

    const targetDir = path.join(__dirname, '../../public/images');
    const targetPath = path.join(targetDir, filename);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error('Error moving file:', err);
        return next(err);
      }

      res.status(201).json({
        fileName: `/images/${filename}`,
        originalName,
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

export default uploadFile;
