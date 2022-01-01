import { Router } from 'express';
import { GetContactsController } from '../modules/contacts/useCases/getContacts/GetContactsController';

export const contactsRoutes = Router();

contactsRoutes.get('/', new GetContactsController().handle);
