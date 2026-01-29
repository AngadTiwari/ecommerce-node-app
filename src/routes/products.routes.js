
import { Router } from 'express';
import { listProducts, getProduct, createProduct } from '../controllers/products.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', listProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', getProduct);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create product (protected)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authRequired, createProduct);

export default router;
