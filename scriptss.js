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
    const undoBtn = document.createElement('button');
    undoBtn.classList.add('undo-btn');
    undoBtn.innerHTML = '<i class="fas fa-undo"></i>';
    document.body.appendChild(undoBtn);

    let currentTaskIndex = 0;
    let tasks = [];
    let swipedTasks = [];

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
        addTask(title, description, budget, location);
        taskForm.reset();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Add task to the list
    function addTask(title, description, budget, location) {
        const task = {
            id: Date.now(),
            title,
            description,
            budget: parseInt(budget),
            location,
            user: {
                name: 'John Doe',
                avatar: 'https://jabyrtech.github.io/new/assets/static/jabyr2.jpg'
            }
        };
        tasks.unshift(task);
        renderTasks();
    }

    // Render tasks
    function renderTasks() {
        taskContainer.innerHTML = '';
        const visibleTasks = tasks.slice(currentTaskIndex, currentTaskIndex + 10);
        visibleTasks.forEach((task, index) => {
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
                            swipedTasks.push(tasks.splice(currentTaskIndex + index, 1)[0]);
                            renderTasks();
                        }, 300);
                    } else {
                        taskCard.classList.add('swipe-left');
                        setTimeout(() => {
                            tasks.splice(currentTaskIndex + index, 1);
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
    }

    // Navigation buttons
    prevTaskBtn.onclick = () => {
        if (currentTaskIndex > 0) {
            currentTaskIndex -= 10;
            renderTasks();
        }
    }

    nextTaskBtn.onclick = () => {
        if (currentTaskIndex + 10 < tasks.length) {
            currentTaskIndex += 10;
            renderTasks();
        }
    }

    // View all tasks
    viewAllTasksBtn.onclick = () => {
        // Implement view all tasks functionality
        alert('View all tasks functionality to be implemented');
    }

    // Search functionality
    searchBtn.onclick = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
        tasks = filteredTasks;
        currentTaskIndex = 0;
        renderTasks();
    }

    // Undo functionality
    undoBtn.onclick = () => {
        if (swipedTasks.length > 0) {
            const lastSwipedTask = swipedTasks.pop();
            tasks.unshift(lastSwipedTask);
            renderTasks();
        }
        if (swipedTasks.length === 0) {
            undoBtn.style.display = 'none';
        }
    }

    // Add some sample tasks
    
    addTask('Event Planning for Royal Gala', 'Looking for an experienced event planner to organize a royal gala for international dignitaries.', 500000000, 'Abuja');
    addTask('Private Jet Interior Design', 'Seeking a world-class designer to renovate the interior of my private jet.', 2000000000, 'Port Harcourt');
    addTask('Yacht Party Catering', 'Need a Michelin-star chef to cater an exclusive yacht party for 100 VIP guests.', 300000000, 'Lagos');
    addTask('Personal Stylist for Celebrity', 'Looking for a top-tier stylist to curate a wardrobe for my upcoming world tour.', 150000000, 'Lagos');
    addTask('Luxury Car Customization', 'Need an expert to customize my fleet of luxury cars with gold plating and diamond accents.', 5000000000, 'Abuja');
    addTask('Private Island Development', 'Seeking a visionary architect to design and develop my private island resort.', 10000000000, 'Lagos');
    addTask('Rare Art Collection Curator', 'Looking for an experienced curator to manage and expand my rare art collection.', 500000000, 'Abuja');
    addTask('Chef Needed', 'I need someone that will be cooking for me, I have the food stuff, he just has to cook, i can pay him with money or with food', 'Negotiable', 'Al-Hikmah');
    addTask('Laundary Service', 'I need a guy to help me wash my clothes please, 10 sets only', 2000, 'Al-Hikmah');
    addTask('Mathematics Assignment', 'Need someone that can do maths assignment for me and give me by Sunday.', 2000, 'Al-Hikmah');

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

    // Add spin animation to step icons
});





document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const postTaskBtn = document.getElementById('post-task-btn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const taskForm = document.getElementById('task-form');

    // Open modal
    postTaskBtn.onclick = () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    }

    // Handle task submission
    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const budget = document.getElementById('task-budget').value;
        const location = document.getElementById('task-location').value;
        
        // Here you would typically send this data to a server
        console.log('Task submitted:', { title, description, budget, location });
        
        // Clear the form and close the modal
        taskForm.reset();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});