import express from 'express'
import { upload } from '../middleware/multerstorage.js'
import { resumequestion } from '../controller/multerstorage.js'

const router = express.Router()

router.post('/upload', upload.single('file'), resumequestion)

export default router