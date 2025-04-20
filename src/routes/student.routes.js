import { Router } from 'express';
import {
  showApiEstudiante,
  showApiEstudianteId,
  createApiEstudiante,
  updateApiEstudiante,
  deleteApiEstudiante
} from '../controllers/student.controller.js';

const router = Router();
const apiName = '/estudiante';

router.route(apiName)
  .get(showApiEstudiante)
  .post(createApiEstudiante);

router.route(`${apiName}/:id`)
  .get(showApiEstudianteId)
  .put(updateApiEstudiante)
  .delete(deleteApiEstudiante);

export default router;
