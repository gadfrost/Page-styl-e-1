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
        this.size = Math.random() * 8 + 4; 
        
        // VITESSE CORRIGÉE : Mouvement horizontal lent et doux
        this.speedX = Math.random() * 0.8 + 0.2; // Toujours un peu vers la droite
        this.speedY = Math.random() * 1 - 0.5; // Très peu de mouvement vertical (flotte)
        this.gravity = -0.005; // Force ascensionnelle quasi-nulle
        
        // Couleur BLEUE uniquement
        this.hue = Math.random() * 50 + 190; 
        this.brightness = Math.random() * 20 + 60; 
        
        // DURÉE DE VIE ALLONGÉE considérablement
        this.life = 1; 
        this.decay = Math.random() * 0.003 + 0.001; // Réduction très lente
    }
    
    update() {
        this.speedY += this.gravity; 
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Brise légère globale vers la droite
        this.x += 0.3; 
        
        // Scintillement
        this.brightness += (Math.random() * 6 - 3);
        if (this.brightness > 85) this.brightness = 85;
        if (this.brightness < 55) this.brightness = 55;
        
        this.life -= this.decay; 
        // La taille diminue aussi plus lentement
        if (this.size > 0.2) this.size -= 0.01; 
    }
    
    draw() {
        // Opacité de l'étoile liée à sa vie
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.life})`;
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
    }
}

// Fonction pour lier les étoiles par des filaments DORÉS VISIBLES
function connectStars() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // DISTANCE DE CONNEXION AUGMENTÉE pour densifier la structure
            if (distance < 90) {
                // Opacité basée sur la distance ET la vie des étoiles (reste visible plus longtemps)
                let opacity = (1 - (distance / 90)) * Math.min(particlesArray[a].life, particlesArray[b].life);
                
                // --- FILAMENTS DORÉS BIEN VISIBLES ---
                ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.7})`; // Opacité augmentée (x0.7 au lieu de x0.4)
                ctx.lineWidth = 1.2; // Épaisseur augmentée (1.2 au lieu de 0.8)
                
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
    if (Math.random() < 0.4) { 
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
    ctx.fillStyle = 'rgba(8, 8, 18, 0.2)'; // Effet de traînée plus doux
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // On dessine d'abord les connexions d'or (maintenant bien visibles)
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
