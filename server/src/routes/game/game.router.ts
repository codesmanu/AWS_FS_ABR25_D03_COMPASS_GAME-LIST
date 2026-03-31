import { Router } from 'express';
import Credential from '@/shared/credential';
import Controller from './game.controller';

const router = Router();

router.get('/', Credential.Safe, Controller.list);
router.get('/:id', Credential.Safe, Controller.get);
router.post('/', Credential.Safe, Controller.create);
router.patch('/:id', Credential.Safe, Controller.update);
router.delete('/:id', Credential.Safe, Controller.remove);

export default router;
