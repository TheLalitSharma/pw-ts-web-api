import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('src/config/excel');
const out = path.join(outDir, 'users.xlsx');

(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Users');
  ws.addRow(['username', 'password']);
  ws.addRow(['standard_user', 'secret_sauce']);
  ws.addRow(['locked_out_user', 'secret_sauce']);
  await wb.xlsx.writeFile(out);
  console.info(`Excel test data generated at ${out}`);
})();