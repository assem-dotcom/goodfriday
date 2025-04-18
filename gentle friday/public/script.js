// Storybook content
const storyContent = [
    {
        text: "Hi! I'm Lenny the Lamb. Today is a very special day called Good Friday. Let me tell you why it's so important...",
        image: "assets/lenny-intro.svg"
    },
    {
        text: "A long time ago, there was someone very special who loved everyone so much that He was willing to do something very hard...",
        image: "assets/jesus-teaching.svg"
    },
    {
        text: "He showed us that true love means being willing to help others, even when it's difficult. Just like sharing your last carrot with a friend!",
        image: "assets/carrot.svg"
    },
    {
        text: "On Good Friday, we remember how this special person showed us the greatest love of all by giving everything He had for others.",
        image: "assets/cross.svg"
    },
    {
        text: "But the story doesn't end there! After the darkness comes light, and after sadness comes joy. That's why we call it GOOD Friday!",
        image: "assets/sunrise.svg"
    },
    {
        text: "Just like flowers bloom after winter, and lambs are born in spring, Good Friday reminds us that love and hope always win in the end!",
        image: "assets/meadow.svg"
    }
];

// Candle quotes
const candleQuotes = [
    "Darkness doesn't last forever.",
    "Even little lambs can be brave.",
    "Love is stronger than anything.",
    "Hope grows in the smallest places.",
    "Kindness makes the world brighter."
];

// API configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://lenny-the-lamb.onrender.com/api'
  : 'http://localhost:3000/api';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeStorybook();
    initializeCandles();
    initializeKindnessQuest();
    initializeMiniGame();
    initializeGratitudeGarden();
    setupLennyEasterEgg();
});

// Storybook functionality
function initializeStorybook() {
    const storyContainer = document.querySelector('.story-container');
    let currentPage = 0;

    function displayPage(pageIndex) {
        const page = storyContent[pageIndex];
        storyContainer.innerHTML = `
            <div class="story-page">
                <img src="${page.image}" alt="Story illustration">
                <p>${page.text}</p>
                <div class="story-controls">
                    <button onclick="turnPage(-1)" ${currentPage === 0 ? 'disabled' : ''}>←</button>
                    <button onclick="turnPage(1)" ${currentPage === storyContent.length - 1 ? 'disabled' : ''}>→</button>
                </div>
            </div>
        `;
    }

    window.turnPage = (direction) => {
        currentPage = Math.max(0, Math.min(storyContent.length - 1, currentPage + direction));
        displayPage(currentPage);
    };

    displayPage(0);
}

// Candle lighting functionality
function initializeCandles() {
    const candlesContainer = document.querySelector('.candles-container');
    let litCandles = 0;

    for (let i = 0; i < 5; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.innerHTML = `
            <div class="candle-flame"></div>
            <div class="candle-quote" style="display: none;">${candleQuotes[i]}</div>
        `;

        candle.addEventListener('click', () => {
            if (!candle.classList.contains('lit')) {
                candle.classList.add('lit');
                litCandles++;
                candle.querySelector('.candle-quote').style.display = 'block';
                
                if (litCandles === 3) {
                    // Trigger Lenny's happy dance
                    const lenny = document.querySelector('.lenny-image');
                    lenny.style.animation = 'none';
                    setTimeout(() => {
                        lenny.style.animation = 'float 0.5s ease-in-out infinite';
                    }, 10);
                }
            }
        });

        candlesContainer.appendChild(candle);
    }
}

// Kindness Quest functionality
async function initializeKindnessQuest() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-canvas');
    const saveButton = document.getElementById('save-heart');
    const heartsGallery = document.createElement('div');
    heartsGallery.className = 'hearts-gallery';
    
    // Add gallery to the container
    document.querySelector('.kindness-container').appendChild(heartsGallery);
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set up drawing styles
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Load saved hearts from API
    async function loadHearts() {
        try {
            const response = await fetch(`${API_URL}/hearts`);
            const hearts = await response.json();
            hearts.forEach(heart => {
                addHeartToGallery(heart.image);
            });
        } catch (error) {
            console.error('Error loading hearts:', error);
        }
    }
    
    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function addHeartToGallery(imageData) {
        const heartContainer = document.createElement('div');
        heartContainer.className = 'heart-container';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Heart drawing';
        
        heartContainer.appendChild(img);
        heartsGallery.appendChild(heartContainer);
    }
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    saveButton.addEventListener('click', async () => {
        const dataURL = canvas.toDataURL('image/png');
        
        try {
            // Save to API
            const response = await fetch(`${API_URL}/hearts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: dataURL }),
            });
            
            if (response.ok) {
                // Add to gallery
                addHeartToGallery(dataURL);
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                console.error('Error saving heart');
            }
        } catch (error) {
            console.error('Error saving heart:', error);
        }
    });
    
    // Load initial hearts
    loadHearts();
}

// Mini-Game functionality
function initializeMiniGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set proper canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const lenny = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: 5
    };
    
    const cross = {
        width: 20,
        height: 30
    };
    
    const obstacles = [];
    let score = 0;
    let gameOver = false;
    
    // Create obstacles
    function createObstacle() {
        const width = Math.random() * 50 + 20;
        const height = Math.random() * 30 + 10;
        const x = Math.random() * (canvas.width - width);
        
        obstacles.push({
            x: x,
            y: -height,
            width: width,
            height: height
        });
    }
    
    // Draw functions
    function drawLenny() {
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(lenny.x, lenny.y, lenny.width, lenny.height);
        
        // Draw cross
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(lenny.x + 5, lenny.y - cross.height, cross.width, cross.height);
        ctx.fillRect(lenny.x - 5, lenny.y - cross.height + 10, lenny.width + 10, 10);
    }
    
    function drawObstacles() {
        ctx.fillStyle = '#666';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    function drawScore() {
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }
    
    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    // Update game state
    function update() {
        if (gameOver) {
            drawGameOver();
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Move obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.y += 2;
            
            // Check collision
            if (lenny.x < obstacle.x + obstacle.width &&
                lenny.x + lenny.width > obstacle.x &&
                lenny.y < obstacle.y + obstacle.height &&
                lenny.y + lenny.height > obstacle.y) {
                gameOver = true;
            }
            
            // Remove obstacles that are off screen
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
                score++;
            }
        });
        
        // Create new obstacles
        if (Math.random() < 0.02) {
            createObstacle();
        }
        
        drawLenny();
        drawObstacles();
        drawScore();
        
        requestAnimationFrame(update);
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                lenny.x = Math.max(0, lenny.x - lenny.speed);
                break;
            case 'ArrowRight':
                lenny.x = Math.min(canvas.width - lenny.width, lenny.x + lenny.speed);
                break;
        }
    });
    
    // Start the game
    update();
}

// Gratitude Garden functionality
async function initializeGratitudeGarden() {
    const gratitudeInput = document.getElementById('gratitude-input');
    const plantFlowerBtn = document.getElementById('plant-flower');
    const flowersContainer = document.querySelector('.flowers-container');
    
    // Load existing flowers from API
    async function loadGratitudeEntries() {
        try {
            const response = await fetch(`${API_URL}/gratitude`);
            const entries = await response.json();
            entries.forEach(entry => {
                createFlower(entry.text);
            });
        } catch (error) {
            console.error('Error loading gratitude entries:', error);
        }
    }
    
    function createFlower(text) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.innerHTML = `
            <div class="flower-petal"></div>
            <div class="flower-center"></div>
            <p>${text}</p>
        `;
        flowersContainer.appendChild(flower);
    }
    
    plantFlowerBtn.addEventListener('click', async () => {
        const gratitude = gratitudeInput.value.trim();
        if (gratitude) {
            try {
                const response = await fetch(`${API_URL}/gratitude`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: gratitude }),
                });
                
                if (response.ok) {
                    createFlower(gratitude);
                    gratitudeInput.value = '';
                } else {
                    console.error('Error saving gratitude entry');
                }
            } catch (error) {
                console.error('Error saving gratitude entry:', error);
            }
        }
    });
    
    // Load initial gratitude entries
    loadGratitudeEntries();
}

// Easter Egg: Click Lenny 10 times
function setupLennyEasterEgg() {
    const lenny = document.querySelector('.lenny-image');
    let clickCount = 0;

    lenny.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 10) {
            const lennySpeech = document.querySelector('.lenny-speech');
            lennySpeech.textContent = "Okay, I ate the church flowers once. Don't tell Pastor Dave.";
            clickCount = 0;
        }
    });
} 