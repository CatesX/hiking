
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice, Mountain, WeatherInfo, Guide } from './types';

const getAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHikingAdvice = async (mountain: Mountain, weather: WeatherInfo): Promise<AIAdvice> => {
  const ai = getAIInstance();
  const prompt = `
    你是一位活泼有趣的南京资深爬山领队“南京爬山哥”。
    用户准备去爬 ${mountain.name} (${mountain.englishName})。
    当前天气情况：${weather.description}, 气温 ${weather.temp}°C。
    请根据这座山的难度(${mountain.difficulty})和天气，给出专业的建议。
    建议必须包含：
    1. 装备建议 (5-8个)
    2. 餐食/零食建议 (3-5个)
    3. 一个有趣的提示或加油鼓励。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
            food: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.STRING }
          },
          required: ["equipment", "food", "tips"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      equipment: ["速干衣", "登山鞋", "1.5L水", "充电宝"],
      food: ["香蕉", "巧克力"],
      tips: "哎呀，信号不好，但爬山哥提醒你：安全第一！"
    };
  }
};

export const getNanjingHikingGuides = async (): Promise<Guide[]> => {
  const ai = getAIInstance();
  const prompt = `为南京爬山爱好者生成3条简短、有趣、地道的爬山攻略。
    1条关于户外安全，1条关于南京推荐的日落/拍照点，1条关于文明爬山。
    每条攻略都要带一点南京方言味道（如“韶一韶”、“多大点事”）。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['safety', 'spot', 'etiquette'] }
            },
            required: ["title", "content", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return [
      { title: "安全第一", content: "爬山表逞强，水带够，早点回。多大点事，安全最重要！", category: 'safety' }
    ];
  }
};
