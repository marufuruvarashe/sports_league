/* ========================================
   Sports League API Handler
======================================== */

const API_BASE_URL = 'http://localhost:5000/api';

// Store token in localStorage
function setToken(token) {
  localStorage.setItem('auth_token', token);
}

function getToken() {
  return localStorage.getItem('auth_token');
}

function removeToken() {
  localStorage.removeItem('auth_token');
}

// Get authorization header
function getAuthHeader() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/* ========================================
   REGISTRATION
======================================== */

function handleRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    // Validate inputs
    if (!name || name.length < 2) {
      showError('Please enter a valid name (at least 2 characters)');
      return;
    }

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    if (!phone) {
      showError('Please enter a phone number');
      return;
    }

    if (!password) {
      showError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!role) {
      showError('Please select a role');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns user_id - registration successful
        if (data.user_id) {
          localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: name, email: email }));
          showSuccess('Account created successfully! Redirecting...');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
          showError('Invalid response from server');
        }
      } else {
        // Registration failed
        showError(data.message || 'Registration failed');
      }
    } catch (error) {
      showError('Network error: ' + error.message);
    }
  });
}

/* ========================================
   LOGIN
======================================== */

function handleLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate inputs before sending
    if (!email) {
      showError('Please enter your email address');
      return;
    }

    if (!password) {
      showError('Please enter your password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returned 200 - login successful
        // Verify we got user_id before storing
        if (data.user_id && data.name) {
          localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: data.name, email: email }));
          showSuccess('Login successful! Redirecting...');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
          showError('Invalid response from server');
        }
      } else {
        // Backend returned error status - login failed
        // Clear any stale user data
        localStorage.removeItem('user');
        showError(data.message || 'Login failed');
      }
    } catch (error) {
      // Network error
      localStorage.removeItem('user');
      showError('Network error: ' + error.message);
    }
  });
}

/* ========================================
   TEAM REGISTRATION
======================================== */

function handleTeamForm() {
  const form = document.getElementById('teamForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const team_name = document.getElementById('teamName').value;
    const sport = document.getElementById('sport').value;
    const city = document.getElementById('city').value;
    const coach_name = document.getElementById('coachName').value;
    const description = document.getElementById('description').value;

    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          team_name,
          sport,
          city,
          coach_name,
          description,
          user_id: null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Team created successfully!');
        form.reset();
        setTimeout(() => {
          window.location.href = 'teams.html';
        }, 1500);
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError('Network error: ' + error.message);
    }
  });
}

/* ========================================
   FIXTURE CREATION
======================================== */

function handleFixtureForm() {
  const form = document.getElementById('fixtureForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const home_team_id = document.getElementById('homeTeam').value;
    const away_team_id = document.getElementById('awayTeam').value;
    const fixture_date = document.getElementById('fixtureDate').value;
    const venue = document.getElementById('venue').value;
    const sport = document.getElementById('sport').value;

    try {
      const response = await fetch(`${API_BASE_URL}/fixtures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          home_team_id,
          away_team_id,
          fixture_date,
          venue,
          sport,
          user_id: null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Fixture created successfully!');
        form.reset();
        setTimeout(() => {
          window.location.href = 'fixtures.html';
        }, 1500);
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError('Network error: ' + error.message);
    }
  });
}

/* ========================================
   CONTACT FORM
======================================== */

function handleContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Message sent successfully! We will get back to you soon.');
        form.reset();
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError('Network error: ' + error.message);
    }
  });
}

/* ========================================
   LOAD TEAMS FOR DROPDOWN
======================================== */

async function loadTeams(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    const data = await response.json();

    // clear existing options except the first placeholder
    while (select.options.length > 1) {
      select.remove(1);
    }

    if (data.teams) {
      data.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.team_name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading teams:', error);
  }
}

// Filter teams dropdown by selected sport
async function filterTeamsBySelectedSport() {
  const sportSelect = document.getElementById('sport');
  const homeTeamSelect = document.getElementById('homeTeam');
  const awayTeamSelect = document.getElementById('awayTeam');
  
  if (!sportSelect || !homeTeamSelect || !awayTeamSelect) return;
  
  const selectedSport = (sportSelect.value || '').toLowerCase();
  
  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    const data = await response.json();
    
    // Filter teams by selected sport
    const filteredTeams = selectedSport 
      ? data.teams.filter(team => (team.sport || '').toLowerCase() === selectedSport)
      : data.teams;
    
    // Update both team selects
    [homeTeamSelect, awayTeamSelect].forEach(select => {
      // Keep first placeholder option
      const firstOption = select.options[0];
      while (select.options.length > 1) {
        select.remove(1);
      }
      
      // Add filtered teams
      filteredTeams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.team_name;
        select.appendChild(option);
      });
      
      // Reset selection to placeholder
      select.value = '';
    });
    
  } catch (error) {
    console.error('Error filtering teams:', error);
  }
}

/* ========================================
   LOAD AND DISPLAY TEAMS
======================================== */

async function loadTeamsDisplay() {
  const teamGrid = document.querySelector('.team-grid');
  if (!teamGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    const data = await response.json();

    if (data.teams && data.teams.length > 0) {
      teamGrid.innerHTML = data.teams.map(team => `
        <div class="team-card" data-sport="${(team.sport || '').toLowerCase()}">
          <div class="team-card-header">
            <div class="team-logo">${team.team_name.charAt(0).toUpperCase()}</div>
            <h4>${team.team_name}</h4>
            <span>${team.sport}</span>
          </div>
          <div class="team-card-body">
            <div class="team-stat">
              <span>City</span>
              <span>${team.city || 'N/A'}</span>
            </div>
            <div class="team-stat">
              <span>Coach</span>
              <span>${team.coach_name || 'N/A'}</span>
            </div>
            <div class="team-stat">
              <span>Description</span>
              <span>${team.description || 'No description'}</span>
            </div>
            <div class="team-stat">
              <span>Created</span>
              <span>${new Date(team.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      teamGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No teams available. <a href="register_team.html">Create one now!</a></p>';
    }
  } catch (error) {
    console.error('Error loading teams:', error);
    teamGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error loading teams</p>';
  }
}

// Filter teams by selected sport
function filterTeamsBySport() {
  const sportFilter = document.getElementById('sportFilter');
  const selectedSport = (sportFilter.value || '').toLowerCase();
  const teamCards = document.querySelectorAll('.team-card');
  
  let visibleCount = 0;
  
  teamCards.forEach(card => {
    const cardSport = (card.getAttribute('data-sport') || '').toLowerCase();
    
    if (!selectedSport || cardSport === selectedSport) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show message if no teams match filter
  const teamGrid = document.querySelector('.team-grid');
  if (visibleCount === 0 && teamGrid) {
    const existingMsg = teamGrid.querySelector('p[style*="grid-column"]');
    if (!existingMsg) {
      const msg = document.createElement('p');
      msg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;';
      msg.textContent = `No teams found for ${selectedSport || 'selected sport'}`;
      teamGrid.appendChild(msg);
    }
  }
}

/* ========================================
   LOAD AND DISPLAY FIXTURES
======================================== */

async function loadFixtures() {
  const tableBody = document.querySelector('#fixturesTable tbody');
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_BASE_URL}/fixtures`);
    const data = await response.json();

    if (data.fixtures && data.fixtures.length > 0) {
      tableBody.innerHTML = data.fixtures.map(fixture => `
        <tr data-id="${fixture.id}">
          <td>${new Date(fixture.fixture_date).toLocaleDateString()} - ${new Date(fixture.fixture_date).toLocaleTimeString()}</td>
          <td data-sport="${fixture.sport}">${fixture.sport}</td>
          <td>${fixture.home_team_name || 'TBD'}</td>
          <td>${fixture.away_team_name || 'TBD'}</td>
          <td>${fixture.venue}</td>
          <td><span class="badge badge-warning">${fixture.status}</span></td>
          <td class="action-buttons">
            <a href="edit_fixture.html?id=${fixture.id}" class="action-btn edit" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </a>
            <button class="action-btn delete" title="Delete" onclick="deleteFixture(${fixture.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </td>
        </tr>
      `).join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No fixtures available</td></tr>';
    }
  } catch (error) {
    console.error('Error loading fixtures:', error);
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Error loading fixtures</td></tr>';
  }
}

async function deleteFixture(id) {
  if (!confirm('Are you sure you want to delete this fixture?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/fixtures/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      showSuccess(data.message || 'Fixture deleted');
      // try to remove row from table if present
      const row = document.querySelector(`#fixturesTable tbody tr[data-id="${id}"]`);
      if (row) {
        row.remove();
      } else {
        // fallback: reload fixtures
        loadFixtures();
      }
    } else {
      showError(data.message || 'Failed to delete fixture');
    }
  } catch (err) {
    showError('Network error: ' + err.message);
  }
}

// Load a single fixture and populate edit form
async function loadFixtureForEdit(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/fixtures/${id}`);
    if (!response.ok) return;
    const data = await response.json();
    const fixture = data.fixture;
    if (!fixture) return;

    // populate fields if they exist
    const sport = document.getElementById('sport');
    const homeTeam = document.getElementById('homeTeam');
    const awayTeam = document.getElementById('awayTeam');
    const fixtureDate = document.getElementById('fixtureDate');
    const venue = document.getElementById('venue');
    const status = document.getElementById('status');
    const notes = document.getElementById('notes');

    if (sport) sport.value = fixture.sport || '';
    if (venue) venue.value = fixture.venue || '';
    if (status) status.value = fixture.status || '';
    if (notes) notes.value = fixture.notes || '';

    // ensure team selects are filled then select values
    if (homeTeam) {
      await loadTeams('homeTeam');
      homeTeam.value = fixture.home_team_id || '';
    }
    if (awayTeam) {
      await loadTeams('awayTeam');
      awayTeam.value = fixture.away_team_id || '';
    }

    // format ISO local for datetime-local input
    if (fixtureDate && fixture.fixture_date) {
      const d = new Date(fixture.fixture_date);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISO = new Date(d - tzOffset).toISOString().slice(0,16);
      fixtureDate.value = localISO;
    }
  } catch (err) {
    console.error('Error loading fixture:', err);
  }
}

// Initialize fixtures-related UI on page load
function initFixturesPage() {
  // If fixtures table exists, load fixtures
  if (document.querySelector('#fixturesTable')) {
    loadFixtures();
  }

  // If fixture form exists (add or edit), load teams into selects
  if (document.getElementById('homeTeam')) {
    loadTeams('homeTeam');
  }
  if (document.getElementById('awayTeam')) {
    loadTeams('awayTeam');
  }

  // If this is edit page, detect id and load fixture
  if (window.location.pathname.endsWith('edit_fixture.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      loadFixtureForEdit(id);

      // override submit to call PUT
      const form = document.getElementById('fixtureForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const home_team_id = document.getElementById('homeTeam').value;
          const away_team_id = document.getElementById('awayTeam').value;
          const fixture_date = document.getElementById('fixtureDate').value;
          const venue = document.getElementById('venue').value;
          const sport = document.getElementById('sport').value;
          const status = document.getElementById('status') ? document.getElementById('status').value : 'scheduled';

          try {
            const response = await fetch(`${API_BASE_URL}/fixtures/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ home_team_id, away_team_id, fixture_date, venue, sport, status })
            });
            const data = await response.json();
            if (response.ok) {
              showSuccess('Fixture updated successfully! Redirecting...');
              setTimeout(() => window.location.href = 'fixtures.html', 1200);
            } else {
              showError(data.message || 'Failed to update fixture');
            }
          } catch (err) {
            showError('Network error: ' + err.message);
          }
        });
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', initFixturesPage);

/* ========================================
   LOGOUT
======================================== */

async function performLogout() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Call backend logout endpoint (optional tracking)
    if (user.id) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      }).catch(() => {}); // Ignore errors - still logout even if API fails
    }
  } catch (e) {
    // Ignore errors - still logout
  }
  
  // Clear all session data
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  
  // Show message and redirect
  showSuccess('You have been logged out. Redirecting...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

function handleLogout() {
  // Find all logout links/buttons
  const logoutElements = document.querySelectorAll('a[href="index.html"]');
  
  logoutElements.forEach(element => {
    // Check if it's in the Account section (contains "Logout" text)
    if (element.textContent.includes('Logout')) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        performLogout();
      });
    }
  });
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */

function showError(message) {
  // Create error notification
  const notification = document.createElement('div');
  notification.className = 'notification error-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ef4444;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

function showSuccess(message) {
  // Create success notification
  const notification = document.createElement('div');
  notification.className = 'notification success-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #22c55e;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

/* ========================================
   INITIALIZE ON PAGE LOAD
======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize forms
  handleRegisterForm();
  handleLoginForm();
  handleTeamForm();
  handleFixtureForm();
  handleContactForm();
  handleLogout();

  // Load data on relevant pages
  if (document.getElementById('addFixtureForm')) {
    loadTeams('homeTeam');
    loadTeams('awayTeam');
  }

  // Load teams display
  if (document.querySelector('.team-grid')) {
    loadTeamsDisplay();
  }

  // Load fixtures display
  if (document.getElementById('fixturesTable')) {
    loadFixtures();
  }

  // Load dashboard data
  if (document.getElementById('statsContainer')) {
    loadCurrentUser();
    loadDashboardStats();
    loadUpcomingFixtures();
    loadRecentResults();
  }

  // Load current user on all pages
  loadCurrentUser();
});

/* ========================================
   DASHBOARD FUNCTIONS
======================================== */

function loadCurrentUser() {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      const userName = user.name || 'User';
      const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
      
      // Update user display across all pages
      const userNameSpans = document.querySelectorAll('.user-menu span:not(.user-avatar)');
      userNameSpans.forEach(span => {
        span.textContent = userName;
      });
      
      // Update avatar initials
      const avatarDiv = document.querySelector('.user-avatar');
      if (avatarDiv) {
        avatarDiv.textContent = initials;
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
  }
}

async function loadDashboardStats() {
  try {
    // Get teams
    const teamsResponse = await fetch(`${API_BASE_URL}/teams`);
    const teamsData = await teamsResponse.json();
    const totalTeams = teamsData.teams ? teamsData.teams.length : 0;

    // Get fixtures
    const fixturesResponse = await fetch(`${API_BASE_URL}/fixtures`);
    const fixturesData = await fixturesResponse.json();
    const totalFixtures = fixturesData.fixtures ? fixturesData.fixtures.length : 0;
    
    // Count unique sports
    const uniqueSports = new Set();
    if (fixturesData.fixtures) {
      fixturesData.fixtures.forEach(fixture => {
        if (fixture.sport) {
          uniqueSports.add(fixture.sport.toLowerCase());
        }
      });
    }
    const totalSports = uniqueSports.size;

    // Count completed fixtures
    const completedFixtures = fixturesData.fixtures 
      ? fixturesData.fixtures.filter(f => f.status && f.status.toLowerCase() === 'completed').length
      : 0;

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
      statCards[0].querySelector('h3').textContent = totalTeams;
      statCards[1].querySelector('h3').textContent = totalFixtures;
      statCards[2].querySelector('h3').textContent = totalSports;
      statCards[3].querySelector('h3').textContent = completedFixtures;
    }

  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

async function loadUpcomingFixtures() {
  try {
    const response = await fetch(`${API_BASE_URL}/fixtures`);
    const data = await response.json();
    
    if (!data.fixtures) return;

    // Filter upcoming fixtures
    const today = new Date();
    const upcoming = data.fixtures
      .filter(f => {
        const fixtureDate = new Date(f.fixture_date);
        return fixtureDate > today && (!f.status || f.status.toLowerCase() === 'upcoming');
      })
      .sort((a, b) => new Date(a.fixture_date) - new Date(b.fixture_date))
      .slice(0, 4);

    // Get team names
    const teamsResponse = await fetch(`${API_BASE_URL}/teams`);
    const teamsData = await teamsResponse.json();
    const teamMap = {};
    if (teamsData.teams) {
      teamsData.teams.forEach(team => {
        teamMap[team.id] = team.team_name;
      });
    }

    // Update upcoming fixtures table
    const tbody = document.querySelector('.upcoming-fixtures tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      if (upcoming.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No upcoming fixtures</td></tr>';
      } else {
        upcoming.forEach(fixture => {
          const homeTeam = teamMap[fixture.home_team_id] || 'TBA';
          const awayTeam = teamMap[fixture.away_team_id] || 'TBA';
          const date = new Date(fixture.fixture_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${homeTeam} vs ${awayTeam}</td>
            <td>${fixture.sport || 'N/A'}</td>
            <td>${date}</td>
            <td><span class="badge badge-warning">Upcoming</span></td>
          `;
          tbody.appendChild(row);
        });
      }
    }

  } catch (error) {
    console.error('Error loading upcoming fixtures:', error);
  }
}

async function loadRecentResults() {
  try {
    const response = await fetch(`${API_BASE_URL}/fixtures`);
    const data = await response.json();
    
    if (!data.fixtures) return;

    // Filter completed fixtures
    const completed = data.fixtures
      .filter(f => f.status && f.status.toLowerCase() === 'completed')
      .sort((a, b) => new Date(b.fixture_date) - new Date(a.fixture_date))
      .slice(0, 4);

    // Get team names
    const teamsResponse = await fetch(`${API_BASE_URL}/teams`);
    const teamsData = await teamsResponse.json();
    const teamMap = {};
    if (teamsData.teams) {
      teamsData.teams.forEach(team => {
        teamMap[team.id] = team.team_name;
      });
    }

    // Update recent results table
    const tbody = document.querySelector('.recent-results tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      if (completed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No completed matches</td></tr>';
      } else {
        completed.forEach(fixture => {
          const homeTeam = teamMap[fixture.home_team_id] || 'TBA';
          const awayTeam = teamMap[fixture.away_team_id] || 'TBA';
          const homeScore = fixture.home_team_score !== null ? fixture.home_team_score : '0';
          const awayScore = fixture.away_team_score !== null ? fixture.away_team_score : '0';
          const date = new Date(fixture.fixture_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${homeTeam} vs ${awayTeam}</td>
            <td>${homeScore} - ${awayScore}</td>
            <td>${date}</td>
            <td><span class="badge badge-success">Completed</span></td>
          `;
          tbody.appendChild(row);
        });
      }
    }

  } catch (error) {
    console.error('Error loading recent results:', error);
  }
}
