import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

export const scifiimage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text prompt is required",
      });
    }

    try {
     
      const imageResult = await client.textToImage({
        model: "stabilityai/stable-diffusion-3-medium",
        inputs: text,
      });

     
      const buffer = await imageResult.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      if (base64) {
        return res.status(200).json({
          success: true,
          image: `data:image/png;base64,${base64}`,
        });
      }
    } catch (hfError) {
      console.log("HF inference error:", hfError.message);
      
      
      const placeholderImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      
      return res.status(200).json({
        success: true,
        image: `data:image/png;base64,${placeholderImage}`,
        note: "Demo image - Configure HF token for real image generation"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(402).json({
      message: error.message || "Unable to generate image",
    });
  }
};


