from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Create the app - serve static files from current directory
app = Flask(__name__)
CORS(app)

# Get database credentials from .env
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'adminroot')
DB_NAME = os.getenv('DB_NAME', 'sports_league')

# Database connection setup
def get_db():
    """Connect to MySQL database"""
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return connection
    except:
        # log exception to help debugging
        import traceback
        traceback.print_exc()
        return None

# ==========================================
# REGISTER NEW USER
# ==========================================

@app.route('/api/register', methods=['POST'])
def register_user():
    """Save a new user to database"""
    data = request.get_json()
    
    # Get form data
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role')
    
    # Connect to database
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'message': 'Email already exists'}), 400
    
    # Insert new user
    sql = "INSERT INTO users (name, email, phone, password, role, created_at) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (name, email, phone, password, role, datetime.now()))
    db.commit()
    
    user_id = cursor.lastrowid
    cursor.close()
    db.close()
    
    return jsonify({'message': 'User registered!', 'user_id': user_id}), 201

# ==========================================
# LOGIN USER
# ==========================================

@app.route('/api/login', methods=['POST'])
def login_user():
    """Check if user email and password are correct"""
    data = request.get_json()
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    # Validate inputs are not empty
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    if not password:
        return jsonify({'message': 'Password is required'}), 400
    
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor(dictionary=True)
    
    # Find user by email first
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    cursor.close()
    db.close()
    
    # Check if user exists and password matches exactly
    if user and user['password'] == password:
        return jsonify({'message': 'Login success!', 'user_id': user['id'], 'name': user['name']}), 200
    else:
        # Don't reveal if email exists or not (security best practice)
        return jsonify({'message': 'Email or password is incorrect'}), 401

# ==========================================
# CREATE TEAM
# ==========================================

@app.route('/api/teams', methods=['POST'])
def create_team():
    """Save a new team to database"""
    data = request.get_json()
    
    team_name = data.get('team_name')
    sport = data.get('sport')
    city = data.get('city')
    coach_name = data.get('coach_name', '')
    description = data.get('description', '')
    user_id = data.get('user_id')  # Can be None
    
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor()
    
    sql = "INSERT INTO teams (team_name, sport, city, coach_name, description, created_by, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (team_name, sport, city, coach_name, description, user_id, datetime.now()))
    db.commit()
    
    team_id = cursor.lastrowid
    cursor.close()
    db.close()
    
    return jsonify({'message': 'Team created!', 'team_id': team_id}), 201

# ==========================================
# GET ALL TEAMS
# ==========================================

@app.route('/api/teams', methods=['GET'])
def get_all_teams():
    """Get all teams from database"""
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM teams")
    teams = cursor.fetchall()
    
    cursor.close()
    db.close()
    
    return jsonify({'teams': teams}), 200

# ==========================================
# CREATE FIXTURE
# ==========================================

@app.route('/api/fixtures', methods=['POST'])
def create_fixture():
    """Save a new fixture to database"""
    data = request.get_json()
    
    home_team_id = data.get('home_team_id')
    away_team_id = data.get('away_team_id')
    fixture_date = data.get('fixture_date')
    venue = data.get('venue')
    sport = data.get('sport')
    user_id = data.get('user_id')  # Can be None
    
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor()
    
    sql = "INSERT INTO fixtures (home_team_id, away_team_id, fixture_date, venue, sport, status, created_by, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (home_team_id, away_team_id, fixture_date, venue, sport, 'scheduled', user_id, datetime.now()))
    db.commit()
    
    fixture_id = cursor.lastrowid
    cursor.close()
    db.close()
    
    return jsonify({'message': 'Fixture created!', 'fixture_id': fixture_id}), 201

# ==========================================
# GET ALL FIXTURES
# ==========================================

@app.route('/api/fixtures', methods=['GET'])
def get_all_fixtures():
    """Get all fixtures from database"""
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT f.*, 
               ht.team_name as home_team_name,
               at.team_name as away_team_name
        FROM fixtures f
        LEFT JOIN teams ht ON f.home_team_id = ht.id
        LEFT JOIN teams at ON f.away_team_id = at.id
    """)
    fixtures = cursor.fetchall()
    
    cursor.close()
    db.close()
    
    return jsonify({'fixtures': fixtures}), 200


# ==========================================
# SINGLE FIXTURE (GET / UPDATE / DELETE)
# ==========================================

@app.route('/api/fixtures/<int:fixture_id>', methods=['GET'])
def get_fixture(fixture_id):
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500

    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.*, 
               ht.team_name as home_team_name,
               at.team_name as away_team_name
        FROM fixtures f
        LEFT JOIN teams ht ON f.home_team_id = ht.id
        LEFT JOIN teams at ON f.away_team_id = at.id
        WHERE f.id = %s
    """, (fixture_id,))
    fixture = cursor.fetchone()
    cursor.close()
    db.close()

    if fixture:
        return jsonify({'fixture': fixture}), 200
    else:
        return jsonify({'message': 'Fixture not found'}), 404


@app.route('/api/fixtures/<int:fixture_id>', methods=['PUT'])
def update_fixture(fixture_id):
    data = request.get_json()
    home_team_id = data.get('home_team_id')
    away_team_id = data.get('away_team_id')
    fixture_date = data.get('fixture_date')
    venue = data.get('venue')
    sport = data.get('sport')
    status = data.get('status', 'scheduled')

    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500

    cursor = db.cursor()
    sql = """
        UPDATE fixtures SET home_team_id=%s, away_team_id=%s, fixture_date=%s,
        venue=%s, sport=%s, status=%s, updated_at=%s WHERE id=%s
    """
    cursor.execute(sql, (home_team_id, away_team_id, fixture_date, venue, sport, status, datetime.now(), fixture_id))
    db.commit()
    cursor.close()
    db.close()

    return jsonify({'message': 'Fixture updated!'}), 200


@app.route('/api/fixtures/<int:fixture_id>', methods=['DELETE'])
def delete_fixture(fixture_id):
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500

    cursor = db.cursor()
    cursor.execute("DELETE FROM fixtures WHERE id = %s", (fixture_id,))
    db.commit()
    affected = cursor.rowcount
    cursor.close()
    db.close()

    if affected:
        return jsonify({'message': 'Fixture deleted'}), 200
    else:
        return jsonify({'message': 'Fixture not found'}), 404

# ==========================================
# SAVE CONTACT MESSAGE
# ==========================================

@app.route('/api/contact', methods=['POST'])
def save_contact():
    """Save contact form message to database"""
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '')
    subject = data.get('subject', '')
    message = data.get('message')
    
    db = get_db()
    if db is None:
        return jsonify({'message': 'Database error'}), 500
    
    cursor = db.cursor()
    
    sql = "INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (name, email, phone, subject, message, datetime.now()))
    db.commit()
    
    cursor.close()
    db.close()
    
    return jsonify({'message': 'Message sent!'}), 201

# ==========================================
# LOGOUT USER (optional - for tracking)
# ==========================================

@app.route('/api/logout', methods=['POST'])
def logout_user():
    """Log user logout (session tracking only)"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    # Optional: Log logout event to database if needed in future
    # For now, just confirm logout
    return jsonify({'message': 'Logged out successfully'}), 200


# ==========================================
# CHECK IF DATABASE IS CONNECTED
# ==========================================

@app.route('/api/health', methods=['GET'])
def check_health():
    """Check if database is working"""
    db = get_db()
    
    if db:
        db.close()
        return jsonify({'status': 'OK', 'database': 'connected'}), 200
    else:
        return jsonify({'status': 'ERROR', 'database': 'disconnected'}), 500

# ==========================================
# SERVE HTML PAGES
# ==========================================

@app.route('/')
def home():
    """Serve index.html"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (HTML, CSS, JS)"""
    try:
        return send_from_directory('.', filename)
    except:
        return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# ==========================================
# START THE APP
# ==========================================