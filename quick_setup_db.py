import mysql.connector
from mysql.connector import errorcode
import time
import sys

# Try passwords in order
PASSWORDS = ['adminroot', 'root', '']

# SQL commands to create database and tables
SQL_COMMANDS = [
    "CREATE DATABASE IF NOT EXISTS sports_league;",
    "USE sports_league;",
    """CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('player', 'coach', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
    );""",
    """CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_name VARCHAR(100) NOT NULL,
        sport VARCHAR(50) NOT NULL,
        city VARCHAR(50),
        coach_name VARCHAR(100),
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id),
        INDEX idx_sport (sport)
    );""",
    """CREATE TABLE IF NOT EXISTS fixtures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        home_team_id INT NOT NULL,
        away_team_id INT NOT NULL,
        fixture_date DATETIME NOT NULL,
        venue VARCHAR(150),
        sport VARCHAR(50),
        status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
        home_team_score INT DEFAULT NULL,
        away_team_score INT DEFAULT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (home_team_id) REFERENCES teams(id),
        FOREIGN KEY (away_team_id) REFERENCES teams(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        INDEX idx_fixture_date (fixture_date),
        INDEX idx_status (status)
    );""",
    """CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        team_id INT NOT NULL,
        jersey_number INT,
        position VARCHAR(50),
        height DECIMAL(5, 2),
        weight DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        INDEX idx_team_id (team_id)
    );""",
    """CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status)
    );""",
    """CREATE TABLE IF NOT EXISTS team_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id INT NOT NULL,
        matches_played INT DEFAULT 0,
        matches_won INT DEFAULT 0,
        matches_lost INT DEFAULT 0,
        matches_drawn INT DEFAULT 0,
        goals_for INT DEFAULT 0,
        goals_against INT DEFAULT 0,
        points INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id),
        UNIQUE KEY unique_team (team_id)
    );""",
    """CREATE TABLE IF NOT EXISTS player_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player_id INT NOT NULL,
        matches_played INT DEFAULT 0,
        goals_scored INT DEFAULT 0,
        assists INT DEFAULT 0,
        yellow_cards INT DEFAULT 0,
        red_cards INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE KEY unique_player (player_id)
    );"""
]

def setup_database():
    """Create database and tables"""
    print("=" * 60)
    print("SPORTS LEAGUE DATABASE SETUP")
    print("=" * 60)
    
    connection = None
    password_used = None
    
    # Try to connect with each password
    for pwd in PASSWORDS:
        try:
            print(f"\n[1/2] Trying to connect with password: '{pwd}'...")
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password=pwd
            )
            password_used = pwd
            print(f"✓ Connected to MySQL")
            break
        except:
            continue
    
    if not connection:
        print("\n✗ Could not connect to MySQL with any password")
        print("   Please check MySQL is running and credentials are correct")
        return False
    
    try:
        print(f"\n[2/2] Creating database and tables...")
        cursor = connection.cursor()
        
        for i, command in enumerate(SQL_COMMANDS, 1):
            try:
                cursor.execute(command)
                if i == 1:
                    print(f"  ✓ Created database: sports_league")
                elif i == 2:
                    pass  # USE database statement
                elif i <= 5:
                    table_name = ['users', 'teams', 'fixtures'][i-3]
                    print(f"  ✓ Created table: {table_name}")
                elif i <= 7:
                    table_name = ['players', 'contact_messages'][i-6]
                    print(f"  ✓ Created table: {table_name}")
                else:
                    table_name = ['team_statistics', 'player_statistics'][i-8]
                    print(f"  ✓ Created table: {table_name}")
            except mysql.connector.Error as err:
                if "already exists" in str(err):
                    pass  # Table already exists, that's fine
                else:
                    print(f"  ✗ Error: {err}")
        
        connection.commit()
        cursor.close()
        
        print("\n" + "=" * 60)
        print("SUCCESS!")
        print("=" * 60)
        print(f"\nDatabase Setup Complete:")
        print(f"  Host: localhost")
        print(f"  User: root")
        print(f"  Password: {password_used}")
        print(f"  Database: sports_league")
        print(f"\nTables created:")
        print(f"  - users")
        print(f"  - teams")
        print(f"  - fixtures")
        print(f"  - players")
        print(f"  - contact_messages")
        print(f"  - team_statistics")
        print(f"  - player_statistics")
        print("\nNow run: python app.py")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\nError creating tables: {e}")
        return False
        
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
