// server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import categoryRoutes from './src/routes/categoryRoutes.mjs';
import postRoutes from './src/routes/postRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
