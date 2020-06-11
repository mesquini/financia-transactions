import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomes = await this.find({ where: { type: 'income' } });

    const incomesvalue = incomes.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    const outcomes = await this.find({ where: { type: 'outcome' } });

    const outcomesValue = outcomes.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    return {
      income: incomesvalue,
      outcome: outcomesValue,
      total: incomesvalue - outcomesValue,
    };
  }
}

export default TransactionsRepository;
