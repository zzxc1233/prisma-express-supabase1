// src/routes/categoryRoutes.mjs

import express from 'express';
import prisma from '../utils/prisma.mjs';

const router = express.Router();

// Create new category
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json(category);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: { posts: true }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description
            }
        });

        res.json(category);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).end();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;
