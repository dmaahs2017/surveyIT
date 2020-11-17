export function downloadCsvFile(data: any, fileName: string) {
  const csvName = fileName + ".csv";
  const blob = new Blob([data], { type: "text/csv" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // IE
    window.navigator.msSaveOrOpenBlob(blob, csvName);
    window.navigator.msSaveOrOpenBlob(blob, csvName);
  } else {
    //Chrome & Firefox
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = csvName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
