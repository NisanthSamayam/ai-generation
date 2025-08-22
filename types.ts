
export enum ToolType {
  ARTICLE_IDEAS = 'ARTICLE_IDEAS',
  SOCIAL_MEDIA_POSTS = 'SOCIAL_MEDIA_POSTS',
  CREATIVE_WRITER = 'CREATIVE_WRITER',
  IMAGE_BRIEFS = 'IMAGE_BRIEFS',
  CODE_GENERATOR = 'CODE_GENERATOR',
  AUDIO_TOOLS = 'AUDIO_TOOLS',
}

export interface ArticleIdea {
  title: string;
  outline: string[];
}

export interface SocialPost {
  postText: string;
  hashtags: string[];
}

export interface ImageBrief {
  title: string;
  description: string;
  style: string;
  keywords: string[];
}