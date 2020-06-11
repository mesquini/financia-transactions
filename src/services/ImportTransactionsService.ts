import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Icsv {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(data: Icsv[]): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    data.forEach(async csv => {
      await categoriesRepository
        .findCategory({
          title: csv.category.trim(),
        })
        .then(async category => {
          const transaction = transactionsRepository.create({
            title: csv.title,
            value: Number(csv.value),
            type: csv.type,
            category_id: category.id,
            category,
          });

          await transactionsRepository.save(transaction);
        });
    });
  }
}

export default ImportTransactionsService;
