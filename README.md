# 🎯 Whack-a-Mole Neo

A modern, responsive Whack-a-Mole game with advanced UI/UX features, glassmorphism design, and cutting-edge animations.

## ✨ Features

### 🎮 **Gameplay**
- **4 Difficulty Modes**: Rookie, Warrior, Master, Legend
- **Progressive Levels**: Automatic difficulty scaling every 15 seconds
- **Combo System**: Chain hits for bonus points and visual effects
- **Achievement System**: Unlock badges for special accomplishments
- **Real-time Stats**: Score, time, combo, and level tracking

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Translucent cards with backdrop blur
- **3D Animations**: Advanced mole animations with cubic-bezier transitions
- **Particle Effects**: Multi-colored explosions on successful hits
- **Gradient Animations**: Dynamic title with shifting colors
- **Floating Background**: Animated particles and background effects

### 📱 **Responsive Design**
- **Fully Adaptive**: Works on all screen sizes (320px - 2560px+)
- **Smart Grid**: Auto-adjusting game grid (3-5 columns)
- **Viewport Scaling**: All elements scale proportionally
- **Touch Optimized**: Perfect for mobile and tablet devices

### 🎵 **Interactive Elements**
- **Sound Controls**: Toggle audio feedback
- **Ripple Effects**: Material Design button interactions
- **Hover Animations**: Smooth scale effects and transitions
- **Modal System**: Sleek game over screen with achievements

## 🚀 Getting Started

### **Quick Start**
1. Clone or download the project
2. Open `index.html` in your web browser
3. Click "Initialize" to start playing!

### **File Structure**
```
Whack-a-Mole/
├── index.html      # Main HTML structure
├── style.css       # Modern CSS with glassmorphism
├── script.js       # Advanced game logic
└── README.md       # This file
```

## 🎯 How to Play

1. **Select Difficulty**: Choose from Rookie to Legend mode
2. **Start Game**: Click "Initialize" to begin
3. **Whack Moles**: Click on moles as they appear
4. **Build Combos**: Hit consecutive moles for bonus points
5. **Level Up**: Survive 60 seconds while difficulty increases

### **Scoring System**
- Base points: 100 per hit
- Combo bonus: +50 points per combo level
- Level multiplier: Points × current level
- Perfect streak bonus: 1.5× multiplier after 10 consecutive hits

## 🏆 Achievements

- **Combo Master**: Achieve 10x combo
- **High Scorer**: Reach 10,000 points
- **Perfectionist**: 20 consecutive perfect hits
- **Sharpshooter**: 90%+ accuracy
- **Combo King**: 25+ max combo

## 🛠️ Technical Features

### **Modern CSS**
- CSS Custom Properties (variables)
- Clamp() functions for responsive sizing
- CSS Grid with auto-fit
- Advanced animations and keyframes
- Backdrop-filter for glassmorphism

### **Advanced JavaScript**
- ES6 Classes and modern syntax
- Event delegation and optimization
- Dynamic DOM manipulation
- Performance-optimized animations
- Responsive grid calculations

### **Browser Support**
- Chrome 88+
- Firefox 94+
- Safari 14+
- Edge 88+

## 🎨 Customization

### **Colors**
Modify CSS custom properties in `:root`:
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### **Difficulty Settings**
Adjust in `script.js`:
```javascript
this.difficulties = {
    easy: { moleSpeed: 2000, moleLifetime: 1800, maxMoles: 2 }
};
```

## 📱 Device Compatibility

- **Mobile**: 320px - 768px (3-column grid)
- **Tablet**: 768px - 1024px (4-column grid)
- **Desktop**: 1024px+ (4-5 column grid)
- **Large Screens**: 1400px+ (5-column grid)

## 🔧 Development

### **Local Development**
No build process required - open `index.html` directly in browser.

### **Fonts Used**
- **Orbitron**: Futuristic monospace for titles and scores
- **Inter**: Modern sans-serif for UI text

## 📄 License

Open source - feel free to modify and distribute.

---

**Enjoy the game! 🎮✨**