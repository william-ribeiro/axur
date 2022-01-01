import { hubspotClient } from '../../../../shared/hubspot';
import { Contact } from '../../model/Contact';
import { AppError } from '../../../../errors/AppError';
import { GetListsUseCase } from '../../../lists/useCases/getLists/GetListsUseCase';

type Item = {
  [index: string]: string;
};

interface IDomain extends Array<Item> {}

export class GetContactsUseCase {
  async execute(): Promise<Contact[]> {
    try {
      const { listId } = await new GetListsUseCase().execute();

      const { body } = await hubspotClient().apiRequest({
        method: 'GET',
        path: `/contacts/v1/lists/${listId}/contacts/all?hapikey=${process.env.API_KEY}&property=email&count=100`,
      });

      const { contacts } = body;

      const domains: IDomain[] = [];

      contacts.map((contact: Contact) => {
        const email = contact.properties.email.value;
        const domain = email.split('@')[1];
        domains[domain] = domains[domain] ? domains[domain] + 1 : 1;
      });

      const resultDomains = [];
      for (const d in domains) {
        resultDomains.push({ domain: d, quantity: domains[d] });
      }

      return resultDomains;
    } catch (error) {
      throw new AppError('Internal error', 500);
    }
  }
}
