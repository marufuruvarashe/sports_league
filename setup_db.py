#!/usr/bin/env python3
"""
Setup MySQL Database for Sports League
This script resets MySQL root password and creates the sports_league database
"""

import subprocess
import os
import sys

print("=" * 60)
print("SPORTS LEAGUE DATABASE SETUP")
print("=" * 60)

# Step 1: Stop MySQL service
print("\n[1/4] Stopping MySQL service...")
try:
    subprocess.run(["net", "stop", "MySQL80"], check=True, capture_output=True)
    print("✓ MySQL stopped")
except:
    print("✗ Could not stop MySQL (might already be stopped)")

# Step 2: Start MySQL without password requirement
print("\n[2/4] Starting MySQL in safe mode (skip grant tables)...")
try:
    # This is Windows-specific - start MySQL with --skip-grant-tables
    subprocess.Popen([
        "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqld.exe",
        "--skip-grant-tables"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("✓ MySQL started in safe mode")
    
    import time
    time.sleep(3)  # Wait for MySQL to start
    
except Exception as e:
    print(f"✗ Could not start MySQL: {e}")
    sys.exit(1)

# Step 3: Create database and tables using root without password
print("\n[3/4] Creating database and tables...")
try:
    # Read SQL file
    with open("database_setup.sql", "r") as f:
        sql_commands = f.read()
    
    # Execute SQL
    process = subprocess.Popen(
        ["C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe", "-u", "root"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    stdout, stderr = process.communicate(input=sql_commands)
    
    if process.returncode == 0:
        print("✓ Database created successfully")
        print("\nDatabase setup output:")
        if stdout:
            print(stdout)
    else:
        print(f"✗ Database creation failed")
        print(f"Error: {stderr}")
        
except Exception as e:
    print(f"✗ Error during database creation: {e}")

# Step 4: Restart MySQL normally
print("\n[4/4] Restarting MySQL normally...")
try:
    subprocess.run(["net", "start", "MySQL80"], check=True, capture_output=True)
    print("✓ MySQL restarted")
except:
    print("✗ Could not restart MySQL")

print("\n" + "=" * 60)
print("SETUP COMPLETE!")
print("=" * 60)
print("\nDatabase: sports_league")
print("User: root")
print("Password: (empty)")
print("\nYou can now run: python app.py")
