import { Router } from 'express'
import { noCache } from '../middleware/noCache.js'
import { login, register, home, profile } from '../controllers/index.js'

const router = Router()

router.get('/', noCache, home, profile)
router.get('/login', login)
router.get('/register', register)

export default router