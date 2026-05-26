const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

// Ajuster la taille de la zone de dessin à l'écran du téléphone
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Modèle d'une particule (étincelle)
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2; // Taille aléatoire
        this.speedX = Math.random() * 3 - 1.5; // Vitesse horizontale (gauche/droite)
        this.speedY = Math.random() * -3 - 1; // Vitesse verticale (monte vers le haut)
        // Teintes aléatoires de rose, violet et bleu électrique
        this.color = `hsl(${Math.random() * 60 + 280}, 100%, 60%)`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1; // Réduction de taille progressive
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Détecter le mouvement du doigt sur l'écran tactile
window.addEventListener('touchmove', function(e) {
    for (let i = 0; i < 2; i++) {
        let touch = e.touches[0];
        particlesArray.push(new Particle(touch.clientX, touch.clientY));
    }
});

// Gérer aussi la souris si jamais on regarde sur un ordinateur
window.addEventListener('mousemove', function(e) {
    for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(e.clientX, e.clientY));
    }
});

// Boucle d'animation principale
function animate() {
    // Crée un effet de traînée lumineuse en ne vidant pas complètement l'écran
    ctx.fillStyle = 'rgba(11, 11, 26, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Supprimer les particules devenues invisibles pour ne pas ralentir le téléphone
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
