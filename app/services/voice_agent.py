import speech_recognition as sr
from gtts import gTTS
import pygame
import os
import time

class SahayakCounselor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        # Keywords based on your Technical Proforma (Page 2 & 7)
        self.intent_map = {
            "payment": ["bill", "pay", "payment", "bharna", "paisa", "receipt"],
            "complaint": ["shikayat", "complaint", "issue", "problem", "broken", "leakage", "spark"],
            "new_connection": ["new", "connection", "apply", "naya", "nayi", "gas", "meter"],
            "status": ["track", "status", "check", "kahan", "update"],
            "help": ["help", "kaise", "how", "sahayak", "madad"]
        }

    def listen(self):
        """STT: User -> Machine (Captures Hindi/English Audio)"""
        with sr.Microphone() as source:
            print("Sahayak is listening...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
            try:
                # 'hi-IN' supports both Hindi and English (Code-mixing)
                text = self.recognizer.recognize_google(audio, language='hi-IN')
                return text
            except Exception:
                return ""

    def process_intent(self, text: str):
        """AI Logic: Understands SUVIDHA Problem Statement goals"""
        text = text.lower()
        
        if any(word in text for word in self.intent_map["payment"]):
            return {"action": "NAVIGATE", "target": "BillPayments", "msg": "Ji, main aapko Bill Payment page par le ja raha hoon."}
            
        elif any(word in text for word in self.intent_map["complaint"]):
            return {"action": "NAVIGATE", "target": "CivicComplaint", "msg": "Shikayat darj karne ke liye portal khul raha hai."}
            
        elif any(word in text for word in self.intent_map["new_connection"]):
            return {"action": "NAVIGATE", "target": "NewConnection", "msg": "Naye connection ke liye application form khul raha hai."}
            
        elif any(word in text for word in self.intent_map["status"]):
            return {"action": "NAVIGATE", "target": "ComplaintTracking", "msg": "Aapki shikayat ka status yahan dikhayi dega."}
            
        return {"action": "CHAT", "target": "home", "msg": "Main Sahayak hoon. Kya main aapki bill ya shikayat mein madad karun?"}

    def speak(self, response_text: str):
        """TTS: Machine -> User (Hindi/English Voice Output)"""
        tts = gTTS(text=response_text, lang='hi')
        filename = "response.mp3"
        tts.save(filename)
        
        pygame.mixer.init()
        pygame.mixer.music.load(filename)
        pygame.mixer.music.play()
        
        while pygame.mixer.music.get_busy():
            time.sleep(0.1)
        
        pygame.mixer.quit()
        os.remove(filename) 