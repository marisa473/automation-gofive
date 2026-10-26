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

## เทสหน้าลงทะเบียน empeo (`features/registerEmpeo.feature`)

ทดสอบ https://portal.uat.gofive.co.th/Register/empeo — ลงทะเบียนสำเร็จ, OTP, โค้ดโปรโมชัน, ช่องบังคับกรอก, edge case เบอร์/อีเมล/บริษัท และหน้าตั้งรหัสผ่าน

```
npm test -- --tags "@registerEmpeo"                        # ทั้งหมด
npm test -- --tags "@registerEmpeo and not @knownBug"      # ไม่รวมเคสที่เป็น bug ที่รู้แล้ว
npm run test:headed -- --tags "@sendsOtp"                  # เฉพาะเคสที่ส่ง OTP แบบเห็นเบราว์เซอร์
npm test -- --tags "@smoke"                                # ลงทะเบียนสำเร็จ end-to-end
```

รันทีละเคสด้วยรหัส scenario: `npm run test:headed -- --tags "@SC-GF-01"` หรือหลายเคส `--tags "@SC-GF-01 or @SC-GF-14"`

| รหัส | Scenario | ส่ง OTP |
|---|---|---|
| SC-GF-01 | ลงทะเบียนสำเร็จพร้อมโค้ด FREE15DAY | ✔ |
| SC-GF-02 | ลงทะเบียนสำเร็จโดยไม่ใช้โค้ด | ✔ |
| SC-GF-03 | หน้าต่าง OTP แสดงเบอร์ปิดบัง / ref / นับถอยหลัง | ✔ |
| SC-GF-04 | ปุ่มยืนยัน OTP กดไม่ได้จนครบ 6 หลัก, ไม่รับตัวอักษร | ✔ |
| SC-GF-05 | กรอก OTP ผิด | ✔ |
| SC-GF-06 | ส่ง OTP ใหม่ ได้ ref ใหม่ | ✔ |
| SC-GF-07 | ส่ง OTP ใหม่แล้วลงทะเบียนต่อจนสำเร็จ (intermittent bug) | ✔ |
| SC-GF-08 | OTP หมดอายุ (ต้องตั้ง `OTP_EXPIRE_SECONDS`) | ✔ |
| SC-GF-09 | โค้ดส่วนลดถูกต้อง (FREE15DAY / free15day) | |
| SC-GF-10 | โค้ดส่วนลดไม่ถูกต้อง | |
| SC-GF-11 | โค้ดมีช่องว่างหน้า-หลัง | |
| SC-GF-12 | ลบโค้ดแล้วใช้โค้ดเดิมซ้ำ | |
| SC-GF-13 | ใช้โค้ดซ้ำกับการลงทะเบียนครั้งที่ 2 | ✔ |
| SC-GF-14 | ไม่กรอกอะไรเลย แจ้ง error ทุกช่องบังคับ | |
| SC-GF-15 | กรอกครบแต่ไม่ติ๊กยอมรับเงื่อนไข (known bug) | |
| SC-GF-16 | error หายเมื่อกรอกแล้ว | |
| SC-GF-17 | ชื่อเป็นช่องว่างล้วน (known bug) | |
| SC-GF-18 | เบอร์มือถือไม่ถูกต้อง 5 แบบ | |
| SC-GF-19 | เบอร์มือถือรูปแบบที่ยอมรับ | |
| SC-GF-20 | อีเมลรูปแบบไม่ถูกต้อง | |
| SC-GF-21 | โดเมนอีเมลมีบัญชีแล้ว | |
| SC-GF-22 | บริษัทไทยที่มีบัญชีแล้ว | |
| SC-GF-23 | เลือก "อื่นๆ" แต่ไม่กรอกชื่อบริษัท | |
| SC-GF-24 | รหัสผ่านไม่ตรงกัน | ✔ |
| SC-GF-25 | รหัสผ่านไม่ผ่านเงื่อนไข | ✔ |

`--tags` ใช้ tag expression แบบ Cucumber (`and` / `or` / `not`) และส่งไปให้ `bddgen` ส่วน option อื่น
(`--workers`, `--list`, `--project` ฯลฯ) ส่งต่อให้ `playwright test` ผ่าน [scripts/run-tests.js](scripts/run-tests.js)

- scenario ที่ส่ง OTP จริงติด tag `@sendsOtp` และรันใน project `chromium-otp` ทีละตัว (workers: 1)
  เพราะใช้เบอร์ทดสอบเดียวกัน ถ้ารันพร้อมกัน OTP จะชนกันจนยืนยันไม่ผ่าน
- ทุกครั้งที่รัน `@sendsOtp` จะสร้างบัญชีจริงใน UAT และส่ง SMS ไปเบอร์ 0967690708
- อีเมลถูกเช็คซ้ำระดับโดเมน จึงสุ่มโดเมนใหม่ทุกครั้ง (`genUniqueDomainEmail`)
- env ที่ปรับได้: `REGISTER_URL`, `TEST_OTP` (default 123456), `OTP_EXPIRE_SECONDS` (เปิดเคส OTP หมดอายุ — ถ้าไม่ตั้งจะ skip)
- `@knownBug` = เคสที่ระบบปัจจุบันทำงานผิด ติด `@fail` คู่กันไว้ (playwright-bdd แปลงเป็น `test.fail()`)
  ผลจึงขึ้นผ่านตราบที่ bug ยังอยู่ — เมื่อเว็บแก้แล้วเทสจะ fail ว่า "expected to fail, but passed"
  ให้ลบ `@knownBug @fail` ออกจาก scenario นั้น
- `@intermittentBug` = bug ที่เกิดไม่สม่ำเสมอ
