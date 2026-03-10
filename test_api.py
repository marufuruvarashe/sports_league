# Test Database Connection and API
# Run this in Python to test if everything is working

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000/api"

print("=" * 60)
print("TESTING SPORTS LEAGUE API")
print("=" * 60)

# 1. Test Health Check
print("\n1. Testing Database Connection...")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.json()['status']}")
    print(f"   Database: {response.json()['database']}")
except Exception as e:
    print(f"   ERROR: {e}")

# 2. Register a Test User
print("\n2. Registering Test User...")
try:
    user_data = {
        "name": "John Doe",
        "email": f"john{datetime.now().timestamp()}@example.com",
        "phone": "+263712345678",
        "password": "password123",
        "role": "admin"
    }
    response = requests.post(f"{BASE_URL}/register", json=user_data)
    if response.status_code == 201:
        user_id = response.json()['user_id']
        print(f"   ✓ User created! ID: {user_id}")
    else:
        print(f"   ERROR: {response.json()['message']}")
except Exception as e:
    print(f"   ERROR: {e}")

# 3. Create a Test Team
print("\n3. Creating Test Team...")
try:
    team_data = {
        "team_name": "Test United FC",
        "sport": "Football",
        "city": "Harare",
        "coach_name": "Coach Smith",
        "description": "A test team",
        "user_id": 1
    }
    response = requests.post(f"{BASE_URL}/teams", json=team_data)
    if response.status_code == 201:
        team_id = response.json()['team_id']
        print(f"   ✓ Team created! ID: {team_id}")
    else:
        print(f"   ERROR: {response.json()['message']}")
except Exception as e:
    print(f"   ERROR: {e}")

# 4. Get All Teams
print("\n4. Fetching All Teams...")
try:
    response = requests.get(f"{BASE_URL}/teams")
    teams = response.json()['teams']
    print(f"   ✓ Found {len(teams)} team(s)")
    for team in teams[:3]:  # Show first 3
        print(f"     - {team['team_name']} ({team['sport']})")
    if len(teams) > 3:
        print(f"     ... and {len(teams) - 3} more")
except Exception as e:
    print(f"   ERROR: {e}")

# 5. Create a Test Fixture
print("\n5. Creating Test Fixture...")
try:
    fixture_data = {
        "home_team_id": 1,
        "away_team_id": 2,
        "fixture_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "venue": "National Stadium",
        "sport": "Football",
        "user_id": 1
    }
    response = requests.post(f"{BASE_URL}/fixtures", json=fixture_data)
    if response.status_code == 201:
        fixture_id = response.json()['fixture_id']
        print(f"   ✓ Fixture created! ID: {fixture_id}")
    else:
        print(f"   ERROR: {response.json()['message']}")
except Exception as e:
    print(f"   ERROR: {e}")

# 6. Get All Fixtures
print("\n6. Fetching All Fixtures...")
try:
    response = requests.get(f"{BASE_URL}/fixtures")
    fixtures = response.json()['fixtures']
    print(f"   ✓ Found {len(fixtures)} fixture(s)")
    for fixture in fixtures[:3]:  # Show first 3
        print(f"     - {fixture['home_team_name']} vs {fixture['away_team_name']}")
    if len(fixtures) > 3:
        print(f"     ... and {len(fixtures) - 3} more")
except Exception as e:
    print(f"   ERROR: {e}")

# 7. Submit Contact Message
print("\n7. Testing Contact Form...")
try:
    contact_data = {
        "name": "Test Contact",
        "email": "test@example.com",
        "phone": "+263712345678",
        "subject": "Test Message",
        "message": "This is a test message"
    }
    response = requests.post(f"{BASE_URL}/contact", json=contact_data)
    if response.status_code == 201:
        print(f"   ✓ Contact message saved!")
    else:
        print(f"   ERROR: {response.json()['message']}")
except Exception as e:
    print(f"   ERROR: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE!")
print("=" * 60)
