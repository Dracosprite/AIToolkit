import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY 
})








export const jsconverter = async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Code description is required"
      })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Convert this to JavaScript code: ${text}`
      }],
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (responseText) {
      return res.status(200).json({
        success: true,
        code: responseText
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(402).json({
      message: error.message
    })

  }
}
