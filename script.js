const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const shapes = ['heart', 'star', 'circle'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 6; 
        this.speedX = Math.random() * 4 - 2; 
        this.speedY = Math.random() * -4 - 1; // Monte doucement
        this.hue = Math.random() * 360; 
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }
    
    update() {
        // Ajout d'une brise légère vers la droite (Vent)
        this.speedX += 0.03; 
        
        // Friction : ralentit légèrement le mouvement pour plus de douceur
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.hue += 1; 
        if (this.size > 0.4) this.size -= 0.05; // Dure encore plus longtemps
    }
    
    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 65%)`;
        ctx.beginPath();
        
        if (this.shape === 'heart') {
            let width = this.size;
            let height = this.size;
            ctx.moveTo(this.x, this.y - height / 4);
            ctx.bezierCurveTo(this.x + width / 2, this.y - height, this.x + width, this.y - height / 4, this.x, this.y + height);
            ctx.bezierCurveTo(this.x - width, this.y - height / 4, this.x - width / 2, this.y - height, this.x, this.y - height / 4);
        } else if (this.shape === 'star') {
            let spikes = 5;
            let outerRadius = this.size;
            let innerRadius = this.size / 2;
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
        } else if (this.shape === 'circle') {
            ctx.arc(this.x, this.y, this.size / 1.5, 0, Math.PI * 2);
        }
        
        ctx.closePath();
        ctx.fill();
    }
}

// Fonction magique pour lier les particules proches par un fil lumineux
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            // Calcul de la distance géométrique entre la particule A et la particule B
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Si la distance est inférieure à 80 pixels, on trace une ligne
            if (distance < 80) {
                // Opacité de la ligne proportionnelle à la distance (plus c'est proche, plus c'est brillant)
                let opacity = 1 - (distance / 80);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function handleParticles(x, y) {
    // On augmente un peu le nombre pour enrichir les connexions
    for (let i = 0; i < 3; i++) {
        particlesArray.push(new Particle(x, y));
    }
}

window.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    handleParticles(touch.clientX, touch.clientY);
});

window.addEventListener('mousemove', function(e) {
    handleParticles(e.clientX, e.clientY);
});

function animate() {
    ctx.fillStyle = 'rgba(11, 11, 26, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // On dessine d'abord les lignes de connexion
    connectParticles();
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        if (particlesArray[i].size <= 0.4) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
