router.route('/personaLogin')
  .post(loginApiPersona); // Login

router.route(`${apiName}/:id`)
  .get(verifyToken, showApiPersonaId)  // Obtener persona por Id
  .put(verifyToken, updateApiPersona)  // Actualizar persona por Id
  .delete(verifyToken, deleteApiPersona); // Eliminar persona por Id

export default router;
