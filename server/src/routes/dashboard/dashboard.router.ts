import { Router } from 'express';
import Credential from '@/shared/credential';
import Controller from './dashboard.controller';

const router = Router();

router.get('/summary', Credential.Safe, Controller.summary);

export default router;
