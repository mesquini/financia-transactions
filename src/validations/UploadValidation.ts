import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import Joi from 'joi';

import AppError from '../errors/AppError';

interface Icsv {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

const schema = Joi.object().keys({
  title: Joi.string().required(),
  type: Joi.string().required(),
  value: Joi.number().required(),
  category: Joi.string().required(),
});

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const arrayCsv: Icsv[] = [];
    let isError: boolean;

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', data => {
        const { error } = Joi.validate(data, schema);

        if (error) isError = true;

        arrayCsv.push(data);
      })
      .on('end', async () => {
        if (!isError) {
          req.csv = arrayCsv;
          next();
        } else {
          next(new AppError('Modelo do arquivo invalido.'));
        }
      });
  } catch {
    throw new AppError('Modelo do arquivo invalido.');
  }
};
