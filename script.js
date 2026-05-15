const PARALLAX_LAYERS = {
    far: { id: 'parallax-bg-far', count: 80, speed: 150 },
    mid: { id: 'parallax-bg-mid', count: 50, speed: 80 },
    near: { id: 'parallax-bg-near', count: 20, speed: 30 }
};

let breathingTimer1, breathingTimer2;

function generateParallaxStars() {
    Object.keys(PARALLAX_LAYERS).forEach(layerKey => {
        const layer = PARALLAX_LAYERS[layerKey];
        const container = document.getElementById(layer.id);
        
        for (let i = 0; i < layer.count; i++) {
            const star = document.createElement('div');
            star.className = `bg-star layer-${layerKey}`;
            
            // Random positioning
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Size mapping based on layer
            const size = layerKey === 'near' ? Math.random() * 2 + 2 
                       : layerKey === 'mid' ? Math.random() * 1.5 + 1
                       : Math.random() * 1 + 0.5;
                       
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Adult, realistic star colors
            const colors = ['#ffffff', '#e0f0ff', '#ffe0b2', '#ffffff', '#ffffff'];
            star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(star);
        }
    });
}

// Fluid Parallax Interaction & Jar Proximity
function handleParallax(mouseX, mouseY) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    Object.keys(PARALLAX_LAYERS).forEach(layerKey => {
        const layer = PARALLAX_LAYERS[layerKey];
        const el = document.getElementById(layer.id);
        
        const moveX = (cx - mouseX) / layer.speed;
        const moveY = (cy - mouseY) / layer.speed;
        
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
    
    // Jar proximity effect
    const jar = document.getElementById('jar-container');
    const innerLight = document.getElementById('jar-inner-light');
    if (jar && innerLight) {
        const rect = jar.getBoundingClientRect();
        const jarCenterX = rect.left + rect.width / 2;
        const jarCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(mouseX - jarCenterX, 2) + Math.pow(mouseY - jarCenterY, 2));
        
        if (distance < 200) {
            innerLight.classList.add('active');
        } else {
            innerLight.classList.remove('active');
        }
    }
}

window.addEventListener('mousemove', (e) => handleParallax(e.clientX, e.clientY));

window.addEventListener('deviceorientation', (e) => {
    if (e.gamma && e.beta) {
        // Map tilt to pseudo-mouse coordinates
        const x = window.innerWidth / 2 + (e.gamma * 10); 
        const y = window.innerHeight / 2 + (e.beta * 10);  
        handleParallax(x, y);
    }
});

async function initConstellation() {
    generateParallaxStars();
    
    let starsData = [];
    try {
        const response = await fetch('data.json');
        starsData = await response.json();
    } catch (e) {
        console.warn("Using fallback data for constellation.");
        starsData = [
            { id: 1, type: "memory", text: "Давай просто будем так гулять и больше ничего.", image: "just_us.jpg", x: 75, y: 8, name: "Iota Cancri" },
            { id: 2, type: "breathing", text: "Я всегда рядом, даже когда кажется, что я далеко ", x: 78, y: 25, name: "Delta Cancri" },
            { id: 3, type: "voice", text: "Послушай эту песню, она для тебя.", audio: "4_my_girl_hq.mp4", x: 92, y: 45, name: "Alpha Cancri" },
            { id: 4, type: "portal", text: "Відкрий нашу банку спогадів", url: "jar/index.html", x: 32, y: 28, name: "Zeta Cancri" },
            { id: 5, type: "placeholder", text: "", x: 18, y: 55, name: "Beta Cancri" }
        ];
    }
    
    const container = document.getElementById('constellation-container');
    
    starsData.forEach(data => {
        const star = document.createElement('div');
        star.className = 'interactive-star';
        star.style.left = `${data.x}%`;
        star.style.top = `${data.y}%`;
        
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomToStar(data, star);
        });
        
        container.appendChild(star);
    });
    
    drawConstellationLines(starsData);
}

function drawConstellationLines(starsData) {
    const svg = document.getElementById('constellation-lines');
    svg.innerHTML = '';
    
    // In Cygnus, Sadr (id: 2) is the central star connecting to Deneb (1), Albireo (3), and the wings (4, 5).
    const centerStar = starsData.find(s => s.id === 2);
    if (!centerStar) return;
    
    starsData.forEach(star => {
        if (star.id === 2) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${centerStar.x}%`);
        line.setAttribute('y1', `${centerStar.y}%`);
        line.setAttribute('x2', `${star.x}%`);
        line.setAttribute('y2', `${star.y}%`);
        line.setAttribute('class', 'constellation-line');
        
        svg.appendChild(line);
    });
}

function zoomToStar(data, starElement) {
    const container = document.getElementById('constellation-container');
    const jar = document.getElementById('jar-container');
    
    const rect = starElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const moveX = centerX - rect.left - (rect.width / 2);
    const moveY = centerY - rect.top - (rect.height / 2);
    
    // Zoom in with 3D translation
    container.style.transform = `translate3d(${moveX}px, ${moveY}px, 200px) scale(3.5)`;
    jar.classList.add('blurred');
    
    setTimeout(() => openModal(data), 700); // Wait for the zoom spring to settle
}

function openModal(data) {
    const modal = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    const snake = document.getElementById('flower-snake');
    
    body.innerHTML = '';
    snake.classList.remove('active');
    snake.classList.add('hidden');
    
    clearTimeout(breathingTimer1);
    clearTimeout(breathingTimer2);
    modal.classList.remove('is-portal');
    
    if (data.type === 'memory') {
        body.innerHTML = `
            <div class="memory-card">
                <img src="${data.image}" alt="Memory">
                <p>${data.text}</p>
            </div>
        `;
    } else if (data.type === 'breathing') {
        body.innerHTML = `
            <div class="breathing-container">
                <div class="breathing-circle"></div>
                <p class="breathing-text" id="breathe-text">Вдих...</p>
                <p class="breathing-sub">${data.text}</p>
            </div>
        `;
        runBreathingCycle();
    } else if (data.type === 'voice') {
        let mediaHtml = `<audio controls src="${data.audio}"></audio>`;
        if (data.audio.includes('youtube.com') || data.audio.includes('youtu.be')) {
            mediaHtml = `<iframe width="100%" height="80" src="${data.audio}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);"></iframe>`;
        }
        
        body.innerHTML = `
            <div class="voice-card">
                <p>${data.text}</p>
                ${mediaHtml}
            </div>
        `;
    } else if (data.type === 'portal') {
        modal.classList.add('is-portal');
        body.innerHTML = `
            <div class="portal-container">
                <iframe src="${data.url}" class="portal-iframe"></iframe>
            </div>
        `;
    } else if (data.type === 'placeholder') {
        snake.classList.remove('hidden');
        snake.classList.add('active');
        body.innerHTML = `
            <div class="placeholder-heart">❤️</div>
            <p style="font-size: 16px; opacity: 0.8; line-height: 1.4;">Зовсім скоро тут з'явиться щось особливе...</p>
        `;
    }
    
    modal.classList.add('active');
}

function runBreathingCycle() {
    const textEl = document.getElementById('breathe-text');
    if (!textEl) return;
    
    textEl.innerText = "Вдих...";
    textEl.style.opacity = 1;
    
    // 4s Inhale
    breathingTimer1 = setTimeout(() => {
        if (!document.getElementById('breathe-text')) return;
        textEl.style.opacity = 0; // fade out
        
        setTimeout(() => {
            if (!document.getElementById('breathe-text')) return;
            textEl.innerText = "Видих...";
            textEl.style.opacity = 1; // fade in
        }, 500);
        
        // 6s Exhale
        breathingTimer2 = setTimeout(runBreathingCycle, 6000);
    }, 4000);
}

document.getElementById('close-btn').addEventListener('click', () => {
    const modal = document.getElementById('modal-overlay');
    const container = document.getElementById('constellation-container');
    const jar = document.getElementById('jar-container');
    
    modal.classList.remove('active');
    modal.classList.remove('is-portal');
    
    // Reset zoom
    container.style.transform = `translate3d(0, 0, 0) scale(1)`;
    jar.classList.remove('blurred');
    
    clearTimeout(breathingTimer1);
    clearTimeout(breathingTimer2);
    
    const audio = modal.querySelector('audio');
    if (audio) audio.pause();
});

document.addEventListener('DOMContentLoaded', initConstellation);
