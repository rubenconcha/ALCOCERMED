import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

if (process.argv.includes("--help-import")) {
  const probe = Workbook.create();
  probe.worksheets.add("Probe");
  console.log(probe.help("*", {
    search: "importXlsx|import workbook|skip drawings|drawings",
    include: "index,examples,notes",
    maxChars: 6000,
  }).ndjson);
  process.exit(0);
}

const files = [
  "C:/Users/PC/Downloads/canal endemico y monitoreo pai.xlsm",
  "C:/Users/PC/Downloads/canal endemico y monitoreo pai (1).xlsm",
];

for (const path of files) {
  console.log(`\n===== FILE: ${path} =====`);
  try {
    const blob = await FileBlob.load(path);
    const workbook = await SpreadsheetFile.importXlsx(blob);

    const sheets = await workbook.inspect({
      kind: "sheet",
      include: "id,name",
      maxChars: 12000,
    });
    console.log("--- SHEETS ---");
    console.log(sheets.ndjson);

    const summary = await workbook.inspect({
      kind: "workbook,sheet,table,drawing",
      maxChars: 20000,
      tableMaxRows: 5,
      tableMaxCols: 10,
      tableMaxCellChars: 100,
    });
    console.log("--- SUMMARY ---");
    console.log(summary.ndjson);

    const matches = await workbook.inspect({
      kind: "match",
      searchTerm: "canal|endemico|endémico|sauces|zona|monitoreo|pai|epidemi",
      options: { useRegex: true, maxResults: 300 },
      maxChars: 30000,
    });
    console.log("--- MATCHES ---");
    console.log(matches.ndjson);
  } catch (error) {
    console.log(`ERROR: ${error?.stack ?? error}`);
  }
}
