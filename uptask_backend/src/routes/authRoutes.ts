import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import {body, param} from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()

 router.post('/create-account',
 body('name').notEmpty().withMessage('the name is require'),
 body('password').isLength({ min: 8 }).withMessage('password should be 8 characters at least '),
 body('password_confirmation').custom((value, { req }) => {
   if (value !== req.body.password) {
     throw new Error('Los passwords no son iguales')
   }
   return true
 }),
 body('email').isEmail().withMessage('Please enter a valid email'),
 handleInputErrors,
   AuthController.createAccount)


router.post('/confirm-account',
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErrors,
  AuthController.confirmAccount
)

router.post('/login',
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('El password no puede ir vacio'),
  handleInputErrors,
  AuthController.login
)

router.post('/request-code',
  body('email').isEmail().withMessage('Please enter a valid email'),
  handleInputErrors,
  AuthController.requestConfirmationCode
)

router.post('/forgot-password',
  body('email').isEmail().withMessage('Please enter a valid email'),
  handleInputErrors,
  AuthController.forgotPassword
)

router.post('/validate-token',
  body('token').notEmpty().withMessage('El token no debe ir vacio'),
  handleInputErrors,
  AuthController.validateToken
)

router.post('/update-password/:token',
  param('token').isNumeric().withMessage('token no valido'),
  body('password').isLength({ min: 8 }).withMessage('password should be 8 characters at least '),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {throw new Error('Los passwords no son iguales')}
    return true}),
  handleInputErrors,
  AuthController.updatePasswordWithToken
)
router.get('/user',
  authenticate,
  AuthController.user
)



export default router