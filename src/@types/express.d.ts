declare namespace Express {
  export interface Request {
    csv: {
      title: string;
      type: 'income' | 'outcome';
      value: number;
      category: string;
    }[];
  }
}
