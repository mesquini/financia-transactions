import { Request } from 'express';
import { FileFilterCallback } from 'multer';

import AppError from '../errors/AppError';

export default {
  dest: '/tmp',

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const type: string = file.mimetype;

    if (type.includes('csv')) cb(null, true);
    else cb(new Error('Arquivo invalido, apenas arquivos CSV.'));
  },
};
