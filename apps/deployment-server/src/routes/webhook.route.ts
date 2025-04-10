import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller.js';

const WebhookRouter = Router();

WebhookRouter.post('/', handleWebhook);

export default WebhookRouter;
