from pydantic import BaseModel
from typing import Optional

class DocumentPayload(BaseModel):
    raw_text: str
    doc_type: str  # e.g., "utility_bill", "aadhar", "complaint"
    detected_logo: Optional[str] = ""

class OCRResponse(BaseModel):
    status: str
    doc_type: str
    extracted_info: dict