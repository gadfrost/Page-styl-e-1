const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const shapes = ['heart', 'star', 'circle']; // Liste des formes disponibles

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
        this.size = Math.random() * 15 + 10; 
        this.speedX = Math.random() * 4 - 2; 
        this.speedY = Math.random() * -5 - 2; 
        this.gravity = 0.08; 
        this.hue = Math.random() * 360; 
        
        // Choisir une forme aléatoire parmi la liste
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }
    
    update() {
        this.speedY += this.gravity; 
        this.x += this.speedX;
        this.y += this.speedY;
        this.hue += 2; 
        if (this.size > 0.4) this.size -= 0.08; 
    }
    
    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 65%)`;
        ctx.beginPath();
        
        if (this.shape === 'heart') {
            // Forme de Cœur
            let width = this.size;
            let height = this.size;
            ctx.moveTo(this.x, this.y - height / 4);
            ctx.bezierCurveTo(this.x + width / 2, this.y - height, this.x + width, this.y - height / 4, this.x, this.y + height);
            ctx.bezierCurveTo(this.x - width, this.y - height / 4, this.x - width / 2, this.y - height, this.x, this.y - height / 4);
            
        } else if (this.shape === 'star') {
            // Forme d'Étoile à 5 branches
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
            // Forme de Cercle lumineux
            ctx.arc(this.x, this.y, this.size / 1.5, 0, Math.PI * 2);
        }
        
        ctx.closePath();
        ctx.fill();
    }
}

function handleParticles(x, y) {
    for (let i = 0; i < 2; i++) {
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
    ctx.fillStyle = 'rgba(11, 11, 26, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
