#  Sports League Management System

A web based platform for managing sports leagues, teams, players, and match fixtures. This project was built with Flask, MySQL, and JavaScript.

Features

* **User Management** – Register and login users
* **Team Management** – Create and manage sports teams
* **Fixture Scheduling** – Schedule matches with venues and dates
* **Statistics Dashboard** – Track team and Scheduled matches
* **Contact System** – Receive inquiries through a contact form
* **Responsive UI** – Works on desktop and mobile devices


Technology used

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | HTML, CSS, JavaScript, Tailwind |
| Backend  | Python, Flask                   |
| Database | MySQL                           |
| APIs     | REST JSON                       |


How To Run The Application 

1. Clone The Github Repository


git clone https://github.com/marufuruvarashe/sports-league-management.git
cd sports-league-management


2. Setup Database

mysql -u root -p < database_setup.sql

Create `.env` file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=sports_league


3. Install Dependencies
        pip install -r requirements.txt

4. Run the Application
        python app.py


Open in browser:


http://localhost:5000


Project Structure


                sports-league-management/
                app.py
                database_setup.sql
                requirements.txt
                templates-          # HTML pages
                static-             # CSS & JS
                test_api.py         # API tests



 Main API Endpoints

| Method | Endpoint        | Description    |
| ------ | --------------- | -------------- |
| POST   | `/api/register` | Register user  |
| POST   | `/api/login`    | User login     |
| GET    | `/api/teams`    | List teams     |
| POST   | `/api/teams`    | Create team    |
| GET    | `/api/fixtures` | List fixtures  |
| POST   | `/api/fixtures` | Create fixture |
| POST   | `/api/contact`  | Send message   |
