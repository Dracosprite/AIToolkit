import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const summaryController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Summarize this in 2-3 sentences:\n${text}`
      }],
      max_tokens: 1024,
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (responseText) {
      return res.status(200).json({
        success: true,
        summary: responseText
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(402).json({
      message: error.message
    })
  }
};

export const chatbot = async (req, res) => {
    try {
        const { messages } = req.body

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'messages array is required'
            })
        }
        
        const cleanMessages = messages.filter((msg) => msg && typeof msg.content === 'string' && ['user', 'assistant'].includes(msg.role)).map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: "You are a very helpful assistant. Give clear, useful, short answers unless the user asks for more detail. Respond naturally and helpfully."
                },
                ...cleanMessages
            ],
            max_tokens: 2048,
        });
        
        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
            return res.status(200).json({
                success: true,
                reply: responseText
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(402).json({
            message: error.message
        })
    }
}

export const paragraphgenrater = async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Topic is required"
      })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Create a well-written paragraph on the topic: ${text}`
      }],
      max_tokens: 1024,
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (responseText) {
      return res.status(200).json({
        success: true,
        paragraph: responseText
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(402).json({
      message: error.message
    })
  }
}