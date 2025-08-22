
import React, { useState } from 'react';
import { ImageBrief } from '../types';
import { generateImageBrief, generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { DownloadIcon } from './icons/Icons';

const ImageBriefCreator: React.FC = () => {
    const [concept, setConcept] = useState<string>('');
    const [brief, setBrief] = useState<ImageBrief | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loadingState, setLoadingState] = useState<'idle' | 'briefing' | 'imaging'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleGenerateBrief = async () => {
        if (!concept.trim()) {
            setError('Please enter a concept.');
            return;
        }
        setLoadingState('briefing');
        setError(null);
        setBrief(null);
        setImageUrl(null);
        try {
            const result = await generateImageBrief(concept);
            setBrief(result);
        } catch (e) {
            setError('Failed to generate brief. Please try again.');
            console.error(e);
        } finally {
            setLoadingState('idle');
        }
    };
    
    const handleGenerateImage = async () => {
        if (!brief) return;

        setLoadingState('imaging');
        setError(null);
        setImageUrl(null);
        try {
            const fullPrompt = `${brief.title}. ${brief.description}. Style: ${brief.style}. Keywords: ${brief.keywords.join(', ')}`;
            const resultUrl = await generateImage(fullPrompt);
            setImageUrl(resultUrl);
        } catch (e) {
            setError('Failed to generate image. Please try again.');
            console.error(e);
        } finally {
            setLoadingState('idle');
        }
    };

    const handleDownloadImage = () => {
        if (!imageUrl || !brief) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${brief.title.replace(/\s+/g, '_').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">AI Image Generator</h2>
                <p className="mt-2 text-lg text-gray-400">Transform your ideas into visual concepts. Generate a detailed creative brief, then create a stunning image from it.</p>
            </header>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                <label htmlFor="concept" className="block text-sm font-medium text-gray-300">
                    Your Concept
                </label>
                <textarea
                    id="concept"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., A majestic lion wearing a crown in a futuristic city"
                    className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                    onClick={handleGenerateBrief}
                    disabled={loadingState !== 'idle'}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {loadingState === 'briefing' ? <><LoadingSpinner /> Generating Brief...</> : '1. Generate Creative Brief'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {brief && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">Creative Brief</h3>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 space-y-4">
                            <div>
                                <h4 className="font-bold text-indigo-400">Title</h4>
                                <p className="text-gray-300">{brief.title}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-400">Description</h4>
                                <p className="text-gray-300">{brief.description}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-400">Style</h4>
                                <p className="text-gray-300">{brief.style}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-400">Keywords</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {brief.keywords.map((kw, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                         <button
                            onClick={handleGenerateImage}
                            disabled={loadingState !== 'idle'}
                            className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loadingState === 'imaging' ? <><LoadingSpinner /> Generating Image...</> : '2. Generate Image'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-semibold text-white">Generated Image</h3>
                            {imageUrl && (
                                <button
                                    onClick={handleDownloadImage}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-all duration-200"
                                    aria-label="Download generated image"
                                >
                                    <DownloadIcon />
                                    Download
                                </button>
                            )}
                        </div>
                        <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center p-2">
                            {loadingState === 'imaging' && <LoadingSpinner size="lg" />}
                            {imageUrl && <img src={imageUrl} alt={brief.title} className="rounded-md object-contain w-full h-full" />}
                            {loadingState !== 'imaging' && !imageUrl && <p className="text-gray-500">Image will appear here</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageBriefCreator;