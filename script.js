// 粒子背景初始化
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#0077ff'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#0077ff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// 深色/浅色模式切换
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

let isDarkMode = true;

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    } else {
        body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    }
});

// 功能模块内容切换
const modules = document.querySelectorAll('.module');
const contentSections = document.querySelectorAll('.content-section');

modules.forEach(module => {
    module.addEventListener('click', () => {
        const target = module.getAttribute('data-target');
        
        // 隐藏所有内容区域
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示目标内容区域
        document.getElementById(target).classList.add('active');
    });
});

// 接星星小游戏
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 400;

// 游戏对象
const game = {
    cloud: {
        x: canvas.width / 2 - 50,
        y: canvas.height - 100,
        width: 100,
        height: 50,
        speed: 5
    },
    stars: [],
    score: 0,
    gameOver: false,
    spawnRate: 60,
    frameCount: 0
};

// 生成星星
function spawnStar() {
    const star = {
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 80%)`
    };
    game.stars.push(star);
}

// 绘制云朵
function drawCloud() {
    ctx.beginPath();
    ctx.arc(game.cloud.x + 25, game.cloud.y + 25, 25, 0, Math.PI * 2);
    ctx.arc(game.cloud.x + 75, game.cloud.y + 25, 25, 0, Math.PI * 2);
    ctx.arc(game.cloud.x + 50, game.cloud.y + 15, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 绘制星星
function drawStars() {
    game.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // 星星闪烁效果
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

// 更新游戏状态
function updateGame() {
    // 移动云朵
    if (keys['ArrowLeft'] && game.cloud.x > 0) {
        game.cloud.x -= game.cloud.speed;
    }
    if (keys['ArrowRight'] && game.cloud.x < canvas.width - game.cloud.width) {
        game.cloud.x += game.cloud.speed;
    }
    
    // 生成星星
    game.frameCount++;
    if (game.frameCount % game.spawnRate === 0) {
        spawnStar();
    }
    
    // 更新星星位置
    game.stars.forEach((star, index) => {
        star.y += star.speed;
        
        // 检查星星是否被云朵接住
        if (star.y + star.size > game.cloud.y && 
            star.y - star.size < game.cloud.y + game.cloud.height && 
            star.x > game.cloud.x && 
            star.x < game.cloud.x + game.cloud.width) {
            game.score++;
            game.stars.splice(index, 1);
            
            // 播放闪烁动画
            createFlash(star.x, star.y);
        }
        
        // 检查星星是否掉落
        if (star.y > canvas.height) {
            game.stars.splice(index, 1);
        }
    });
}

// 闪烁动画
function createFlash(x, y) {
    const flash = {
        x: x,
        y: y,
        size: 0,
        maxSize: 50,
        alpha: 1
    };
    
    function animateFlash() {
        flash.size += 2;
        flash.alpha -= 0.05;
        
        if (flash.size < flash.maxSize) {
            ctx.globalAlpha = flash.alpha;
            ctx.beginPath();
            ctx.arc(flash.x, flash.y, flash.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateFlash);
        }
    }
    
    animateFlash();
}

// 绘制得分
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`得分: ${game.score}`, 20, 40);
}

// 键盘控制
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 游戏主循环
function gameLoop() {
    // 清空画布
    if (isDarkMode) {
        ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新游戏状态
    updateGame();
    
    // 绘制游戏元素
    drawCloud();
    drawStars();
    drawScore();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 启动游戏
gameLoop();

// 鼠标控制云朵
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    game.cloud.x = mouseX - game.cloud.width / 2;
    
    // 限制云朵在画布内
    if (game.cloud.x < 0) {
        game.cloud.x = 0;
    }
    if (game.cloud.x > canvas.width - game.cloud.width) {
        game.cloud.x = canvas.width - game.cloud.width;
    }
});

// 触摸控制云朵
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    game.cloud.x = touchX - game.cloud.width / 2;
    
    // 限制云朵在画布内
    if (game.cloud.x < 0) {
        game.cloud.x = 0;
    }
    if (game.cloud.x > canvas.width - game.cloud.width) {
        game.cloud.x = canvas.width - game.cloud.width;
    }
});