# Database & Form Connection Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML/CSS/JS)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  register.html      teams.html      fixtures.html           │
│      │                  │                 │                 │
│      │  Form Submit     │ Page Load       │ Page Load        │
│      │                  │                 │                 │
│      └──────────────────┴─────────────────┘                 │
│                          │                                   │
│              js/api.js (JavaScript Handler)                 │
│              - handleRegisterForm()                         │
│              - handleTeamForm()                             │
│              - handleFixtureForm()                          │
│              - loadTeamsDisplay()                           │
│              - loadFixtures()                               │
│                          │                                   │
│              HTTP POST/GET to Port 5000                     │
│                          │                                   │
└────────────────────────────────────────────────────────────┼┐
                                                               │
                    NETWORK (HTTP/JSON)                       │
                                                               │
┌────────────────────────────────────────────────────────────┼┐
│                    BACKEND (Flask API)                      │ │
├────────────────────────────────────────────────────────────┤ │
│                                                              │ │
│  app.py (Routes):                                           │ │
│                                                              │ │
│  POST /api/register  ───────────────────────────────────┐   │ │
│  POST /api/login     ────────────────────────────────┐  │   │ │
│  POST /api/teams     ──────────────────────────────┐ │  │   │ │
│  GET  /api/teams     ─────────────────────────────┐│ │  │   │ │
│  POST /api/fixtures  ────────────────────────────┐││ │  │   │ │
│  GET  /api/fixtures  ───────────────────────────┐│││ │  │   │ │
│  POST /api/contact   ──────────────────────────┐│││ │  │   │ │
│  GET  /api/health    ─────────────────────────┐│││ │  │   │ │
│                                               ││││ │  │   │ │
│              Database Operations             ││││ │  │   │ │
│              INSERT / SELECT / UPDATE        ││││ │  │   │ │
│                       │                      ││││ │  │   │ │
└───────────────────────┼──────────────────────┼┼┼┼─┼──┼───┘ │
                        │                      ││││ │  │
                    MySQL Connection          ││││ │  │
                        │                      ││││ │  │
┌───────────────────────┼──────────────────────┼┼┼┼─┼──┼───┐ │
│                   DATABASE (MySQL)          ││││ │  │    │ │
├───────────────────────┼──────────────────────┼┼┼┼─┼──┼───┤ │
│                       │                      ││││ │  │    │ │
│  ┌─────────────────────────────────────┐    ││││ │  │    │ │
│  │ sports_league database              │    ││││ │  │    │ │
│  │                                      │    ││││ │  │    │ │
│  │ Tables:                              │◄───┼┼┼┼─┼──┼─┐  │ │
│  │ ├─ users                            │    ││││ │  │ │  │ │
│  │ ├─ teams                            │    ││││ │  │ │  │ │
│  │ ├─ fixtures                         │    ││││ │  │ │  │ │
│  │ ├─ contact_messages                 │    ││││ │  │ │  │ │
│  │ ├─ players                          │    ││││ │  │ │  │ │
│  │ ├─ team_statistics                  │    ││││ │  │ │  │ │
│  │ └─ player_statistics                │    ││││ │  │ │  │ │
│  │                                      │    ││││ │  │ │  │ │
│  └─────────────────────────────────────┘    ││││ │  │ │  │ │
│                                             ││││ │  │ │  │ │
└─────────────────────────────────────────────┼┼┼┼─┼──┼─┼──┘ │
                                              ││││ │  │ │
                                    Data Flow │││└──┘  │ │
                                              │││      │ │
┌──────────────────────────────────────────────┼┼┼──────┼─┘
│                JSON RESPONSE                 │││      │
│              (Back to Frontend)              │││      │
│                                              │││      │
└──────────────────────────────────────────────┼┼┼──────┘
                                               │││
                                      Display on Page
                                               │││
                            ┌──────────────────┴┴┘
                            │
                    HTML Content Updated
```

## Form → Database → Display Flow

### Example: Create Team

```
1. User fills form in register_team.html
   ├─ Team Name: "Harare United"
   ├─ Sport: "Football"
   ├─ City: "Harare"
   ├─ Coach: "John Smith"
   └─ Description: "Professional team"

2. Form Submit Button Clicked
   └─ handleTeamForm() called in js/api.js

3. JavaScript sends POST request to Flask
   POST http://127.0.0.1:5000/api/teams
   {
     "team_name": "Harare United",
     "sport": "Football",
     "city": "Harare",
     "coach_name": "John Smith",
     "description": "Professional team",
     "user_id": 1
   }

4. Flask receives request in app.py
   └─ create_team() function processes it

5. Flask connects to MySQL
   └─ INSERT INTO teams (...)

6. Data saved to database
   teams table:
   ┌─────┬────────────────┬──────────┬────────┬──────────────┬──────────────────┐
   │ id  │ team_name      │ sport    │ city   │ coach_name   │ description      │
   ├─────┼────────────────┼──────────┼────────┼──────────────┼──────────────────┤
   │ 1   │ Harare United  │ Football │ Harare │ John Smith   │ Professional team│
   └─────┴────────────────┴──────────┴────────┴──────────────┴──────────────────┘

7. Flask sends success response
   {
     "message": "Team created!",
     "team_id": 1
   }

8. JavaScript shows success message
   "Team created successfully!"

9. Page redirects to teams.html

10. teams.html page loads
    └─ JavaScript calls loadTeamsDisplay()

11. loadTeamsDisplay() sends GET request
    GET http://127.0.0.1:5000/api/teams

12. Flask retrieves from database
    SELECT * FROM teams

13. Flask returns JSON
    {
      "teams": [
        {
          "id": 1,
          "team_name": "Harare United",
          "sport": "Football",
          "city": "Harare",
          "coach_name": "John Smith",
          "description": "Professional team",
          "created_at": "2026-01-27..."
        }
      ]
    }

14. JavaScript receives data

15. JavaScript builds HTML cards
    <div class="team-card">
      <div class="team-card-header">
        <div class="team-logo">H</div>
        <h4>Harare United</h4>
        <span>Football</span>
      </div>
      <div class="team-card-body">
        <div class="team-stat">
          <span>City</span>
          <span>Harare</span>
        </div>
        ...
      </div>
    </div>

16. HTML inserted into .team-grid

17. Team appears on page!
```

## Data Validation Flow

```
HTML Form Input
    ↓
JavaScript Validation
├─ Check required fields
├─ Validate email format
├─ Check password length
└─ Show error if invalid
    ↓
Send to Flask
    ↓
Flask Validation
├─ Check email not duplicate (for users)
├─ Check all fields present
└─ Show error if invalid
    ↓
Save to Database
    ↓
Success Response
    ↓
JavaScript Shows Message
    ↓
Update Page or Redirect
```

## Key Connection Points

### Frontend → Backend
```javascript
// In js/api.js
fetch(`${API_BASE_URL}/teams`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

### Backend → Database
```python
# In app.py
cursor = db.cursor()
sql = "INSERT INTO teams (...) VALUES (...)"
cursor.execute(sql, (team_name, sport, city, ...))
db.commit()
```

### Database → Backend
```python
# In app.py
cursor.execute("SELECT * FROM teams")
teams = cursor.fetchall()
return jsonify({'teams': teams})
```

### Backend → Frontend
```javascript
// In js/api.js
const response = await fetch(`${API_BASE_URL}/teams`);
const data = await response.json();
teamGrid.innerHTML = data.teams.map(team => ...);
```

## API Endpoints Summary

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| POST | /api/register | Create user | user_id, message |
| POST | /api/login | Authenticate user | user_id, name, role |
| POST | /api/teams | Create team | team_id, message |
| GET | /api/teams | Get all teams | teams array |
| POST | /api/fixtures | Create fixture | fixture_id, message |
| GET | /api/fixtures | Get all fixtures | fixtures array |
| POST | /api/contact | Submit contact form | message |
| GET | /api/health | Check system status | status, database |

## Error Handling Flow

```
User Action
    ↓
Frontend Validation
├─ ✓ Valid → Send to Flask
└─ ✗ Invalid → Show error, stop
    ↓
Flask Validation
├─ ✓ Valid → Save to database
└─ ✗ Invalid → Return error response
    ↓
Database Operation
├─ ✓ Success → Return success
└─ ✗ Failed → Return error
    ↓
JavaScript Response Handler
├─ ✓ Success → Show success message
└─ ✗ Error → Show error message
```

---
This architecture ensures:
- ✅ Data is validated twice (frontend + backend)
- ✅ Data is safely stored in database
- ✅ Real-time display of data
- ✅ User sees confirmation messages
- ✅ Errors are caught and displayed
