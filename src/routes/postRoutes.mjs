// src/routes/postRoutes.mjs
import express from 'express';
import prisma from '../utils/prisma.mjs';

const router = express.Router();

// Create new post
router.post('/', async (req, res) => {
    try {
        const { title, content, published, categoryId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published || false,
                categoryId: categoryId ? parseInt(categoryId) : null
            }
        });

        res.status(201).json(post);
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                category: true
            }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
            include: { category: true }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, published, categoryId } = req.body;

        const post = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                published,
                categoryId: categoryId ? parseInt(categoryId) : null
            }
        });

        res.json(post);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.post.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).end();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;
