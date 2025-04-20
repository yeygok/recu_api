router.route(`${apiName}/:id`)
  .get(verifyToken, showApiProfesorId)  // Obtener profesor por ID
  .put(verifyToken, updateApiProfesor)  // Actualizar profesor por ID
  .delete(verifyToken, deleteApiProfesor); // Eliminar profesor por ID

export default router;
