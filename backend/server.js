import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/recommend", async (req, res) => {
  try {
    const { movies } = req.body;

    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      return res.status(400).json({ error: "Movies list is required" });
    }
    const prompt = `בהתבסס על כך שאהבת את הסרטים הבאים: ${movies.join(", ")}, 
    אנא המלץ לי על סרטים נוספים שכנראה יתאימו לטעם שלך, לפי סגנון, עלילה ודמיון כללי.
    
    פתח את התשובה במשפט הבא בלבד (אל תשנה או תוסיף עליו דבר):
    על סמך הסרטים שאהבת, אלו הסרטים שעשויים להתאים לך:
    
    לאחר מכן, עבור כל סרט מומלץ, הצג את המידע הבא בצורה מסודרת:
    - שם הסרט באנגלית בלבד (ללא תרגום)
    - בסוגריים: ז'אנר הסרט בעברית (ניתן לציין מספר ז'אנרים מופרדים בפסיקים)
    - שנת יציאה
    - קישור ל־IMDb של הסרט (אם קיים)
    
    פורמט רצוי:
    שם הסרט (ז'אנר1, ז'אנר2) – שנה  
    https://www.imdb.com/title/ttXXXXXXX/
    
    ⚠️ אין לכלול תיאורים, הסברים, משפטי סיום או מלל נוסף. הצג רק את הרשימה בפורמט שהוגדר, בצורה טכנית ומסודרת.`;
    


    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant who recommends movies.",
        },
        { role: "user", content: prompt },
      ],
    });

    const recommendations = completion.choices[0].message.content.trim();

    res.json({ recommendations });
  } catch (error) {
    console.error("Error in /recommend:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
