
import React, { useState } from 'react';
import { ArticleIdea } from '../types';
import { generateArticleIdeas } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CopyIcon } from './icons/Icons';

const ArticleIdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [ideas, setIdeas] = useState<ArticleIdea[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas(null);
        try {
            const result = await generateArticleIdeas(topic);
            setIdeas(result);
        } catch (e) {
            setError('Failed to generate ideas. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (idea: ArticleIdea, index: number) => {
        const textToCopy = `Title: ${idea.title}\n\nOutline:\n${idea.outline.map(point => `- ${point}`).join('\n')}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Article Idea Generator</h2>
                <p className="mt-2 text-lg text-gray-400">Never run out of content ideas. Enter a topic and get a list of creative article titles and outlines.</p>
            </header>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300">
                    Topic
                </label>
                <textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The future of renewable energy"
                    className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    aria-label="Article topic input"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? <><LoadingSpinner /> Generating...</> : 'Generate Ideas'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {ideas && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Generated Ideas</h3>
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-5 transition-transform hover:scale-[1.02] duration-200">
                            <div className="flex justify-between items-start">
                                <h4 className="text-xl font-bold text-blue-400 flex-1 pr-4">{idea.title}</h4>
                                <button
                                    onClick={() => handleCopy(idea, index)}
                                    className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Copy idea to clipboard"
                                >
                                    {copiedIndex === index ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon />}
                                </button>
                            </div>
                            <ul className="mt-3 list-disc list-inside space-y-1 text-gray-300">
                                {idea.outline.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleIdeaGenerator;