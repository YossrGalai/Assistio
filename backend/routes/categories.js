const express = require('express');
const Category = require('../models/Category');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

async function isAdmin(req) {
  const userId = req.user?.userId || req.user?.id;
  if (!userId) return false;
  const me = await User.findById(userId).select('role');
  return me?.role === 'admin';
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function hydrateCategoryCounts(categories) {
  const counts = await ServiceRequest.aggregate([
    { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [item._id || '', item.count]));

  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    active: category.active,
    requestCount: countMap.get((category.name || '').toLowerCase()) || 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));
}

// GET /api/categories
router.get('/', auth, async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      const requestCategories = await ServiceRequest.distinct('category');
      const seeded = await Promise.all(
        requestCategories
          .filter(Boolean)
          .map((name) => Category.create({ name: name.trim(), slug: slugify(name), description: '', active: true }))
      );
      categories = seeded;
    }
    const hydrated = await hydrateCategoryCounts(categories);
    res.json(hydrated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories
router.post('/', auth, async (req, res) => {
  try {
    if (!(await isAdmin(req))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, description = '', active = true } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = slugify(name);
    const category = await Category.create({ name: name.trim(), slug, description, active: !!active });
    res.status(201).json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: category.active,
      requestCount: 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  try {
    if (!(await isAdmin(req))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = {};
    if (req.body.name !== undefined) {
      updates.name = req.body.name.trim();
      updates.slug = slugify(req.body.name);
    }
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.active !== undefined) updates.active = !!req.body.active;

    const category = await Category.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const hydrated = await hydrateCategoryCounts([category]);
    res.json(hydrated[0]);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!(await isAdmin(req))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
