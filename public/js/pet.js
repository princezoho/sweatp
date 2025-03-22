/**
 * Pet Class: Handles the pet's stats, evolution, and rendering
 * Mid-century modern design with Feltron-inspired data visualization
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
            primary: [
                '#E8430F', // Level 1-20: Orange
                '#F29F05', // Level 21-40: Amber
                '#0A9396', // Level 41-60: Teal
                '#005F73', // Level 61-80: Deep blue
                '#85B8AC'  // Level 81-100: Mint
            ],
            secondary: [
                '#F29F05', // Level 1-20: Amber 
                '#0A9396', // Level 21-40: Teal
                '#005F73', // Level 41-60: Deep blue
                '#85B8AC', // Level 61-80: Mint
                '#E8430F'  // Level 81-100: Orange
            ]
        };
        
        // Canvas and context
        this.canvas = document.getElementById('pet-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Animation properties
        this.animationFrame = 0;
        this.lastTimestamp = 0;
        
        // Start animation loop
        this.animate();
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
            message.style.backgroundColor = this.getPetColor();
            message.style.color = '#fff';
            
            // Multi-level up message
            if (newLevel > oldLevel + 1) {
                message.textContent = `Wow! Your pet evolved ${newLevel - oldLevel} levels to level ${newLevel}!`;
            } else {
                message.textContent = `Your pet evolved to level ${newLevel}!`;
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
     * Update the UI with current pet stats
     */
    updateUI() {
        // Basic stats will be handled by the main app.js
        // This method is kept simple for compatibility
    }
    
    /**
     * Get pet's color based on current level
     */
    getPetColor(type = 'primary') {
        // Determine color tier based on level
        let tier = 0;
        
        if (this.level <= 20) tier = 0;
        else if (this.level <= 40) tier = 1;
        else if (this.level <= 60) tier = 2;
        else if (this.level <= 80) tier = 3;
        else tier = 4;
        
        return this.colors[type][tier];
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
        
        // Get pet colors based on level
        const primaryColor = this.getPetColor('primary');
        const secondaryColor = this.getPetColor('secondary');
        
        // Calculate the center of the canvas
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw pet shape based on tier (5 visual tiers)
        const tier = Math.min(4, Math.floor((this.level - 1) / 20));
        
        switch(tier) {
            case 0: // Levels 1-20 (simplest geometric shapes)
                this.drawTier1Pet(centerX, centerY, primaryColor, secondaryColor);
                break;
            case 1: // Levels 21-40 (more complex shapes)
                this.drawTier2Pet(centerX, centerY, primaryColor, secondaryColor);
                break;
            case 2: // Levels 41-60 (complex patterns)
                this.drawTier3Pet(centerX, centerY, primaryColor, secondaryColor);
                break;
            case 3: // Levels 61-80 (detailed form)
                this.drawTier4Pet(centerX, centerY, primaryColor, secondaryColor);
                break;
            case 4: // Levels 81-100 (ultimate form)
                this.drawTier5Pet(centerX, centerY, primaryColor, secondaryColor);
                break;
        }
        
        // Add level text for higher levels (21+)
        if (this.level > 20) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px "Helvetica Neue", Helvetica, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${this.level}`, centerX, centerY);
        }
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
    
    // Different pet drawing methods for each tier - Feltron-inspired mid-century modern style
    
    // Tier 1: Simple shapes (Levels 1-20)
    drawTier1Pet(x, y, color, secondaryColor) {
        const bounce = Math.sin(this.animationFrame * 0.1) * 3;
        
        // Draw background shape (circle)
        this.ctx.beginPath();
        this.ctx.arc(x, y + bounce, 40, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Draw simple geometric patterns
        this.ctx.beginPath();
        this.ctx.arc(x, y + bounce, 25, 0, Math.PI * 2);
        this.ctx.fillStyle = secondaryColor;
        this.ctx.fill();
        
        // Eyes (simple dots)
        this.ctx.beginPath();
        this.ctx.arc(x - 10, y - 5 + bounce, 3, 0, Math.PI * 2);
        this.ctx.arc(x + 10, y - 5 + bounce, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        
        // Simple mouth
        this.ctx.beginPath();
        this.ctx.arc(x, y + 10 + bounce, 8, 0, Math.PI);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    // Tier 2: More complex shapes (Levels 21-40)
    drawTier2Pet(x, y, color, secondaryColor) {
        const bounce = Math.sin(this.animationFrame * 0.1) * 3;
        
        // Draw main body (rounded rectangle)
        this.roundRect(
            this.ctx, 
            x - 40, 
            y - 30 + bounce, 
            80, 
            60, 
            8, 
            color
        );
        
        // Draw decorative pattern
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            this.ctx.rect(x - 25 + (i * 25), y + 10 + bounce, 15, 15);
        }
        this.ctx.fillStyle = secondaryColor;
        this.ctx.fill();
        
        // Draw eyes
        this.ctx.beginPath();
        this.ctx.arc(x - 15, y - 10 + bounce, 5, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 10 + bounce, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        
        // Draw pupils
        this.ctx.beginPath();
        this.ctx.arc(x - 15, y - 10 + bounce, 2, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 10 + bounce, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        
        // Draw smile
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y + 5 + bounce);
        this.ctx.quadraticCurveTo(x, y + 12 + bounce, x + 10, y + 5 + bounce);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    // Tier 3: Complex patterns (Levels 41-60)
    drawTier3Pet(x, y, color, secondaryColor) {
        const bounce = Math.sin(this.animationFrame * 0.1) * 2;
        
        // Draw main body (hexagon)
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + Math.cos(angle) * 45;
            const py = y + Math.sin(angle) * 45 + bounce;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Draw internal star pattern
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * 25;
            const py = y + Math.sin(angle) * 25 + bounce;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = secondaryColor;
        this.ctx.fill();
        
        // Draw eyes
        this.ctx.beginPath();
        this.ctx.arc(x - 15, y - 10 + bounce, 5, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 10 + bounce, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        
        // Draw pupils
        this.ctx.beginPath();
        this.ctx.arc(x - 15, y - 10 + bounce, 2, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 10 + bounce, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
    }
    
    // Tier 4: Detailed form (Levels 61-80)
    drawTier4Pet(x, y, color, secondaryColor) {
        const bounce = Math.sin(this.animationFrame * 0.1) * 2;
        const rotation = this.animationFrame * 0.01;
        
        // Draw rotating background
        this.ctx.save();
        this.ctx.translate(x, y + bounce);
        this.ctx.rotate(rotation);
        
        // Main square
        this.ctx.fillStyle = color;
        this.ctx.fillRect(-35, -35, 70, 70);
        
        // Rotating lines
        this.ctx.strokeStyle = secondaryColor;
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            this.ctx.moveTo(0, 0);
            const angle = (Math.PI / 2) * i + rotation * 2;
            const px = Math.cos(angle) * 60;
            const py = Math.sin(angle) * 60;
            this.ctx.lineTo(px, py);
        }
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(x, y + bounce, 25, 0, Math.PI * 2);
        this.ctx.fillStyle = secondaryColor;
        this.ctx.fill();
        
        // Draw inner circle
        this.ctx.beginPath();
        this.ctx.arc(x, y + bounce, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
    }
    
    // Tier 5: Ultimate form (Levels 81-100)
    drawTier5Pet(x, y, color, secondaryColor) {
        const bounce = Math.sin(this.animationFrame * 0.1) * 2;
        const rotation = this.animationFrame * 0.01;
        
        // Create a complex radial sunburst design
        this.ctx.save();
        this.ctx.translate(x, y + bounce);
        
        // Main circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 45, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Rays
        this.ctx.rotate(rotation);
        for (let i = 0; i < 12; i++) {
            this.ctx.rotate(Math.PI / 6);
            this.ctx.beginPath();
            this.ctx.moveTo(40, 0);
            this.ctx.lineTo(60, 0);
            this.ctx.lineTo(50, 15);
            this.ctx.closePath();
            this.ctx.fillStyle = secondaryColor;
            this.ctx.fill();
        }
        
        // Create geometric pattern in the center
        this.ctx.rotate(-rotation * 3);
        
        // Draw pattern
        const patternSize = 30;
        for (let i = 0; i < 4; i++) {
            this.ctx.rotate(Math.PI / 2);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(patternSize, 0);
            this.ctx.lineTo(patternSize, patternSize);
            this.ctx.closePath();
            this.ctx.fillStyle = secondaryColor;
            this.ctx.globalAlpha = 0.7;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
        
        // Inner circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        
        this.ctx.restore();
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