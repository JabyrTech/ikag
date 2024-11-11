document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const postTaskBtn = document.getElementById('post-task-btn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const taskForm = document.getElementById('task-form');
    const taskContainer = document.querySelector('.task-cards-container');
    const prevTaskBtn = document.getElementById('prev-task');
    const nextTaskBtn = document.getElementById('next-task');
    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    const searchInput = document.getElementById('task-search');
    const searchBtn = document.getElementById('search-btn');
    const taskTags = document.querySelectorAll('.task-tag');
    const undoBtn = document.createElement('button');
    undoBtn.classList.add('undo-btn');
    undoBtn.innerHTML = '<i class="fas fa-undo"></i>';
    document.body.appendChild(undoBtn);

    let allTasks = [];
    let filteredTasks = [];
    let swipedTasks = [];
    let currentPage = 1;
    const tasksPerPage = 10;

    // Open modal
    postTaskBtn.onclick = () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Handle task submission
    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const budget = document.getElementById('task-budget').value;
        const location = document.getElementById('task-location').value;
        addTask(title, description, budget, location, 'other'); // Default category
        taskForm.reset();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Function to add a task
    function addTask(title, description, budget, location, category) {
        const task = {
            id: Date.now(),
            title,
            description,
            budget: parseInt(budget),
            location,
            category,
            user: {
                name: 'John Doe',
                avatar: 'https://jabyrtech.github.io/new/assets/static/jabyr2.jpg'
            }
        };
        allTasks.unshift(task);
        filteredTasks = allTasks;
        renderTasks();
    }

    // Render tasks
    function renderTasks() {
        taskContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
        const tasksToRender = filteredTasks.slice(startIndex, endIndex);

        tasksToRender.forEach((task, index) => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.style.zIndex = 10 - index;
            taskCard.innerHTML = `
                <div class="user-info">
                    <img src="${task.user.avatar}" alt="${task.user.name}" class="user-avatar">
                    <span class="user-name">${task.user.name}</span>
                </div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task-budget">Budget: ₦${task.budget.toLocaleString()}</p>
                <p><strong>Location:</strong> ${task.location}</p>
                <button class="i-am-a-guy-btn">I am a guy</button>
            `;
            taskContainer.appendChild(taskCard);

            // Add swipe functionality
            let startX, startY, distX, distY;
            let threshold = 100; // minimum distance traveled to be considered swipe

            taskCard.addEventListener('touchstart', function(e) {
                var touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            }, false);

            taskCard.addEventListener('touchmove', function(e) {
                if (!startX || !startY) {
                    return;
                }
                var touch = e.touches[0];
                distX = touch.clientX - startX;
                distY = touch.clientY - startY;
            }, false);

            taskCard.addEventListener('touchend', function(e) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= 100) {
                    if (distX > 0) {
                        taskCard.classList.add('swipe-right');
                        setTimeout(() => {
                            swipedTasks.push(filteredTasks.splice(startIndex + index, 1)[0]);
                            renderTasks();
                        }, 300);
                    } else {
                        taskCard.classList.add('swipe-left');
                        setTimeout(() => {
                            filteredTasks.splice(startIndex + index, 1);
                            renderTasks();
                        }, 300);
                    }
                    undoBtn.style.display = 'block';
                }
                startX = null;
                startY = null;
                distX = null;
                distY = null;
            }, false);
        });

        updateNavigationButtons();
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevTaskBtn.style.display = currentPage > 1 ? 'block' : 'none';
        nextTaskBtn.style.display = currentPage < Math.ceil(filteredTasks.length / tasksPerPage) ? 'block' : 'none';
    }

    // Navigation buttons
    prevTaskBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTasks();
        }
    }

    nextTaskBtn.onclick = () => {
        if (currentPage < Math.ceil(filteredTasks.length / tasksPerPage)) {
            currentPage++;
            renderTasks();
        }
    }

    // View all tasks
    viewAllTasksBtn.onclick = () => {
        filteredTasks = allTasks;
        currentPage = 1;
        renderTasks();
        taskTags.forEach(t => t.classList.remove('active'));
        document.querySelector('.task-tag[data-category="all"]').classList.add('active');
    }

    const allTasksModal = document.getElementById('all-tasks-modal');
    const allTasksContainer = document.querySelector('.all-tasks-container');
    const modalSearchInput = document.getElementById('modal-task-search');
    const modalSearchBtn = document.getElementById('modal-search-btn');
    const modalTaskTags = document.querySelectorAll('.modal-task-tag');

    // View all tasks
    viewAllTasksBtn.onclick = () => {
        allTasksModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        renderAllTasks(allTasks);
    }

    // Close all tasks modal
    allTasksModal.querySelector('.close').onclick = () => {
        allTasksModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Render all tasks in the modal
    function renderAllTasks(tasks) {
        allTasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'modal-task-card';
            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task-budget">Budget: ₦${task.budget.toLocaleString()}</p>
                <p><strong>Location:</strong> ${task.location}</p>
                <button class="i-am-a-guy-btn">I am a guy</button>
            `;
            allTasksContainer.appendChild(taskCard);

            // Add event listener for "I am a guy" button
            const iAmAGuyBtn = taskCard.querySelector('.i-am-a-guy-btn');
            iAmAGuyBtn.addEventListener('click', () => {
                alert(`You've expressed interest in the task: ${task.title}`);
                // Here you would typically send this data to a server
            });
        });
    }

    // Modal search functionality
    modalSearchBtn.onclick = () => {
        const searchTerm = modalSearchInput.value.toLowerCase();
        const filteredTasks = allTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
        renderAllTasks(filteredTasks);
    }

    // Modal task tags functionality
    modalTaskTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.category;
            modalTaskTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            let filteredTasks;
            if (category === 'all') {
                filteredTasks = allTasks;
            } else {
                filteredTasks = allTasks.filter(task => task.category === category);
            }
            renderAllTasks(filteredTasks);
        });
    });


    // Search functionality
    searchBtn.onclick = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredTasks = allTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderTasks();
    }

    // Undo functionality
    undoBtn.onclick = () => {
        if (swipedTasks.length > 0) {
            const lastSwipedTask = swipedTasks.pop();
            filteredTasks.unshift(lastSwipedTask);
            renderTasks();
        }
        if (swipedTasks.length === 0) {
            undoBtn.style.display = 'none';
        }
    }

    // Event listener for task tags
    taskTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.category;
            taskTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            if (category === 'all') {
                filteredTasks = allTasks;
            } else {
                filteredTasks = allTasks.filter(task => task.category === category);
            }

            currentPage = 1;
            renderTasks();
        });
    });

    // Add sample tasks
    addTask('Website Design for Luxury Brand', 'Need a professional to design a high-end website for my luxury fashion brand.', 1000000000, 'Lagos', 'design');
    addTask('Mobile App Development', 'Develop a food delivery app for Android and iOS', 2000000, 'Abuja', 'development');
    addTask('Content Writing', 'Write 10 blog posts about Nigerian cuisine', 100000, 'Port Harcourt', 'writing');
    addTask('Social Media Marketing', 'Manage social media accounts for a fashion brand', 300000, 'Lagos', 'marketing');
    addTask('Logo Design', 'Create a logo for a new eco-friendly product line', 150000, 'Kano', 'design');
    addTask('E-commerce Website', 'Build an e-commerce platform for handmade crafts', 1500000, 'Ibadan', 'development');
    addTask('Video Editing', 'Edit promotional videos for a tourism company', 250000, 'Lagos', 'design');
    addTask('SEO Optimization', 'Improve search engine rankings for a local business', 400000, 'Abuja', 'marketing');
    addTask('Technical Writing', 'Create user manuals for a new software product', 200000, 'Port Harcourt', 'writing');
    addTask('UI/UX Design', 'Design user interface for a fintech app', 800000, 'Lagos', 'design');

    // Initial render
    renderTasks();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.task-card, .step, .contact form');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Call once to check initial state

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // Add 3D tilt effect to task cards
    const cards = document.querySelectorAll('.task-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const angleX = (e.clientY - cardCenterY) / 25;
            const angleY = (cardCenterX - e.clientX) / 25;
            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Add floating animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    setInterval(() => {
        ctaButton.classList.toggle('animate-bounce');
    }, 2000);

    // Add spin animation to step icons
    const stepIcons = document.querySelectorAll('.step-icon');
    stepIcons.forEach(icon => {
        icon.classList.add('animate-spin');
    });
});
