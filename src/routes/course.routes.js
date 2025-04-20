import { Router } from 'express';
import {
  showApiCurso,
  showApiCursoId,
  createApiCurso,
  updateApiCurso,
  deleteApiCurso
} from '../controllers/course.controller.js';

const router = Router();
const apiName = '/curso';

router.route(apiName)
  .get(showApiCurso)
  .post(createApiCurso);

router.route(`${apiName}/:id`)
  .get(showApiCursoId)
  .put(updateApiCurso)
  .delete(deleteApiCurso);

export default router;
