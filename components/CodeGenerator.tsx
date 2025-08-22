
import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CopyIcon, DownloadIcon } from './icons/Icons';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'HTML', 'CSS'];
const FILE_EXTENSIONS: { [key: string]: string } = {
    'JavaScript': 'js',
    'Python': 'py',
    'Java': 'java',
    'C++': 'cpp',
    'TypeScript': 'ts',
    'Go': 'go',
    'Rust': 'rs',
    'HTML': 'html',
    'CSS': 'css',
};


const CodeGenerator: React.FC = () => {
    const [description, setDescription] = useState<string>('');
    const [language, setLanguage] = useState<string>('JavaScript');
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please enter a description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCode('');
        try {
            const result = await generateCode(description, language);
            setCode(result);
        } catch (e) {
            setError('Failed to generate code. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleDownload = () => {
        if (!code) return;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generated_code.${FILE_EXTENSIONS[language] || 'txt'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">AI Code Generator</h2>
                <p className="mt-2 text-lg text-gray-400">Describe the code you want, pick a language, and let AI do the heavy lifting.</p>
            </header>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="code-description" className="block text-sm font-medium text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="code-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., A function to fetch data from an API and handle errors"
                            className="w-full mt-1 h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                            Language
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full mt-1 h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            {LANGUAGES.map(lang => <option key={lang}>{lang}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isLoading ? <><LoadingSpinner /> Generating...</> : 'Generate Code'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {code && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                         <h3 className="text-2xl font-semibold text-white">Generated Code</h3>
                         <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                aria-label="Copy code to clipboard"
                            >
                                {copied ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon />}
                            </button>
                             <button
                                onClick={handleDownload}
                                className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                aria-label="Download code snippet"
                            >
                                <DownloadIcon />
                            </button>
                         </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <pre className="text-gray-200 whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                            <code>{code}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeGenerator;
