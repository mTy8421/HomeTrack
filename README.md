# 🏡 HomeTrack — Home Maintenance & Asset Tracker

> **ระบบจัดการบ้าน รถยนต์ และทรัพย์สินภายในบ้านแบบครบวงจร**  
> ติดตามประวัติการดูแลรักษา แจ้งเตือนรอบบำรุงรักษา จัดเก็บเอกสารสำคัญ และควบคุมค่าใช้จ่ายทั้งหมดของครอบครัวในระบบเดียว

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-slate?style=flat-square)](#)

---

## 📖 สารบัญ (Table of Contents)

- [จุดเด่นและปัญหาที่แก้ไข (Overview & Problem Solved)](#-จุดเด่นและปัญหาที่แก้ไข-overview--problem-solved)
- [ฟีเจอร์หลัก (Key Features)](#-ฟีเจอร์หลัก-key-features)
- [โครงสร้างโฟลเดอร์ (Project Structure)](#-โครงสร้างโฟลเดอร์-project-structure)
- [เทคโนโลยีที่ใช้ (Tech Stack)](#-เทคโนโลยีที่ใช้-tech-stack)
- [การติดตั้งและเริ่มต้นใช้งาน (Getting Started)](#-การติดตั้งและเริ่มต้นใช้งาน-getting-started)
- [ข้อมูลตัวอย่างและการสำรองข้อมูล (Demo Data & Backup)](#-ข้อมูลตัวอย่างและการสำรองข้อมูล-demo-data--backup)
- [คำสั่งสคริปต์ในโครงการ (Available Scripts)](#-คำสั่งสคริปต์ในโครงการ-available-scripts)

---

## 💡 จุดเด่นและปัญหาที่แก้ไข (Overview & Problem Solved)

เจ้าของบ้านและครอบครัวส่วนใหญ่มักประสบปัญหา:
- **ลืมรอบการดูแลรักษา:** เช่น ลืมล้างแอร์ตามรอบ 6 เดือน, ลืมเปลี่ยนไส้กรองน้ำดื่ม หรือปล่อยให้งานเลยกำหนดจนเครื่องใช้ไฟฟ้าชำรุด
- **ลืมต่อประกันและภาษี:** ไม่รู้ว่าประกันเครื่องใช้ไฟฟ้าหมดเมื่อไหร่, ลืมต่อภาษีรถยนต์หรือ พ.ร.บ. ประจำปี
- **เอกสารและใบเสร็จกระจัดกระจาย:** หาใบเสร็จหรือใบรับประกันไม่เจอเมื่อต้องการเคลมสินค้า
- **ค่าใช้จ่ายสะสมไม่ชัดเจน:** ไม่ทราบยอดค่าใช้จ่ายที่แท้จริงของการซ่อมแซมและบำรุงรักษาบ้านและรถในแต่ละปี

**HomeTrack** รวมศูนย์ข้อมูลทรัพย์สินทั้งหมด จัดการรอบการดูแลรักษาล่วงหน้า แจ้งเตือนอัจฉริยะ และแสดงรายงานค่าใช้จ่ายแบบเรียลไทม์

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 1. 🏠 จัดการทรัพย์สิน (Asset Management)
* บันทึกรายการทรัพย์สินได้ทุกประเภท (บ้าน, รถยนต์, แอร์, ตู้เย็น, เครื่องซักผ้า, ทีวี, เครื่องทำน้ำอุ่น ฯลฯ)
* จัดเก็บสเปก รุ่น (Model), หมายเลขเครื่อง (Serial Number), วันที่ซื้อ, ราคา, ร้านค้า และสถานที่ติดตั้ง
* กรองตามหมวดหมู่ (Category Filter) พร้อมค้นหาและดูรายละเอียดรายชิ้น

### 2. 🚗 ระบบ Dual-Trigger Maintenance สำหรับยานพาหนะ
* รถยนต์มีเงื่อนไขการตรวจเช็กแบบ **Dual-Trigger** (คำนวณทั้ง **ระยะเวลา** หรือ **เลขไมล์กิโลเมตร** เงื่อนไขใดถึงก่อนระบบจะแจ้งเตือนทันที)
* บันทึกและอัปเดตเลขไมล์ปัจจุบัน พร้อมแสดงระยะทางคงเหลือก่อนถึงรอบเช็กระยะถัดไป

### 3. 🛠️ บันทึกและวางแผนงานบำรุงรักษา (Maintenance Tracking)
* วางแผนงานล่วงหน้า พร้อมระบบรอบอัตโนมัติ (Recurring Schedule: รายเดือน, ราย 6 เดือน, รายปี)
* จัดลำดับความสำคัญ (Priority: Urgent, High, Medium, Low)
* ฟังก์ชัน **"บันทึกทำเสร็จ" (Complete Task)** พร้อมระบุค่าใช้จ่ายจริง ร้านค้า/ช่างที่ให้บริการ อะไหล่ที่เปลี่ยน และคำนวณรอบถัดไปให้อัตโนมัติ

### 4. 🛡️ ติดตามการรับประกันและกรมธรรม์ (Warranty & Insurance)
* ติดตามวันหมดอายุประกันตัวเครื่อง (Warranty), ประกันภัยบ้าน/รถ (Insurance), ภาษี และ พ.ร.บ.
* คำนวณสถานะอัตโนมัติ: **ใช้งานได้ (Active)**, **ใกล้หมดอายุใน 30 วัน (Expiring Soon)**, หรือ **หมดอายุแล้ว (Expired)**
* จัดเก็บเลขที่กรมธรรม์ บริษัทประกันภัย และช่องทางติดต่อฉุกเฉิน

### 5. 📊 สรุปและวิเคราะห์ค่าใช้จ่าย (Expense Analytics)
* **กราฟแท่งรายเดือน (Monthly Bar Chart):** เปรียบเทียบค่าใช้จ่าย 10 เดือนในปี 2026 พร้อมไฮไลต์เดือนปัจจุบัน และเดือนที่มียอดสูงเป็นพิเศษ
* **สัดส่วนแยกตามหมวดหมู่ (Category Breakdown):** แสดงเปอร์เซ็นต์ค่าซ่อม, ค่าบำรุงรักษา, ค่าอะไหล่, ประกันภัย, และค่าน้ำมัน
* **สัดส่วนแยกตามทรัพย์สิน (Asset Breakdown):** ติดตามว่าทรัพย์สินชิ้นใดมีค่าใช้จ่ายสะสมสูงสุด
* บันทึกค่าใช้จ่ายใหม่ได้สะดวกรวดเร็ว พร้อมเชื่อมโยงกับใบเสร็จ

### 6. 📁 คลังเอกสารและใบเสร็จดิจิทัล (Digital Document Vault)
* จัดเก็บคู่มือการใช้งาน (Manual), ใบรับประกัน (Warranty Card), ใบเสร็จ (Receipt), และเอกสารตรวจสภาพ
* แนบไฟล์และเปิดดูเอกสารได้โดยตรง
* เชื่อมโยงเอกสารเข้ากับรายการทรัพย์สินและรายการค่าใช้จ่าย

### 7. 📅 ปฏิทินรอบงาน (Maintenance Calendar)
* แสดงกำหนดการดูแลรักษาในรูปแบบปฏิทินรายเดือน
* แยกประเภทงานด้วยสีและไอคอนเพื่อให้ดูง่าย
* คลิกดูรายละเอียดงานที่ต้องทำในแต่ละวันได้ทันที

### 8. 🔔 ศูนย์การแจ้งเตือนอัจฉริยะ (Smart Notification Center)
* ตรวจสอบสถานะอัตโนมัติ: งานเลยกำหนด (Overdue), งานที่ต้องทำใน 14 วัน (Due Soon), และประกันใกล้หมดอายุ
* มีปุ่ม Action ลิงก์ตรงไปยังรายการที่เกี่ยวข้องทันที
* ทำเครื่องหมายอ่านแล้ว หรือลบการแจ้งเตือนได้

### 9. 🔍 ระบบค้นหาด่วนทั่วทั้งแอป (Global Search)
* กดปุ่มลัด `Ctrl + K` หรือ `Cmd + K` ได้จากทุกหน้า
* ค้นหาครอบคลุมทุกข้อมูล ทั้งชื่อทรัพย์สิน, งานบำรุงรักษา, เอกสาร และรายการค่าใช้จ่าย

### 10. 🌓 โหมดสว่าง/มืด & ออกแบบสำหรับมือถือ (Dark Mode & Responsive)
* สลับโหมด Light Mode / Dark Mode ได้อย่างราบรื่น
* รองรับหน้าจอทุกขนาด ทั้งมือถือ (Bottom Navigation Bar), แท็บเล็ต และเดสก์ท็อป (Sidebar Menu)

---

## 📁 โครงสร้างโฟลเดอร์ (Project Structure)

```text
asset/
├── app/                            # Next.js App Router Pages
│   ├── layout.tsx                  # Root Layout พร้อม Geist Font & AppProvider
│   ├── page.tsx                    # หน้า Dashboard ภาพรวม
│   ├── assets/                     # รายการทรัพย์สิน และหน้ารายละเอียด [id]
│   ├── maintenance/                # รายการงานบำรุงรักษาและประวัติ
│   ├── warranty/                   # รายการรับประกันและประกันภัย
│   ├── expenses/                   # บันทึกค่าใช้จ่ายและตารางสรุป
│   ├── documents/                  # คลังจัดเก็บเอกสาร
│   ├── calendar/                   # ปฏิทินงานบำรุงรักษา
│   ├── notifications/              # ศูนย์รวมการแจ้งเตือน
│   ├── settings/                   # ตั้งค่าระบบ, ธีม, และสำรองข้อมูล
│   └── login/                      # หน้าสลับผู้ใช้งาน
├── components/                     # React UI Components
│   ├── dashboard/                  # ExpenseCharts, SummaryCards, UpcomingTasks, MyAssetsPreview
│   ├── layout/                     # AppLayout, Navbar, Sidebar, MobileNav, QuickActionModal
│   ├── assets/                     # AssetFormModal
│   ├── maintenance/                # MaintenanceFormModal, CompleteMaintenanceModal
│   ├── expenses/                   # ExpenseFormModal
│   ├── documents/                  # DocumentUploadModal
│   ├── search/                     # GlobalSearchModal
│   └── ui/                         # Badge, Button, FormField, Toast, ConfirmDialog, EmptyState
├── context/
│   └── AppContext.tsx              # Global State Management (React Context)
├── lib/
│   ├── constants.ts                # ค่าคงที่, หมวดหมู่, วันที่อ้างอิง, ฟังก์ชันจัดรูปแบบ
│   ├── storage.ts                  # LocalStorage Handler, คำนวณสถานะงานและวันครบกำหนด
│   └── seedData.ts                 # ข้อมูลเริ่มต้นจำลอง (Demo Seed Data)
├── types/
│   └── index.ts                    # TypeScript Type Definitions ทั้งหมด
├── public/                         # Static Assets
├── package.json                    # Dependencies และ Scripts
└── README.md                       # เอกสารแนะนำโครงการ
```

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนประกอบ | เทคโนโลยี | รายละเอียด |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | เซิร์ฟเวอร์และไคลเอ็นต์คอมโพเนนต์ประสิทธิภาพสูง |
| **UI Library** | [React 19](https://react.dev/) | เวอร์ชันล่าสุด รองรับ Hooks และ State Management สมบูรณ์ |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type Safety ครอบคลุมทั้งโปรเจกต์ |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Universal Design System, CSS Variables, Responsive & Dark Mode |
| **Icons** | [Lucide React](https://lucide.dev/) | ชุดไอคอน UI ที่ทันสมัยและคมชัด |
| **Storage** | LocalStorage | จัดเก็บข้อมูลฝั่งเบราว์เซอร์ พร้อมระบบ Export/Import JSON |

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) เวอร์ชัน 18.18 ขึ้นไป (แนะนำ v20+)
- npm หรือ pnpm หรือ yarn

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000) เพื่อเข้าใช้งานระบบ

### 3. บิลด์สำหรับ Production
```bash
npm run build
npm run start
```

---

## 💾 ข้อมูลตัวอย่างและการสำรองข้อมูล (Demo Data & Backup)

ระบบมาพร้อมข้อมูลตัวอย่าง (Demo Data) ที่ครอบคลุมสถานการณ์จริง:
- **ทรัพย์สิน 8 รายการ:** บ้านเดี่ยว 2 ชั้น, Toyota Camry 2.5, แอร์ Daikin 2 ตัว, ตู้เย็น Samsung, เครื่องซักผ้า LG, เครื่องทำน้ำอุ่น Panasonic, ทีวี Sony OLED
- **สถานะหลากหลาย:**
  - ⚠️ งานเลยกำหนด (Overdue) เพื่อทดสอบแจ้งเตือน
  - ⏰ งานใกล้ถึงกำหนดใน 7-14 วัน (Upcoming)
  - 🚗 งานเช็กระยะรถยนต์ที่มีเงื่อนไขทั้ง วันที่ และ เลขกิโลเมตร (Dual-Trigger)
  - 🛡️ ประกันภัยที่ใกล้หมดอายุใน 30 วัน

### การสำรองและกู้คืนข้อมูล (หน้า Settings):
1. **ส่งออกข้อมูล (Export Data):** บันทึกข้อมูลทั้งหมดเป็นไฟล์ JSON เพื่อสำรองไว้
2. **นำเข้าข้อมูล (Import Data):** นำเข้าไฟล์ JSON เพื่อกู้คืนข้อมูล
3. **รีเซ็ตเป็นข้อมูลตัวอย่าง (Reset to Demo):** สามารถกดรีเซ็ตกลับเป็นข้อมูลตัวอย่างเริ่มต้นได้ตลอดเวลา

---

## 📜 คำสั่งสคริปต์ในโครงการ (Available Scripts)

- `npm run dev`: เริ่มต้นรัน Development Server
- `npm run build`: คอมไพล์โปรเจกต์สำหรับขึ้น Production
- `npm run start`: รัน Production Server หลังจากบิลด์เสร็จ
- `npm run lint`: ตรวจสอบความถูกต้องของโค้ดด้วย ESLint
