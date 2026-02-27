import re
import hashlib

# Mock database for duplicate detection
PROCESSED_COMPLAINTS_HASHES = set()

def extract_utility_data(text: str, utility_type: str = "electricity") -> dict:
    """
    Extracts utility numbers based on your schema (IVRS or Gas No),
    plus billing amounts and pincode.
    """
    data = {
        "ivrs_no": None,
        "gas_no": None,
        "amount_due": None,
        "pin_code": None
    }
    
    # Extract Amount
    amount_match = re.search(r'(?:Net Amount|Payable|Total|Rs\.?|₹)\s*[:\-]?\s*([\d,]+\.\d{2}|\d+)', text, re.IGNORECASE)
    if amount_match:
        data["amount_due"] = amount_match.group(1)

    # Extract 6-digit Pincode from the address block
    pin_match = re.search(r'\b(\d{6})\b', text)
    if pin_match:
        data["pin_code"] = pin_match.group(1)

    # Extract specific utility ID based on the document type
    if utility_type == "electricity":
        # Includes the fix for "IVRS no."
        ivrs_match = re.search(r'(?:IVRS\s*(?:no\.?|number)?|K\s*[-]?\s*No|Consumer\s*No)[\s:\.\-]*([A-Z0-9]{9,15})', text, re.IGNORECASE)
        if ivrs_match:
            data["ivrs_no"] = ivrs_match.group(1)
            
    elif utility_type == "gas":
        gas_match = re.search(r'(?:CRN|BP\s*No|Gas\s*No)[\s:\.\-]*([A-Z0-9]{8,15})', text, re.IGNORECASE)
        if gas_match:
            data["gas_no"] = gas_match.group(1)
            
    return data

def extract_aadhar_data(text: str) -> dict:
    """
    Extracts core demographic data mapping directly to the USER schema.
    """
    data = {
        "adhaar_no": None,
        "dob": None,
        "gender": None,
        "phone": None,
        "email": None,
        "pin_code": None
    }
    
    aadhar_match = re.search(r'\b(\d{4}\s?\d{4}\s?\d{4})\b', text)
    if aadhar_match:
        data["adhaar_no"] = aadhar_match.group(1).replace(" ", "")

    dob_match = re.search(r'(?:DOB|Year of Birth|YOB).*?(\d{2}[/-]\d{2}[/-]\d{4}|\d{4})', text, re.IGNORECASE)
    if dob_match:
        data["dob"] = dob_match.group(1)

    gender_match = re.search(r'\b(Male|Female|Transgender)\b', text, re.IGNORECASE)
    if gender_match:
        data["gender"] = gender_match.group(1).capitalize()

    phone_match = re.search(r'\b([6-9]\d{9})\b', text)
    if phone_match:
        data["phone"] = phone_match.group(1)

    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', text)
    if email_match:
        data["email"] = email_match.group(0).lower()

    pin_match = re.search(r'\b(\d{6})\b', text)
    if pin_match:
        data["pin_code"] = pin_match.group(1)
        
    return data

def extract_supporting_document(text: str, doc_type: str) -> dict:
    """
    Extracts key verification data from secondary documents like
    Rent Agreements, FIRs, and Income Certificates.
    """
    data = {
        "document_type": doc_type,
        "registration_no": None,
        "key_value": None # Could be Income Amount, Rent Amount, or FIR Date
    }
    
    if doc_type == "income_certificate":
        # Look for Certificate No and Annual Income
        cert_match = re.search(r'(?:Certificate\s*No|Registration\s*No)[\s:\.\-]*([A-Z0-9/]+)', text, re.IGNORECASE)
        if cert_match:
            data["registration_no"] = cert_match.group(1)
            
        income_match = re.search(r'(?:Annual\s*Income|Income|Rs\.?|₹)\s*[:\-]?\s*([\d,]+)', text, re.IGNORECASE)
        if income_match:
            data["key_value"] = f"Income: ₹{income_match.group(1)}"
            
    elif doc_type == "police_fir":
        # Look for FIR No and Date
        fir_match = re.search(r'(?:FIR\s*No|Crime\s*No)[\s:\.\-]*([A-Z0-9/]+)', text, re.IGNORECASE)
        if fir_match:
            data["registration_no"] = fir_match.group(1)
            
        date_match = re.search(r'(?:Date)[\s:\.\-]*(\d{2}[/-]\d{2}[/-]\d{4})', text, re.IGNORECASE)
        if date_match:
            data["key_value"] = f"Date: {date_match.group(1)}"
            
    elif doc_type == "rent_agreement":
        # Look for Monthly Rent
        rent_match = re.search(r'(?:Monthly\s*Rent|Rent|Rs\.?|₹)\s*[:\-]?\s*([\d,]+)', text, re.IGNORECASE)
        if rent_match:
            data["key_value"] = f"Rent: ₹{rent_match.group(1)}"

    return data

def check_duplicate_complaint(text: str) -> dict:
    """Creates a unique hash to detect duplicate complaints."""
    clean_text = re.sub(r'\s+', ' ', text.strip().lower())
    text_hash = hashlib.md5(clean_text.encode('utf-8')).hexdigest()
    
    if text_hash in PROCESSED_COMPLAINTS_HASHES:
        return {"is_duplicate": True, "message": "This document has already been uploaded."}
    
    PROCESSED_COMPLAINTS_HASHES.add(text_hash)
    return {"is_duplicate": False, "message": "New document verified."}