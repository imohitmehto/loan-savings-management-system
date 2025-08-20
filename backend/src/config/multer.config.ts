import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

/**
 * Multer configuration for account file uploads.
 */
export const accountMulterConfig = {
  storage: diskStorage({
    destination: "./uploads/account",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpeg|jpg|png|pdf)$/)) {
      return cb(
        new BadRequestException(
          "Only JPEG, JPG, PNG, or PDF files are allowed",
        ),
        false,
      );
    }
    cb(null, true);
  },
};
