import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../../core/types';
import { UserIcon } from '../icons/UserIcon';

const API_KEY = process.env.API_KEY;

// System instruction for the AI model
// FIX: Changed systemInstruction to a string and will pass it in the config object, as per Gemini API guidelines.
const systemInstruction = "Eres un asistente médico experto en infectología. Tu propósito es proporcionar información clara, concisa y basada en evidencia sobre enfermedades infecciosas, tratamientos y pautas clínicas. Responde a las preguntas del personal médico de manera profesional. Siempre aclara que eres un modelo de IA y que tu consejo no reemplaza el juicio clínico de un profesional de la salud calificado. No proporciones diagnósticos ni planes de tratamiento para pacientes específicos.";

export default function ChatComponent() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    async function initializeChat() {
      try {
        if (!API_KEY) {
          throw new Error("API_KEY no encontrada. Asegúrese de que esté configurada en las variables de entorno.");
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          // FIX: Pass systemInstruction through the config object.
          config: {
            systemInstruction: systemInstruction,
          },
        });
        setChat(newChat);
      } catch (e: any) {
        console.error("Error al inicializar el chat:", e);
        setError(e.message || "No se pudo conectar con el servicio de IA.");
      }
    }
    initializeChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: userInput }],
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const responseStream = await chat.sendMessageStream({ message: userInput });

      let currentModelMessage = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of responseStream) {
        currentModelMessage += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: currentModelMessage }]};
            return newMessages;
        });
      }
    } catch (e: any) {
      console.error("Error al enviar mensaje:", e);
      setError("Error al obtener la respuesta del asistente. Por favor, intente de nuevo.");
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Lo siento, ocurrió un error.' }]}]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
        <header className="p-4 border-b">
            <h2 className="text-xl font-bold text-brand-blue">Asistente de Infectología (IA)</h2>
            <p className="text-sm text-slate-500">Consulta de información general. No sustituye el juicio clínico.</p>
        </header>
        
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-brand-blue flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                           IA
                        </div>
                    )}
                    <div className={`max-w-lg p-3 rounded-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-brand-gray'}`}>
                       {msg.parts[0].text}
                    </div>
                     {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-slate-500"/>
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-3 justify-start">
                     <div className="w-8 h-8 rounded-full bg-brand-blue flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                           IA
                     </div>
                     <div className="max-w-lg p-3 rounded-lg bg-slate-100 text-brand-gray">
                        <span className="animate-pulse">Escribiendo...</span>
                     </div>
                </div>
            )}
            {error && <p className="text-brand-red text-center">{error}</p>}
        </div>

        <div className="p-4 border-t bg-slate-50">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isLoading ? "Esperando respuesta..." : "Escriba su pregunta aquí..."}
                    className="w-full p-2 border rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                    disabled={isLoading || !chat}
                    aria-label="Mensaje para el asistente de IA"
                />
                <button
                    type="submit"
                    disabled={isLoading || !userInput.trim() || !chat}
                    className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    Enviar
                </button>
            </form>
        </div>
    </div>
  );
}