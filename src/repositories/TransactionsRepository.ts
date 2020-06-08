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

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions
      .filter(transaction => transaction.type.includes('income'))
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        0,
      );

    const outcomes = this.transactions
      .filter(transaction => transaction.type.includes('outcome'))
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        0,
      );

    return {
      income: incomes,
      outcome: outcomes,
      total: incomes - outcomes,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }

  public verifyTotal(type: string, value: number): boolean {
    if (type.includes('out')) {
      const { total } = this.getBalance();
      return value > total;
    }

    return false;
  }
}

export default TransactionsRepository;
