# 🌙 DreamWeaver

**DreamWeaver** is a creative AI-powered web app that transforms simple prompts into surreal, imaginative stories — or as we like to call them, *dreams*.  
Built with **Node.js, Express, MySQL**, and **Google Gemini API**, it lets users explore different story types like dreamy, horror, fantasy, mystery, and more.

---

## ✨ Features

- 🧠 **AI Story Generation** — Turn a few words into full short stories using Google’s Gemini API (free tier supported).  
- 💬 **Multiple Story Types** — Choose from **Dreamy, Horror, Fantasy, Mystery, Sci-Fi, Romance, Adventure, Mythical, Historical, Comedy, Thriller, Inspirational** and more.  
- ⏱️ **Smart Length Detection** — Include words like *short*, *medium*, *long* to control story size.  
- 💾 **MySQL Storage** — Every generated story is saved and retrievable from a database.  
- 🌈 **Glassmorphism UI** — Clean, dreamy interface using HTML, CSS, and Vanilla JS.  
- 💡 **Recent Dreams List** — View recent stories (from session + database).  
- ⚡ **Free-Tier Friendly** — Designed to work smoothly with Gemini’s free model (`gemini-2.0-flash`).  

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js + Express |
| **Database** | MySQL |
| **AI Model** | Google Gemini API |
| **Version Control** | Git + GitHub |

---

## 🚀 Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rutujayadav72/dreamweaver.git
cd dreamweaver

```

### 2. Install Dependencies
```bash
npm intall

```
### 3. Set Up Environment Variables

```dotenv.

PORT=3000

DB_HOST=localhost
DB_USER=mysql_user
DB_PASS=mysql_password
DB_NAME=dreamweaver
GEMINI_API_KEY=Your_API_KEY


```
### 4. Set Up the MySQL Database

```sql

CREATE DATABASE dreamweaver;
USE dreamweaver;
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prompt VARCHAR(255),
  story TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
### 6. Start the Server
 ```bash
 npm start

```
## 🗂️ Project Structure

```plaintext
DREAMWAVER/
├── public/
│ ├── html/
│ ├── css/
│ ├── js/
│
│ ├── .env
│
│ ├──db.js
│
│ ├──package.json
│
│ ├──server.js
│

```
## How to use

Select story type: horror story. Prompt:cat and dog friendship (like these prompts)
---

