import hashlib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

# 1. Import all modules: OCR, NLP, and the new Voice Counselor
from app.services.ocr_parser import (
    extract_utility_data, 
    extract_aadhar_data, 
    check_duplicate_complaint, 
    extract_supporting_document
)
from app.services.complaint_router import categorize_complaint
from app.services.voice_agent import SahayakCounselor

app = FastAPI(
    title="SUVIDHA AI Engine", 
    description="Backend for OCR, Smart Routing, and Sahayak Voice Assistant",
    version="1.0"
)

# Initialize the Sahayak Voice Agent
sahayak = SahayakCounselor()

# Pydantic Models

class DocumentPayload(BaseModel):
    raw_text: str
    doc_type: str 
    detected_logo: Optional[str] = ""

class ComplaintPayload(BaseModel):
    complaint_text: str

class OCRResponse(BaseModel):
    status: str
    doc_type: str
    extracted_info: Dict[str, Any]

# FEATURE 1: Smart Document Scanner (OCR)

@app.post("/api/ocr/process-document", response_model=OCRResponse)
async def process_document(payload: DocumentPayload):
    doc_type = payload.doc_type.lower()
    text = payload.raw_text
    
    if not text:
        raise HTTPException(status_code=400, detail="Raw text cannot be empty.")

    response_data = {"status": "success", "doc_type": doc_type, "extracted_info": {}}

    try:
        if doc_type == "electricity_bill":
            response_data["extracted_info"] = extract_utility_data(text, utility_type="electricity")
        elif doc_type == "gas_bill":
            response_data["extracted_info"] = extract_utility_data(text, utility_type="gas")
        elif doc_type == "aadhar":
            response_data["extracted_info"] = extract_aadhar_data(text)
        elif doc_type == "complaint":
            response_data["extracted_info"] = check_duplicate_complaint(text)
        elif doc_type in ["income_certificate", "police_fir", "rent_agreement"]:
            response_data["extracted_info"] = extract_supporting_document(text, doc_type)
        else:
            raise HTTPException(status_code=400, detail="Invalid doc_type.")

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# FEATURE 2: Smart Complaint Routing & Ticket Generation

@app.post("/api/complaints/analyze")
async def analyze_complaint(payload: ComplaintPayload):
    if not payload.complaint_text:
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty.")

    try:
        analysis = categorize_complaint(payload.complaint_text)
        ticket_hash = hashlib.md5(payload.complaint_text.encode()).hexdigest()[:8].upper()
        ticket_id = f"SUVIDHA-{ticket_hash}"
        
        return {
            "status": "success",
            "ticket_id": ticket_id,
            "department": analysis["department"],
            "priority": analysis["priority"],
            "message": f"Routed to {analysis['department']} department."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# FEATURE 3: Sahayak Multi-Voice Counselor (STT -> Intent -> TTS)

@app.post("/api/sahayak/voice-assist")
async def voice_assist():
    """
    STT: User -> Machine | Logic: Dashboard Intent | TTS: Machine -> User
    """
    try:
        # 1. Capture user voice and convert to text (Hindi/English)
        user_query = sahayak.listen()
        
        if not user_query:
            return {"status": "error", "message": "No voice input detected."}
        
        # 2. Map query to SUVIDHA Dashboard Actions (Payment, Connection, Tracking, etc.)
        result = sahayak.process_intent(user_query)
        
        # 3. Speak the response back to the citizen via Kiosk speakers
        sahayak.speak(result["msg"])
        
        return {
            "status": "success",
            "user_said": user_query,
            "action": result["action"],
            "target_screen": result["target"],
            "voice_response": result["msg"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice Assistant Error: {str(e)}")

# Run: uvicorn app.main:app --reload