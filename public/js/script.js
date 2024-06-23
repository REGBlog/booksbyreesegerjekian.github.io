let spiralMaterial; // Declare spiralMaterial here

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('spiral-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Create the spiral geometry
const spiralGeometry = new THREE.BufferGeometry();
spiralMaterial = new THREE.LineBasicMaterial({ color: getComputedStyle(document.documentElement).getPropertyValue('--spiral-color').trim() });
const vertexCount = 1000;

const vertices = new Float32Array(vertexCount * 3);
spiralGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const spiral = new THREE.Line(spiralGeometry, spiralMaterial);
scene.add(spiral);

// Set the camera position
camera.position.z = -5;

let theta = 0;
let animationRunning = false;

// Animation loop
function animate() {
    if (animationRunning) {
        requestAnimationFrame(animate);

        // Update vertices to create the time warp effect
        for (let i = 0; i < vertexCount; i++) {
            const radius = i * 0.05;
            const angle = theta + i * 0.1;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const z = (i - theta * 10) * 0.1 - 5; // Move the spiral along the z-axis to create looping effect
            vertices[i * 3] = x;
            vertices[i * 3 + 1] = y;
            vertices[i * 3 + 2] = z;
        }
        spiralGeometry.attributes.position.needsUpdate = true;

        // Increment theta to animate the spiral movement
        theta += 0.01;

        renderer.render(scene, camera);
    }
}

function startAnimation() {
    animationRunning = true;
    animate();
}

// Show the start button after a delay
const startButton = document.getElementById('start-button');
const quoteContainer = document.getElementById('quote-container');

setTimeout(() => {
    startButton.classList.add('show');
}, 2000);

startButton.addEventListener('click', () => {
    startButton.style.display = 'none'; // Hide the button after clicking
    quoteContainer.classList.add('hidden'); // Hide the quote container
    startAnimation();
    document.body.classList.add('animate-background'); // Add class to start background animation
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth quote floating effect
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let mouseInside = true;

document.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    mouseInside = true;
});

document.addEventListener('mouseleave', () => {
    mouseInside = false;
});

function updateQuotePosition() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (targetX - centerX) * 0.02; // Reduced movement amount
    const moveY = (targetY - centerY) * 0.02; // Reduced movement amount

    quoteContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Update camera position
    camera.position.x = moveX * 0.1; // Adjust the multiplier to control the movement sensitivity
    camera.position.y = -moveY * 0.1; // Adjust the multiplier to control the movement sensitivity

    if (!mouseInside) {
        targetX += (centerX - targetX) * 0.05;
        targetY += (centerY - targetY) * 0.05;
    }

    requestAnimationFrame(updateQuotePosition);
}

updateQuotePosition();