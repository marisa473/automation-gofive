// ตัวรันเทส: แยก --tags ไปให้ bddgen (กรอง scenario ตอน generate) ส่วน option อื่นส่งต่อให้ playwright test
// ใช้ผ่าน npm ได้เลย เช่น
//   npm test -- --tags "@sendsOtp"
//   npm run test:headed -- --tags "@registerEmpeo and not @knownBug" --workers=2

const { spawnSync } = require('child_process');

function splitArgs(argv) {
  const playwrightArgs = [];
  let tags;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--tags') {
      tags = argv[++i];
    } else if (arg.startsWith('--tags=')) {
      tags = arg.slice('--tags='.length);
    } else {
      playwrightArgs.push(arg);
    }
  }
  return { tags, playwrightArgs };
}

// spawn ผ่าน shell (จำเป็นบน Windows เพื่อเรียก npx.cmd) จึงต้อง quote argument ที่มีช่องว่างเอง
const quote = (arg) => (/[\s"]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg);

function run(args) {
  const result = spawnSync('npx', args.map(quote), { stdio: 'inherit', shell: true });
  return result.status ?? 1;
}

const { tags, playwrightArgs } = splitArgs(process.argv.slice(2));

if (tags !== undefined && !tags) {
  console.error('ต้องระบุ tag expression หลัง --tags เช่น --tags "@sendsOtp"');
  process.exit(1);
}

const genStatus = run(['bddgen', 'test', ...(tags ? ['--tags', tags] : [])]);
if (genStatus !== 0) process.exit(genStatus);

process.exit(run(['playwright', 'test', ...playwrightArgs]));
