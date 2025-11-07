import ExcelJS from 'exceljs';

export async function readUsersFromExcel(filePath: string) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error(`No worksheet found in file: ${filePath}`);

  const rows = ws.getSheetValues().slice(2) as Array<Array<string>>;
  const users = rows
    .filter(Boolean)
    .map((r) => ({ username: String(r[1]), password: String(r[2]) }))
    .filter((u) => u.username && u.password);
  return users;
}

export async function writeExampleResult(
  filePath: string, 
  sheetName: string, 
  records: Array<Record<string, unknown>>
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  // ✅ If no records, still create file with message or skip
  if (!records.length) {
    ws.addRow(['No data available']);
    await wb.xlsx.writeFile(filePath);
    return;
  }

  // ✅ Safely extract headers
  const headers = Object.keys(records[0] ?? {});
  ws.addRow(headers);

  for (const rec of records) {
    const row = headers.map((h) => rec[h]);
    ws.addRow(row);
  }

  await wb.xlsx.writeFile(filePath);
}