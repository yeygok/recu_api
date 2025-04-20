import { Router } from 'express';
import { showApiPersona, showApiPersonaId, createApiPersona, updateApiPersona, deleteApiPersona, loginApiPersona } from '../controllers/person.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
const apiName = '/persona';

router.route(apiName)
  .get(verifyToken, showApiPersona)
  .post(createApiPersona);

router.route('/personaLogin')
  .post(loginApiPersona);

router.route(`${apiName}/:id`)
  .get(verifyToken, showApiPersonaId)
  .put(verifyToken, updateApiPersona)
  .delete(verifyToken, deleteApiPersona);

export default router;
