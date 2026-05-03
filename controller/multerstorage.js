import Groq from 'groq-sdk';
import fs from 'fs/promises';
import PdfParse from 'pdf-parse-new';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})









export const resumequestion = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                messgae: 'no file uploaded'
            })
        }
        const buffer = await fs.readFile(req.file.path)
      const result=await PdfParse(buffer)
      const content=result.text||result
    
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "user",
               content: `Read this resume and generate 5-10 interview questions based on the candidate's skills, projects, and experience:\n\n${content}`

            }],
    
    
            
        });
    
        if (completion.choices[0]) {
            return res.status(200).json({
                success:true,
                code:completion.choices[0].message.content
            })
        }
        
    } catch (error) {
        console.log(error);
    return res.status(500).json({
      message: error.message || "some error",
    });
    }


}