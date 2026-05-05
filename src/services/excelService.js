import { saveAs } from 'file-saver';

export const exportToExcel = (data, isBottom) => {
  const totalCols = 24;
  const sideSpace = '<td style="border:none;width:20px;"></td>';
  
  let html = `<table border="1" style="border-collapse:collapse;width:100%;font-family:sans-serif;">`;

  // 1. Top Empty Row
  html += `<tr style="height:25px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;

  // 2. Header
  html += `<tr>${sideSpace}<th colspan="${totalCols}" style="text-align:center;background:#f1f5f9;padding:15px;font-size:18px;border:2px solid #000;">${data.header}</th>${sideSpace}</tr>`;

  // 3. Gap
  html += `<tr style="height:20px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;

  // 4. Content (Bottom vs Side-by-Side)
  if (isBottom) {
    // FORM GRID (4 PER ROW)
    const fieldsPerRow = 4;
    const colPerField = Math.floor(totalCols / fieldsPerRow);
    for (let i = 0; i < data.form.length; i += fieldsPerRow) {
      html += `<tr style="height:55px;">${sideSpace}`;
      for (let j = 0; j < fieldsPerRow; j++) {
        const field = data.form[i + j];
        if (field) {
          html += `<td colspan="${colPerField}" style="padding:10px;border:1px solid #cbd5e1;">`;
          html += `<div style="font-weight:bold;font-size:12px;color:#64748b;text-align:center;">${field.label}</div>`;
          html += `<div style="background:#f1f5f9;padding:8px;margin-top:6px;text-align:center;border:1px solid #94a3b8;">${field.type.toUpperCase()}</div>`;
          html += `</td>`;
        } else {
          html += `<td colspan="${colPerField}" style="border:none;"></td>`;
        }
      }
      html += `${sideSpace}</tr>`;
    }

    // TABLE SECTION
    html += `<tr style="height:30px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;
    html += `<tr>${sideSpace}`;
    const tableColSpan = Math.floor(totalCols / data.table.columns.length);
    data.table.columns.forEach((c) => {
      html += `<th colspan="${tableColSpan}" style="background:#f1f5f9;padding:10px;border:2px solid #000;">${c}</th>`;
    });
    html += `${sideSpace}</tr>`;

    data.table.data.forEach((row) => {
      html += `<tr>${sideSpace}`;
      row.forEach((val) => {
        const isAction = val.toLowerCase() === "edit" || val.toLowerCase() === "delete";
        html += `<td colspan="${tableColSpan}" style="padding:10px;text-align:center;border:1px solid #000;background:${isAction ? '#e2e8f0' : '#fff'};">${val}</td>`;
      });
      html += `${sideSpace}</tr>`;
    });
  } else {
    // SIDE BY SIDE
    const formWidth = 10;
    const tableWidth = totalCols - formWidth;
    const maxRows = Math.max(data.form.length, data.table.data.length + 1);

    for (let i = 0; i < maxRows; i++) {
      html += `<tr style="height:45px;">${sideSpace}`;
      // Form Side
      if (data.form[i]) {
        html += `<td colspan="4" style="padding:8px;border:1px solid #000;"><b>${data.form[i].label}</b></td>`;
        html += `<td colspan="6" style="background:#f1f5f9;padding:8px;text-align:center;border:1px solid #000;">${data.form[i].type.toUpperCase()}</td>`;
      } else {
        html += `<td colspan="${formWidth}"></td>`;
      }

      // Table Side
      if (i === 0) {
        const tColSpan = Math.floor(tableWidth / data.table.columns.length);
        data.table.columns.forEach((c) => {
          html += `<th colspan="${tColSpan}" style="background:#f1f5f9;padding:8px;border:1px solid #000;">${c}</th>`;
        });
      } else if (data.table.data[i - 1]) {
        const tColSpan = Math.floor(tableWidth / data.table.columns.length);
        data.table.data[i - 1].forEach((val) => {
          const isAction = val.toLowerCase() === "edit";
          html += `<td colspan="${tColSpan}" style="padding:8px;border:1px solid #000;background:${isAction ? '#e2e8f0' : '#fff'};">${val}</td>`;
        });
      } else {
        html += `<td colspan="${tableWidth}"></td>`;
      }
      html += `${sideSpace}</tr>`;
    }
  }

  // 5. Footer
  html += `<tr style="height:25px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;
  html += `<tr>${sideSpace}<td colspan="${totalCols}" style="text-align:center;background:#f1f5f9;font-weight:bold;padding:12px;border:2px solid #000;">${data.footer}</td>${sideSpace}</tr>`;
  html += `<tr>${sideSpace}<td colspan="${totalCols}" style="text-align:center;padding:10px;color:#94a3b8;font-size:12px;">${data.pageName}</td>${sideSpace}</tr>`;
  
  html += `</table>`;

  const blob = new Blob(['\ufeff', html], { type: "application/vnd.ms-excel" });
  saveAs(blob, `${data.pageName}_Wireframe.xls`);
};