router.route(`${apiName}/:id`)
  .get(verifyToken, showApiEstudianteId)  // Obtener estudiante por ID
  .put(verifyToken, updateApiEstudiante)  // Actualizar estudiante por ID
  .delete(verifyToken, deleteApiEstudiante); // Eliminar estudiante por ID

export default router;
