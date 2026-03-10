/* ========================================
   Sports League Management - Main JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initSidebar();
  initForms();
  initMobileMenu();
});

/* ========================================
   Navbar Auto-Hide on Scroll
======================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollTop = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.classList.add('hidden');
      } else {
        // Scrolling up
        navbar.classList.remove('hidden');
      }
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollTop = scrollTop;
  });
}

/* ========================================
   Sidebar Toggle
======================================== */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!sidebar || !toggleBtn) return;

  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    sidebar.classList.toggle('collapsed');
    
    if (overlay) {
      overlay.classList.toggle('active');
    }
  });

  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebar.classList.add('collapsed');
      overlay.classList.remove('active');
    });
  }

  // Close sidebar on window resize (desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
      sidebar.classList.remove('collapsed');
      sidebar.classList.remove('active');
      if (overlay) {
        overlay.classList.remove('active');
      }
    }
  });
}

/* ========================================
   Mobile Menu
======================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar-menu');
  const navActions = document.querySelector('.navbar-actions');

  if (!hamburger) return;

  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    if (navActions) {
      navActions.classList.toggle('active');
    }
    
    // Animate hamburger
    this.classList.toggle('active');
  });

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.navbar-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      if (navActions) {
        navActions.classList.remove('active');
      }
      hamburger.classList.remove('active');
    });
  });
}

/* ========================================
   Form Validation
======================================== */
function initForms() {
  // Login and Register forms are now handled by api.js (database integration)
  // See api.js for handleLoginForm() and handleRegisterForm()

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateContactForm()) {
        showAlert('Message sent successfully!', 'success');
        contactForm.reset();
      }
    });
  }

  // Fixture Form
  const fixtureForm = document.getElementById('fixtureForm');
  if (fixtureForm) {
    fixtureForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateFixtureForm()) {
        showAlert('Fixture saved successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'fixtures.html';
        }, 1500);
      }
    });
  }

  // Team Registration Form
  const teamForm = document.getElementById('teamForm');
  if (teamForm) {
    teamForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateTeamForm()) {
        showAlert('Team registered successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'teams.html';
        }, 1500);
      }
    });
  }
}

/* ========================================
   Validation Functions
======================================== */
function validateLoginForm() {
  let isValid = true;
  
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  // Email validation
  if (!email.value || !isValidEmail(email.value)) {
    showError(email, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(email);
  }

  // Password validation
  if (!password.value || password.value.length < 6) {
    showError(password, 'Password must be at least 6 characters');
    isValid = false;
  } else {
    clearError(password);
  }

  return isValid;
}

function validateRegisterForm() {
  let isValid = true;
  
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const role = document.getElementById('role');

  // Name validation
  if (!name.value || name.value.trim().length < 2) {
    showError(name, 'Please enter your full name');
    isValid = false;
  } else {
    clearError(name);
  }

  // Email validation
  if (!email.value || !isValidEmail(email.value)) {
    showError(email, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(email);
  }

  // Phone validation
  if (!phone.value || !isValidPhone(phone.value)) {
    showError(phone, 'Please enter a valid phone number');
    isValid = false;
  } else {
    clearError(phone);
  }

  // Password validation
  if (!password.value || password.value.length < 6) {
    showError(password, 'Password must be at least 6 characters');
    isValid = false;
  } else {
    clearError(password);
  }

  // Confirm password validation
  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, 'Passwords do not match');
    isValid = false;
  } else {
    clearError(confirmPassword);
  }

  // Role validation
  if (!role.value) {
    showError(role, 'Please select a role');
    isValid = false;
  } else {
    clearError(role);
  }

  return isValid;
}

function validateContactForm() {
  let isValid = true;
  
  const name = document.getElementById('contactName');
  const email = document.getElementById('contactEmail');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');

  if (!name.value || name.value.trim().length < 2) {
    showError(name, 'Please enter your name');
    isValid = false;
  } else {
    clearError(name);
  }

  if (!email.value || !isValidEmail(email.value)) {
    showError(email, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(email);
  }

  if (!subject.value || subject.value.trim().length < 3) {
    showError(subject, 'Please enter a subject');
    isValid = false;
  } else {
    clearError(subject);
  }

  if (!message.value || message.value.trim().length < 10) {
    showError(message, 'Please enter a message (at least 10 characters)');
    isValid = false;
  } else {
    clearError(message);
  }

  return isValid;
}

function validateFixtureForm() {
  let isValid = true;
  
  const sport = document.getElementById('sport');
  const homeTeam = document.getElementById('homeTeam');
  const awayTeam = document.getElementById('awayTeam');
  const fixtureDate = document.getElementById('fixtureDate');
  const venue = document.getElementById('venue');

  if (!sport.value) {
    showError(sport, 'Please select a sport');
    isValid = false;
  } else {
    clearError(sport);
  }

  if (!homeTeam.value) {
    showError(homeTeam, 'Please select home team');
    isValid = false;
  } else {
    clearError(homeTeam);
  }

  if (!awayTeam.value) {
    showError(awayTeam, 'Please select away team');
    isValid = false;
  } else {
    clearError(awayTeam);
  }

  if (homeTeam.value && awayTeam.value && homeTeam.value === awayTeam.value) {
    showError(awayTeam, 'Home and away teams must be different');
    isValid = false;
  }

  if (!fixtureDate.value) {
    showError(fixtureDate, 'Please select date and time');
    isValid = false;
  } else {
    clearError(fixtureDate);
  }

  if (!venue.value || venue.value.trim().length < 3) {
    showError(venue, 'Please enter a venue');
    isValid = false;
  } else {
    clearError(venue);
  }

  return isValid;
}

function validateTeamForm() {
  let isValid = true;
  
  const teamName = document.getElementById('teamName');
  const sport = document.getElementById('sport');
  const coachName = document.getElementById('coachName');
  const contactEmail = document.getElementById('contactEmail');
  const contactPhone = document.getElementById('contactPhone');

  if (!teamName.value || teamName.value.trim().length < 2) {
    showError(teamName, 'Please enter team name');
    isValid = false;
  } else {
    clearError(teamName);
  }

  if (!sport.value) {
    showError(sport, 'Please select a sport');
    isValid = false;
  } else {
    clearError(sport);
  }

  if (!coachName.value || coachName.value.trim().length < 2) {
    showError(coachName, 'Please enter coach name');
    isValid = false;
  } else {
    clearError(coachName);
  }

  if (!contactEmail.value || !isValidEmail(contactEmail.value)) {
    showError(contactEmail, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(contactEmail);
  }

  if (!contactPhone.value || !isValidPhone(contactPhone.value)) {
    showError(contactPhone, 'Please enter a valid phone number');
    isValid = false;
  } else {
    clearError(contactPhone);
  }

  return isValid;
}

/* ========================================
   Helper Functions
======================================== */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function showError(input, message) {
  input.classList.add('error');
  const errorEl = input.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearError(input) {
  input.classList.remove('error');
  const errorEl = input.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}

function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert-toast');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement('div');
  alert.className = `alert-toast alert-${type}`;
  alert.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Add styles inline for the toast
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
}

/* ========================================
   Search and Filter
======================================== */
function filterTable(searchInput, tableId) {
  const filter = searchInput.value.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
}

function filterBySport(selectElement, tableId) {
  const filter = selectElement.value.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const sportCell = row.querySelector('[data-sport]');
    if (!sportCell) return;
    
    const sport = sportCell.getAttribute('data-sport').toLowerCase();
    
    if (!filter || sport === filter) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function filterCards(searchInput, containerClass) {
  const filter = searchInput.value.toLowerCase();
  const container = document.querySelector(`.${containerClass}`);
  if (!container) return;
  
  const cards = container.querySelectorAll('.team-card, .blog-card');
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(filter) ? '' : 'none';
  });
}

/* ========================================
   Delete Confirmation
======================================== */
function confirmDelete(itemName) {
  return confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`);
}
