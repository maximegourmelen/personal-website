// Conway's Game of Life animation with fade-out transition to main page
const canvas = document.getElementById('game-of-life-canvas');
if (canvas) {
    let cellSize = 10;
    let rows, cols, grid;
    const ctx = canvas.getContext('2d');
    let fading = false;
    let fadeStart = null;
    let fadeDuration = 1200;
    let fadeAlpha = 1;
    let transitionTimeout;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        rows = Math.floor(canvas.height / cellSize);
        cols = Math.floor(canvas.width / cellSize);
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        // Single random pattern in the center
        const patternSize = 7;
        const startY = Math.floor(rows / 2 - patternSize / 2);
        const startX = Math.floor(cols / 2 - patternSize / 2);
        for (let y = 0; y < patternSize; y++) {
            for (let x = 0; x < patternSize; x++) {
                grid[startY + y][startX + x] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw(alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#222';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x]) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        ctx.restore();
    }

    function nextGen() {
        const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
                            neighbors += grid[ny][nx];
                        }
                    }
                }
                if (grid[y][x] === 1) {
                    newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
                } else {
                    newGrid[y][x] = neighbors === 3 ? 1 : 0;
                }
            }
        }
        grid = newGrid;
    }

    function loop() {
        if (!fading) {
            draw(1);
            nextGen();
            setTimeout(loop, 60);
        } else {
            // Fade out
            draw(fadeAlpha);
        }
    }

    function startFadeTransition() {
        fading = true;
        fadeStart = null;
        requestAnimationFrame(fadeFrame);
    }

    function fadeFrame(ts) {
        if (!fadeStart) fadeStart = ts;
        const elapsed = ts - fadeStart;
        const t = Math.min(1, elapsed / fadeDuration);
        fadeAlpha = 1 - t;
        draw(fadeAlpha);
        if (t < 1) {
            requestAnimationFrame(fadeFrame);
        } else {
            // Redirect to introduction page
            window.location.href = 'introduction.html';
        }
    }

    // Start the fade after 2.5 seconds
    transitionTimeout = setTimeout(startFadeTransition, 2500);
    loop();
}

// Portfolio logic (unchanged)
if (document.getElementById('portfolio-content')) {
    function populateProjects() {
        const projects = [
            { name: "Project One", description: "A cool project about X." },
            { name: "Project Two", description: "Another project about Y." },
            { name: "Project Three", description: "Yet another project about Z." }
        ];
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';
        projects.forEach(project => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${project.name}</strong><br>${project.description}`;
            projectList.appendChild(li);
        });
    }
    populateProjects();
} 