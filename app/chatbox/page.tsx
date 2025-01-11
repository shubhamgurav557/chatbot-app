'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiDownload, FiCopy, FiSend } from 'react-icons/fi';
import ProfileHeader from '../components/ProfileHeader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ChatPage = () => {
    const navigate = useRouter();
    const { data: session, status } = useSession();

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/genai',
    });

    const [showPreview, setShowPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const previewIframeRef = useRef<HTMLIFrameElement | null>(null);

    const downloadCode = (code: string, filename: string) => {
        const blob = new Blob([code], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            navigate.push('/');
        }
    }, [status, navigate]);
    

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handlePreviewClick = (htmlCode: string, idx: number) => {
        setShowPreview(!showPreview);
        setPreviewContent(htmlCode);

        
        if (!showPreview) {
            previewIframeRef.current?.focus();
        }
    };

    const handleSendMessage = async () => {
        try {
            setLoading(true);
            handleSubmit();
        } catch (err) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const parseLandingPageOutput = (content: string) => {
        const sections = content.split('\n');
        const headline = sections[0]?.replace(/^Headline: /, '').trim();
        const keyBenefits = sections.filter(line => line.startsWith('-')).map(line => line.replace('-', '').trim());
        const callToAction = sections.find(line => line.startsWith('Call-to-Action:'))?.replace(/^Call-to-Action: /, '').trim();

        return {
            headline,
            keyBenefits,
            callToAction,
        };
    };

    const formatExplanation = (explanation: string) => {
        return explanation.split('\n').map((line, index) => {
            const formattedLine = line.replace(/\*/g, '').trim();
            if (formattedLine.includes('<!DOCTYPE html>') || formattedLine.includes('html') || formattedLine.match(/<html[\s\S]*<\/html>/)) {
                return null;
            }

            if (formattedLine.startsWith('**')) {
                return (
                    <li key={index}>
                        <strong>{formattedLine.replace('**', '')}</strong>
                    </li>
                );
            }
            return <li key={index} className='mb-2'>{formattedLine}</li>;
        }).filter(Boolean);
    };

    return (
        <div className="h-screen bg-gray-100 p-6">
            <div className='flex items-center justify-between mb-7'>
                <h1 className="text-2xl font-bold text-center">Chat with GenAI</h1>
                <ProfileHeader />
            </div>
            <div className="max-w-7xl w-full h-full max-h-[90%] bg-white rounded-lg shadow-lg p-6 flex flex-col m-auto relative">
                {/* Messages container */}
                <div className="flex-1 space-y-4 overflow-y-auto px-2">
                    {messages.map((msg, idx) => {
                        if (msg.content.startsWith('`')) {
                            const contentWithoutBackticks = msg.content.replace(/`/g, '');
                            const htmlCodeMatch = contentWithoutBackticks.match(/<html[\s\S]*<\/html>/);
                            const htmlCode = htmlCodeMatch ? htmlCodeMatch[0] : null;
                            const explanation = contentWithoutBackticks.replace(htmlCode || '', '').trim();
                            const { headline, keyBenefits, callToAction } = parseLandingPageOutput(explanation);

                            return (
                                <div key={idx} className="mt-6">
                                    {htmlCode && (
                                        <div className="max-w-[80%] p-4 bg-gray-200 rounded-lg shadow-md">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-lg">Generated HTML Code:</h3>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handlePreviewClick(htmlCode, idx)}
                                                        className="bg-gray-800 text-white hover:bg-gray-900 p-2 flex items-center gap-2"
                                                        title='Preview'
                                                    >
                                                        {!showPreview ? <FiEye /> : <FiEyeOff />}
                                                    </Button>
                                                    <Button
                                                        onClick={() => downloadCode(htmlCode, 'generated_code.html')}
                                                        className="p-2 bg-blue-500 hover:bg-blue-600 flex items-center"
                                                        title='Download'
                                                    >
                                                        <FiDownload />
                                                    </Button>
                                                    <Button
                                                        onClick={() => copyToClipboard(htmlCode)}
                                                        className="p-2 bg-green-500 hover:bg-green-600 flex items-center"
                                                        title='Copy'
                                                    >
                                                        <FiCopy />
                                                    </Button>
                                                </div>
                                            </div>
                                            <pre className="whitespace-pre-wrap bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-4">
                                                <code>{htmlCode}</code>
                                            </pre>
                                            {explanation && (
                                                <div className="mt-4 text-sm text-gray-700">
                                                    <ul className="list-inside list-disc pl-5 mt-2">
                                                        {formatExplanation(explanation)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {showPreview && htmlCode && previewContent === htmlCode && (
                                        <div className="max-w-[80%] mt-4 bg-white border p-4 rounded-lg shadow-md">
                                            <h3 className="font-bold text-lg mb-2">Live Preview:</h3>
                                            <iframe
                                                ref={previewIframeRef}
                                                srcDoc={htmlCode}
                                                className="w-full h-96 border rounded-lg"
                                                title="HTML Preview"
                                                tabIndex={-1}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={idx}
                                    className={`${msg.role === 'user' ? 'ml-auto bg-emerald-500 text-white' : 'mr-auto bg-gray-100 text-black'
                                        } text-black p-3 rounded-lg text-sm max-w-[80%]`}
                                >
                                    {msg.content}
                                </div>
                            );
                        }
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {loading && (
                    <div className="pt-3 text-gray-600">
                        <p className="text-sm animate-pulse">Response is being generated{'.'.repeat((Math.floor(Date.now() / 1000) % 3) + 1)}</p>
                    </div>
                )}

                {/* Input and button */}
                <div className="flex items-center mt-4">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="ml-4 bg-gray-900 text-white hover:bg-gray-600">
                        <FiSend />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
