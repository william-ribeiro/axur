import { Router } from 'express';
import { contactsRoutes } from './contacts.routes';

const routes = Router();

routes.use('/contacts', contactsRoutes);

export default routes;
