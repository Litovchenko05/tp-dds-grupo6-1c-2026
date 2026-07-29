import express from 'express'
import { sedeController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').get((req, res) => sedeController.findAll(req, res))

export default router
