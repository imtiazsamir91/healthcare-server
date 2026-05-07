import { Router } from 'express';
import { SpecialtyController } from './specialty.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/browser';
//import SpecialtyController from './specialty.controller';

const router = Router();




router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialtyController.createSpecialty);
router.get('/',  SpecialtyController.getAllSpecialty);
router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);
export const  SpecialtyRouter= router;