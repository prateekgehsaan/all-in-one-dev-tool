import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Stack, Button, TextField, 
  MenuItem, Select, FormControl, IconButton, Tooltip, 
  Paper, Divider, Chip, Alert
} from '@mui/material';
import { 
  History, Abc, Security, ContentCopy, 
  DeleteSweep, BugReport, AccessTime 
} from '@mui/icons-material';

function Converters() {
  const [input, setInput] = useState('');
  const [tool, setTool] = useState('case'); // case | timestamp | jwt
  
  // Case Converter States
  const [caseResults, setCaseResults] = useState({});

  // Timestamp States
  const [dateResult, setDateResult] = useState('');

  // JWT States
  const [jwtPayload, setJwtPayload] = useState(null);
  const [jwtError, setJwtError] = useState('');

  useEffect(() => {
    if (!input) {
      setCaseResults({});
      setDateResult('');
      setJwtPayload(null);
      setJwtError('');
      return;
    }

    if (tool === 'case') handleCaseConversion();
    if (tool === 'timestamp') handleTimestamp();
    if (tool === 'jwt') handleJWT();
  }, [input, tool]);

  // --- LOGIC: CASE CONVERTER ---
  const handleCaseConversion = () => {
    const clean = input.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
    const words = clean.split(/\s+/);
    
    const toCamel = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    const toSnake = words.map(w => w.toLowerCase()).join('_');
    const toKebab = words.map(w => w.toLowerCase()).join('-');
    const toPascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');

    setCaseResults({ camelCase: toCamel, snake_case: toSnake, 'kebab-case': toKebab, PascalCase: toPascal });
  };

  // --- LOGIC: TIMESTAMP ---
  const handleTimestamp = () => {
    try {
      let val = parseInt(input);
      if (input.length === 10) val *= 1000; // Seconds to ms
      const d = new Date(val);
      setDateResult(isNaN(d.getTime()) ? 'Invalid Date' : d.toISOString().replace('T', ' ').split('.')[0] + ' UTC');
    } catch { setDateResult('Invalid Timestamp'); }
  };

  // --- LOGIC: JWT DEBUGGER ---
  const handleJWT = () => {
    setJwtError('');
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT Format");
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setJwtPayload(payload);
    } catch (e) {
      setJwtError("Could not decode JWT. Ensure it's a valid token string.");
      setJwtPayload(null);
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* TOOL SELECTOR HEADER */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Smart <span style={{ color: '#6366f1' }}>Converters</span>
          </Typography>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <Select value={tool} onChange={(e) => setTool(e.target.value)} sx={{ borderRadius: '10px', fontWeight: 600 }}>
              <MenuItem value="case"><Stack direction="row" spacing={1}><Abc /> <Typography variant="body2" fontWeight={600}>Case Converter</Typography></Stack></MenuItem>
              <MenuItem value="timestamp"><Stack direction="row" spacing={1}><AccessTime /> <Typography variant="body2" fontWeight={600}>Epoch Timestamp</Typography></Stack></MenuItem>
              <MenuItem value="jwt"><Stack direction="row" spacing={1}><Security /> <Typography variant="body2" fontWeight={600}>JWT Debugger</Typography></Stack></MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
        {/* INPUT SECTION */}
        <Card variant="outlined" sx={{ borderRadius: '20px', p: 0, height: 'fit-content' }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>RAW INPUT</Typography>
            <IconButton size="small" onClick={() => setInput('')}><DeleteSweep fontSize="small"/></IconButton>
          </Box>
          <TextField
            multiline fullWidth rows={8} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool === 'jwt' ? "Paste JWT token here..." : tool === 'timestamp' ? "Enter Unix timestamp..." : "Enter text to convert..."}
            sx={{ "& .MuiOutlinedInput-root": { p: 3, fontFamily: "'Fira Code', monospace", "& fieldset": { border: 'none' } } }}
          />
        </Card>

        {/* DYNAMIC RESULT SECTION */}
        <Box>
          {tool === 'case' && (
            <Stack spacing={2}>
              {Object.entries(caseResults).map(([label, val]) => (
                <Card key={label} variant="outlined" sx={{ p: 2, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 800 }}>{label.toUpperCase()}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{val || '...'}</Typography>
                  </Box>
                  <IconButton onClick={() => copy(val)} size="small"><ContentCopy fontSize="small"/></IconButton>
                </Card>
              ))}
            </Stack>
          )}

          {tool === 'timestamp' && (
            <Card variant="outlined" sx={{ p: 4, borderRadius: '20px', textAlign: 'center', bgcolor: '#4f46e5', color: '#fff' }}>
              <History sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>ISO 8601 Format</Typography>
              <Typography variant="h4" sx={{ my: 2, fontWeight: 300, fontFamily: 'monospace' }}>{dateResult || '0000-00-00 00:00:00'}</Typography>
              <Button variant="contained" onClick={() => copy(dateResult)} sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)' }}>Copy Date</Button>
            </Card>
          )}

          {tool === 'jwt' && (
            <Card variant="outlined" sx={{ borderRadius: '20px', bgcolor: '#020617', color: '#cbd5e1', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BugReport sx={{ color: '#ef4444' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8' }}>PAYLOAD DECODED (LOCAL ONLY)</Typography>
              </Box>
              <Box sx={{ p: 3, maxHeight: '400px', overflow: 'auto' }}>
                {jwtError ? <Alert severity="error" sx={{ bgcolor: 'transparent', color: '#f87171' }}>{jwtError}</Alert> : 
                  <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: '13px' }}>
                    {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : "// Awaiting valid JWT token..."}
                  </pre>
                }
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Converters;