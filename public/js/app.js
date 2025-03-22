/**
 * Sweat Pets App - Main Controller
 * Mid-century modern aesthetic inspired by Alexander Girard with Feltron-inspired data display
 */
document.addEventListener('DOMContentLoaded', () => {
    // Sound settings
    let soundEnabled = localStorage.getItem('sweatPetsSoundEnabled') !== 'false';
    
    // Setup sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    updateSoundToggleIcon();
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('sweatPetsSoundEnabled', soundEnabled);
        updateSoundToggleIcon();
        playSound('click-sound');
    });
    
    function updateSoundToggleIcon() {
        soundToggle.innerHTML = soundEnabled 
            ? `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>`
            : `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/></svg>`;
    }
    
    // Create sound elements if missing
    createSoundFilesIfMissing();

    // Initialize the pet
    const pet = new Pet();
    
    // Try to load saved data
    const dataLoaded = pet.loadData();
    
    if (!dataLoaded) {
        // First time user, show welcome message
        setTimeout(() => {
            showMessage('Welcome to Sweat Pets! Record your steps to help your pet grow and evolve.');
        }, 500);
    }
    
    // Update level requirement text
    updateLevelRequirementText();
    
    // Add interactive hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSound('click-sound', 0.2);
        });
    });
    
    // Update additional UI elements
    updateAllStats();
    createWeeklyChart();
    
    // Add steps button handler
    const addStepsBtn = document.getElementById('add-steps-btn');
    const stepsInput = document.getElementById('steps');
    
    // Add animation to button
    addStepsBtn.addEventListener('mouseenter', () => {
        playSound('click-sound', 0.1);
    });
    
    // Add number input interactions
    stepsInput.addEventListener('focus', () => {
        playSound('click-sound', 0.1);
    });
    
    stepsInput.addEventListener('input', () => {
        if (stepsInput.value && stepsInput.value > 0) {
            addStepsBtn.classList.add('ready');
        } else {
            addStepsBtn.classList.remove('ready');
        }
    });
    
    // Main button handler
    addStepsBtn.addEventListener('click', () => {
        const steps = parseInt(stepsInput.value);
        
        if (isNaN(steps) || steps <= 0) {
            showMessage('Please enter a valid number of steps.');
            playSound('click-sound', 0.3);
            return;
        }
        
        // Store the previous level to check for level up
        const previousLevel = pet.level;
        
        // Add steps to the pet
        pet.addSteps(steps);
        
        // Check if pet leveled up to play sound
        if (pet.level > previousLevel) {
            playSound('levelup-sound');
            
            // Add celebration animation
            celebrateLevelUp();
            
            // Update level requirement text
            updateLevelRequirementText();
        } else {
            playSound('achievement-sound');
        }
        
        // Update all stats UI
        updateAllStats();
        
        // Update chart data
        updateWeeklyChart(steps);
        
        // Provide feedback
        if (steps > 0) {
            const milestone = getStepMilestone(pet.totalSteps);
            if (milestone) {
                showMessage(`🎉 ${milestone}`);
            } else {
                showMessage(`Recorded ${steps.toLocaleString()} steps. Progress saved.`);
            }
        }
        
        // Clear input field
        stepsInput.value = '';
        addStepsBtn.classList.remove('ready');
    });
    
    // Reset today's steps button handler
    const resetStepsBtn = document.getElementById('reset-steps-btn');
    
    resetStepsBtn.addEventListener('mouseenter', () => {
        playSound('click-sound', 0.1);
    });
    
    resetStepsBtn.addEventListener('click', () => {
        // Confirm reset
        if (pet.stepsToday === 0) {
            showMessage('You haven\'t recorded any steps today yet.');
            return;
        }
        
        // Reset today's steps but keep total
        const stepsToReset = pet.stepsToday;
        pet.resetStepsToday();
        
        // Update all UI elements
        updateAllStats();
        
        // Provide feedback
        showMessage(`Reset today's steps count from ${stepsToReset.toLocaleString()} to 0.`);
        
        playSound('click-sound', 0.3);
    });
    
    // Pet management buttons
    const feedPetBtn = document.getElementById('feed-pet-btn');
    const playPetBtn = document.getElementById('play-pet-btn');
    const restPetBtn = document.getElementById('rest-pet-btn');
    const trainPetBtn = document.getElementById('train-pet-btn');
    const exercisePetBtn = document.getElementById('exercise-pet-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');
    
    feedPetBtn.addEventListener('click', () => {
        pet.increaseHealth(10);
        updateAllStats();
        showMessage('Pet fed! Health +10');
        playSound('click-sound', 0.3);
    });
    
    playPetBtn.addEventListener('click', () => {
        pet.increaseHappiness(10);
        updateAllStats();
        showMessage('Played with pet! Happiness +10');
        playSound('click-sound', 0.3);
    });
    
    restPetBtn.addEventListener('click', () => {
        pet.increaseEnergy(10);
        updateAllStats();
        showMessage('Pet rested! Energy +10');
        playSound('click-sound', 0.3);
    });
    
    trainPetBtn.addEventListener('click', () => {
        pet.increaseStrength(5);
        updateAllStats();
        showMessage('Pet trained! Strength +5');
        playSound('click-sound', 0.3);
    });
    
    exercisePetBtn.addEventListener('click', () => {
        pet.increaseAgility(5);
        updateAllStats();
        showMessage('Pet exercised! Agility +5');
        playSound('click-sound', 0.3);
    });
    
    resetAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all pet data? This cannot be undone.')) {
            // Clear all data
            localStorage.removeItem('sweatPetData');
            localStorage.removeItem('sweatPetsWeeklyData');
            
            // Reload the page
            showMessage('All pet data has been reset!');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
    
    // Data management buttons
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    
    exportDataBtn.addEventListener('click', () => {
        exportPetData();
    });
    
    importDataBtn.addEventListener('click', () => {
        importPetData();
    });
    
    /**
     * Export pet data to a JSON file
     */
    function exportPetData() {
        const petData = {
            stats: JSON.parse(localStorage.getItem('sweatPetData')),
            weeklyData: JSON.parse(localStorage.getItem('sweatPetsWeeklyData')),
            achievements: JSON.parse(localStorage.getItem('sweatPetsAchievements') || '[]')
        };
        
        const dataStr = JSON.stringify(petData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'sweat-pets-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showMessage('Pet data exported successfully!');
    }
    
    /**
     * Import pet data from a JSON file
     */
    function importPetData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.stats) {
                        localStorage.setItem('sweatPetData', JSON.stringify(data.stats));
                    }
                    
                    if (data.weeklyData) {
                        localStorage.setItem('sweatPetsWeeklyData', JSON.stringify(data.weeklyData));
                    }
                    
                    if (data.achievements) {
                        localStorage.setItem('sweatPetsAchievements', JSON.stringify(data.achievements));
                    }
                    
                    showMessage('Pet data imported successfully! Reloading...');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (err) {
                    showMessage('Error importing data. Please check the file format.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Update all stats displays with animations
     */
    function updateAllStats() {
        // Update numeric values with counting animation
        animateCounter('health-value', Math.round(pet.health));
        animateCounter('happiness-value', Math.round(pet.happiness));
        animateCounter('energy-value', Math.round(pet.energy));
        animateCounter('strength-value', Math.round(pet.strength));
        animateCounter('agility-value', Math.round(pet.agility));
        
        // Update percentage texts
        document.getElementById('health-percent').textContent = `${Math.round(pet.health)}%`;
        document.getElementById('happiness-percent').textContent = `${Math.round(pet.happiness)}%`;
        document.getElementById('energy-percent').textContent = `${Math.round(pet.energy)}%`;
        document.getElementById('strength-percent').textContent = `${Math.round(pet.strength)}%`;
        document.getElementById('agility-percent').textContent = `${Math.round(pet.agility)}%`;
        
        // Update progress bars
        document.getElementById('health-bar').style.width = `${Math.round(pet.health)}%`;
        document.getElementById('happiness-bar').style.width = `${Math.round(pet.happiness)}%`;
        document.getElementById('energy-bar').style.width = `${Math.round(pet.energy)}%`;
        document.getElementById('strength-bar').style.width = `${Math.round(pet.strength)}%`;
        document.getElementById('agility-bar').style.width = `${Math.round(pet.agility)}%`;
        
        // Update total steps with animation
        animateCounter('total-steps', pet.totalSteps);
        
        // Update steps today with animation
        animateCounter('steps-today', pet.stepsToday);
        
        // Update pet level
        document.getElementById('pet-level').textContent = pet.level;
        document.getElementById('current-level').textContent = pet.level;
        document.getElementById('next-level').textContent = Math.min(pet.level + 1, 100);
        
        // Update level progress bar
        updateLevelProgressBar();
    }
    
    /**
     * Update level progress bar based on current progress towards next level
     */
    function updateLevelProgressBar() {
        const progressBar = document.getElementById('level-progress-bar');
        const currentLevel = pet.level;
        const nextLevel = Math.min(currentLevel + 1, 100);
        
        if (currentLevel >= 100) {
            // Max level reached
            progressBar.style.width = '100%';
            return;
        }
        
        const currentThreshold = pet.getStepsForLevel(currentLevel);
        const nextThreshold = pet.getStepsForLevel(nextLevel);
        const stepsNeeded = nextThreshold - currentThreshold;
        const progress = pet.totalSteps - currentThreshold;
        
        const percentage = Math.min(100, Math.round((progress / stepsNeeded) * 100));
        progressBar.style.width = `${percentage}%`;
    }
    
    /**
     * Updates the text showing requirements for next level
     */
    function updateLevelRequirementText() {
        const nextLevel = Math.min(pet.level + 1, 100);
        const stepsRequired = pet.getStepsForLevel(nextLevel);
        const levelReqElement = document.getElementById('level-requirement');
        
        if (pet.level >= 100) {
            levelReqElement.textContent = 'Max level reached!';
        } else {
            const stepsRemaining = stepsRequired - pet.totalSteps;
            levelReqElement.textContent = `Next level: ${stepsRemaining.toLocaleString()} more steps`;
        }
    }
    
    /**
     * Animate counter from current value to target value
     */
    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.textContent.replace(/,/g, ''));
        const start = currentValue || 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuad = progress * (2 - progress);
            
            const value = Math.round(start + (targetValue - start) * easeOutQuad);
            element.textContent = value.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    /**
     * Create weekly activity chart with mid-century modern style
     */
    function createWeeklyChart() {
        const chartContainer = document.getElementById('weekly-chart');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Get last 7 days of data or create placeholder
        const weekData = getWeeklyData();
        
        // Clear existing chart
        chartContainer.innerHTML = '';
        
        // Create chart bars
        days.forEach((day, index) => {
            const barHeight = weekData[index] > 0 
                ? Math.min(Math.round(weekData[index] / 100), 150) 
                : 0;
                
            // Create bar element
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${barHeight}px`;
            bar.style.left = `${(index * 14) + 6}%`;
            bar.setAttribute('data-steps', weekData[index].toLocaleString());
            
            // Add hover text and interaction
            bar.title = `${day}: ${weekData[index].toLocaleString()} steps`;
            bar.addEventListener('mouseenter', () => {
                playSound('click-sound', 0.1);
            });
            
            // Create label element
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = day;
            label.style.left = `${(index * 14) + 6}%`;
            
            // Add to chart
            chartContainer.appendChild(bar);
            chartContainer.appendChild(label);
        });
    }
    
    /**
     * Get weekly data from localStorage or create placeholder
     */
    function getWeeklyData() {
        const savedData = localStorage.getItem('sweatPetsWeeklyData');
        
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Default weekly data (zeros for each day)
        const defaultData = [0, 0, 0, 0, 0, 0, 0];
        localStorage.setItem('sweatPetsWeeklyData', JSON.stringify(defaultData));
        return defaultData;
    }
    
    /**
     * Update weekly chart with new step data
     */
    function updateWeeklyChart(newSteps) {
        // Get current day of week (0 = Monday, 6 = Sunday)
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday from 0 to 6
        
        // Get current data
        const weekData = getWeeklyData();
        
        // Update today's steps
        weekData[dayIndex] += newSteps;
        
        // Save updated data
        localStorage.setItem('sweatPetsWeeklyData', JSON.stringify(weekData));
        
        // Recreate chart
        createWeeklyChart();
    }
    
    /**
     * Helper function to show temporary messages to the user
     * @param {string} text - Message to display
     */
    function showMessage(text) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => {
            document.body.removeChild(msg);
        });
        
        // Create message element
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        
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
        }, 3000);
    }
    
    /**
     * Play a sound effect
     */
    function playSound(soundId, volume = 0.5) {
        if (!soundEnabled) return;
        
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.log('Audio play error:', err);
            });
        }
    }
    
    /**
     * Create celebration animation for level up
     */
    function celebrateLevelUp() {
        // Create confetti elements
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
    }
    
    /**
     * Create a single confetti element
     */
    function createConfetti() {
        const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent1)', 'var(--color-accent2)'];
        const confetti = document.createElement('div');
        
        confetti.style.position = 'fixed';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 5 + 5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '-10px';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(0deg)';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Random horizontal movement and rotation
        const rotation = Math.random() * 360;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        const duration = Math.random() * 2 + 2;
        
        confetti.animate([
            { transform: `translateX(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateX(${horizontalMovement}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.14, 0.82, 0.36, 1)',
            fill: 'forwards'
        });
        
        // Fall animation
        confetti.animate([
            { top: '-10px' },
            { top: '110vh' }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.14, 0.82, 0.36, 1)',
            fill: 'forwards'
        });
        
        // Remove the element after animation completes
        setTimeout(() => {
            if (document.body.contains(confetti)) {
                document.body.removeChild(confetti);
            }
        }, duration * 1000);
    }
    
    /**
     * Get milestone message based on total steps
     */
    function getStepMilestone(totalSteps) {
        const milestones = {
            1000: "You've taken your first 1,000 steps with your pet!",
            5000: "Milestone: 5,000 steps! Your pet has evolved!",
            10000: "10,000 steps achieved. You're building great habits!",
            25000: "25,000 steps. Impressive commitment!",
            50000: "50,000 steps achieved!",
            100000: "100,000 steps! You're a fitness champion!",
            250000: "250,000 steps - incredible dedication!",
            500000: "500,000 steps! You're among the pet fitness elite!",
            1000000: "1 MILLION steps! Legendary achievement!"
        };
        
        for (const milestone in milestones) {
            if (totalSteps >= parseInt(milestone) && totalSteps < parseInt(milestone) + 1000) {
                return milestones[milestone];
            }
        }
        
        return null;
    }
    
    /**
     * Create sound files if they don't exist
     */
    function createSoundFilesIfMissing() {
        // Define sound sources
        const audioElements = [
            { id: 'click-sound', src: 'sounds/click.mp3' },
            { id: 'levelup-sound', src: 'sounds/levelup.mp3' },
            { id: 'achievement-sound', src: 'sounds/achievement.mp3' }
        ];
        
        // Check each audio element
        audioElements.forEach(audio => {
            if (!document.getElementById(audio.id)) {
                const element = document.createElement('audio');
                element.id = audio.id;
                element.preload = 'auto';
                element.src = audio.src;
                document.body.appendChild(element);
                
                // Add error handling if sounds don't exist yet
                element.addEventListener('error', () => {
                    console.log(`Warning: Sound file ${audio.src} not found.`);
                });
            }
        });
    }
    
    // Initialize achievements
    createAchievements();
    
    /**
     * Create achievements section
     */
    function createAchievements() {
        const achievementsContainer = document.getElementById('achievements-container');
        const achievements = [
            { id: 'steps1k', title: 'First Steps', description: 'Take 1,000 steps', icon: '👣', requirement: total => total >= 1000 },
            { id: 'steps10k', title: 'Walking Pro', description: 'Take 10,000 steps', icon: '🏃', requirement: total => total >= 10000 },
            { id: 'steps100k', title: 'Marathon', description: 'Take 100,000 steps', icon: '🥇', requirement: total => total >= 100000 },
            { id: 'level10', title: 'Level 10', description: 'Reach level 10', icon: '⭐', requirement: (_, pet) => pet.level >= 10 },
            { id: 'level25', title: 'Level 25', description: 'Reach level 25', icon: '🌟', requirement: (_, pet) => pet.level >= 25 },
            { id: 'level50', title: 'Level 50', description: 'Reach level 50', icon: '💫', requirement: (_, pet) => pet.level >= 50 },
            { id: 'level100', title: 'Master', description: 'Reach level 100', icon: '👑', requirement: (_, pet) => pet.level >= 100 },
            { id: 'perfect', title: 'Perfect Pet', description: 'Get 100% in all stats', icon: '🏆', requirement: (_, pet) => 
                pet.health >= 100 && pet.happiness >= 100 && pet.energy >= 100 && pet.strength >= 100 && pet.agility >= 100 }
        ];
        
        // Get unlocked achievements from localStorage or create empty array
        let unlockedAchievements = JSON.parse(localStorage.getItem('sweatPetsAchievements') || '[]');
        
        // Clear existing achievements
        achievementsContainer.innerHTML = '';
        
        // Create achievement elements
        achievements.forEach(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id) || 
                               achievement.requirement(pet.totalSteps, pet);
            
            // If newly unlocked, save to localStorage
            if (isUnlocked && !unlockedAchievements.includes(achievement.id)) {
                unlockedAchievements.push(achievement.id);
                localStorage.setItem('sweatPetsAchievements', JSON.stringify(unlockedAchievements));
                
                // Show notification if this isn't initial load
                if (dataLoaded) {
                    showMessage(`Achievement Unlocked: ${achievement.title}!`);
                    playSound('achievement-sound');
                }
            }
            
            const element = document.createElement('div');
            element.className = `achievement ${isUnlocked ? '' : 'locked'}`;
            
            element.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
            `;
            
            achievementsContainer.appendChild(element);
        });
    }
}); 