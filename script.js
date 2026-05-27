const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Taille réduite pour plus d'élégance
        this.size = Math.random() * 8 + 4; 
        this.speedX = Math.random() * 2 - 1; // Mouvement latéral doux
        this.speedY = Math.random() * -3 - 1; // Monte doucement
        this.gravity = -0.01; // Légère force ascensionnelle
        
        // Teintes de BLEU uniquement (Cyan, Électrique, Profond)
        this.hue = Math.random() * 50 + 190; 
        // Luminosité variable pour un effet scintillant
        this.brightness = Math.random() * 20 + 60; 
        
        // Durée de vie plus longue
        this.life = 1; 
        this.decay = Math.random() * 0.005 + 0.003; 
    }
    
    update() {
        this.speedY += this.gravity; 
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Brise légère vers la droite
        this.x += 0.2; 
        
        // Scintillement (la luminosité change légèrement)
        this.brightness += (Math.random() * 10 - 5);
        if (this.brightness > 80) this.brightness = 80;
        if (this.brightness < 50) this.brightness = 50;
        
        this.life -= this.decay; 
        if (this.size > 0.2) this.size -= 0.02; 
    }
    
    draw() {
        // L'étoile est BLEUE
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        ctx.beginPath();
        
        // Forme d'Étoile élégante à 5 branches
        let spikes = 5;
        let outerRadius = this.size;
        let innerRadius = this.size / 2.5; // Plus effilée
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
    }
}

// Fonction pour lier les étoiles par des filaments DORÉS
function connectStars() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Distance de connexion réduite pour éviter la surcharge (toile d'araignée)
            if (distance < 70) {
                // Opacité basée sur la distance ET la vie des étoiles
                let opacity = (1 - (distance / 70)) * Math.min(particlesArray[a].life, particlesArray[b].life);
                
                // --- Couleur DORÉE (GOLD) pour les filaments ---
                // On utilise un dégradé or chaud (Hue 40, Saturation 100, Brightness 50)
                ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.4})`; // Un or pur et doux
                ctx.lineWidth = 0.8;
                
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function handleStars(x, y) {
    // Moins de particules pour un effet "constellation" épuré
    if (Math.random() < 0.4) { // N'en crée pas à chaque mouvement
        particlesArray.push(new Star(x, y));
    }
}

window.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    handleStars(touch.clientX, touch.clientY);
});

window.addEventListener('mousemove', function(e) {
    handleStars(e.clientX, e.clientY);
});

function animate() {
    // Fond bleu nuit très profond, presque noir
    ctx.fillStyle = 'rgba(8, 8, 18, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // On dessine d'abord les connexions d'or
    connectStars();
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Supprimer si l'étoile meurt (life <= 0) ou devient invisible
        if (particlesArray[i].life <= 0 || particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
