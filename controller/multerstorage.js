import Groq from 'groq-sdk';
import fs from 'fs';
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
    
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "user",
                content: `give 5-10 interviese on the basis of the resume: ${req.file}`
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