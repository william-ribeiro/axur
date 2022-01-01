import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';

import router from './routes';
import { List } from './modules/lists/model/List';
import { AppError } from './errors/AppError';
import { GetListsUseCase } from './modules/lists/useCases/getLists/GetListsUseCase';
import { ImportContactsUseCase } from './modules/contacts/useCases/importContacts/ImportContactsUseCase';

const app = express();

app.use(express.json());

new GetListsUseCase().execute().then((data: List) => {
  const { listId, name, status } = data;

  console.log(`
    ID: ${listId} - ${name}
    `);

  if (!status) {
    new ImportContactsUseCase().execute(listId);
    console.log(`
      Contatos importados...
      `);
  }
});

app.use(router);
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(Number(err.statusCode)).json({
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`,
  });
});

export { app };
