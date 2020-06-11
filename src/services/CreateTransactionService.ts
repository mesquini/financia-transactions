import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: CreateTransactionDTO): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type))
      throw new AppError('Transaction type is invalid!');

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type.includes('out') && total < value)
      throw new AppError(
        'Não foi possivel sacar o dinheiro, valor extrapolado!!!',
      );

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findCategory({
      title: categoryTitle,
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
      category,
    });

    await transactionsRepository.save(transaction);

    delete transaction.category_id;

    return transaction;
  }
}

export default CreateTransactionService;
