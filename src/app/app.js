// Usar las rutas con sus propios prefijos
app.use('/', personRoutes);
app.use('/', studentRoutes);
app.use('/', teacherRoutes);
app.use('/', courseRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint no encontrado'
  });
});

export default app;
