import { Router } from 'express';
import { SpecialtyController } from './specialty.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/browser';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { SpecialtyValidation } from './specialty.validation';
//import SpecialtyController from './specialty.controller';

const router = Router();




router.post('/', 
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    multerUpload.single("file"), 
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty);
router.get('/',  SpecialtyController.getAllSpecialty);
router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);
export const  SpecialtyRouter= router;