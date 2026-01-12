// This runs as soon as the file loads
setTimeout(() => {
    // 1. Get the name from the URL
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('name');

    if (platform) {
        // 2. Set the Meta Title (the tab name)
        document.title = platform;

        // 3. Set the H1 text to match that Meta Title
        const h1Element = document.getElementById('display-title');
        if (h1Element) {
            h1Element.textContent = document.title;
        }
        
        console.log("Success: Title and H1 updated to " + platform);
    }
}, 3000); // 3 second delay


//scroll
// Set your coordinates here
// const targetX = 987;
// const targetY = 924;

// let autoScroller = setInterval(() => {
//     // 1. Find the element at that point
//     let el = document.elementFromPoint(targetX, targetY);
    
//     // 2. Look for the nearest parent that can actually scroll
//     while (el) {
//         if (el.scrollHeight > el.clientHeight) {
//             // Found it! Move the scrollbar down 100px
//             el.scrollBy({
//                 top: 100,
//                 behavior: 'smooth'
//             });
//             console.log("Scrolling container:", el);
//             return; // Exit once we scroll the right box
//         }
//         el = el.parentElement;
//     }
    
//     // 3. Fallback to window if no box is found
//     window.scrollBy(0, 100);
// }, 500);

// TO STOP: clearInterval(autoScroller);