import React, { useState, useEffect } from "react";
import { 
  Button, Paper, Switch, FormControlLabel, TextField, 
  Typography, Box, Card, CardContent, Stack, Divider, Tooltip, IconButton, Select, MenuItem
} from "@mui/material";
import { 
  Download as DownloadIcon, 
  PlayArrow as PlayIcon, 
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon
} from "@mui/icons-material";
import { exportToExcel } from "../services/excelService";

import { exportToPDF, exportToPNG, exportToSVG} from "../services/pdfService";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';  


function WireframeTool() {
  const [isBottom, setIsBottom] = useState(true);
  const [jsonText, setJsonText] = useState(`{
  "pageName": "User Master",
  "header": "Header",
  "footer": "Footer",
  "form": [
    {"label":"User Name","type":"text"},
    {"label":"Role","type":"dropdown"},
    {"label":"Status","type":"checkbox"},
    {"label":"Joining Date","type":"date"}
  ],
  "table":{
    "columns":["ID","Name","Permissions","Action"],
    "data":[["101","Admin","Full Access","Edit"]]
  }
}`);
  const [previewHTML, setPreviewHTML] = useState("");

  // Sync preview whenever JSON or Layout changes
  useEffect(() => {
    handleRender();
  }, [jsonText, isBottom]);

  const buildWireframeTable = (data) => {
    const totalCols = 24;
    const sideSpace = '<td style="border:none;width:20px;"></td>';
    let html = '<table border="1" style="border-collapse:collapse;width:100%;font-family:sans-serif;background:white;">';

    // 1. Top Margin
    html += `<tr style="height:25px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;

    // 2. Header
    html += `<tr>${sideSpace}<th colspan="${totalCols}" style="text-align:center;background:#f1f5f9;padding:15px;font-size:18px;border:2px solid #000;">${data.header}</th>${sideSpace}</tr>`;

    // 3. Gap
    html += `<tr style="height:20px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;

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
          const isAction = val.toLowerCase() === "edit";
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
        if (data.form[i]) {
          html += `<td colspan="4" style="padding:8px;border:1px solid #000;"><b>${data.form[i].label}</b></td>`;
          html += `<td colspan="6" style="background:#f1f5f9;padding:8px;text-align:center;border:1px solid #000;">${data.form[i].type.toUpperCase()}</td>`;
        } else {
          html += `<td colspan="${formWidth}"></td>`;
        }
        if (i === 0) {
          const tColSpan = Math.floor(tableWidth / data.table.columns.length);
          data.table.columns.forEach((c) => {
            html += `<th colspan="${tColSpan}" style="background:#f1f5f9;padding:8px;border:1px solid #000;">${c}</th>`;
          });
        } else if (data.table.data[i - 1]) {
          const tColSpan = Math.floor(tableWidth / data.table.columns.length);
          data.table.data[i - 1].forEach((val) => {
            html += `<td colspan="${tColSpan}" style="padding:8px;border:1px solid #000;background:${val.toLowerCase()==='edit'?'#e2e8f0':'#fff'};">${val}</td>`;
          });
        } else {
          html += `<td colspan="${tableWidth}"></td>`;
        }
        html += `${sideSpace}</tr>`;
      }
    }

    // Footer
    html += `<tr style="height:25px;">${sideSpace}<td colspan="${totalCols}"></td>${sideSpace}</tr>`;
    html += `<tr>${sideSpace}<td colspan="${totalCols}" style="text-align:center;background:#f1f5f9;font-weight:bold;padding:12px;border:2px solid #000;">${data.footer}</td>${sideSpace}</tr>`;
    html += `<tr>${sideSpace}<td colspan="${totalCols}" style="text-align:center;padding:10px;color:#94a3b8;font-size:12px;">${data.pageName}</td>${sideSpace}</tr>`;
    html += '</table>';
    return html;
  };

  const handleRender = () => {
    try {
      const data = JSON.parse(jsonText);
      setPreviewHTML(buildWireframeTable(data));
    } catch {
      setPreviewHTML('<div style="color:red; padding:20px;">Invalid JSON Syntax</div>');
    }
  };

  const [exportFormat, setExportFormat] = useState('xlsx');

  const handleExport = () => {
    // We try-catch JSON.parse in case the editor has a syntax error
    try {
      const data = JSON.parse(jsonText);
      switch (exportFormat) {
        case 'xlsx': exportToExcel(data, isBottom); break;
        case 'pdf': exportToPDF('wireframe-preview'); break;
        case 'png': exportToPNG('wireframe-preview'); break;
        case 'svg': exportToSVG('wireframe-preview'); break;
        default: break;
      }
    } catch (e) {
      alert("Invalid JSON in editor. Please fix it before exporting.");
    }
  };
  
  return (
    <Box className="animate-in slide-in-from-bottom-4 duration-500">
        
    <Paper 
      elevation={0} 
      sx={{ p: 2, mb: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>
            Wireframe <span style={{ color: '#4f46e5' }}>Studio</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>Design pixel-perfect Excel layouts.</Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* LAYOUT TOGGLE */}
          <Paper elevation={0} sx={{ p: 0.5, px: 2, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
            <FormControlLabel
              control={<Switch size="small" checked={isBottom} onChange={() => setIsBottom(!isBottom)} />}
              label={<Typography variant="button" sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Bottom Layout</Typography>}
            />
          </Paper>

          {/* CONSOLIDATED EXPORT GROUP */}
          <Stack direction="row" sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              size="small"
              sx={{ 
                minWidth: 120, 
                bgcolor: '#fff', 
                borderRadius: '12px 0 0 12px',
                '& fieldset': { border: 'none' },
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
              <MenuItem value="pdf">Document (.pdf)</MenuItem>
              <MenuItem value="png">Image (.png)</MenuItem>
              <MenuItem value="svg">Vector (.svg)</MenuItem>
            </Select>
            
            <Divider orientation="vertical" flexItem sx={{ height: '24px', alignSelf: 'center' }} />

            <Button 
              variant="contained" 
              onClick={handleExport}
              startIcon={<DownloadIcon />}
              sx={{ 
                borderRadius: '0 12px 12px 0', 
                px: 3, 
                fontWeight: 700, 
                textTransform: 'none',
                bgcolor: '#4f46e5',
                '&:hover': { bgcolor: '#4338ca' },
                boxShadow: 'none'
              }}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>

      <Box className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <Card sx={{ gridColumn: { xl: 'span 4' }, borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CodeIcon sx={{ color: '#6366f1' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Configuration</Typography>
          </Box>
          <TextField
            multiline fullWidth rows={18} value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                p: 2, fontFamily: "'Fira Code', monospace", fontSize: '0.85rem', bgcolor: '#fff',
                '& fieldset': { border: 'none' } 
              } 
            }}
          />
          <Button 
            fullWidth onClick={handleRender} variant="contained" 
            sx={{ borderRadius: 0, py: 2, fontWeight: 800, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
          >
            Refresh Preview
          </Button>
        </Card>

        <Paper sx={{ 
          gridColumn: { xl: 'span 8' }, borderRadius: '24px', bgcolor: '#fff', overflow: 'hidden', 
          border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
          marginTop: 3, marginBottom: 3
        }}>
          <Box sx={{ p: 2.5, bgcolor: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 1 }}>
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </Box>
          <Box sx={{ p: { xs: 2, md: 5 }, overflow: 'auto', maxHeight: '700px' }}>
            <Box id="wireframe-preview" 
                 sx={{ minWidth: '800px' }} 
                 dangerouslySetInnerHTML={{ __html: previewHTML }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default WireframeTool;