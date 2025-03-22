/**
 * Sweat Pets App - Main Controller
 * Mid-century modern aesthetic inspired by Alexander Girard with Feltron-inspired data display
 */
document.addEventListener('DOMContentLoaded', () => {
    // Instantiate the pet
    const pet = new Pet();
    
    // Load saved data if available
    pet.loadData();
    
    // Update UI based on pet stats
    updateUI();
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize UI components
    initializeCharts();
    
    // Check if activity data exists in localStorage
    const activityData = JSON.parse(localStorage.getItem('sweatActivityData') || '{}');
    
    // If no activity data, set default values
    if (!activityData.weeklySteps) {
        // Default weekly step data
        activityData.weeklySteps = [2000, 4500, 3200, 7800, 5400, 9200, 8100];
        localStorage.setItem('sweatActivityData', JSON.stringify(activityData));
    }
    
    // Sound toggle
    const soundButton = document.getElementById('sound-toggle');
    let soundEnabled = true;
    
    soundButton.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundButton.textContent = soundEnabled ? '🔊' : '🔇';
        
        // Play click sound when toggling sound on
        if (soundEnabled) {
            playSound('click');
        }
    });
    
    // Function to play sound effects
    function playSound(soundName) {
        if (!soundEnabled) return;
        
        const sound = document.getElementById(`sound-${soundName}`);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Error playing sound:', e));
        }
    }
    
    /**
     * Update all UI elements based on pet stats
     */
    function updateUI() {
        // Update pet info
        document.getElementById('pet-level').textContent = pet.level;
        document.getElementById('steps-today').textContent = formatNumber(pet.stepsToday);
        document.getElementById('total-steps').textContent = formatNumber(pet.totalSteps);
        
        // Update stats
        updateStatBar('health', pet.health);
        updateStatBar('happiness', pet.happiness);
        updateStatBar('energy', pet.energy);
        updateStatBar('strength', pet.strength);
        updateStatBar('agility', pet.agility);
        
        // Update level progress
        updateLevelProgress();
        
        // Update achievements
        updateAchievements();
    }
    
    /**
     * Update a stat bar with current value
     */
    function updateStatBar(statName, value) {
        const statBar = document.querySelector(`.stat-card.${statName} .progress-bar`);
        const statValue = document.querySelector(`.stat-card.${statName} .stat-value`);
        
        if (statBar && statValue) {
            statBar.style.width = `${value}%`;
            statValue.textContent = `${Math.round(value)}%`;
            
            // Update color based on value
            if (value < 30) {
                statBar.style.backgroundColor = '#e63946'; // Low - red
            } else if (value < 70) {
                statBar.style.backgroundColor = '#f9c74f'; // Medium - yellow
            } else {
                statBar.style.backgroundColor = '#90be6d'; // High - green
            }
        }
    }
    
    /**
     * Update level progress bar
     */
    function updateLevelProgress() {
        const currentLevel = pet.level;
        const nextLevel = currentLevel + 1;
        
        const currentLevelSteps = pet.getStepsForLevel(currentLevel);
        const nextLevelSteps = pet.getStepsForLevel(nextLevel);
        const stepProgress = pet.totalSteps - currentLevelSteps;
        const stepsNeeded = nextLevelSteps - currentLevelSteps;
        const progressPercent = (stepProgress / stepsNeeded) * 100;
        
        const progressBar = document.getElementById('level-progress-bar');
        const progressText = document.getElementById('level-progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progressPercent}%`;
            progressText.textContent = `${formatNumber(stepProgress)} / ${formatNumber(stepsNeeded)} steps to level ${nextLevel}`;
        }
    }
    
    /**
     * Update achievements display
     */
    function updateAchievements() {
        const achievementsContainer = document.getElementById('achievements-container');
        if (!achievementsContainer) return;
        
        // Clear existing achievements
        achievementsContainer.innerHTML = '';
        
        // Define achievements list
        const achievements = [
            { id: 'steps-1k', name: '1,000 Steps', requirement: pet.totalSteps >= 1000, icon: '👣' },
            { id: 'steps-10k', name: '10,000 Steps', requirement: pet.totalSteps >= 10000, icon: '🏃' },
            { id: 'steps-100k', name: '100,000 Steps', requirement: pet.totalSteps >= 100000, icon: '🏆' },
            { id: 'level-10', name: 'Level 10', requirement: pet.level >= 10, icon: '⭐' },
            { id: 'level-25', name: 'Level 25', requirement: pet.level >= 25, icon: '🌟' },
            { id: 'level-50', name: 'Level 50', requirement: pet.level >= 50, icon: '💫' },
            { id: 'level-75', name: 'Level 75', requirement: pet.level >= 75, icon: '✨' },
            { id: 'level-100', name: 'Level 100', requirement: pet.level >= 100, icon: '🎖️' }
        ];
        
        // Add achievements to container
        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${achievement.requirement ? 'unlocked' : 'locked'}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            `;
            achievementsContainer.appendChild(achievementElement);
        });
    }
    
    /**
     * Set up event listeners for buttons and controls
     */
    function setupEventListeners() {
        // Add steps button
        const addStepsBtn = document.getElementById('add-steps-btn');
        const stepsInput = document.getElementById('steps-input');
        
        if (addStepsBtn && stepsInput) {
            addStepsBtn.addEventListener('click', () => {
                const steps = parseInt(stepsInput.value) || 0;
                
                if (steps > 0) {
                    playSound('click');
                    pet.addSteps(steps);
                    stepsInput.value = '';
                    
                    // Check if we need to play achievement sound
                    const oldLevel = pet.level;
                    pet.checkLevelUp();
                    if (pet.level > oldLevel) {
                        playSound('levelup');
                        showConfetti();
                    }
                    
                    updateUI();
                    updateWeeklyActivity(steps);
                    
                    // Check if any new achievements were unlocked
                    checkNewAchievements();
                }
            });
        }
        
        // Reset today's steps button
        const resetTodayBtn = document.getElementById('reset-today-btn');
        if (resetTodayBtn) {
            resetTodayBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset today\'s steps?')) {
                    playSound('click');
                    pet.resetStepsToday();
                    updateUI();
                }
            });
        }
        
        // Reset all data button
        const resetAllBtn = document.getElementById('reset-all-btn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm('This will reset ALL of your pet\'s data. Are you sure you want to continue?')) {
                    playSound('click');
                    localStorage.removeItem('sweatPetData');
                    localStorage.removeItem('sweatActivityData');
                    location.reload();
                }
            });
        }
        
        // Care buttons
        setupCareButton('feed-btn', 'Feeding pet...', () => pet.increaseHealth(10));
        setupCareButton('play-btn', 'Playing with pet...', () => pet.increaseHappiness(10));
        setupCareButton('rest-btn', 'Pet is resting...', () => pet.increaseEnergy(10));
        setupCareButton('train-btn', 'Training pet...', () => pet.increaseStrength(10));
        setupCareButton('exercise-btn', 'Exercising pet...', () => pet.increaseAgility(10));
        
        // Export data button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                playSound('click');
                exportPetData();
            });
        }
        
        // Import data button
        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                playSound('click');
                importPetData();
            });
        }
    }
    
    /**
     * Set up a care button with feedback and animation
     */
    function setupCareButton(btnId, feedbackText, action) {
        const button = document.getElementById(btnId);
        if (!button) return;
        
        button.addEventListener('click', () => {
            playSound('click');
            
            // Disable button temporarily
            button.disabled = true;
            
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'feedback';
            feedback.textContent = feedbackText;
            document.body.appendChild(feedback);
            
            // Remove feedback after delay
            setTimeout(() => {
                document.body.removeChild(feedback);
                button.disabled = false;
                
                // Apply the action
                action();
                updateUI();
            }, 1000);
        });
    }
    
    /**
     * Initialize chart for weekly activity
     */
    function initializeCharts() {
        const weeklyActivityContainer = document.getElementById('weekly-activity');
        if (!weeklyActivityContainer) return;
        
        // Get weekly data from localStorage
        const activityData = JSON.parse(localStorage.getItem('sweatActivityData') || '{}');
        const weeklySteps = activityData.weeklySteps || [0, 0, 0, 0, 0, 0, 0];
        
        // Clear any existing content
        weeklyActivityContainer.innerHTML = '';
        
        // Find maximum value for scaling
        const maxSteps = Math.max(...weeklySteps, 1000);
        
        // Create day labels
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Create chart
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';
        
        // Create bars
        weeklySteps.forEach((steps, index) => {
            const barHeight = Math.max(5, (steps / maxSteps) * 100);
            
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${barHeight}%`;
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = dayLabels[index];
            
            const value = document.createElement('div');
            value.className = 'bar-value';
            value.textContent = formatNumber(steps);
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            barContainer.appendChild(value);
            chartWrapper.appendChild(barContainer);
        });
        
        weeklyActivityContainer.appendChild(chartWrapper);
    }
    
    /**
     * Update weekly activity data
     */
    function updateWeeklyActivity(newSteps) {
        // Get weekly data from localStorage
        const activityData = JSON.parse(localStorage.getItem('sweatActivityData') || '{}');
        let weeklySteps = activityData.weeklySteps || [0, 0, 0, 0, 0, 0, 0];
        
        // Get current day of week (0 = Sunday, 6 = Saturday)
        const today = new Date().getDay();
        
        // Convert to our format (0 = Monday, 6 = Sunday)
        const dayIndex = today === 0 ? 6 : today - 1;
        
        // Update today's steps
        weeklySteps[dayIndex] += newSteps;
        
        // Save back to localStorage
        activityData.weeklySteps = weeklySteps;
        localStorage.setItem('sweatActivityData', JSON.stringify(activityData));
        
        // Redraw charts
        initializeCharts();
    }
    
    /**
     * Check for newly unlocked achievements and show notifications
     */
    function checkNewAchievements() {
        // Get previous achievements status
        const previousAchievements = JSON.parse(localStorage.getItem('sweatAchievements') || '{}');
        
        // Define achievements to check
        const achievements = [
            { id: 'steps-1k', name: '1,000 Steps', requirement: pet.totalSteps >= 1000, previouslyUnlocked: previousAchievements['steps-1k'] },
            { id: 'steps-10k', name: '10,000 Steps', requirement: pet.totalSteps >= 10000, previouslyUnlocked: previousAchievements['steps-10k'] },
            { id: 'steps-100k', name: '100,000 Steps', requirement: pet.totalSteps >= 100000, previouslyUnlocked: previousAchievements['steps-100k'] },
            { id: 'level-10', name: 'Level 10', requirement: pet.level >= 10, previouslyUnlocked: previousAchievements['level-10'] },
            { id: 'level-25', name: 'Level 25', requirement: pet.level >= 25, previouslyUnlocked: previousAchievements['level-25'] },
            { id: 'level-50', name: 'Level 50', requirement: pet.level >= 50, previouslyUnlocked: previousAchievements['level-50'] },
            { id: 'level-75', name: 'Level 75', requirement: pet.level >= 75, previouslyUnlocked: previousAchievements['level-75'] },
            { id: 'level-100', name: 'Level 100', requirement: pet.level >= 100, previouslyUnlocked: previousAchievements['level-100'] }
        ];
        
        // Check each achievement
        let newUnlocks = 0;
        
        achievements.forEach(achievement => {
            if (achievement.requirement && !achievement.previouslyUnlocked) {
                // New achievement unlocked!
                newUnlocks++;
                
                // Update storage
                previousAchievements[achievement.id] = true;
                
                // Show notification after a small delay (stagger notifications)
                setTimeout(() => {
                    showAchievementNotification(achievement.name);
                }, newUnlocks * 800);
            }
        });
        
        // Play achievement sound if any new achievements
        if (newUnlocks > 0) {
            playSound('achievement');
        }
        
        // Save updated achievements
        localStorage.setItem('sweatAchievements', JSON.stringify(previousAchievements));
    }
    
    /**
     * Show achievement notification
     */
    function showAchievementNotification(achievementName) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievementName}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
    
    /**
     * Show confetti animation for level ups
     */
    function showConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confettiContainer.appendChild(confetti);
        }
        
        // Remove after animation completes
        setTimeout(() => {
            if (document.body.contains(confettiContainer)) {
                document.body.removeChild(confettiContainer);
            }
        }, 5000);
    }
    
    /**
     * Export pet data to a file
     */
    function exportPetData() {
        const petData = localStorage.getItem('sweatPetData');
        const activityData = localStorage.getItem('sweatActivityData');
        const achievementsData = localStorage.getItem('sweatAchievements');
        
        const exportData = {
            petData: petData ? JSON.parse(petData) : null,
            activityData: activityData ? JSON.parse(activityData) : null,
            achievementsData: achievementsData ? JSON.parse(achievementsData) : null,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "sweat_pets_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    
    /**
     * Import pet data from a file
     */
    function importPetData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (importedData.petData) {
                        localStorage.setItem('sweatPetData', JSON.stringify(importedData.petData));
                    }
                    
                    if (importedData.activityData) {
                        localStorage.setItem('sweatActivityData', JSON.stringify(importedData.activityData));
                    }
                    
                    if (importedData.achievementsData) {
                        localStorage.setItem('sweatAchievements', JSON.stringify(importedData.achievementsData));
                    }
                    
                    // Reload page to apply changes
                    location.reload();
                } catch (error) {
                    alert('Error importing data: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Helper to format numbers with commas
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    /**
     * Get a random color for confetti
     */
    function getRandomColor() {
        const colors = [
            '#e84a27', // Primary orange
            '#f5844a', // Light orange
            '#a4c1ab', // Background mint
            '#5b8c5a', // Darker mint
            '#ffd166', // Yellow
            '#06d6a0', // Turquoise
            '#118ab2'  // Blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}); 