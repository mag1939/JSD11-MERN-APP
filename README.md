# MERN STACK LEARNING REPO

Clone from: https://github.com/neetibut/jsd11-backend-express-app, https://github.com/neetibut/jsd-react-assessment-solution

Thank you K'Neeti

## My system architecture diagram

![system architecture diagram](./system-architecture-diagram.png)

---

## 🚀 How to Run This Project

โปรเจกต์นี้รองรับการรัน ทั้งหมดผ่าน **Docker**

---

### 📋 Prerequisites

1. **Git**: สำหรับ Clone Repository
2. **Docker Desktop**: ติดตั้งและเปิดใช้งานโปรแกรมให้เรียบร้อย (สถานะขึ้น *Engine Running*)
   * [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### ⚙️ Step-by-Step Setup

#### 1. Clone Repository
เปิด Terminal / PowerShell แล้วรันคำสั่งเพื่อดึงโค้ดลงเครื่อง:

```bash
git clone https://github.com/mag1939/JSD11-MERN-APP.git
cd JSD11-MERN-APP
```

---

#### 2. Configure Environment Variables
โปรเจกต์นี้แยกการตั้งค่า Environment Variables ออกเป็น 2 ส่วน (Backend และ Frontend):

##### **ฝั่ง Backend:**
ไปที่โฟลเดอร์ `jsd11-mag38-backend-express` แล้วคัดลอกไฟล์ `.env.example` เป็น `.env`

* **Windows (PowerShell):**
  ```powershell
  copy .\jsd11-mag38-backend-express\.env.example .\jsd11-mag38-backend-express\.env
  ```
* **Mac / Linux / Git Bash:**
  ```bash
  cp ./jsd11-mag38-backend-express/.env.example ./jsd11-mag38-backend-express/.env
  ```
> **หมายเหตุ:** อย่าลืมเปิดไฟล์ `.env` ที่สร้างขึ้นใหม่ เพื่อระบุค่า เพิ่มเติมของคุณเอง ให้ถูกต้อง 

##### **ฝั่ง Frontend:**
ไปที่โฟลเดอร์ `jsd11-mag38-frontend-react` แล้วคัดลอกไฟล์ `.env.example` เป็น `.env`

* **Windows (PowerShell):**
  ```powershell
  copy .\jsd11-mag38-frontend-react\.env.example .\jsd11-mag38-frontend-react\.env
  ```
* **Mac / Linux / Git Bash:**
  ```bash
  cp ./jsd11-mag38-frontend-react/.env.example ./jsd11-mag38-frontend-react/.env
  ```

---

#### 3. Start Application with Docker Compose
เปิด Terminal ที่ **Root Directory ของโปรเจกต์ (`JSD11-MERN-APP`)** แล้วสั่งรันคำสั่ง:

```bash
docker compose up --build
```

เมื่อ Container ทำงานเรียบร้อยแล้ว สามารถเข้าใช้งานผ่าน Web Browser ได้ที่:
* 🌐 **Frontend (React):** [http://localhost:5173](http://localhost:5173)
* ⚙️ **Backend API (Express):** [http://localhost:3000](http://localhost:3000)
