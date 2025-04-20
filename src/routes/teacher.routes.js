import { Router } from 'express';
import {
  showApiProfesor,
  showApiProfesorId,
  createApiProfesor,
  updateApiProfesor,
  deleteApiProfesor
} from '../controllers/teacher.controller.js';

const router = Router();
const apiName = '/profesor';

router.route(apiName)
  .get(showApiProfesor)
  .post(createApiProfesor);

router.route(`${apiName}/:id`)
  .get(showApiProfesorId)
  .put(updateApiProfesor)
  .delete(deleteApiProfesor);

export default router;
