
import React, { useState } from 'react';
import { ToolType } from './types';
import Sidebar from './components/Sidebar';
import ArticleIdeaGenerator from './components/ArticleIdeaGenerator';
import SocialMediaPostCrafter from './components/SocialMediaPostCrafter';
import ImageBriefCreator from './components/ImageBriefCreator';
import CreativeWriter from './components/CreativeWriter';
import CodeGenerator from './components/CodeGenerator';
import AudioTools from './components/AudioTools';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.ARTICLE_IDEAS);

  const renderActiveTool = () => {
    switch (activeTool) {
      case ToolType.ARTICLE_IDEAS:
        return <ArticleIdeaGenerator />;
      case ToolType.SOCIAL_MEDIA_POSTS:
        return <SocialMediaPostCrafter />;
      case ToolType.CREATIVE_WRITER:
        return <CreativeWriter />;
      case ToolType.IMAGE_BRIEFS:
        return <ImageBriefCreator />;
      case ToolType.CODE_GENERATOR:
        return <CodeGenerator />;
      case ToolType.AUDIO_TOOLS:
        return <AudioTools />;
      default:
        return <ArticleIdeaGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;