const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

// Ajuster la taille du canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Modèle d'une particule en forme de cœur
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Taille initiale plus grande pour bien voir la forme
        this.size = Math.random() * 15 + 10; 
        this.speedX = Math.random() * 4 - 2; // Vitesse latérale
        this.speedY = Math.random() * -5 - 2; // Propulsion vers le haut
        this.gravity = 0.08; // Force qui fait retomber la particule
        this.hue = Math.random() * 360; // Teinte de départ aléatoire (0-360)
    }
    
    update() {
        this.speedY += this.gravity; // La gravité s'applique
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Changement de couleur progressif (vitesse de rotation des teintes)
        this.hue += 2; 
        
        // Réduction TRÈS lente de la taille pour qu'elle dure plus longtemps
        if (this.size > 0.4) this.size -= 0.08; 
    }
    
    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 65%)`;
        ctx.beginPath();
        
        // Dessin mathématique d'un cœur basé sur la position (x, y) et la taille (size)
        let width = this.size;
        let height = this.size;
        
        ctx.moveTo(this.x, this.y - height / 4);
        ctx.bezierCurveTo(this.x + width / 2, this.y - height, this.x + width, this.y - height / 4, this.x, this.y + height);
        ctx.bezierCurveTo(this.x - width, this.y - height / 4, this.x - width / 2, this.y - height, this.x, this.y - height / 4);
        
        ctx.fill();
    }
}

// Fonction pour ajouter des particules
function handleParticles(x, y) {
    // On en crée 2 à chaque mouvement pour un effet dense mais fluide
    for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(x, y));
    }
}

// Événement Tactile (Téléphone)
window.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    handleParticles(touch.clientX, touch.clientY);
});

// Événement Souris (PC)
window.addEventListener('mousemove', function(e) {
    handleParticles(e.clientX, e.clientY);
});

// Boucle d'animation
function animate() {
    // Effet d'ambiance sombre avec une traînée fluide
    ctx.fillStyle = 'rgba(11, 11, 26, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Supprimer si le cœur devient trop petit
        if (particlesArray[i].size <= 0.4) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
