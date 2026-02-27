from transformers import pipeline

# Load a lightweight Zero-Shot Classification model
# 'facebook/bart-large-mnli' is powerful, but 'typeform/distilbert-base-uncased-mnli' is faster for kiosks
classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")

# Define our SUVIDHA Departments
DEPARTMENTS = ["Electricity", "Water Supply", "Gas Pipeline", "Waste Management", "Public Safety"]

def categorize_complaint(text: str) -> dict:
    """
    Analyzes the complaint text to determine the Department and Priority.
    """
    # 1. Determine Department
    result = classifier(text, candidate_labels=DEPARTMENTS)
    top_department = result['labels'][0]
    confidence = result['scores'][0]

    # 2. Determine Priority Logic
    # We look for 'Emergency Keywords' to bump priority
    emergency_keywords = ["spark", "fire", "current", "leak", "burst", "falling", "accident", "emergency"]
    
    priority = "Standard"
    if any(word in text.lower() for word in emergency_keywords):
        priority = "Critical"
    elif confidence > 0.9:
        priority = "High"

    return {
        "department": top_department,
        "priority": priority,
        "confidence_score": round(confidence, 2),
        "original_text": text
    }