import { hubspotClient } from '../../../../shared/hubspot';
import { List } from '../../model/List';
import { listConfig } from '../../../../config';
import { AppError } from '../../../../errors/AppError';
import { CreateListsUseCase } from '../createLists/CreateListsUseCase';

export class GetListsUseCase {
  async execute(): Promise<List> {
    try {
      const { body } = await hubspotClient().apiRequest({
        method: 'GET',
        path: '/contacts/v1/lists/static',
      });

      const { lists } = body;
      let listExists = false;

      const verifyLists = lists.find((list: List) => {
        if (RegExp(listConfig.name.toLowerCase()).exec(list.name.toLowerCase())) {
          listExists = true;
          list.status = 'exists';
          return list;
        }
      });

      if (listExists) {
        return verifyLists;
      }

      return new CreateListsUseCase().execute();
    } catch (error) {
      throw new AppError(error);
    }
  }
}
