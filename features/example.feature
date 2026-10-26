Feature: ตัวอย่าง — ค้นหาบน search engine
  ตัวอย่าง scenario แบบ Gherkin ไว้ให้ดูโครงสร้าง
  แก้ไข/ลบไฟล์นี้ทิ้งแล้วเขียน feature จริงของระบบที่ต้องการเทสแทนได้เลย

  Background:
    Given ผู้ใช้เปิดหน้าเว็บหลัก

  Scenario: ค้นหาคำว่า Playwright แล้วเห็นผลลัพธ์
    When ผู้ใช้ค้นหาคำว่า "Playwright"
    Then ผู้ใช้ควรเห็นผลลัพธ์การค้นหาอย่างน้อย 1 รายการ

  Scenario Outline: ค้นหาด้วยคำหลายแบบ
    When ผู้ใช้ค้นหาคำว่า "<keyword>"
    Then ผู้ใช้ควรเห็นผลลัพธ์การค้นหาอย่างน้อย 1 รายการ

    Examples:
      | keyword    |
      | Automation |
      | Gherkin    |
