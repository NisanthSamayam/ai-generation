
import React from 'react';
import { ToolType } from '../types';
import { ArticleIcon, SocialIcon, ImageIcon, BrandIcon, QuillIcon, CodeIcon, AudioIcon } from './icons/Icons';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const navItems = [
    { type: ToolType.ARTICLE_IDEAS, label: 'Article Ideas', icon: <ArticleIcon /> },
    { type: ToolType.SOCIAL_MEDIA_POSTS, label: 'Social Posts', icon: <SocialIcon /> },
    { type: ToolType.CREATIVE_WRITER, label: 'Creative Writer', icon: <QuillIcon /> },
    { type: ToolType.IMAGE_BRIEFS, label: 'Image Generator', icon: <ImageIcon /> },
    { type: ToolType.CODE_GENERATOR, label: 'Code Generator', icon: <CodeIcon /> },
    { type: ToolType.AUDIO_TOOLS, label: 'Audio Tools', icon: <AudioIcon /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700/50 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <BrandIcon />
          <h1 className="text-xl font-bold text-white tracking-wide">Content Studio</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.type}
              onClick={() => onSelectTool(item.type)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ${
                activeTool === item.type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
       <div className="text-center text-xs text-gray-500">
        <p>Powered by Gemini</p>
      </div>
    </aside>
  );
};

export default Sidebar;