const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let backgroundStars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBackgroundStars(); // Recréer le fond si l'écran change de taille
}
window.addEventListener('resize', resizeCanvas);

// 1. Génération de la poussière cosmique en arrière-plan
function initBackgroundStars() {
    backgroundStars = [];
    const numberOfBackgroundStars = 100; // Densité du fond
    for (let i = 0; i < numberOfBackgroundStars; i++) {
        backgroundStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

resizeCanvas();

class Star {
    constructor(x, y, isExplosion = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4; 
        
        if (isExplosion) {
            // Propulsion multidirectionnelle pour l'explosion
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 4 + 1;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
        } else {
            // Mouvement horizontal lent classique
            this.speedX = Math.random() * 0.8 + 0.2; 
            this.speedY = Math.random() * 1 - 0.5; 
        }
        
        this.gravity = -0.005; 
        this.hue = Math.random() * 40 + 195; // Teintes bleues/cyan ciblées
        this.brightness = Math.random() * 20 + 65; 
        this.life = 1; 
        this.decay = Math.random() * 0.004 + 0.002; 
    }
    
    update() {
        this.speedY += this.gravity; 
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Brise vers la droite (légèrement réduite pour l'explosion)
        this.x += 0.15; 
        
        this.life -= this.decay; 
        if (this.size > 0.2) this.size -= 0.01; 
    }
    
    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.life})`;
        
        // --- EFFET NÉON BRYANT (BLOOM) ---
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 65%)`;
        
        ctx.beginPath();
        let spikes = 5;
        let outerRadius = this.size;
        let innerRadius = this.size / 2.5;
        let rot = Math.PI / 2 * 3;
        let cx = this.x;
        let cy = this.y;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        
        // Réinitialisation obligatoire du shadow pour ne pas ralentir le rendu
        ctx.shadowBlur = 0;
    }
}

function connectStars() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 95) {
                let opacity = (1 - (distance / 95)) * Math.min(particlesArray[a].life, particlesArray[b].life);
                
                // --- FILAMENTS DORÉS AVEC MINI GLOW ---
                ctx.shadowBlur = 4;
                ctx.shadowColor = "rgba(212, 175, 55, 1)";
                ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.75})`; 
                ctx.lineWidth = 1.2; 
                
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
                ctx.shadowBlur = 0;
            }
        }
    }
}

// Déclencheur au glissement (Doigt/Souris)
function handleStars(x, y) {
    if (Math.random() < 0.4) { 
        particlesArray.push(new Star(x, y, false));
    }
}

// DECLENCHEUR D'EXPLOSION AU TAP UNIQUE
function triggerExplosion(x, y) {
    for (let i = 0; i < 15; i++) { // Crée 15 étoiles d'un coup
        particlesArray.push(new Star(x, y, true));
    }
}

// Gestion des événements tactiles (Mobile)
window.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    handleStars(touch.clientX, touch.clientY);
});
window.addEventListener('touchstart', function(e) {
    let touch = e.touches[0];
    triggerExplosion(touch.clientX, touch.clientY);
});

// Gestion des événements souris (PC)
window.addEventListener('mousemove', function(e) {
    handleStars(e.clientX, e.clientY);
});
window.addEventListener('mousedown', function(e) {
    triggerExplosion(e.clientX, e.clientY);
});

function animate() {
    // Fond très sombre avec légère traînée
    ctx.fillStyle = 'rgba(6, 6, 14, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner et faire scintiller l'arrière-plan cosmique
    backgroundStars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    
    connectStars();
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        if (particlesArray[i].life <= 0 || particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
