import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * Multer configuration for account file uploads with user folder creation.
 */
export const accountMulterConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Replace 'userId' with the actual property that identifies the user
      const firstName = req.body?.firstName;
      const lastName = req.body?.lastName;

      if (!firstName || !lastName) {
        return cb(
          new BadRequestException("User identification missing"),
          "false",
        );
      }
      const userFolder = `./uploads/account/`;

      // Create the folder if it doesn't exist
      if (!existsSync(userFolder)) {
        mkdirSync(userFolder, { recursive: true });
      }

      cb(null, userFolder);
    },
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
