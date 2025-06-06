import express from 'express';
import cors from 'cors';
import personRoutes from '../routes/person.routes.js';
import studentRoutes from '../routes/student.routes.js';
import teacherRoutes from '../routes/teacher.routes.js';
import courseRoutes from '../routes/course.routes.js';

const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to handle JSON
app.use(express.json());

// Montar todas las rutas con prefijo '/'
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
