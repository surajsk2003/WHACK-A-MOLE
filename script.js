class WhackAMoleNeo {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.combo = 0;
        this.level = 1;
        this.gameActive = false;
        this.moleTimer = null;
        this.gameTimer = null;
        this.activeMoles = new Set();
        this.difficulty = 'easy';
        this.maxCombo = 0;
        this.achievements = [];
        this.soundEnabled = true;
        this.totalHits = 0;
        this.totalMisses = 0;
        this.perfectStreak = 0;
        this.maxPerfectStreak = 0;
        
        this.difficulties = {
            easy: { moleSpeed: 2000, moleLifetime: 1800, maxMoles: 2, name: 'Rookie' },
            normal: { moleSpeed: 1400, moleLifetime: 1400, maxMoles: 3, name: 'Warrior' },
            hard: { moleSpeed: 900, moleLifetime: 1000, maxMoles: 4, name: 'Master' },
            insane: { moleSpeed: 600, moleLifetime: 700, maxMoles: 5, name: 'Legend' }
        };

        this.particleColors = ['gold', 'blue', 'pink', 'green'];
        this.initializeGame();
        this.bindEvents();
        this.createFloatingParticles();
    }

    initializeGame() {
        this.createGrid();
        this.updateDisplay();
        this.updateProgressBars();
        this.createComboStreak();
    }

    createGrid() {
        const grid = document.getElementById('gameGrid');
        grid.innerHTML = '';
        
        const totalHoles = window.innerWidth <= 768 ? 9 : 16;
        const columns = window.innerWidth <= 768 ? 3 : 4;
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        for (let i = 0; i < totalHoles; i++) {
            const hole = document.createElement('div');
            hole.className = 'mole-hole';
            hole.dataset.index = i;
            
            const mole = document.createElement('div');
            mole.className = 'mole';
            hole.appendChild(mole);
            
            hole.addEventListener('click', (e) => this.hitMole(e, i));
            hole.addEventListener('mouseenter', () => this.holeHover(hole));
            grid.appendChild(hole);
        }
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('playAgainBtn')?.addEventListener('click', () => this.playAgain());
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setDifficulty(e.target.closest('.difficulty-btn').dataset.difficulty));
        });
        
        document.querySelectorAll('.neo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e, btn));
        });
    }

    setDifficulty(newDifficulty) {
        if (this.gameActive) return;
        
        this.difficulty = newDifficulty;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === newDifficulty);
        });
    }

    startGame() {
        if (this.gameActive) return;
        
        this.gameActive = true;
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.totalHits = 0;
        this.totalMisses = 0;
        this.perfectStreak = 0;
        this.achievements = [];
        this.activeMoles.clear();
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('gameOverScreen').style.display = 'none';
        
        this.updateDisplay();
        this.updateProgressBars();
        this.startGameTimer();
        this.spawnMoles();
        this.playSound('start');
    }

    startGameTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgressBars();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
            
            // Level progression
            if (this.timeLeft % 15 === 0 && this.timeLeft > 0) {
                this.level++;
                this.updateDisplay();
                this.playSound('levelup');
                this.showLevelUpEffect();
            }
        }, 1000);
    }

    spawnMoles() {
        if (!this.gameActive) return;
        
        const settings = this.difficulties[this.difficulty];
        const levelModifier = Math.max(0.5, 1 - (this.level - 1) * 0.1);
        const spawnRate = settings.moleSpeed * levelModifier;
        const maxMoles = Math.min(settings.maxMoles + Math.floor(this.level / 3), 8);
        
        if (this.activeMoles.size < maxMoles && Math.random() < 0.7) {
            this.showRandomMole();
        }
        
        this.moleTimer = setTimeout(() => this.spawnMoles(), spawnRate);
    }

    showRandomMole() {
        const holes = document.querySelectorAll('.mole-hole');
        const availableHoles = Array.from(holes).filter((_, index) => !this.activeMoles.has(index));
        
        if (availableHoles.length === 0) return;
        
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const holeIndex = parseInt(randomHole.dataset.index);
        const mole = randomHole.querySelector('.mole');
        
        this.activeMoles.add(holeIndex);
        mole.classList.add('visible');
        
        const settings = this.difficulties[this.difficulty];
        const levelModifier = Math.max(0.4, 1 - (this.level - 1) * 0.05);
        const lifetime = settings.moleLifetime * levelModifier;
        
        setTimeout(() => {
            if (mole.classList.contains('visible')) {
                mole.classList.remove('visible');
                this.activeMoles.delete(holeIndex);
                this.resetCombo();
            }
        }, lifetime);
    }

    hitMole(event, holeIndex) {
        event.preventDefault();
        
        if (!this.gameActive) return;
        
        if (!this.activeMoles.has(holeIndex)) {
            this.totalMisses++;
            this.resetCombo();
            this.playSound('miss');
            this.showMissEffect(event.currentTarget);
            return;
        }
        
        const hole = event.currentTarget;
        const mole = hole.querySelector('.mole');
        
        if (!mole.classList.contains('visible') || mole.classList.contains('hit')) return;
        
        mole.classList.add('hit');
        mole.classList.remove('visible');
        this.activeMoles.delete(holeIndex);
        
        this.totalHits++;
        this.combo++;
        this.perfectStreak++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.maxPerfectStreak = Math.max(this.maxPerfectStreak, this.perfectStreak);
        
        let points = 100;
        if (this.combo > 1) {
            points += (this.combo - 1) * 50;
        }
        points *= this.level;
        
        // Bonus for perfect accuracy
        if (this.perfectStreak >= 10) {
            points *= 1.5;
        }
        
        this.score += points;
        this.updateDisplay();
        this.updateProgressBars();
        this.updateComboStreak();
        
        this.createAdvancedParticles(hole);
        this.playSound('hit');
        
        if (this.combo > 1) {
            this.showComboDisplay(hole, this.combo);
        }
        
        this.checkAchievements();
        
        setTimeout(() => {
            mole.classList.remove('hit');
        }, 600);
    }

    createAdvancedParticles(hole) {
        const rect = hole.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particleCount = this.combo > 5 ? 12 : 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const colorClass = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
            particle.className = `particle ${colorClass}`;
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    showComboDisplay(hole, combo) {
        const display = document.createElement('div');
        display.className = 'combo-display';
        
        let comboText = `${combo}x COMBO!`;
        if (combo >= 10) comboText = `🔥 ${combo}x FIRE! 🔥`;
        if (combo >= 20) comboText = `⚡ ${combo}x LIGHTNING! ⚡`;
        if (combo >= 30) comboText = `💫 ${combo}x LEGENDARY! 💫`;
        
        display.textContent = comboText;
        hole.appendChild(display);
        
        this.playSound('combo');
        
        setTimeout(() => display.remove(), 1200);
    }

    resetCombo() {
        this.combo = 0;
        this.perfectStreak = 0;
        this.updateDisplay();
        this.updateComboStreak();
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('level').textContent = this.level;
    }

    updateProgressBars() {
        const timeFill = document.getElementById('timeFill');
        if (timeFill) {
            const timePercent = (this.timeLeft / 60) * 100;
            timeFill.style.width = `${timePercent}%`;
        }
    }
    
    createComboStreak() {
        const comboStreak = document.getElementById('comboStreak');
        if (comboStreak) {
            comboStreak.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const dot = document.createElement('div');
                dot.className = 'combo-dot';
                comboStreak.appendChild(dot);
            }
        }
    }
    
    updateComboStreak() {
        const dots = document.querySelectorAll('.combo-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index < this.combo);
        });
    }
    
    holeHover(hole) {
        if (!this.gameActive) return;
        hole.style.transform = 'scale(1.05)';
        setTimeout(() => {
            hole.style.transform = '';
        }, 200);
    }
    
    createRipple(event, button) {
        const ripple = button.querySelector('.btn-ripple');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('active');
        
        setTimeout(() => ripple.classList.remove('active'), 600);
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundIcon = document.querySelector('.sound-icon');
        soundIcon.textContent = this.soundEnabled ? '🔊' : '🔇';
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        console.log(`Playing sound: ${type}`);
    }
    
    showMissEffect(hole) {
        hole.style.boxShadow = '0 0 0 4px rgba(255, 0, 0, 0.5)';
        setTimeout(() => {
            hole.style.boxShadow = '';
        }, 300);
    }
    
    showLevelUpEffect() {
        const levelCard = document.querySelector('.level-card');
        levelCard.style.transform = 'scale(1.1)';
        levelCard.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        setTimeout(() => {
            levelCard.style.transform = '';
            levelCard.style.boxShadow = '';
        }, 500);
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        if (this.combo >= 10 && !this.achievements.includes('combo10')) {
            newAchievements.push({ id: 'combo10', name: 'Combo Master', desc: '10x Combo!' });
        }
        if (this.score >= 10000 && !this.achievements.includes('score10k')) {
            newAchievements.push({ id: 'score10k', name: 'High Scorer', desc: '10,000 Points!' });
        }
        if (this.perfectStreak >= 20 && !this.achievements.includes('perfect20')) {
            newAchievements.push({ id: 'perfect20', name: 'Perfectionist', desc: '20 Perfect Hits!' });
        }
        
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement.id);
            this.showAchievement(achievement);
        });
    }
    
    showAchievement(achievement) {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement-popup';
        achievementEl.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        document.body.appendChild(achievementEl);
        
        setTimeout(() => achievementEl.remove(), 3000);
    }
    
    calculateFinalAchievements() {
        const accuracy = this.totalHits / (this.totalHits + this.totalMisses) * 100;
        if (accuracy >= 90) {
            this.achievements.push('sharpshooter');
        }
        if (this.maxCombo >= 25) {
            this.achievements.push('comboking');
        }
    }
    
    displayGameOverModal() {
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    playAgain() {
        document.getElementById('gameOverScreen').style.display = 'none';
        this.resetGame();
    }
    
    createFloatingParticles() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: 100%;
                    pointer-events: none;
                    z-index: -1;
                    animation: float 10s linear forwards;
                `;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 10000);
            }
        }, 2000);
    }

    endGame() {
        this.gameActive = false;
        clearTimeout(this.moleTimer);
        clearInterval(this.gameTimer);
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        
        this.calculateFinalAchievements();
        this.displayGameOverModal();
        this.playSound('gameover');
        
        document.querySelectorAll('.mole.visible').forEach(mole => {
            mole.classList.remove('visible');
        });
        this.activeMoles.clear();
    }

    resetGame() {
        this.endGame();
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.totalHits = 0;
        this.totalMisses = 0;
        this.perfectStreak = 0;
        this.achievements = [];
        this.updateDisplay();
        this.updateProgressBars();
        this.updateComboStreak();
        document.getElementById('gameOverScreen').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new WhackAMoleNeo();
});

window.addEventListener('resize', () => {
    if (window.game && !window.game.gameActive) {
        window.game.createGrid();
    }
});