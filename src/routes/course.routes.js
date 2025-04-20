router.route(`${apiName}/:id`)
  .get(verifyToken, showApiCursoId)  // Obtener curso por ID
  .put(verifyToken, updateApiCurso)  // Actualizar curso por ID
  .delete(verifyToken, deleteApiCurso); // Eliminar curso por ID

export default router;
