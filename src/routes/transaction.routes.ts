import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import multerConfig from '../configs/multer';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import UploadValidation from '../validations/UploadValidation';

const transactionRouter = Router();
const upload = multer(multerConfig);

transactionRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    categoryTitle: category,
  });

  return response.status(201).json(transaction);
});

transactionRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ transaction_id: id });

  return response
    .status(200)
    .json({ message: 'Transaction deleta with success' });
});

transactionRouter.post(
  '/import',
  upload.single('file'),
  UploadValidation,
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    await importTransactionsService.execute(request.csv);

    return response
      .status(201)
      .json({ message: 'Arquivo CSV importado com sucesso!' });
  },
);

export default transactionRouter;
