import { Router } from 'express';

import authController from 'features/authentication/authentication.controller.js';

const router = Router();


router.get('/login', authController.spotifyAuth);
router.get('/login/callback', authController.spotifyCallbackAuth);

router.get('/success', authController.loginSuccess);
router.get('/failure', authController.loginFailure);
router.get('/logout', authController.logoutController);

export default router;
