
import express from 'express'
import { scifiimage } from '../controller/huggingface.js'
import { jsconverter } from '../controller/groqController.js'
import { chatbot, paragraphgenrater, summaryController } from '../controller/geminiController.js'


const routes = express.Router()

routes.post('/summary', summaryController)
routes.post('/scifiimage', scifiimage)
routes.post('/jsconverter', jsconverter)
routes.post('/paragraphgenrater', paragraphgenrater)
routes.post('/chatbot', chatbot)


export default routes
