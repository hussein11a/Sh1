// Site Data Configuration
const siteData = {
    site: {
        title: "سطحة هيدروليك",
        subtitle: "خدمات نقل ورفع السيارات بأحدث التقنيات الهيدروليكية",
        description: "نحن نقدم خدمات احترافية لنقل السيارات والمركبات باستخدام أحدث المعدات الهيدروليكية. فريق متخصص متاح على مدار الساعة لخدمتكم.",
        phone: "+966501234567",
        whatsapp: "+966501234567",
        workingHours: "متاحون 24/7",
        address: "المملكة العربية السعودية"
    },
    features: [
        {
            title: "خدمة 24 ساعة",
            description: "متاحون في جميع أوقات اليوم",
            icon: "🕐"
        },
        {
            title: "معدات حديثة",
            description: "أحدث التقنيات الهيدروليكية",
            icon: "🚛"
        },
        {
            title: "فريق محترف",
            description: "خبرة واسعة في نقل المركبات",
            icon: "👨‍🔧"
        },
        {
            title: "أسعار منافسة",
            description: "خدمات بأفضل الأسعار",
            icon: "💰"
        }
    ],
    services: [
        {
            id: 1,
            title: "نقل السيارات من وإلى مراكز الصيانة",
            description: "خدمة احترافية لنقل سيارتك بأمان من وإلى مراكز الصيانة المعتمدة",
            icon: "🔧",
            active: true
        },
        {
            id: 2,
            title: "نقل السيارات من وإلى مراكز التقديرات",
            description: "نوفر خدمة نقل سريعة وآمنة لمراكز تقدير الأضرار والتأمين",
            icon: "📋",
            active: true
        },
        {
            id: 3,
            title: "نقل السيارات من وإلى مراكز الفحص الدوري",
            description: "احصل على خدمة نقل موثوقة لإجراء الفحص الدوري لمركبتك",
            icon: "✅",
            active: true
        },
        {
            id: 4,
            title: "نقل السيارات بين المدن",
            description: "خدمة نقل المركبات لمسافات طويلة بين المدن مع ضمان الأمان",
            icon: "🏙️",
            active: true
        },
        {
            id: 5,
            title: "خدمة الكفرات في حال عدم عمل القير",
            description: "خدمة طوارئ لحالات تعطل ناقل الحركة مع توفير حلول فورية",
            icon: "⚡",
            active: true
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteData;
}