# Playwright + Gherkin (BDD) Test Automation — Scaffold

โปรเจกต์ตัวอย่างสำหรับทำ Test Automation ด้วย Playwright โดยเขียน logic เป็น Gherkin (BDD)
พัฒนาผ่าน VS Code และใช้ AI ช่วยเขียน step/page object ต่อได้เลย

## โครงสร้างโฟลเดอร์

```
pw-bdd-automation/
├── features/              # ไฟล์ .feature เขียน Gherkin (Given/When/Then)
│   └── example.feature
├── steps/                 # Step definitions — โค้ดที่ผูกกับแต่ละบรรทัดใน .feature
│   └── example.steps.js
├── pages/                 # Page Object Model — เก็บ selector/action ของแต่ละหน้า
│   └── SearchPage.js
├── .vscode/
│   ├── extensions.json    # extension ที่แนะนำให้ลงใน VS Code
│   └── settings.json      # บอก Cucumber extension ว่า feature/step อยู่ไหน
├── playwright.config.js   # ตั้งค่า Playwright + playwright-bdd (baseURL, browser, report)
├── package.json
└── .gitignore
```

หมวดที่ "จำเป็นต้องมี" คือ `features/`, `steps/`, `playwright.config.js` — ส่วน `pages/`
เป็น pattern แนะนำ (Page Object Model) เพื่อไม่ให้ selector ปนอยู่ใน step ตรงๆ ทำให้ AI/คนช่วยแก้ทีหลังง่ายขึ้น

## วิธี import เข้า VS Code

1. แตก zip แล้วเปิดโฟลเดอร์ `pw-bdd-automation` ด้วย VS Code (File → Open Folder)
2. เปิด terminal ใน VS Code แล้วรัน:
   ```
   npm install
   npx playwright install
   ```
3. ติดตั้ง extension ที่แนะนำ (VS Code จะเด้ง prompt ให้เองจาก `.vscode/extensions.json`)
   - **Playwright Test for VSCode** — รัน/debug test ทีละบรรทัดได้จาก editor
   - **Cucumber (Gherkin) Full Support** — syntax highlight, autocomplete ใน .feature
   - Copilot/AI extension ตัวไหนก็ได้ที่ใช้อยู่

## วิธีรันเทส

```
npm test              # generate step จาก .feature แล้วรันทุก scenario
npm run test:headed   # รันแบบเห็นเบราว์เซอร์จริง
npm run test:ui       # เปิด Playwright UI mode (แนะนำตอนพัฒนา/debug)
npm run report        # ดูรายงานผลหลังรันเสร็จ
```

ตั้งค่า URL ของระบบที่จะเทสได้ที่ `playwright.config.js` (ตัวแปร `use.baseURL`)
หรือรันแบบ override ได้ เช่น `BASE_URL=https://your-site.com npm test`

## ขั้นตอนถัดไปเมื่อได้ URL ระบบจริงแล้ว

1. แก้ `baseURL` ใน `playwright.config.js`
2. เขียน `.feature` ใหม่ใน `features/` อธิบาย scenario เป็นภาษาคน (Given/When/Then)
3. ให้ AI (ผม หรือ Copilot ใน VS Code) ช่วย generate step definitions ใน `steps/`
   และ Page Object ใน `pages/` จาก DOM จริงของเว็บ — ใช้ `npm run codegen` เพื่อเปิด
   Playwright Inspector บันทึก selector จากการคลิกจริงบนเว็บ แล้วเอามาปรับเป็น POM ได้
4. รันซ้ำด้วย `npm run test:ui` เพื่อ debug ทีละ step

## ไฟล์ตัวอย่างที่ให้มา

`example.feature` / `example.steps.js` / `SearchPage.js` เป็นตัวอย่างเทสค้นหา (ใช้กับเว็บ
search ทั่วไป) ไว้ให้ดู pattern การเขียน — ลบทิ้งแล้วแทนที่ด้วย feature จริงของระบบคุณได้เลย
