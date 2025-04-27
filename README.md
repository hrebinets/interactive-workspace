# 🚀 Interactive Workspace & Bitcoin Transactions Tracker

A small interactive project with two parts:
- A **Workspace** where you can drag, resize, and manage blocks dynamically.
- A **Real-time Bitcoin Transactions Tracker** using the [Blockchain WebSocket API](https://www.blockchain.com/api/api_websocket).

---

## 🔥 Technologies Used

- **Next.js** (v15)
- **TypeScript**
- **Tailwind CSS**
- **react-rnd** (dragging and resizing blocks)
- **WebSocket API** (`wss://ws.blockchain.info/inv`)

---

## 🚀 Features

### Workspace (Interactive Blocks)
- Drag and resize multiple blocks on the screen.
- Dynamic Z-index management — bring blocks to front on click.
- Save workspace state to **localStorage**.
- Reset workspace to default blocks.
- Smooth UI animations and modern design.

### Bitcoin Transactions Tracker
- Displays a live list of incoming Bitcoin transactions.
- Shows the total sum of received transactions.
- Control buttons:
  - **Start** — subscribe to new transactions.
  - **Stop** — unsubscribe while keeping the list.
  - **Reset** — clear the list and reset total.

---

## ⚙️ How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/hrebinets/interactive-workspace.git
```
3. Navigate to the project directory:
```bash
cd interactive-workspace
```
5. Install dependencies:
```bash
npm install
```
7. Start the development server:
```bash
-npm run dev
```

The app will be available at: http://localhost:3000

