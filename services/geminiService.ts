
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ArticleIdea, SocialPost, ImageBrief } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const articleIdeasSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "A catchy and relevant title for a blog post or article."
            },
            outline: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: "A list of 3-5 key points or sections for the article outline."
            }
        },
        required: ["title", "outline"]
    }
};

const socialPostSchema = {
    type: Type.OBJECT,
    properties: {
        postText: {
            type: Type.STRING,
            description: "The main content of the social media post, engaging and platform-appropriate."
        },
        hashtags: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of relevant hashtags, without the '#' symbol."
        }
    },
    required: ["postText", "hashtags"]
};

const imageBriefSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, evocative title for the image concept."
        },
        description: {
            type: Type.STRING,
            description: "A detailed, vivid description of the scene, characters, and actions for the image."
        },
        style: {
            type: Type.STRING,
            description: "The artistic style of the image (e.g., photorealistic, anime, watercolor, cinematic)."
        },
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of keywords that capture the essence of the image."
        }
    },
    required: ["title", "description", "style", "keywords"]
};

export const generateArticleIdeas = async (topic: string): Promise<ArticleIdea[]> => {
    const prompt = `Generate 5 creative article ideas based on the following topic: "${topic}". For each idea, provide a compelling title and a brief 3-5 point outline.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: articleIdeasSchema
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ArticleIdea[];
};

export const generateSocialMediaPost = async (topic: string, platform: string): Promise<SocialPost> => {
    const prompt = `Craft a social media post for ${platform} about the topic: "${topic}". The post should be engaging, concise, and appropriate for the platform's audience. Include relevant hashtags.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: socialPostSchema
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as SocialPost;
};

export const generateImageBrief = async (concept: string): Promise<ImageBrief> => {
    const prompt = `Create a detailed creative brief for an image based on this concept: "${concept}". The brief should include a title, a detailed description of the scene, a suggested artistic style, and relevant keywords.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: imageBriefSchema
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ImageBrief;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation failed or returned no images.");
};

export const generateCode = async (description: string, language: string): Promise<string> => {
    const prompt = `Generate a single, complete code snippet in ${language} for the following task: "${description}". Only output the raw code, with no extra explanations, no comments about the code, and no markdown formatting.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    let code = response.text.trim();
    const codeBlockRegex = new RegExp("^\`\`\`" + language.toLowerCase() + "\\n([\\s\\S]*?)\\n\`\`\`$");
    const match = code.match(codeBlockRegex);

    if (match && match[1]) {
        return match[1].trim();
    }
    if (code.startsWith('```') && code.endsWith('```')) {
       code = code.substring(code.indexOf('\n') + 1, code.lastIndexOf('```')).trim();
    }
    return code;
};

export const generateCreativeTextStream = async (prompt: string) => {
    const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return stream;
};