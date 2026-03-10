# Sports League Management - Flask Backend Setup Guide

## Overview
This guide walks you through setting up the Flask backend with MySQL database for the Sports League Management System.

## Prerequisites
- Python 3.8+ installed
- MySQL Server 5.7+ installed and running
- Node.js & npm (for frontend)

---

## Step 1: Install MySQL

### Windows
1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Make note of the MySQL root password
4. Default: localhost, port 3306

### Verify MySQL Installation
```bash
mysql --version
```

---

## Step 2: Create the Database

1. Open MySQL Command Line or MySQL Workbench
2. Run the SQL commands from `database_setup.sql`:

```bash
mysql -u root -p < database_setup.sql
```

Or copy-paste the entire content of `database_setup.sql` into your MySQL client.

### Verify Database Creation
```bash
mysql -u root -p
USE sports_league;
SHOW TABLES;
```

You should see 8 tables:
- users
- teams
- fixtures
- players
- contact_messages
- team_statistics
- player_statistics

---

## Step 3: Install Python Dependencies

1. Open PowerShell in the project directory
2. Install required packages:

```bash
pip install -r requirements.txt
```

### Installed Packages
- Flask - Web framework
- Flask-CORS - Handle cross-origin requests
- mysql-connector-python - MySQL connection
- python-dotenv - Environment variables
- bcrypt - Password hashing
- PyJWT - Authentication tokens

---

## Step 4: Configure Environment Variables

Edit `.env` file and update with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sports_league
DB_PORT=3306
SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
```

Replace `your_mysql_password` with your MySQL root password.

---

## Step 5: Run Flask Server

```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Test the Connection
Open browser and go to:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## Step 6: Update HTML Forms

The HTML forms already reference form IDs that match the JavaScript handlers:

### Register Form (register.html)
- Form ID: `registerForm`
- Fields: name, email, phone, password, confirmPassword, role
- Endpoint: `POST /api/register`

### Login Form (login.html)
- Form ID: `loginForm`
- Fields: email, password
- Endpoint: `POST /api/login`

### Team Registration (register_team.html)
- Form ID: `registerTeamForm`
- Fields: teamName, sport, city, coachName, description
- Endpoint: `POST /api/teams`

### Contact Form (contact.html)
- Form ID: `contactForm`
- Fields: name, email, phone, subject, message
- Endpoint: `POST /api/contact`

### Fixture Form (add_fixture.html)
- Form ID: `addFixtureForm`
- Fields: homeTeam, awayTeam, fixtureDate, venue, sport
- Endpoint: `POST /api/fixtures`

---

## Available API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Teams
- `POST /api/teams` - Create team (requires auth)
- `GET /api/teams` - Get all teams

### Fixtures
- `POST /api/fixtures` - Create fixture (requires auth)
- `GET /api/fixtures` - Get all fixtures

### Contact
- `POST /api/contact` - Submit contact message

### Utility
- `GET /api/health` - Health check

---

## Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+263712345678",
    "password": "password123",
    "role": "player"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Team
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "team_name": "Harare United",
    "sport": "Football",
    "city": "Harare",
    "coach_name": "John Smith",
    "description": "Professional football team"
  }'
```

---

## Database Schema

### Users Table
- id (INT, Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 120, Unique)
- phone (VARCHAR 20)
- password (VARCHAR 255, hashed)
- role (ENUM: player, coach, admin)
- created_at, updated_at (TIMESTAMP)

### Teams Table
- id (INT, Primary Key)
- team_name (VARCHAR 100)
- sport (VARCHAR 50)
- city (VARCHAR 50)
- coach_name (VARCHAR 100)
- description (TEXT)
- created_by (INT, FK to users)
- created_at, updated_at (TIMESTAMP)

### Fixtures Table
- id (INT, Primary Key)
- home_team_id (INT, FK to teams)
- away_team_id (INT, FK to teams)
- fixture_date (DATETIME)
- venue (VARCHAR 150)
- sport (VARCHAR 50)
- status (ENUM: scheduled, ongoing, completed, cancelled)
- home_team_score, away_team_score (INT)
- created_by (INT, FK to users)
- created_at, updated_at (TIMESTAMP)

### Contact Messages Table
- id (INT, Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 120)
- phone (VARCHAR 20)
- subject (VARCHAR 200)
- message (TEXT)
- status (ENUM: new, read, replied)
- created_at (TIMESTAMP)

---

## Troubleshooting

### MySQL Connection Error
**Error:** "Can't connect to MySQL server"
- Check MySQL is running: `mysql --version`
- Verify credentials in `.env`
- Check port 3306 is accessible

### Database Not Found
**Error:** "Unknown database 'sports_league'"
- Run `database_setup.sql` again
- Check: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
**Error:** "Address already in use"
- Change port in `app.py`: `app.run(port=5001)`
- Or kill process: `lsof -i :5000` and then `kill -9 PID`

### CORS Issues
- Frontend and backend must be on different ports
- Frontend: typically port 80 or 8000
- Backend: port 5000
- CORS is already enabled in `app.py`

---

## Security Notes (Production)

1. Change `SECRET_KEY` in `.env` to a strong random value
2. Use environment variables for all sensitive data
3. Never commit `.env` to git (add to `.gitignore`)
4. Use HTTPS in production
5. Set `FLASK_ENV=production`
6. Use a production WSGI server like Gunicorn
7. Implement rate limiting
8. Add request validation
9. Use database backups

---

## Frontend Integration

The JavaScript file `js/api.js` handles all API calls:

```javascript
// Automatically called on page load
handleRegisterForm();    // Register page
handleLoginForm();       // Login page
handleTeamForm();        // Team registration
handleFixtureForm();     // Fixture creation
handleContactForm();     // Contact form

// Data loading
loadTeams('selectId');   // Load teams into dropdown
loadFixtures();          // Load and display fixtures
```

All responses show user-friendly error/success messages via toast notifications.

---

## Testing the Full Flow

1. **Register**: http://localhost/register.html
2. **Login**: http://localhost/login.html
3. **Create Team**: http://localhost/register_team.html (requires login)
4. **View Fixtures**: http://localhost/fixtures.html
5. **Contact**: http://localhost/contact.html

---

## Next Steps

1. Add authentication checks to protect dashboard pages
2. Implement player registration
3. Create admin panel for statistics management
4. Add email notifications
5. Implement real-time score updates
6. Add file uploads for team logos

---

For support, check the Flask documentation: https://flask.palletsprojects.com/
