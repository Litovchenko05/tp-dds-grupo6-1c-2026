import express from 'express'
import { planController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').get((req, res) => planController.findAll(req, res))

export default router
