import { create } from "zustand";

export type Language = "en" | "hi" | "bn" | "ta" | "mr";

export interface LanguageOption {
    code: Language;
    label: string;
    nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
    { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
    { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
    { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
];

// Translation keys for the application
type TranslationKeys = {
    // Navigation
    "nav.dashboard": string;
    "nav.complaints": string;
    "nav.globalFeed": string;
    "nav.billPayments": string;
    "nav.services": string;
    "nav.documents": string;
    "nav.notifications": string;
    "nav.profile": string;
    "nav.signOut": string;
    "nav.lightMode": string;
    "nav.darkMode": string;
    // Dashboard
    "dashboard.welcome": string;
    "dashboard.overview": string;
    "dashboard.totalComplaints": string;
    "dashboard.pending": string;
    "dashboard.inProgress": string;
    "dashboard.resolved": string;
    "dashboard.fileNew": string;
    "dashboard.payBills": string;
    "dashboard.recentComplaints": string;
    "dashboard.viewAll": string;
    "dashboard.billsDue": string;
    "dashboard.noBills": string;
    // Complaints
    "complaints.title": string;
    "complaints.search": string;
    "complaints.filterByStatus": string;
    "complaints.filterByDept": string;
    "complaints.all": string;
    "complaints.newComplaint": string;
    "complaints.noComplaints": string;
    // Common
    "common.loading": string;
    "common.error": string;
    "common.retry": string;
    "common.submit": string;
    "common.cancel": string;
    "common.save": string;
    "common.delete": string;
    "common.back": string;
    "common.next": string;
    "common.language": string;
    // Admin
    "admin.dashboard": string;
    "admin.actionQueue": string;
    "admin.allComplaints": string;
    "admin.docVerification": string;
    "admin.reports": string;
    "admin.wardMap": string;
    // Departments
    "dept.electricity": string;
    "dept.water": string;
    "dept.roads": string;
    "dept.sanitation": string;
};

const translations: Record<Language, TranslationKeys> = {
    en: {
        "nav.dashboard": "Dashboard",
        "nav.complaints": "Complaints",
        "nav.globalFeed": "Global Feed",
        "nav.billPayments": "Bill Payments",
        "nav.services": "Services",
        "nav.documents": "Documents",
        "nav.notifications": "Notifications",
        "nav.profile": "Profile",
        "nav.signOut": "Sign Out",
        "nav.lightMode": "Light Mode",
        "nav.darkMode": "Dark Mode",
        "dashboard.welcome": "Welcome back",
        "dashboard.overview": "Here's an overview of your civic services activity",
        "dashboard.totalComplaints": "Total Complaints",
        "dashboard.pending": "Pending",
        "dashboard.inProgress": "In Progress",
        "dashboard.resolved": "Resolved",
        "dashboard.fileNew": "File New Complaint",
        "dashboard.payBills": "Pay Bills",
        "dashboard.recentComplaints": "Recent Complaints",
        "dashboard.viewAll": "View All",
        "dashboard.billsDue": "Bills Due",
        "dashboard.noBills": "All bills paid!",
        "complaints.title": "My Complaints",
        "complaints.search": "Search complaints...",
        "complaints.filterByStatus": "Filter by status",
        "complaints.filterByDept": "Filter by dept",
        "complaints.all": "All",
        "complaints.newComplaint": "New Complaint",
        "complaints.noComplaints": "No complaints found",
        "common.loading": "Loading...",
        "common.error": "Something went wrong",
        "common.retry": "Retry",
        "common.submit": "Submit",
        "common.cancel": "Cancel",
        "common.save": "Save",
        "common.delete": "Delete",
        "common.back": "Back",
        "common.next": "Continue",
        "common.language": "Language",
        "admin.dashboard": "Admin Dashboard",
        "admin.actionQueue": "Action Queue",
        "admin.allComplaints": "All Complaints",
        "admin.docVerification": "Doc Verification",
        "admin.reports": "Reports",
        "admin.wardMap": "Ward Map",
        "dept.electricity": "Electricity",
        "dept.water": "Water Supply",
        "dept.roads": "Roads",
        "dept.sanitation": "Sanitation",
    },
    hi: {
        "nav.dashboard": "डैशबोर्ड",
        "nav.complaints": "शिकायतें",
        "nav.globalFeed": "वैश्विक फ़ीड",
        "nav.billPayments": "बिल भुगतान",
        "nav.services": "सेवाएं",
        "nav.documents": "दस्तावेज़",
        "nav.notifications": "सूचनाएं",
        "nav.profile": "प्रोफ़ाइल",
        "nav.signOut": "लॉग आउट",
        "nav.lightMode": "लाइट मोड",
        "nav.darkMode": "डार्क मोड",
        "dashboard.welcome": "वापसी पर स्वागत है",
        "dashboard.overview": "आपकी नागरिक सेवा गतिविधि का अवलोकन",
        "dashboard.totalComplaints": "कुल शिकायतें",
        "dashboard.pending": "लंबित",
        "dashboard.inProgress": "प्रगति में",
        "dashboard.resolved": "हल किया गया",
        "dashboard.fileNew": "नई शिकायत दर्ज करें",
        "dashboard.payBills": "बिल भुगतान",
        "dashboard.recentComplaints": "हाल की शिकायतें",
        "dashboard.viewAll": "सभी देखें",
        "dashboard.billsDue": "बकाया बिल",
        "dashboard.noBills": "सभी बिल भुगतान हो गए!",
        "complaints.title": "मेरी शिकायतें",
        "complaints.search": "शिकायतें खोजें...",
        "complaints.filterByStatus": "स्थिति के अनुसार",
        "complaints.filterByDept": "विभाग के अनुसार",
        "complaints.all": "सभी",
        "complaints.newComplaint": "नई शिकायत",
        "complaints.noComplaints": "कोई शिकायत नहीं मिली",
        "common.loading": "लोड हो रहा है...",
        "common.error": "कुछ गलत हो गया",
        "common.retry": "पुनः प्रयास करें",
        "common.submit": "जमा करें",
        "common.cancel": "रद्द करें",
        "common.save": "सहेजें",
        "common.delete": "हटाएं",
        "common.back": "वापस",
        "common.next": "आगे",
        "common.language": "भाषा",
        "admin.dashboard": "व्यवस्थापक डैशबोर्ड",
        "admin.actionQueue": "कार्य कतार",
        "admin.allComplaints": "सभी शिकायतें",
        "admin.docVerification": "दस्तावेज़ सत्यापन",
        "admin.reports": "रिपोर्ट",
        "admin.wardMap": "वार्ड मानचित्र",
        "dept.electricity": "बिजली",
        "dept.water": "जल आपूर्ति",
        "dept.roads": "सड़कें",
        "dept.sanitation": "स्वच्छता",
    },
    bn: {
        "nav.dashboard": "ড্যাশবোর্ড",
        "nav.complaints": "অভিযোগ",
        "nav.globalFeed": "বিশ্ব ফিড",
        "nav.billPayments": "বিল পেমেন্ট",
        "nav.services": "সেবা",
        "nav.documents": "নথি",
        "nav.notifications": "বিজ্ঞপ্তি",
        "nav.profile": "প্রোফাইল",
        "nav.signOut": "সাইন আউট",
        "nav.lightMode": "লাইট মোড",
        "nav.darkMode": "ডার্ক মোড",
        "dashboard.welcome": "স্বাগতম",
        "dashboard.overview": "আপনার নাগরিক সেবা কার্যকলাপের সারসংক্ষেপ",
        "dashboard.totalComplaints": "মোট অভিযোগ",
        "dashboard.pending": "মুলতুবি",
        "dashboard.inProgress": "চলমান",
        "dashboard.resolved": "সমাধান হয়েছে",
        "dashboard.fileNew": "নতুন অভিযোগ",
        "dashboard.payBills": "বিল পরিশোধ",
        "dashboard.recentComplaints": "সাম্প্রতিক অভিযোগ",
        "dashboard.viewAll": "সব দেখুন",
        "dashboard.billsDue": "বকেয়া বিল",
        "dashboard.noBills": "সব বিল পরিশোধ হয়েছে!",
        "complaints.title": "আমার অভিযোগ",
        "complaints.search": "অভিযোগ খুঁজুন...",
        "complaints.filterByStatus": "স্থিতি অনুসারে",
        "complaints.filterByDept": "বিভাগ অনুসারে",
        "complaints.all": "সব",
        "complaints.newComplaint": "নতুন অভিযোগ",
        "complaints.noComplaints": "কোনো অভিযোগ পাওয়া যায়নি",
        "common.loading": "লোড হচ্ছে...",
        "common.error": "কিছু ভুল হয়েছে",
        "common.retry": "পুনরায় চেষ্টা",
        "common.submit": "জমা দিন",
        "common.cancel": "বাতিল",
        "common.save": "সংরক্ষণ",
        "common.delete": "মুছুন",
        "common.back": "পিছনে",
        "common.next": "পরবর্তী",
        "common.language": "ভাষা",
        "admin.dashboard": "প্রশাসক ড্যাশবোর্ড",
        "admin.actionQueue": "কার্য তালিকা",
        "admin.allComplaints": "সব অভিযোগ",
        "admin.docVerification": "নথি যাচাই",
        "admin.reports": "প্রতিবেদন",
        "admin.wardMap": "ওয়ার্ড মানচিত্র",
        "dept.electricity": "বিদ্যুৎ",
        "dept.water": "জল সরবরাহ",
        "dept.roads": "সড়ক",
        "dept.sanitation": "পরিচ্ছন্নতা",
    },
    ta: {
        "nav.dashboard": "டாஷ்போர்ட்",
        "nav.complaints": "புகார்கள்",
        "nav.globalFeed": "உலக ஊட்டம்",
        "nav.billPayments": "பில் செலுத்தம்",
        "nav.services": "சேவைகள்",
        "nav.documents": "ஆவணங்கள்",
        "nav.notifications": "அறிவிப்புகள்",
        "nav.profile": "சுயவிவரம்",
        "nav.signOut": "வெளியேறு",
        "nav.lightMode": "லைட் மோட்",
        "nav.darkMode": "டார்க் மோட்",
        "dashboard.welcome": "மீண்டும் வரவேற்கிறோம்",
        "dashboard.overview": "உங்கள் குடிமக்கள் சேவை நடவடிக்கைகள்",
        "dashboard.totalComplaints": "மொத்த புகார்கள்",
        "dashboard.pending": "நிலுவை",
        "dashboard.inProgress": "நடந்துகொண்டிருக்கிறது",
        "dashboard.resolved": "தீர்க்கப்பட்டது",
        "dashboard.fileNew": "புதிய புகார்",
        "dashboard.payBills": "பில் செலுத்து",
        "dashboard.recentComplaints": "சமீபத்திய புகார்கள்",
        "dashboard.viewAll": "அனைத்தையும் காண்",
        "dashboard.billsDue": "நிலுவை பில்கள்",
        "dashboard.noBills": "அனைத்து பில்களும் செலுத்தப்பட்டன!",
        "complaints.title": "எனது புகார்கள்",
        "complaints.search": "புகார்களை தேடு...",
        "complaints.filterByStatus": "நிலை",
        "complaints.filterByDept": "துறை",
        "complaints.all": "அனைத்தும்",
        "complaints.newComplaint": "புதிய புகார்",
        "complaints.noComplaints": "புகார்கள் இல்லை",
        "common.loading": "ஏற்றுகிறது...",
        "common.error": "பிழை ஏற்பட்டது",
        "common.retry": "மீண்டும் முயற்சிக்கவும்",
        "common.submit": "சமர்ப்பி",
        "common.cancel": "ரத்து செய்",
        "common.save": "சேமி",
        "common.delete": "நீக்கு",
        "common.back": "பின்",
        "common.next": "அடுத்து",
        "common.language": "மொழி",
        "admin.dashboard": "நிர்வாகி டாஷ்போர்ட்",
        "admin.actionQueue": "செயல் வரிசை",
        "admin.allComplaints": "அனைத்து புகார்கள்",
        "admin.docVerification": "ஆவண சரிபார்ப்பு",
        "admin.reports": "அறிக்கைகள்",
        "admin.wardMap": "வார்டு வரைபடம்",
        "dept.electricity": "மின்சாரம்",
        "dept.water": "நீர் வழங்கல்",
        "dept.roads": "சாலைகள்",
        "dept.sanitation": "சுகாதாரம்",
    },
    mr: {
        "nav.dashboard": "डॅशबोर्ड",
        "nav.complaints": "तक्रारी",
        "nav.globalFeed": "जागतिक फीड",
        "nav.billPayments": "बिल भरणा",
        "nav.services": "सेवा",
        "nav.documents": "कागदपत्रे",
        "nav.notifications": "सूचना",
        "nav.profile": "प्रोफाइल",
        "nav.signOut": "बाहेर पडा",
        "nav.lightMode": "लाइट मोड",
        "nav.darkMode": "डार्क मोड",
        "dashboard.welcome": "पुन्हा स्वागत",
        "dashboard.overview": "तुमच्या नागरी सेवा क्रियाकलापांचा आढावा",
        "dashboard.totalComplaints": "एकूण तक्रारी",
        "dashboard.pending": "प्रलंबित",
        "dashboard.inProgress": "प्रगतीत",
        "dashboard.resolved": "निराकरण",
        "dashboard.fileNew": "नवीन तक्रार",
        "dashboard.payBills": "बिल भरा",
        "dashboard.recentComplaints": "अलीकडील तक्रारी",
        "dashboard.viewAll": "सर्व पहा",
        "dashboard.billsDue": "देय बिले",
        "dashboard.noBills": "सर्व बिले भरली!",
        "complaints.title": "माझ्या तक्रारी",
        "complaints.search": "तक्रारी शोधा...",
        "complaints.filterByStatus": "स्थिती",
        "complaints.filterByDept": "विभाग",
        "complaints.all": "सर्व",
        "complaints.newComplaint": "नवीन तक्रार",
        "complaints.noComplaints": "तक्रारी आढळल्या नाहीत",
        "common.loading": "लोड होत आहे...",
        "common.error": "काहीतरी चूक झाली",
        "common.retry": "पुन्हा प्रयत्न करा",
        "common.submit": "सबमिट करा",
        "common.cancel": "रद्द करा",
        "common.save": "जतन करा",
        "common.delete": "हटवा",
        "common.back": "मागे",
        "common.next": "पुढे",
        "common.language": "भाषा",
        "admin.dashboard": "प्रशासक डॅशबोर्ड",
        "admin.actionQueue": "कार्य रांग",
        "admin.allComplaints": "सर्व तक्रारी",
        "admin.docVerification": "कागदपत्र पडताळणी",
        "admin.reports": "अहवाल",
        "admin.wardMap": "प्रभाग नकाशा",
        "dept.electricity": "वीज",
        "dept.water": "पाणी पुरवठा",
        "dept.roads": "रस्ते",
        "dept.sanitation": "स्वच्छता",
    },
};

interface I18nState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof TranslationKeys) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
    language: "en",
    setLanguage: (language) => set({ language }),
    t: (key) => {
        const lang = get().language;
        return translations[lang]?.[key] || translations.en[key] || key;
    },
}));
