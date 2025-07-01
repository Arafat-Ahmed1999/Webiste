
        // --- Three.js Particle Background ---
        let scene, camera, renderer, particles;
        const particleCount = 1000;
        const particleSpeed = 0.0005;

        function initThreeJS() {
            const container = document.getElementById('three-bg');

            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Particles
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const color1 = new THREE.Color(0x007bff); // Primary color
            const color2 = new THREE.Color(0x6c5ce7); // Accent color

            for (let i = 0; i < particleCount; i++) {
                // Position particles randomly in a cube
                positions[i * 3] = (Math.random() * 2 - 1) * 10; // x
                positions[i * 3 + 1] = (Math.random() * 2 - 1) * 10; // y
                positions[i * 3 + 2] = (Math.random() * 2 - 1) * 10; // z

                // Assign colors based on interpolation
                const mixColor = new THREE.Color();
                mixColor.lerpColors(color1, color2, Math.random());
                colors[i * 3] = mixColor.r;
                colors[i * 3 + 1] = mixColor.g;
                colors[i * 3 + 2] = mixColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending // For a glowing effect
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Handle window resize
            window.addEventListener('resize', onWindowResize, false);

            // Start animation loop
            animateThreeJS();
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animateThreeJS() {
            requestAnimationFrame(animateThreeJS);

            // Rotate particles slowly
            particles.rotation.x += particleSpeed * 0.5;
            particles.rotation.y += particleSpeed;

            renderer.render(scene, camera);
        }

        // --- General JavaScript Functionality ---

        // Smooth scrolling navigation & active link highlighting
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('nav a');

        function showSection(sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Intersection Observer for section active state and animations
        const sectionObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4 // Adjust threshold as needed
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                    entry.target.classList.add('active'); // Add 'active' class for section fade-in
                } else {
                    entry.target.classList.remove('active'); // Remove 'active' class when out of view
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Scroll progress indicator
        function updateScrollProgress() {
            const scrolled = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrolled / docHeight) * 100;
            document.getElementById('scrollProgress').style.width = progress + '%';
        }

        // Modal functionality
        const modal = document.getElementById('projectModal');
        const closeBtn = modal.querySelector('.close-button');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalTechStack = document.getElementById('modalTechStack');
        const modalKeyFeaturesSection = document.getElementById('modalKeyFeatures');
        const modalKeyFeaturesList = modalKeyFeaturesSection.querySelector('ul');
        const modalChallengesSolutionsSection = document.getElementById('modalChallengesSolutions');
        const modalChallengesSolutionsList = modalChallengesSolutionsSection.querySelector('ul');


        function openModal(title, description, techStackHTML, imageUrl, keyFeatures, challengesSolutions) {
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalTechStack.innerHTML = techStackHTML;

            // Handle image
            if (imageUrl) {
                modalImage.src = imageUrl;
                modalImage.style.display = 'block';
            } else {
                modalImage.src = '';
                modalImage.style.display = 'none'; // Hide if no image
            }

            // Handle Key Features
            modalKeyFeaturesList.innerHTML = ''; // Clear previous items
            if (keyFeatures && keyFeatures.length > 0) {
                modalKeyFeaturesSection.style.display = 'block';
                keyFeatures.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
                    modalKeyFeaturesList.appendChild(li);
                });
            } else {
                modalKeyFeaturesSection.style.display = 'none';
            }

            // Handle Challenges & Solutions
            modalChallengesSolutionsList.innerHTML = ''; // Clear previous items
            if (challengesSolutions && challengesSolutions.length > 0) {
                modalChallengesSolutionsSection.style.display = 'block';
                challengesSolutions.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-lightbulb"></i> ${item}`;
                    modalChallengesSolutionsList.appendChild(li);
                });
            } else {
                modalChallengesSolutionsSection.style.display = 'none';
            }


            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Attach click listeners to portfolio, projects, research, and journal cards
        document.querySelectorAll('#portfolio .card, #projects .card, #research .card, #journal .journal-entry').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.dataset.title;
                const description = card.dataset.description;
                const techStack = card.dataset.techStack || '';
                const imageUrl = card.dataset.imageUrl || '';
                const keyFeatures = card.dataset.keyFeatures ? JSON.parse(card.dataset.keyFeatures) : [];
                const challengesSolutions = card.dataset.challengesSolutions ? JSON.parse(card.dataset.challengesSolutions) : [];

                openModal(title, description, techStack, imageUrl, keyFeatures, challengesSolutions);
            });
        });

        // Form submission
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            formMessage.style.display = 'block';
            
            this.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });

        // Animate cards and journal entries on scroll
        const animatedElements = document.querySelectorAll('.card, .journal-entry, .stat-card');
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // For stat cards, trigger number animation
                    if (entry.target.classList.contains('stat-card')) {
                        const statNumberElement = entry.target.querySelector('.stat-number');
                        if (statNumberElement && !statNumberElement.dataset.animated) {
                            countUp(statNumberElement, parseInt(statNumberElement.dataset.target), 2000);
                            statNumberElement.dataset.animated = 'true'; // Mark as animated
                        }
                    }
                    animateObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            animateObserver.observe(el);
        });

        // Number counting animation for stats
        function countUp(element, target, duration) {
            let start = 0;
            const increment = target / (duration / 16); // ~60fps
            const step = () => {
                start += increment;
                if (start < target) {
                    element.textContent = Math.ceil(start) + (target === 5 ? '' : '+'); // Add '+' for 50+, 100+
                    requestAnimationFrame(step);
                } else {
                    element.textContent = target + (target === 5 ? '' : '+');
                }
            };
            requestAnimationFrame(step);
        }

        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) { // Show after scrolling 400px
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Gear rotation on scroll
        const gear1 = document.getElementById('gear1');
        const gear2 = document.getElementById('gear2');
        let lastScrollY = 0;
        let rotation1 = 0;
        let rotation2 = 0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            const scrollDelta = currentScrollY - lastScrollY;

            // Adjust rotation speed as needed
            rotation1 += scrollDelta * 0.2; // Gear 1 rotates clockwise
            rotation2 -= scrollDelta * 0.3; // Gear 2 rotates counter-clockwise and faster for interlocking effect

            gear1.style.transform = `rotate(${rotation1}deg)`;
            gear2.style.transform = `translate(-50%, -50%) rotate(${rotation2}deg)`; // Maintain its offset

            lastScrollY = currentScrollY;
        });


        // Initialize all on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            initThreeJS(); // Initialize Three.js background
            window.addEventListener('scroll', updateScrollProgress);
            
            // Set initial active state for home section
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.classList.add('active');
            }
        });
