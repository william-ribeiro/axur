import { hubspotClient } from '../../../../shared/hubspot';
import { List } from '../../model/List';
import { listConfig } from '../../../../config';
import { AppError } from '../../../../errors/AppError';

export class CreateListsUseCase {
  async execute(): Promise<List> {
    try {
      const time = new Date().getTime();
      const { body } = await hubspotClient().apiRequest({
        method: 'POST',
        path: '/contacts/v1/lists',
        body: { name: `${listConfig.name.toLowerCase()}.${time}`, dynamic: false },
      });

      const newList = await body;

      return newList;
    } catch (error) {
      throw new AppError('Internal error', 500);
    }
  }
}
