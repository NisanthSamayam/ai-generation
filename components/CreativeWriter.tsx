
import React, { useState } from 'react';
import { generateCreativeTextStream } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CopyIcon } from './icons/Icons';

const CreativeWriter: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedText, setGeneratedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedText('');
        try {
            const stream = await generateCreativeTextStream(prompt);
            for await (const chunk of stream) {
                setGeneratedText((prev) => prev + chunk.text);
            }
        } catch (e) {
            setError('Failed to generate text. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Creative Writer</h2>
                <p className="mt-2 text-lg text-gray-400">Your AI partner for brainstorming, writing, and rewriting. Enter any prompt and see what happens.</p>
            </header>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                    Your Prompt
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a short story about a robot who discovers music."
                    className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? <><LoadingSpinner /> Generating...</> : 'Generate Text'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {generatedText && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-white">Generated Text</h3>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            aria-label="Copy text to clipboard"
                        >
                            {copied ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon />}
                        </button>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                        <p className="text-gray-200 whitespace-pre-wrap">{generatedText}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreativeWriter;
