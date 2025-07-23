document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ELEMENT SELECTION ---
    const frameContainer = document.querySelector('.frame-container');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const galleryPage = document.getElementById('gallery-page');
    const aboutPage = document.getElementById('about-page');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const closePageBtns = document.querySelectorAll('.close-page-btn');

    // --- 2. STATE AND CONFIGURATION ---
    const totalFrames = 16;
    const checkpoints = [0, 5, 10, 15];
    let currentFrame = 0;
    let isAutoScrolling = false;

    // --- 3. UPDATED DATA STRUCTURE ---
    // All info about frames, images, and buttons is now here for easy editing.
    const frameData = [
        // Checkpoint 1
        { imageUrl: 'assets/0001.png', isCheckpoint: true, buttons: [
            { id: 'phone-1', text: 'Phone'},
            { id: 'burger-1', text: 'Burger'},
            { id: 'unique-1', text: 'Monitor'}
        ]},
        { imageUrl: 'assets/0002.png' }, { imageUrl: 'assets/0003.png' },
        { imageUrl: 'assets/0004.png' }, { imageUrl: 'assets/0005.png' },
        // Checkpoint 2
        { imageUrl: 'assets/0006.png', isCheckpoint: true, buttons: [
            { id: 'phone-2', text: 'Phone'},
            { id: 'burger-2', text: 'Burger'},
            { id: 'unique-2', text: 'Unique Item 2'}
        ]},
        { imageUrl: 'assets/0007.png' }, { imageUrl: 'assets/0008.png' },
        { imageUrl: 'assets/0009.png' }, { imageUrl: 'assets/0010.png' },
        // Checkpoint 3
        { imageUrl: 'assets/0011.png', isCheckpoint: true, buttons: [
            { id: 'phone-3', text: 'Phone'},
            { id: 'burger-3', text: 'Burger'},
            { id: 'unique-3', text: 'Unique Item 3'}
        ]},
        { imageUrl: 'assets/0012.png' }, { imageUrl: 'assets/0013.png' },
        { imageUrl: 'assets/0014.png' }, { imageUrl: 'assets/0015.png' },
        // Checkpoint 4
        { imageUrl: 'assets/0016.png', isCheckpoint: true, buttons: [
            { id: 'phone-4', text: 'Phone'},
            { id: 'burger-4', text: 'Burger'}
        ]}
    ];

    // --- 4. REBUILT CORE FUNCTIONS ---
    
    // This function is now much smarter
    function createFrames() {
        frameData.forEach((data, i) => {
            const frame = document.createElement('div');
            frame.classList.add('frame');
            frame.dataset.index = i;

            if (data.isCheckpoint) {
                // For checkpoints, create a real <img> tag for perfect positioning
                const img = document.createElement('img');
                img.src = data.imageUrl;
                frame.appendChild(img);

                // Create the overlay that will hold the buttons
                const buttonOverlay = document.createElement('div');
                buttonOverlay.className = 'button-overlay';

                // Create and position buttons from the data array
                data.buttons.forEach(buttonData => {
                    const button = document.createElement('button');
                    button.className = 'clickable-item';
                    button.id = buttonData.id;
                    button.textContent = buttonData.text; // For debugging, you can make this transparent later
                    button.style.top = buttonData.top;
                    button.style.left = buttonData.left;
                    buttonOverlay.appendChild(button);
                });
                frame.appendChild(buttonOverlay);

            } else {
                // For regular frames, use the simple background-image
                frame.style.backgroundImage = `url('${data.imageUrl}')`;
            }
            frameContainer.appendChild(frame);
        });
    }

    function changeFrame(newIndex) {
        if (newIndex < 0 || newIndex >= totalFrames) return;
        if (frames[currentFrame] && frames[currentFrame].classList.contains('active')) {
            frames[currentFrame].classList.remove('active');
        }
        if (frames[newIndex]) {
            frames[newIndex].classList.add('active');
        }
        currentFrame = newIndex;
        updateArrowVisibility();
    }
    
    // ... (All other functions like updateArrowVisibility, scrollToFrame, openMenu, etc. remain the same as the last version) ...
    function updateArrowVisibility() { const prevCheckpointExists = [...checkpoints].reverse().some(c => c < currentFrame); prevArrow.classList.toggle('hidden', !prevCheckpointExists); const nextCheckpointExists = checkpoints.some(c => c > currentFrame); nextArrow.classList.toggle('hidden', !nextCheckpointExists); }
    function scrollToFrame(targetIndex) { if (isAutoScrolling || currentFrame === targetIndex) return; const direction = targetIndex > currentFrame ? 'next' : 'prev'; isAutoScrolling = true; const autoScroll = setInterval(() => { const nextFrameIndex = currentFrame + (direction === 'next' ? 1 : -1); changeFrame(nextFrameIndex); if (currentFrame === targetIndex) { clearInterval(autoScroll); isAutoScrolling = false; } }, 50); }
    function handleCheckpointNavigation(direction) { if (isAutoScrolling) return; let targetIndex; if (direction === 'next') { targetIndex = checkpoints.find(c => c > currentFrame); } else { targetIndex = [...checkpoints].reverse().find(c => c < currentFrame); } if (targetIndex !== undefined) { scrollToFrame(targetIndex); } }
    function openMenu() { galleryPage.classList.remove('active'); aboutPage.classList.remove('active'); navOverlay.classList.add('active'); document.body.classList.add('nav-open'); hamburgerMenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`; }
    function closeAllOverlays() { navOverlay.classList.remove('active'); galleryPage.classList.remove('active'); aboutPage.classList.remove('active'); document.body.classList.remove('nav-open'); hamburgerMenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`; }
    function showPage(pageElement) { navOverlay.classList.remove('active'); pageElement.classList.add('active'); }


    // --- 5. EVENT LISTENERS ---
    createFrames();
    const frames = document.querySelectorAll('.frame');
    changeFrame(0);

    window.addEventListener('wheel', (e) => { if (!isAutoScrolling) { const delta = Math.sign(e.deltaY); if (delta > 0) changeFrame(currentFrame + 1); else if (delta < 0) changeFrame(currentFrame - 1); } });
    prevArrow.addEventListener('click', () => handleCheckpointNavigation('prev'));
    nextArrow.addEventListener('click', () => handleCheckpointNavigation('next'));
    hamburgerMenu.addEventListener('click', () => { const isAnyOverlayOpen = navOverlay.classList.contains('active') || galleryPage.classList.contains('active') || aboutPage.classList.contains('active'); if (isAnyOverlayOpen) { closeAllOverlays(); } else { openMenu(); } });
    closePageBtns.forEach(btn => { btn.addEventListener('click', () => { const pageId = btn.dataset.targetPage; if (pageId) { document.getElementById(pageId).classList.remove('active'); } openMenu(); }); });
    navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); const linkText = link.textContent.trim().toUpperCase(); if (linkText === 'HOME') { closeAllOverlays(); setTimeout(() => scrollToFrame(0), 300); } else if (linkText === 'GALLERY') { showPage(galleryPage); } else if (linkText === 'ABOUT ME') { showPage(aboutPage); } }); });

    // New, simplified listener for all clickable items
    frameContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-item')) {
            const buttonId = e.target.id;
            
            if (buttonId.includes('phone')) {
                alert('Phone button clicked!');
            } else if (buttonId.includes('burger')) {
                alert('Burger button clicked!');
            } else if (buttonId.includes('unique')) {
                alert('A unique item was clicked!');
            }
        }
    });

    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', closeAllOverlays);
    }
});