import fs from 'fs';
import csv from 'csv-parser';

import { hubspotClient } from '../../../../shared/hubspot';
import { importConfig } from '../../../../config';
import { limiterQueue } from '../../../../shared/hubspot/limiter';
import { Contact } from '../../model/Contact';

type Error = {
  statusCode: number;
};

export class ImportContactsUseCase {
  importContact(contactRead, listId: string) {
    contactRead.forEach(async (contact: string) => {
      const { body } = await hubspotClient().apiRequest({
        method: 'POST',
        path: `/contacts/v1/contact/?hapikey=${process.env.API_KEY}`,
        body: contact,
      });
      const { vid } = body;
      const contactProperties = {
        vids: [vid],
      };

      await hubspotClient().apiRequest({
        method: 'POST',
        path: `/contacts/v1/lists/${listId}/add/?hapikey=${process.env.API_KEY}`,
        body: contactProperties,
      });
    });

    return;
  }

  execute(listId: string): Promise<Contact[]> {
    const { filePath } = importConfig;
    const contactRead = [];

    fs.createReadStream(`${filePath}`)
      .on('error', (err: Error) => {
        return err.statusCode;
      })
      .pipe(csv())
      .on('data', (row) => {
        const contacts = {
          properties: [
            {
              property: 'firstname',
              value: row.first_name,
            },
            {
              property: 'lastname',
              value: row.last_name,
            },
            {
              property: 'email',
              value: row.email,
            },
            {
              property: 'gender',
              value: row.gender,
            },
          ],
        };
        contactRead.push(contacts);
      })
      .on('end', () => {
        for (let chunk = 5, i = 0, j = Object.values(contactRead).length; i < j; i += chunk) {
          limiterQueue
            .removeTokens(1)
            .then(() => {
              this.importContact(contactRead.slice(i, i + chunk), listId);
            })
            .catch((err: Error) => {
              return err.statusCode;
            });
        }
      });

    return;
  }
}
