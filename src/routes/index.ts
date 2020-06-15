import { Router } from 'express';

import transactionRouter from './transaction.routes';
import categoryRouter from './category.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ status: true });
});

routes.use('/transactions', transactionRouter);
routes.use('/categories', categoryRouter);

export default routes;
