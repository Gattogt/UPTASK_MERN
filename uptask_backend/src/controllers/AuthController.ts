import type {Request, Response} from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import Token from '../models/Token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'


export class AuthController{
  static createAccount = async (req:Request, res:Response) => {
    try {
      // evitar duplicados
      const { email } = req.body
      const userExist = await User.findOne({ email })

      if (userExist) {
        const error = new Error('El usuario ya esta registrado')
        return res.status(409).json({ error: error.message })
      }
      
      const user = new User(req.body)
      // hash password
      user.password = await hashPassword(req.body.password)
      // generate token
      const token = new Token()
     
      token.token = generateToken()
      token.user = user.id
      // send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })
      // crea un usario & generate token
      await Promise.allSettled([user.save(),token.save() ])
      res.send('Cuenta creada correctamente, Revisa tu email para confirmar tu cuenta')
    } catch (error) {
      res.status(500).json({error: error.message})
    }
  }
  static confirmAccount = async (req:Request, res:Response) => {
    try {
      const { token } = req.body
      const tokenExist = await Token.findOne({token:token})
      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }
      const user = await User.findById(tokenExist.user)
      user.confirmed = true
      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      return res.send('Cuenta confirmada correctamente')
    } catch (error) {
      res.status(500).json({error: "hubo un error"})
    }
  }

  static login = async(req:Request, res: Response) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({email})
      if (!user) {
        const error = new Error('Este usuario no existe! Intenta de nuevo con un usaurio diferente')
        return res.status(404).json({ error: error.message })
      }
        if (!user.confirmed) {
          const token = new Token()
          token.user = user.id
          token.token = generateToken()
          await token.save()

          AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token
        })

        const error = new Error('La cuenta no a sido confirmada, hemos enviado un e-mail de confirmacion')
        return res.status(401).json({ error: error.message })
        }
      // check passwords are the same
      const isPasswordCorrect = await checkPassword(password, user.password)
      if (!isPasswordCorrect) {
        const error = new Error('Password Incorrecto')
        return res.status(404).json({ error: error.message })
      }
      const token = generateJWT({ id: user.id })
      console.log(token)

      res.send(token)
    } catch (error) {
      res.status(500).json({error: "hubo un error"})
    }
  }

  static requestConfirmationCode = async (req:Request, res:Response) => {
    try {
      
      const { email } = req.body
      // usuario existe?
      const user = await User.findOne({ email })

      if (!user) {
        const error = new Error('El usuario no esta registrado')
        return res.status(404).json({ error: error.message })
      }
      if (user.confirmed) {
        const error = new Error('El usuario ya esta confirmado')
        return res.status(409).json({ error: error.message })
      }
      // generate token
      const token = new Token()
     
      token.token = generateToken()
      token.user = user.id
      // send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })
      // crea un usario & generate token
      await Promise.allSettled([user.save(),token.save() ])
      res.send('Se envio un nuevo token a tu e-mail')
    } catch (error) {
      res.status(500).json({error: error.message})
    }
  }

  static forgotPassword = async (req:Request, res:Response) => {
    try {
      
      const { email } = req.body
      // usuario existe?
      const user = await User.findOne({ email })

      if (!user) {
        const error = new Error('El usuario no esta registrado')
        return res.status(404).json({ error: error.message })
      }
      // generate token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      await token.save()
      // send email
      AuthEmail.sendPaswwordResetToken({
        email: user.email,
        name: user.name,
        token: token.token
      })
      // crea un usario & generate token
      
      res.send('Revisa tu email para instrucciones')
    } catch (error) {
      res.status(500).json({error: error.message})
    }
  }

  static validateToken = async (req:Request, res:Response) => {
    try {
      const { token } = req.body
      const tokenExist = await Token.findOne({token:token})
      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }
      return res.send('Token valido. Define tu nuevo password')
    } catch (error) {
      res.status(500).json({error: "hubo un error"})
    }
  }

  static updatePasswordWithToken = async (req:Request, res:Response) => {
    try {
      const { token } = req.params
      const tokenExist = await Token.findOne({token:token})
      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExist.user)
      user.password = await hashPassword(req.body.password)
      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      return res.send('El nuevo password se modifico correctamente')
    } catch (error) {
      res.status(500).json({error: "hubo un error"})
    }
  }
  static user = async (req:Request, res:Response) => {
    res.json(req.user)
  }
}