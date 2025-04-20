import express from 'express';
import personRoutes from '../routes/person.routes.js';
import studentRoutes from '../routes/student.routes.js';
import teacherRoutes from '../routes/teacher.routes.js';
import courseRoutes from '../routes/course.routes.js';

const app = express();
// Middleware to handle JSON
app.use(express.json());

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
