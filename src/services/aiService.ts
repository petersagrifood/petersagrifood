import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey });

export async function analyzeHRData(data: any) {
  try {
    const prompt = `Bạn là một chuyên gia quản trị nhân sự (HR) của Sagrifood. 
    Dưới đây là dữ liệu thô về chấm công và yêu cầu của nhân viên tháng này:
    ${JSON.stringify(data)}
    
    Hãy phân tích và đưa ra 3-5 nhận xét quan trọng về:
    1. Hiệu suất làm việc (Ai đi làm đầy đủ nhất).
    2. Các vấn đề bất thường (Đi trễ nhiều, trạm nào áp lực cao).
    3. Đề xuất cải thiện.
    
    Trả về kết quả bằng tiếng Việt, định dạng Markdown ngắn gọn, súc tích.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Không thể thực hiện phân tích lúc này. Vui lòng thử lại sau.";
  }
}

export async function chatWithHR(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Bạn là trợ lý ảo HR của Sagrifood, tên là SagriBot. Bạn giúp nhân viên và quản lý giải đáp thắc mắc về chính sách, chấm công và quy trình nội bộ của Sagrifood. Hãy trả lời thân thiện, chuyên nghiệp và ngắn gọn.",
      }
    });

    // Note: The SDK might handle history differently depending on version, 
    // but following the pattern for sendMessage
    const response = await chat.sendMessage({
      message
    });

    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Tôi gặp sự cố nhỏ, bạn có thể hỏi lại được không?";
  }
}
