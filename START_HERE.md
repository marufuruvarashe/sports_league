# 🚀 START HERE - RUNNING THE SYSTEM

## Complete Step-by-Step Guide

### Step 1: Prepare MySQL (Do ONCE)

Open **Command Prompt** or **PowerShell**:

```bash
# Go to your project folder
cd c:\Users\user\Documents\sports_league

# Create the database (requires MySQL to be installed)
mysql -u root -p < database_setup.sql
```

When asked for password: Enter your MySQL password (or press Enter if none)

**Verify:**
```bash
mysql -u root -p -e "USE sports_league; SHOW TABLES;"
```

You should see 8 tables listed. ✅

---

### Step 2: Configure Flask (Do ONCE)

Edit `app.py` line 14:

**Find:**
```python
password='',  # Change this to your MySQL password
```

**Change to:** (example)
```python
password='admin123',  # My MySQL password
```

Save file.

---

### Step 3: Install Python Packages (Do ONCE)

Open **Command Prompt** or **PowerShell**:

```bash
cd c:\Users\user\Documents\sports_league
pip install -r requirements.txt
```

Wait for installation to complete.

---

### Step 4: Start Flask Server (Do EVERY TIME)

**Terminal 1 - Flask Server:**

```bash
cd c:\Users\user\Documents\sports_league
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

**KEEP THIS TERMINAL OPEN** ✅

---

### Step 5: Test Everything (Optional but Recommended)

**Terminal 2 - Run Tests:**

```bash
cd c:\Users\user\Documents\sports_league
python test_api.py
```

You should see:
```
============================================================
TESTING SPORTS LEAGUE API
============================================================

1. Testing Database Connection...
   Status: OK
   Database: connected

2. Registering Test User...
   ✓ User created! ID: 1

3. Creating Test Team...
   ✓ Team created! ID: 1

... (more tests)

TEST COMPLETE!
```

All items should have ✓ marks. ✅

---

### Step 6: Open the Website

Open your browser and go to:

```
http://localhost/
```

or 

```
http://127.0.0.1/
```

You should see the homepage. ✅

---

## Now Test the Features

### Test 1: User Registration

1. Click "Register" button
2. Fill in form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+263712345678`
   - Password: `password123`
   - Role: `Player`
3. Click "Create Account"
4. Should see "Account created successfully!" ✅

### Test 2: View Teams

1. Go to http://localhost/teams.html
2. You should see teams loading (might be empty at first)
3. Click "Register Team"
4. Fill form:
   - Team Name: `Harare United`
   - Sport: `Football`
   - City: `Harare`
   - Coach: `John Smith`
5. Click "Register Team"
6. Should redirect back to teams page
7. New team should appear! ✅

### Test 3: View Fixtures

1. Go to http://localhost/fixtures.html
2. Should see table header
3. Go to add fixture page
4. Need 2 teams first (create them in Test 2)
5. Fill fixture form:
   - Home Team: Select a team
   - Away Team: Select another team
   - Date: Pick a future date
   - Venue: `National Stadium`
   - Sport: `Football`
6. Click "Add Fixture"
7. New fixture should appear on fixtures.html ✅

### Test 4: Contact Form

1. Go to http://localhost/contact.html
2. Fill form:
   - Name: `John`
   - Email: `john@example.com`
   - Message: `This is a test`
3. Click Submit
4. Should see "Message sent successfully!" ✅

---

## Checking if Data Saved

Open **new Terminal**:

```bash
mysql -u root -p
USE sports_league;

# Check users
SELECT * FROM users;

# Check teams
SELECT * FROM teams;

# Check fixtures
SELECT * FROM fixtures;

# Check contact messages
SELECT * FROM contact_messages;

# Exit
EXIT;
```

You should see your data! ✅

---

## When Finished Testing

Press **CTRL+C** in the Flask terminal to stop it.

```
KeyboardInterrupt
 * Running on http://127.0.0.1:5000
```

---

## If Something Goes Wrong

### Error: "Can't connect to MySQL"
```bash
# Check MySQL is running
mysql --version

# If not running, start it
net start MySQL80  # Windows
```

### Error: "Module not found"
```bash
# Reinstall packages
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
```bash
# Kill the process
netstat -ano | findstr :5000
taskkill /PID [PID NUMBER] /F

# Then try again
python app.py
```

### Forms not saving
- Check Flask terminal for errors
- Check browser console (F12) for errors
- Make sure Flask is running on http://127.0.0.1:5000
- Test: http://127.0.0.1:5000/api/health should show "healthy"

### Data not showing
- Refresh browser (Ctrl+F5)
- Check MySQL: `SELECT * FROM teams;`
- Check Flask terminal for error messages
- Check browser console (F12) for JavaScript errors

---

## Quick Reference

| What | Command | Port |
|------|---------|------|
| Flask Server | `python app.py` | 5000 |
| Website | Browser to http://localhost | 80 |
| MySQL | `mysql -u root -p` | 3306 |
| API Test | `python test_api.py` | 5000 |

---

## File Locations

```
Main Backend:        app.py
Main Frontend JS:    js/api.js
Database Setup:      database_setup.sql
Python Config:       requirements.txt
Test Script:         test_api.py
```

---

## Documentation

- **Getting Started**: README.md
- **Detailed Setup**: SETUP_GUIDE.md
- **Quick Start**: QUICK_START.md
- **Architecture**: ARCHITECTURE.md
- **What Changed**: CLEANUP_SUMMARY.md

---

## Success Checklist

✅ MySQL running
✅ Database created (8 tables)
✅ Flask server running on port 5000
✅ test_api.py passes all tests
✅ Can register user
✅ Can create team
✅ Team appears on teams.html
✅ Can create fixture
✅ Fixture appears on fixtures.html
✅ Contact form works
✅ No console errors (F12)
✅ No Flask terminal errors

---

## You're All Set! 🎉

Everything is ready. Just run:

```bash
python app.py
```

And test it out!

Questions? Check the troubleshooting section or look at the other documentation files.

**Happy Testing!** 🚀
