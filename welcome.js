// welcome.js المحدث
const container = document.getElementById('friends-container');
const statusText = document.getElementById('status-text');

// دالة لاستقبال الأسماء وحفظها في التخزين المؤقت لضمان عدم الضياع
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "friend_found") {
        container.style.display = 'block';
        statusText.textContent = "Live Scanning...";
        
        // حفظ الاسم في التخزين المحلي للمتصفح (لتجنب التحميل لمرة واحدة فقط)
        chrome.storage.local.get(['savedFriends'], (result) => {
            let friends = result.savedFriends || [];
            if (!friends.includes(request.name)) {
                friends.push(request.name);
                chrome.storage.local.set({ savedFriends: friends }, () => {
                    addFriendUI(request.name);
                });
            }
        });
    }
});

function addFriendUI(name) {
    if (document.getElementById(`f-${name}`)) return;

    const div = document.createElement('div');
    div.className = 'friend-item';
    div.id = `f-${name}`;
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" checked>
            <span>${name}</span>
        </div>
        <button class="msg-btn" data-name="${name}">Message</button>
    `;
    container.appendChild(div);
    
    // ربط الزر
    div.querySelector('.msg-btn').onclick = () => alert("Preparing message for " + name);
}

// مسح التخزين عند بدء التشغيل الجديد إذا أردت
// chrome.storage.local.clear();