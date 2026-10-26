// สร้างข้อมูลจำลอง (dummy) สำหรับกรอกฟอร์มในเทส — สุ่มใหม่ทุกครั้งเพื่อเลี่ยงชนกับ unique constraint (เบอร์/อีเมล/เลขบัตรซ้ำ)

function genDummyPhone(prefix = '01') {
  const suffix = Math.floor(Math.random() * 1e8)
    .toString()
    .padStart(8, '0');
  return `${prefix}${suffix}`.slice(0, 10);
}

const FIRST_NAMES = ['สมชาย', 'สมหญิง', 'วิชัย', 'มานี', 'ประยุทธ์', 'สุดา'];
const LAST_NAMES = ['ใจดี', 'รักเรียน', 'มั่งมี', 'สุขสันต์', 'เจริญพร'];

function genDummyName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { firstName, lastName };
}

function genDummyDob() {
  const year = 1970 + Math.floor(Math.random() * 30);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  return `${day}/${month}/${year}`; // ปรับ format ให้ตรงกับ date picker จริงทีหลังถ้าไม่ตรง
}

function genDummyEmail(firstName, lastName) {
  return `${firstName}.${lastName}.${Date.now()}@example.com`.toLowerCase();
}

function genDummyIdCard() {
  let digits = '1';
  for (let i = 0; i < 12; i++) digits += Math.floor(Math.random() * 10);
  return digits;
}

// หน้าลงทะเบียน empeo เช็คซ้ำระดับ "โดเมน" อีเมล (ไม่ใช่แค่ทั้ง address) — ต้องสุ่มโดเมนใหม่ทุกครั้ง
function genUniqueDomainEmail(localPart = 'qa.auto') {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${localPart}@qa${stamp}.com`;
}

function genCompanyName(prefix = 'QA Automation') {
  return `${prefix} ${Date.now()}`;
}

module.exports = {
  genDummyPhone,
  genDummyName,
  genDummyDob,
  genDummyEmail,
  genDummyIdCard,
  genUniqueDomainEmail,
  genCompanyName,
};
