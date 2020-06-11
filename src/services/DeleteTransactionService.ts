import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface IRequest {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: IRequest): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(transaction_id);

    if (!transaction) throw new AppError('Transaction not found', 404);

    await transactionsRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
