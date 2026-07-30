import express from 'express'
import { obraSocialController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').get((req, res) => obraSocialController.findAll(req, res))

export default router
