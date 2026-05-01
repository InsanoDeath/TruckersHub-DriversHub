# 🚛 DriversHub

A modern, customizable **DriversHub system for VTCs (Virtual Trucking Companies)** built to integrate seamlessly with TruckersHub.
DriversHub provides a clean dashboard for drivers, real-time statistics, job tracking, and community engagement tools — all in one place for Euro Truck Simulator 2 and American Truck Simulator.

---

## 🌟 Overview

DriversHub is designed as a **plug-and-play web solution** that allows VTC owners to quickly deploy their own branded dashboard for drivers.

With built-in integrations like:

* TruckersHub API
* Discord authentication & logging
* Steam data support

…it acts as the **frontend layer** for your VTC ecosystem.

---

## ✨ Features

* 📊 Driver statistics & job tracking
* 🏆 Leaderboards & points system
* 🎨 Fully customizable branding (color, logo, VTC details)
* 🔐 Discord-based authentication
* 🔗 TruckersHub API integration
* 📡 Webhook support (logs & job updates)
* ⚙️ Auto configuration setup on first run
* 🧩 Extendable structure for future plugins

---

# 🚀 Getting Started with DriversHub

Follow these steps to start using DriversHub with your VTC.

---

## 📌 Prerequisites

Before running DriversHub, you must set up your VTC on TruckersHub and obtain your API key.

### Steps:

1. Go to: https://truckershub.in
2. Create or manage your VTC
3. Navigate to:
   **Integrations → API Tab**
   https://truckershub.in/integrations
4. Copy your **TruckersHub API Key**

👉 You will need this key during `.env` setup.

---

## 🔗 Connecting DriversHub to TruckersHub

To enable job tracking and logging, you must configure a webhook.

### Steps to Enable Job Logging:

1. Go to:
   **Integrations → Webhooks**
   https://truckershub.in/integrations

2. Create a new webhook with the following details:

* **Webhook URL:**

  ```
  YOUR_DRIVERSHUB_URL/api/delivery
  ```

  Example:

  ```
  http://localhost:3000/api/delivery
  ```

* **Event:**
  ✅ Select **"Job Delivered"**

---

## 📊 What This Does

Once configured:

* Every completed job will be sent to DriversHub
* Jobs will automatically:

  * Be logged into your system
  * Update driver statistics
  * Reflect in leaderboards
  * Trigger webhook logs (if configured)

---

## 📦 Installation

### Step 1: Install Dependencies

#### Windows:

```bash
install.bat
```

#### Manual:

```bash
npm install
```

---

### ▶️ Step 2: Run the Project

#### Windows:

```bash
run.bat
```

#### Manual:

```bash
node .
```

---

## ⚙️ First-Time Setup (Auto Configuration)

On the first run, DriversHub will **automatically prompt you** to generate:

* `config.json`
* `.env`

You will be asked a series of questions in the terminal. Once completed, these files will be created automatically.

---

## 🧾 config.json Setup

This file stores your **VTC configuration and system settings**.

### Example prompts:

* VTC main colour
* VTC logo URL
* Discord Server ID
* VTC name & short name
* TruckersMP VTC ID
* TruckersHub VTC ID
* Load previous jobs (yes/no)
* Points multiplier
* Admin user IDs
* DriversHub URL
* Port configuration

### Example structure:

```json
{
  "color": "#298cd8",
  "avatar": "https://static.truckershub.in/images/logo.png",
  "guildID": "123456789012345678",
  "vtcName": "My VTC",
  "vtcShortName": "MVTC",
  "vtcID": 12345,
  "truckersHubVTCID": 1,
  "previousJobs": true,
  "pointsMultiplier": 1,
  "admin": [1],
  "url": "http://localhost:3000/",
  "express": {
    "PORT": 3000,
    "callbackurl": "/redirect"
  }
}
```

---

## 🔐 .env Setup

This file contains **sensitive credentials and API keys**.

### Required values:

* TruckersHub API Key
* Steam API Key
* Discord Application credentials
* Discord Bot Token
* Webhooks for logging & jobs

### Example:

```env
truckershub=YOUR_TRUCKERSHUB_API_KEY
STEAM_API=YOUR_STEAM_API_KEY
clientID=YOUR_DISCORD_CLIENT_ID
clientSecret=YOUR_DISCORD_CLIENT_SECRET
TOKEN=YOUR_DISCORD_BOT_TOKEN
logwebhook=YOUR_LOG_WEBHOOK_URL
jobwebhook=YOUR_JOB_WEBHOOK_URL
```

---

## 🌐 Running the Project

Once setup is complete:

* The server will start automatically
* A URL will be displayed in the console (e.g., `http://localhost:3000`)
* Open it in your browser to access your DriversHub

---

## 🎨 Customization

You can customize your DriversHub via:

* `config.json` → branding, VTC identity, settings
* Frontend components → UI/UX changes
* Styles → colors, themes, layout

---

## 🔌 Integrations

DriversHub relies on:

* TruckersHub API for data & job tracking
* Discord for authentication & logging
* Steam API for user data

---

## 🛠️ Development Notes

* Built using Node.js
* Modular structure for scalability
* Designed to work as a **frontend layer over TruckersHub backend**
* Supports future plugin/extensions system

---

## ⚠️ Important Notes

* Ensure all API keys are valid before running
* Do not share your `.env` file publicly
* Keep sensitive credentials secure
* Restart the server after making config changes

---

## 🚀 Future Scope

* Plugin system for VTC-specific features
* Advanced analytics dashboard
* Event & convoy integration
* Real-time tracking enhancements

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit pull requests.

---

## 📜 License

This project is licensed under a custom TruckersHub License.  
See the LICENSE file for details.

---

## 💡 Final Note

DriversHub is built to make VTC management **simpler, smarter, and more engaging**.
Deploy it, customize it, and give your drivers the experience they deserve.

---
