import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CategoriesRepository from '../repositories/CategoriesRepository';

import CreateCategoryService from '../services/CreateCategoryService';

const categoryRouter = Router();

categoryRouter.get('/', async (request, response) => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();

  return response.json(categories);
});

categoryRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const createCategoryService = new CreateCategoryService();

  const category = await createCategoryService.execute({
    title,
  });

  return response.status(201).json(category);
});

export default categoryRouter;
