// دالة توليد الوقت العشوائي بين 0.5 و 1.5 ثانية (كما طلبت)
const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

async function startScraping() {
    console.log("Continuous Scroll: Fast Mode (0.5s - 1.5s) Active.");

    // دالة داخلية للبحث عن الحاوية القابلة للتمرير في كل دورة
    const getContainer = () => {
        const allElements = document.querySelectorAll('*');
        for (let el of allElements) {
            // نبحث عن عنصر يحتوي على سكرول داخلي وهو الأكثر شيوعاً في قوائم فيسبوك
            if (el.scrollHeight > el.clientHeight && 
                (window.getComputedStyle(el).overflowY === 'auto' || window.getComputedStyle(el).overflowY === 'scroll')) {
                return el;
            }
        }
        return window;
    };

    const seenNames = new Set(); 

    // حلقة لا نهائية لضمان عدم توقف التحميل
    while (true) {
        try {
            const container = getContainer();
            
            // 1. التمرير مسافة عشوائية
            const scrollAmount = getRandomDelay(300, 500);
            if (container === window) {
                window.scrollBy(0, scrollAmount);
            } else {
                container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }

            // 2. الانتظار الديناميكي (0.5 إلى 1.5 ثانية)
            const nextDelay = getRandomDelay(500, 1500);
            await new Promise(resolve => setTimeout(resolve, nextDelay));

            // 3. جمع الأسماء باستخدام Selectors شاملة
            const nameElements = document.querySelectorAll('span[dir="auto"], a[role="link"] span, div[role="button"] span');
            
            nameElements.forEach(el => {
                const name = el.textContent.trim();

                // --- منطق الفلترة المطور ---
                
                // استبعاد النصوص التي تحتوي على أرقام (عدد الأصدقاء، المتابعين، التواريخ)
                const hasNumbers = /\d/.test(name);
                
                // قائمة الكلمات المحظورة لمنع النصوص الإرشادية
                const blacklist = [
                    "صديق", "مشترك", "كل الأصدقاء", "حدد", "أسماء", 
                    "الأشخاص", "معاينة", "ملف", "شخصي", "إضافة", 
                    "متابعة", "يتابعه", "من المتابعين", "رسالة", "Message"
                ];
                
                const isBlacklisted = blacklist.some(word => name.includes(word));
                
                // استبعاد الجمل الطويلة جداً التي لا تشبه الأسماء
                const isTooLong = name.length > 25; 

                // الفلترة النهائية
                if (name && name.length > 3 && !hasNumbers && !isBlacklisted && !isTooLong && !seenNames.has(name)) {
                    const wordCount = name.split(' ').length;
                    
                    // التأكد من أن النص يتكون من اسم (كلمتين إلى 4 كلمات)
                    if (wordCount >= 2 && wordCount <= 4) {
                        seenNames.add(name);
                        
                        // إرسال الاسم لصفحة الترحيب مع معالجة خطأ فقدان الاتصال
                        try {
                            chrome.runtime.sendMessage({ action: "friend_found", name: name });
                        } catch (err) {
                            console.log("Welcome page might be closed. Still scrolling...");
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Scroll error, retrying...", error);
            await new Promise(r => setTimeout(r, 2000)); // انتظر قليلاً قبل المحاولة مرة أخرى في حال حدوث خطأ
        }
    }
}

// البدء بعد 5 ثوانٍ لضمان استقرار واجهة فيسبوك
setTimeout(startScraping, 5000);