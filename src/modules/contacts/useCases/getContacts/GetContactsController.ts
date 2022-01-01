import { Request, Response } from 'express';

import { GetContactsUseCase } from './GetContactsUseCase';

export class GetContactsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getContactsUseCase = new GetContactsUseCase();
    const all = await getContactsUseCase.execute();

    return response.json(all);
  }
}
