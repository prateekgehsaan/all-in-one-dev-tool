import React, { useState } from 'react';
import { 
  Box, Typography, Card, Stack, Button, TextField, 
  MenuItem, Select, FormControl, IconButton, Tooltip, 
  CircularProgress, Divider, Paper
} from '@mui/material';
import { 
  AutoFixHigh, ContentCopy, DeleteSweep, Terminal, 
  DataObject, Html, Css, Javascript, Code, ContentPaste
} from '@mui/icons-material';

// Prettier Core
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserHtml from "prettier/plugins/html";
import parserPostcss from "prettier/plugins/postcss";
import parserEstree from "prettier/plugins/estree";

function Beautifier() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('json');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCode = async () => {
    if (!code) return;
    setLoading(true);
    try {
      let formatted = "";
      if (language === 'json') {
        formatted = JSON.stringify(JSON.parse(code), null, 2);
      } else {
        formatted = await prettier.format(code, {
          parser: language === 'react' ? 'babel' : language,
          plugins: [parserBabel, parserHtml, parserPostcss, parserEstree],
          semi: true,
          printWidth: 80,
        });
      }
      setOutput(formatted);
    } catch (err) {
      setOutput(`// ⚠️ Error: ${err.message}`);
    } finally {
      setTimeout(() => setLoading(false), 300); // Smooth transition
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const languages = [
    { value: 'json', label: 'JSON', icon: <DataObject fontSize="small" /> },
    { value: 'html', label: 'HTML', icon: <Html fontSize="small" /> },
    { value: 'css', label: 'CSS', icon: <Css fontSize="small" /> },
    { value: 'babel', label: 'JavaScript', icon: <Javascript fontSize="small" /> },
    { value: 'react', label: 'React JSX', icon: <Code fontSize="small" /> },
  ];

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* 1. COMPACT RESPONSIVE HEADER */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, mb: 3, borderRadius: '16px', border: '1px solid #e2e8f0',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Code <span style={{ color: '#4f46e5' }}>Studio</span>
            </Typography>
          </Box>

          <Stack 
            direction="row" 
            spacing={0} // No gap between dropdown and button
            sx={{ 
                width: { xs: '100%', sm: 'auto' },
                borderRadius: '12px', 
                overflow: 'hidden', // Crops the corners of children to match the border
                border: '1px solid #e2e8f0',
                bgcolor: '#fff'
            }}
            >
            {/* LANGUAGE DROPDOWN */}
            <FormControl size="small">
                <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ 
                    minWidth: 140,
                    borderRadius: '12px 0 0 12px', // Round only left side
                    bgcolor: '#fff',
                    '& fieldset': { border: 'none' }, // Remove internal MUI border
                    fontWeight: 600,
                    fontSize: '0.875rem'
                }}
                >
                {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ color: '#6366f1', display: 'flex' }}>{lang.icon}</Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{lang.label}</Typography>
                    </Stack>
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

            {/* VERTICAL DIVIDER */}
            <Divider orientation="vertical" flexItem sx={{ height: '24px', alignSelf: 'center', bgcolor: '#e2e8f0' }} />

            {/* BEAUTIFY BUTTON */}
            <Button 
                variant="contained" 
                disabled={loading}
                onClick={formatCode}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoFixHigh />}
                sx={{ 
                borderRadius: '0 12px 12px 0', // Round only right side
                px: 3, 
                py: 1, 
                textTransform: 'none', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                boxShadow: 'none', // Remove shadow to keep it clean within the group
                '&:hover': { background: '#4338ca' },
                '&.Mui-disabled': { background: '#cbd5e1' }
                }}
            >
                {loading ? 'Formatting...' : 'Beautify'}
            </Button>
            </Stack>
        </Stack>
      </Paper>

      {/* 2. STABLE 50/50 GRID */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
          gap: 3, 
          height: { lg: 'calc(100vh - 220px)' },
          minHeight: '500px'
        }}
      >
        {/* LEFT PANEL: INPUT */}
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: '16px', display: 'flex', flexDirection: 'column', 
            border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff'
          }}
        >
          <Box sx={{ p: 1.5, px: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Terminal sx={{ fontSize: 18, color: '#64748b' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 0.5 }}>INPUT</Typography>
            </Stack>
            <Tooltip title="Clear Content">
              <IconButton size="small" onClick={() => setCode('')} sx={{ color: '#94a3b8' }}>
                <DeleteSweep fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            multiline
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste messy ${language} code here...`}
            sx={{ 
              flexGrow: 1,
              "& .MuiOutlinedInput-root": { 
                height: '100%', alignItems: 'flex-start', p: 2,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '13px',
                "& fieldset": { border: 'none' }
              }
            }}
          />
        </Card>

        {/* RIGHT PANEL: OUTPUT */}
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: '16px', display: 'flex', flexDirection: 'column', 
            bgcolor: '#020617', border: '1px solid #1e293b', overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 1.5, px: 2, borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Code sx={{ fontSize: 18, color: '#4f46e5' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5 }}>OUTPUT</Typography>
            </Stack>
            <Tooltip title="Copy to Clipboard">
              <IconButton size="small" onClick={copyToClipboard} sx={{ color: '#94a3b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2.5, overflow: 'auto' }}>
            <pre style={{ margin: 0, color: '#cbd5e1', fontFamily: "'Fira Code', monospace", fontSize: '13px', whiteSpace: 'pre-wrap', lineBreak: 'anywhere' }}>
              <code>{output || '// Your clean code will appear here...'}</code>
            </pre>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default Beautifier;