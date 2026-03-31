import { Router } from 'express';
import Credential from '@/shared/credential';
import Controller from '@/routes/account/account.controller';

const router = Router();

router.post('/register', Credential.Guest, Controller.create);
router.post('/login', Credential.Guest, Controller.login);

router.post('/refresh', Credential.Safe, Controller.refresh);
router.delete('/', Credential.Safe, Controller.remove);
router.patch('/activate', Credential.Safe, Controller.activate);
router.patch('/', Credential.Safe, Controller.update);

export default router;