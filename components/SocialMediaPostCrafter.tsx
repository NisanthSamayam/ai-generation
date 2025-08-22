
import React, { useState } from 'react';
import { SocialPost } from '../types';
import { generateSocialMediaPost } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CopyIcon } from './icons/Icons';

const SocialMediaPostCrafter: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [platform, setPlatform] = useState<string>('Twitter');
    const [post, setPost] = useState<SocialPost | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPost(null);
        try {
            const result = await generateSocialMediaPost(topic, platform);
            setPost(result);
        } catch (e) {
            setError('Failed to generate post. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!post) return;
        const textToCopy = `${post.postText}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Social Media Post Crafter</h2>
                <p className="mt-2 text-lg text-gray-400">Generate engaging social media posts tailored for your chosen platform.</p>
            </header>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="social-topic" className="block text-sm font-medium text-gray-300">
                            Topic
                        </label>
                        <textarea
                            id="social-topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., A new feature launch for a productivity app"
                            className="w-full mt-1 h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="platform" className="block text-sm font-medium text-gray-300">
                            Platform
                        </label>
                        <select
                            id="platform"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full mt-1 h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option>Twitter</option>
                            <option>LinkedIn</option>
                            <option>Facebook</option>
                            <option>Instagram</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? <><LoadingSpinner /> Generating...</> : 'Generate Post'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {post && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-white">Generated {platform} Post</h3>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                        <div className="flex justify-between items-start">
                            <p className="text-gray-200 whitespace-pre-wrap flex-1 pr-4">{post.postText}</p>
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                aria-label="Copy post to clipboard"
                            >
                                {copied ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon />}
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.hashtags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialMediaPostCrafter;