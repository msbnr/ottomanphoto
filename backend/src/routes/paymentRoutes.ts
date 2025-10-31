import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Ödeme token'ı oluştur (kullanıcı giriş yapmış olmalı)
router.post('/paytr/create-token', authenticate, paymentController.createPayTRToken);

// PayTR callback (public - PayTR'den gelecek)
router.post('/paytr/callback', paymentController.paytrCallback);

// Ödeme durumu kontrolü (kullanıcı giriş yapmış olmalı)
router.get('/status/:orderId', authenticate, paymentController.checkPaymentStatus);

export default router;
