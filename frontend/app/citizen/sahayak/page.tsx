"use client";
import React, { useState } from 'react';

const SahayakKiosk = () => {
    const [status, setStatus] = useState("System Ready");
    const [isListening, setIsListening] = useState(false);
    const [result, setResult] = useState<{userSaid: string, target: string} | null>(null);

    const startVoiceAssist = async () => {
        setIsListening(true);
        setStatus("Listening... Speak Now");
        
        try {
            // Seedha Node.js Backend (port 5000) ko call karein
            const response = await fetch('http://localhost:5000/api/voice-proxy', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.status === "success") {
                setStatus("Request Processed!");
                setResult({
                    userSaid: data.user_said,
                    target: data.target_screen
                });
            } else {
                setStatus("No input detected or Error.");
            }
        } catch (error) {
            setStatus("Error: Node.js Backend Offline");
            console.error(error);
        } finally {
            setIsListening(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-10 font-sans text-slate-800">
            {/* Main Kiosk Card */}
            <div className="bg-white p-12 rounded-[24px] shadow-lg text-center mb-10 border border-slate-100">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" 
                    className="w-24 h-24 mx-auto mb-5 drop-shadow-md" 
                    alt="Sahayak Logo" 
                />
                <h1 className="text-[#4f46e5] text-5xl font-extrabold mb-2">SUVIDHA SAHAYAK</h1>
                <p className="text-slate-500 text-lg mb-8">Aapka AI-Powered Citizen Assistant</p>
                
                <div className={`mb-5 font-semibold text-sm px-4 py-2 rounded-xl inline-block ${isListening ? 'text-red-500 bg-red-50' : 'text-[#4f46e5] bg-indigo-50'}`}>
                    {status}
                </div>

                <button 
                    onClick={startVoiceAssist}
                    className={`block mx-auto px-12 py-5 rounded-2xl text-xl font-bold transition-all shadow-xl
                        ${isListening ? 'bg-red-500 animate-pulse scale-95' : 'bg-[#4f46e5] hover:bg-indigo-700 hover:-translate-y-1'} text-white`}
                >
                    🎤 Talk to Sahayak
                </button>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                {[
                    { icon: '⚡', name: 'Electricity' },
                    { icon: '💧', name: 'Water Supply' },
                    { icon: '♻️', name: 'Waste Mgmt.' },
                    { icon: '🏛️', name: 'Nagar Nigam' },
                    { icon: '🔥', name: 'Gas Dist.' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:-translate-y-2 transition-transform shadow-sm">
                        <span className="text-3xl block mb-2">{item.icon}</span>
                        <h3 className="font-bold text-slate-700">{item.name}</h3>
                    </div>
                ))}
            </div>

            {/* Result Box */}
            {result && (
                <div className="bg-slate-50 p-6 rounded-2xl mt-8 border-l-8 border-[#4f46e5] animate-in fade-in slide-in-from-bottom-5">
                    <h4 className="text-[#4f46e5] font-bold mb-3">📡 Real-time Intent Detection</h4>
                    <p><b>Aapne Kaha:</b> <span className="text-red-500">"{result.userSaid}"</span></p>
                    <p><b>Target Screen:</b> <span className="text-green-600 font-bold">{result.target}</span></p>
                </div>
            )}
        </div>
    );
};

export default SahayakKiosk;