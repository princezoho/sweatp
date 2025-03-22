/**
 * Pet Class: Handles the pet's stats, evolution, and rendering
 * Mid-century modern design using sprite images of robot evolution
 */
class Pet {
    constructor() {
        // Initialize pet stats (0-100 scale)
        this.health = 50;
        this.happiness = 50;
        this.energy = 50;
        this.strength = 10;
        this.agility = 10;
        
        // Pet progression
        this.level = 1;
        this.stepsToday = 0;
        this.totalSteps = 0;
        
        // Color palette for mid-century modern design
        this.colors = {
            primary: '#e84a27', // Bright orange for the robot
            secondary: '#bd3a1e', // Darker orange for details
            tertiary: '#f5844a', // Lighter orange for highlights
            background: '#a4c1ab', // Mint green background
            outline: '#3b3b3b'     // Dark outline
        };
        
        // Canvas and context
        this.canvas = document.getElementById('pet-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Animation properties
        this.animationFrame = 0;
        this.lastTimestamp = 0;
        
        // Load robot sprites
        this.sprites = [];
        this.loadSprites();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Load robot sprite images
     */
    loadSprites() {
        // The evolution stages (1-5)
        const totalStages = 5;
        
        for (let i = 1; i <= totalStages; i++) {
            const img = new Image();
            img.src = `images/robot_stage${i}.png`;
            this.sprites.push(img);
            
            // Force error handling for sprite loading
            img.onerror = () => {
                console.error(`Failed to load sprite: robot_stage${i}.png`);
                // Create a fallback colored rectangle if image fails to load
                img._fallback = true;
            };
        }
    }
    
    /**
     * Update pet stats based on steps taken
     * @param {number} steps - Number of steps to add
     */
    addSteps(steps) {
        if (steps <= 0) return;
        
        // Update step counters
        this.stepsToday += steps;
        this.totalSteps += steps;
        
        // Update stats based on steps (decreasing returns for higher values)
        const healthIncrease = Math.min(20, steps * 0.01);
        const happinessIncrease = Math.min(15, steps * 0.005);
        const energyIncrease = Math.min(12, steps * 0.003);
        const strengthIncrease = Math.min(10, steps * 0.001);
        const agilityIncrease = Math.min(10, steps * 0.001);
        
        this.increaseHealth(healthIncrease);
        this.increaseHappiness(happinessIncrease);
        this.increaseEnergy(energyIncrease);
        this.increaseStrength(strengthIncrease);
        this.increaseAgility(agilityIncrease);
        
        // Check for level up
        this.checkLevelUp();
        
        // Save pet data
        this.saveData();
    }
    
    /**
     * Reset today's steps count
     */
    resetStepsToday() {
        this.stepsToday = 0;
        this.saveData();
    }
    
    /**
     * Increase health stat
     */
    increaseHealth(amount) {
        this.health = Math.min(100, this.health + amount);
        this.saveData();
    }
    
    /**
     * Increase happiness stat
     */
    increaseHappiness(amount) {
        this.happiness = Math.min(100, this.happiness + amount);
        this.saveData();
    }
    
    /**
     * Increase energy stat
     */
    increaseEnergy(amount) {
        this.energy = Math.min(100, this.energy + amount);
        this.saveData();
    }
    
    /**
     * Increase strength stat
     */
    increaseStrength(amount) {
        this.strength = Math.min(100, this.strength + amount);
        this.saveData();
    }
    
    /**
     * Increase agility stat
     */
    increaseAgility(amount) {
        this.agility = Math.min(100, this.agility + amount);
        this.saveData();
    }
    
    /**
     * Get the number of steps required for a specific level
     * Uses a progressive scaling formula to make higher levels require more steps
     */
    getStepsForLevel(level) {
        if (level <= 1) return 0;
        if (level > 100) return Infinity;
        
        // Base formula: steps = 1000 * level^1.5
        // Level 2 = 2,828 steps
        // Level 10 = 31,622 steps
        // Level 50 = 353,553 steps
        // Level 100 = 1,000,000 steps
        return Math.floor(1000 * Math.pow(level, 1.5));
    }
    
    /**
     * Check if pet should level up based on total steps
     */
    checkLevelUp() {
        // Determine level based on total steps
        let newLevel = 1;
        
        // Find highest level pet qualifies for (up to level 100)
        for (let i = 100; i >= 1; i--) {
            if (this.totalSteps >= this.getStepsForLevel(i)) {
                newLevel = i;
                break;
            }
        }
        
        // Check if pet leveled up
        if (newLevel > this.level) {
            // Level up!
            const oldLevel = this.level;
            this.level = newLevel;
            
            // Show level up message
            const message = document.createElement('div');
            message.className = 'message';
            message.style.backgroundColor = this.colors.primary;
            message.style.color = '#fff';
            
            // Multi-level up message
            if (newLevel > oldLevel + 1) {
                message.textContent = `Wow! Your robot evolved ${newLevel - oldLevel} levels to level ${newLevel}!`;
            } else {
                message.textContent = `Your robot evolved to level ${newLevel}!`;
            }
            
            // Add to the body
            document.body.appendChild(message);
            
            // Animate in
            setTimeout(() => {
                message.style.opacity = '1';
                message.style.transform = 'translateX(-50%) translateY(0)';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                message.style.opacity = '0';
                message.style.transform = 'translateX(-50%) translateY(-20px)';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (document.body.contains(message)) {
                        document.body.removeChild(message);
                    }
                }, 500);
            }, 4000);
        }
    }
    
    /**
     * Save pet data to localStorage
     */
    saveData() {
        const petData = {
            health: this.health,
            happiness: this.happiness,
            energy: this.energy,
            strength: this.strength,
            agility: this.agility,
            level: this.level,
            stepsToday: this.stepsToday,
            totalSteps: this.totalSteps,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('sweatPetData', JSON.stringify(petData));
    }
    
    /**
     * Load pet data from localStorage
     */
    loadData() {
        const savedData = localStorage.getItem('sweatPetData');
        
        if (savedData) {
            const petData = JSON.parse(savedData);
            
            // Check if it's a new day
            const lastSaved = new Date(petData.lastSaved);
            const today = new Date();
            const isNewDay = lastSaved.getDate() !== today.getDate() || 
                            lastSaved.getMonth() !== today.getMonth() ||
                            lastSaved.getFullYear() !== today.getFullYear();
            
            // Update pet stats
            this.health = petData.health || 50;
            this.happiness = petData.happiness || 50;
            this.energy = petData.energy || 50;
            this.strength = petData.strength || 10;
            this.agility = petData.agility || 10;
            this.level = petData.level || 1;
            this.totalSteps = petData.totalSteps || 0;
            
            // Reset steps today if it's a new day
            this.stepsToday = isNewDay ? 0 : (petData.stepsToday || 0);
            
            // Save updated data
            this.saveData();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Draw the pet on the canvas
     */
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw base line
        this.ctx.fillStyle = '#f5f1e6'; // off-white for the ground/floor
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        
        // Get the current evolution stage (1-5)
        const evolutionStage = this.getEvolutionStage();
        const spriteIndex = evolutionStage - 1;
        
        // Calculate bounce for animation
        const bounce = Math.sin(this.animationFrame * 0.1) * 2;
        
        // Check if sprite is loaded
        if (this.sprites[spriteIndex] && !this.sprites[spriteIndex]._fallback) {
            // Calculate position for the sprite
            const sprite = this.sprites[spriteIndex];
            
            // The height we want the sprite to be
            const targetHeight = this.canvas.height - 40;
            
            // Calculate width proportionally
            const ratio = sprite.width / sprite.height;
            const targetWidth = targetHeight * ratio;
            
            // Center the sprite horizontally
            const x = (this.canvas.width - targetWidth) / 2;
            
            // Draw the sprite
            this.ctx.drawImage(sprite, x, 10 + bounce, targetWidth, targetHeight);
        } else {
            // Fallback - draw a simple representation if sprite isn't loaded
            this.drawFallbackRobot(evolutionStage, bounce);
        }
        
        // Add level indicator
        this.drawLevelIndicator();
    }
    
    /**
     * Draw level indicator
     */
    drawLevelIndicator() {
        // Add a small level indicator at the bottom right
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.fillRect(this.canvas.width - 30, this.canvas.height - 20, 30, 20);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px "Helvetica Neue", Helvetica, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${this.level}`, this.canvas.width - 15, this.canvas.height - 10);
    }
    
    /**
     * Draw fallback robot if sprite isn't loaded
     */
    drawFallbackRobot(evolutionStage, bounce) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const baseY = height - 20;
        
        // Different sizes based on evolution stage
        const size = 30 + (evolutionStage * 15);
        const centerX = width / 2;
        
        // Draw simple robot representation
        ctx.fillStyle = this.colors.primary;
        
        // Body
        this.roundRect(ctx, centerX - size/2, baseY - size - 10 + bounce, size, size, 5, this.colors.primary);
        
        // Head
        ctx.beginPath();
        ctx.arc(centerX, baseY - size - 30 + bounce, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = this.colors.background;
        const eyeSize = size/10;
        ctx.beginPath();
        ctx.arc(centerX - eyeSize*2, baseY - size - 33 + bounce, eyeSize, 0, Math.PI * 2);
        ctx.arc(centerX + eyeSize*2, baseY - size - 33 + bounce, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Text showing sprite couldn't load
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px "Helvetica Neue", Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sprite ' + evolutionStage, centerX, baseY - size - 10 + bounce);
    }
    
    /**
     * Get the evolution stage based on level
     * Matches the 5 stages in the sprite sheet
     */
    getEvolutionStage() {
        if (this.level <= 20) return 1;
        if (this.level <= 40) return 2;
        if (this.level <= 60) return 3;
        if (this.level <= 80) return 4;
        return 5;
    }
    
    /**
     * Animation loop
     * @param {number} timestamp - Current time from requestAnimationFrame
     */
    animate(timestamp = 0) {
        // Calculate time difference
        const deltaTime = timestamp - this.lastTimestamp;
        
        // Update animation frame counter (for movement effects)
        if (deltaTime > 100) {
            this.animationFrame = (this.animationFrame + 1) % 60;
            this.lastTimestamp = timestamp;
        }
        
        // Draw the pet
        this.draw();
        
        // Continue animation loop
        requestAnimationFrame(this.animate.bind(this));
    }
    
    /**
     * Helper function to draw rounded rectangles
     */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = false;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
    }
} 