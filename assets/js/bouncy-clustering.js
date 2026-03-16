let dataset = {};
const n_samples = 2000;
const n_particles = 500;

let particles = [];

let cooldown = 100;

let wallLines = []
let wallThreshold = 300;

let startTime;
let duration = 180000;
let isFrozen = false;

// --- UI ---
let selData, inpParticles, inpWalls, btnRun;
let currentDatasetType = 'Blobs';

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');

    let runBtn = select('#runBtn');
    runBtn.mousePressed(resetSimulation);
    
    resetSimulation();
}

function resetSimulation() {
    let n_samples = 2000;
    let n_p = int(select('#particlesInput').value());
    wallThreshold = int(select('#wallsInput').value());
    n_samples = int(select('#samplesInput').value());
    let type = select('#datasetSelect').value();

    // Reset State
    wallLines = [];
    particles = [];
    isFrozen = false;
    startTime = millis();

    // Generate selected data
    if (type === 'Blobs') dataset = makeBlobs(n_samples, 0.05);
    else if (type === 'Moons') dataset = makeMoons(n_samples, 0.05);
    else if (type === 'Circles') dataset = makeCircles(n_samples, 0.5, 0.05);
    else if (type === 'Aniso') dataset = makeAniso(n_samples, 0.05);
    else if (type === 'Varied') dataset = makeVaried(n_samples);
    else if (type === 'No Structure') dataset = makeNoStructure(n_samples);

    normalizeDataset(dataset);

    // Pre-calculate screen coords
    for (let p of dataset) {
        p.screenX = map(p.x, -1.1, 1.1, 50, width - 50);
        p.screenY = map(p.y, -1.1, 1.1, height - 50, 50);
        p.clusterID = null;
    }

    particles = makeParticles(n_p);
}

function draw() {
    if (millis() - startTime > duration) {
        isFrozen = true;
    }

    background(255);

    dataset.forEach(p => {
        p.screenX = map(p.x, -1.1, 1.1, 50, width - 50);
        p.screenY = map(p.y, -1.1, 1.1, height - 50, 50);

        if (p.clusterID) {
            // If painted, show cluster color
            colorMode(HSB);
            fill(p.clusterID * 137 % 360, 80, 90);
            circle(p.screenX, p.screenY, 8); 
            colorMode(RGB);
        } else {
            fill(330, 0, 10);
            noStroke();
            circle(p.screenX, p.screenY, 4);
        }
    });

    if(!isFrozen) {
        wallLines.forEach(l => {
            stroke(100);
            strokeWeight(1.5);
            line(l.x1, l.y1, l.x2, l.y2);
        });

        particles.forEach(particle => {
            // 1. Move
            particle.x += particle.vx;
            particle.y += particle.vy;


            // 3. Logic: Find the SINGLE closest point within reach
            let closestPoint = null;
            let minD = particle.radius + 6; // Hitbox slightly larger than particle

            dataset.forEach(p => {
                let d = dist(particle.x, particle.y, p.screenX, p.screenY);
                if (d < minD) {
                    minD = d;
                    closestPoint = p;
                }
            });

            // --- SCOUTER LOGIC (Type 1) ---
            if (particle.type === 1 && wallLines.length < wallThreshold) {
                if (closestPoint) {
                    reflectParticleFromNode(particle, closestPoint);
                    
                    let currentTime = millis();
                    let lastInHistory = particle.history[particle.history.length - 1];
                    
                    // Off-cooldown wall building
                    if (closestPoint !== lastInHistory && currentTime - particle.lastHitTime > cooldown) {
                        particle.lastHitTime = currentTime;
                        particle.history.push(closestPoint);

                        if (particle.history.length > 3) particle.history.shift();

                        if (particle.history.length === 3) {
                            let pSecondPrev = particle.history[0];
                            let pPrev = particle.history[1];
                            let pCurrent = particle.history[2];

                            if (dist(pCurrent.screenX, pCurrent.screenY, pPrev.screenX, pPrev.screenY) < 30) {
                                if (!isShortcutThroughData(pPrev, pCurrent)) {
                                    addWallLine(particle, pPrev, pCurrent);
                                }
                            }
                            if (dist(pCurrent.screenX, pCurrent.screenY, pSecondPrev.screenX, pSecondPrev.screenY) < 60) {
                                if (!isShortcutThroughData(pSecondPrev, pCurrent)) {
                                    addWallLine(particle, pSecondPrev, pCurrent);
                                }
                            }
                        }
                    }
                }
            }

            // --- PAINTER LOGIC (Type 0) ---
            if (particle.type === 0) {
                checkLineBounces(particle);

                // Only start logic if infrastructure is ready
                if (wallLines.length >= wallThreshold) {
                    particle.isActivated = true;

                    // Painting
                    if (particle.isActivated && closestPoint) {

                        // Paint uncolored points immediately
                        if (!closestPoint.clusterID) {
                            closestPoint.clusterID = particle.clusterID;
                        }
                        
                        // If particle has a bigger cluster Id, then point gets painted with that
                        // If not, particle adpot the color of the point
                        if (particle.clusterID > closestPoint.clusterID) {
                            closestPoint.clusterID = particle.clusterID;
                        } else if (closestPoint.clusterID > particle.clusterID) {
                            particle.clusterID = closestPoint.clusterID;
                        }
                    }

                }
            }

            // 5. Screen Bounds
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            // 6. Draw Particle
            if(particle.type === 1) {
                if(wallLines.length < wallThreshold) {
                    fill(0);
                    circle(particle.x, particle.y, particle.radius * 2);
                }
            } else {
                fill(0);
                circle(particle.x, particle.y, particle.radius * 2);
            }
        });
    }
}

function makeParticles(n) {
    let particles = [];
    for (let i = 0; i < n; i++) {
        let spawn = getSafeSpawn();
        if(i%3 !== 0) {
            type = 0;
            radius = 4;
            vel_x = random(1, 2);
            vel_y = random(1, 2);
        } else {
            type = 1;
            radius = random(10, 12);
            vel_x = random(1, 7);
            vel_y = random(1, 7);
        }
        particles.push({
            x: spawn.x,
            y: spawn.y,
            vx: vel_x,
            vy: vel_y,
            radius: radius,
            history: [],
            type: type,
            lastHitTime: 0,
            clusterID: i + 1,
            isActivated: false
        });
    }
    return particles;
}

function addWallLine(particle, p, pPrev) {
    let dx = p.screenX - pPrev.screenX;
    let dy = p.screenY - pPrev.screenY;

    let nx = -dy;
    let ny = dx;
    let mag = sqrt(nx * nx + ny * ny);
    if (mag === 0) return;
    nx /= mag; ny /= mag;

    // Check direction towards particle
    let dot = nx * (particle.x - p.screenX) + ny * (particle.y - p.screenY);
    if (dot < 0) { nx = -nx; ny = -ny; }

    // Offset
    // Instead of drawing exactly at p.screenX, 
    // shift the line 10 pixels AWAY from the center of the ring
    let offset = 10; 
    
    wallLines.push({
        x1: pPrev.screenX + nx * offset,
        y1: pPrev.screenY + ny * offset,
        x2: p.screenX + nx * offset,
        y2: p.screenY + ny * offset,
        nx: nx, 
        ny: ny
    });
}

function checkLineBounces(part) {
    wallLines.forEach(w => {
        let closest = closestPointOnSegment(part.x, part.y, w.x1, w.y1, w.x2, w.y2);
        let d = dist(part.x, part.y, closest.x, closest.y);
        let safeDist = part.radius + 2;

        if (d < safeDist) {
            let dx = w.x2 - w.x1;
            let dy = w.y2 - w.y1;
            let nx = -dy;
            let ny = dx;
            let mag = sqrt(nx * nx + ny * ny);
            nx /= mag; ny /= mag;

            let dotNorm = (part.x - closest.x) * nx + (part.y - closest.y) * ny;
            if (dotNorm < 0) { nx = -nx; ny = -ny; }

            let dotVel = part.vx * nx + part.vy * ny;
            if (dotVel < 0) {
                part.vx = part.vx - 2 * dotVel * nx;
                part.vy = part.vy - 2 * dotVel * ny;
            }

            let overlap = safeDist - d;
            part.x += nx * (overlap + 0.5); 
            part.y += ny * (overlap + 0.5);
        }
    });
}

function reflectParticle(part, nx, ny) {
    // 1. Calculate the Dot Product of velocity and the wall normal
    let dot = part.vx * nx + part.vy * ny;

    // 2. Only reflect if the particle is actually moving TOWARDS the wall face
    if (dot < 0) {
        // 3. Subtract the normal component twice to flip the direction
        part.vx = part.vx - 2 * dot * nx;
        part.vy = part.vy - 2 * dot * ny;
    }
}

function closestPointOnSegment(px, py, x1, y1, x2, y2) {
    // 1. Calculate the length of the line segment squared
    let dx = x2 - x1;
    let dy = y2 - y1;
    let l2 = dx * dx + dy * dy;

    // If the line is just a single point, return that point
    if (l2 === 0) return { x: x1, y: y1 };

    // 2. Find the "Projection Percentage" (t)
    // This tells us how far along the line the particle is (0.0 to 1.0)
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;

    // 3. Clip t so the point doesn't go past the endpoints
    t = Math.max(0, Math.min(1, t));

    // 4. Return the actual X and Y coordinates
    return {
        x: x1 + t * dx,
        y: y1 + t * dy
    };
}

function reflectParticleFromNode(part, p) {
    // Calculate the vector from the point to the particle
    if(part.type === 1) {
        let dx = part.x - p.screenX;
        let dy = part.y - p.screenY;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // This is the "Normal" of the circle
            let nx = dx / distance;
            let ny = dy / distance;

            reflectParticle(part, nx, ny);

            // Anti-stuck: Push it to the edge of the hitbox
            let overlap = (part.radius + 4) - distance; 
            if (overlap > 0) {
                part.x += nx * overlap;
                part.y += ny * overlap;
            }
        }
    }
}

function makeCircles(n, factor, noise) {
    let pts = [];
    for (let i = 0; i < n; i++) {
        let r = (i%2 === 0 ? 1 : factor);
        let phi = random(TWO_PI);
        pts.push({
            x: r * cos(phi) + randomGaussian(0, noise),
            y: r * sin(phi) + randomGaussian(0, noise)
        });
    }
    return pts;
}

function makeMoons(n, noise) {
    let pts = [];
    for (let i = 0; i < n; i++) {
        let n_half = n / 2;
        if (i < n_half) {
            let theta = map(i, 0, n_half, 0, PI);
            let x = cos(theta);
            let y = sin(theta);
            pts.push({ x: x + randomGaussian(0, noise), y: y + randomGaussian(0, noise), hits: 0 });
        } else {
            let theta = map(i, n_half, n, 0, PI);
            let x = 1 - cos(theta);
            let y = 0.5 - sin(theta);
            pts.push({ x: x + randomGaussian(0, noise), y: y + randomGaussian(0, noise), hits: 0 });
        }
    }
    return pts;
}

function makeBlobs(n, noise) {
    let pts = [];
    let centers = [{x: -0.5, y: -0.5}, {x: 0.5, y: 0.5}, {x: -0.5, y: 0.5}];
    for (let i = 0; i < n; i++) {
        let c = centers[i % 3];
        pts.push({
            x: c.x + randomGaussian(0, noise),
            y: c.y + randomGaussian(0, noise),
        });
    }
    return pts;
}

function makeAniso(n, noise) {
    let pts = [];
    let centers = [
        {x: -.2, y: 1.2}, 
        {x: 0, y: 0}, 
        {x: 1.2, y: -.2}
    ];

    for (let i = 0; i < n; i++) {
        let c = centers[i % 3];
    
        // 1. Core distribution (tight on Y, spread on X)
        let x = randomGaussian(0, 0.5);
        let y = randomGaussian(0, 0.1); 
    
        // 2. Skew Transformation
        let tx = (x * 0.6) + (y * -0.6);
        let ty = (x * -0.4) + (y * 0.8);
    
        // 3. Adding noise to the final transformed position 
        let finalX = tx + c.x + randomGaussian(0, noise);
        let finalY = ty + c.y + randomGaussian(0, noise);
    
        pts.push({ 
            x: finalX, 
            y: finalY
        });
    }
    return pts;
}

function makeVaried(n) {
    let pts = [];

    // Each center has a different 'spread' (standard deviation)
    let configs = [
        {cx: -1.0, cy: -1.0, std: 0.1}, // Very tight
        {cx: 1.0,  cy: 1.0,  std: 0.5}, // Very fluffy
        {cx: 0.0,  cy: 0.0,  std: 0.25} // Medium
    ];

    for (let i = 0; i < n; i++) {
        let conf = configs[i % 3];
        pts.push({
            x: conf.cx + randomGaussian(0, conf.std),
            y: conf.cy + randomGaussian(0, conf.std)
        });
    }
    return pts;
}

function makeNoStructure(n) {
    let pts = [];
    for (let i = 0; i < n; i++) {
        // Generates points evenly across the -1.2 to 1.2 square
        pts.push({
            x: random(-1.2, 1.2),
            y: random(-1.2, 1.2)
        });
    }
    return pts;
}

function normalizeDataset(pts) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    pts.forEach(p => {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    });

    // Center and scale to -1.0 to 1.0
    pts.forEach(p => {
        p.x = map(p.x, minX, maxX, -1, 1);
        p.y = map(p.y, minY, maxY, -1, 1);
    });
}

function isShortcutThroughData(p1, p2) {
    let midX = (p1.screenX + p2.screenX) / 2;
    let midY = (p1.screenY + p2.screenY) / 2;
    
    let densityCount = 0;
    let checkRadius = 10;

    for (let p of dataset) {
        let d = dist(midX, midY, p.screenX, p.screenY);
        if (d < checkRadius) {
            densityCount++;
        }
        // If we find more than 5 points in the middle of the wall,
        // it means we are drawing a line THROUGH the cluster, not around it.
        if (densityCount > 5) return true; 
    }
    return false;
}

function getSafeSpawn() {
    let x, y;
    let maxAttempts = 500; 
    let currentAttempt = 0;
  
    let checkRadius = 15; 

    while (currentAttempt < maxAttempts) {
        x = random(width);
        y = random(height);
        let overlapFound = false;
        
        for (let p of dataset) {
        if (dist(x, y, p.screenX, p.screenY) < checkRadius) {
            overlapFound = true;
            break;
        }
        }
        
        // If we checked every point and none overlapped, this spot is safe
        if (!overlapFound) {
        return {x, y};
        }
        
        currentAttempt++;
    }

    return {x: 10, y: 10}; 
}