import { getCustomRepository, getRepository, In } from 'typeorm';
import fs from 'fs';
import csvParse from 'csv-parse';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Icsv {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filePath: string): Promise<void> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const contactsReadStrim = fs.createReadStream(filePath);

    const parseCSV = contactsReadStrim.pipe(csvParse({ from_line: 2 }));

    const categories: string[] = [];
    const transactions: Icsv[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({
        title: title.trim(),
        type: type.trim(),
        value: Number(value.trim()),
        category: category.trim(),
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    console.log(transactions);

    if (categories.length === 0 && transactions.length === 0)
      throw new AppError('Arquivo no modelo incorreto.');

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
      select: ['title'],
    });

    const categoriesTitle = existentCategories.map(category => category.title);

    const addCategoryTitles = categories
      .filter(category => !categoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);
  }
}

export default ImportTransactionsService;
