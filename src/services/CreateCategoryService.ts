import { getCustomRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface CreateCategoryDTO {
  title: string;
}
class CreateCategoryService {
  public async execute({ title }: CreateCategoryDTO): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
