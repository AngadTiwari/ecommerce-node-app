
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { me } from '../controllers/users.controller.js';

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/me', authRequired, me);

export default router;
