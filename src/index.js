
import app from './app/app.js';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3000; // Allow dynamic port configuration

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
