import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Stack, Button, TextField, 
  MenuItem, Select, FormControl, IconButton, Tooltip, 
  Paper, Chip, Grid
} from '@mui/material';
// Using solid icons to avoid Vite "Internal Server Error" with Outlined variants
import Compare from '@mui/icons-material/Compare';
import FindInPage from '@mui/icons-material/FindInPage';
import TextFields from '@mui/icons-material/TextFields';
import DeleteSweep from '@mui/icons-material/DeleteSweep';
import Error from '@mui/icons-material/Error';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Info from '@mui/icons-material/Info';

function Utilities() {
  const [tool, setTool] = useState('regex');
  
  // Regex States
  const [regexPattern, setRegexPattern] = useState('[a-z]+');
  const [regexText, setRegexText] = useState('sample text 123');
  const [regexResult, setRegexResult] = useState([]);
  const [regexError, setRegexError] = useState(null);

  // Diff States
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');

  // Counter States
  const [countText, setCountText] = useState('');

  useEffect(() => {
    if (tool === 'regex') handleRegex();
  }, [regexPattern, regexText, tool]);

  const handleRegex = () => {
    try {
      setRegexError(null);
      if (!regexPattern) return setRegexResult([]);
      const re = new RegExp(regexPattern, 'g');
      const matches = [...regexText.matchAll(re)];
      setRegexResult(matches.map(m => m[0]));
    } catch (e) {
      setRegexError(e.message);
    }
  };

  const getDiff = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const max = Math.max(linesA.length, linesB.length);
    const diffs = [];
    for (let i = 0; i < max; i++) {
      diffs.push({
        a: linesA[i] || '',
        b: linesB[i] || '',
        same: linesA[i] === linesB[i]
      });
    }
    return diffs;
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      <Paper 
        elevation={0} 
        sx={{ p: 2, mb: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Dev <span style={{ color: '#4f46e5' }}>Utilities</span>
          </Typography>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <Select 
              value={tool} 
              onChange={(e) => setTool(e.target.value)} 
              sx={{ borderRadius: '10px', fontWeight: 600, bgcolor: '#fff' }}
            >
              <MenuItem value="regex">
                <Stack direction="row" spacing={1}><FindInPage fontSize="small"/> <Typography variant="body2" fontWeight={600}>Regex Tester</Typography></Stack>
              </MenuItem>
              <MenuItem value="diff">
                <Stack direction="row" spacing={1}><Compare fontSize="small"/> <Typography variant="body2" fontWeight={600}>Diff Checker</Typography></Stack>
              </MenuItem>
              <MenuItem value="counter">
                <Stack direction="row" spacing={1}><TextFields fontSize="small"/> <Typography variant="body2" fontWeight={600}>Text Counter</Typography></Stack>
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* --- REGEX TESTER --- */}
      {tool === 'regex' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 1 }}>PATTERN (RegExp)</Typography>
              <TextField 
                fullWidth variant="standard" value={regexPattern} 
                onChange={(e) => setRegexPattern(e.target.value)}
                error={!!regexError}
                placeholder="e.g. [a-z]+"
                sx={{ mt: 1, mb: 3, "& input": { fontFamily: "'Fira Code', monospace", fontSize: '1.1rem' } }}
              />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 1 }}>TEST STRING</Typography>
              <TextField 
                multiline fullWidth rows={8} value={regexText}
                onChange={(e) => setRegexText(e.target.value)}
                sx={{ mt: 1, "& fieldset": { borderRadius: '12px', borderColor: '#f1f5f9' } }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: '20px', bgcolor: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                {regexError ? <Error color="error"/> : <CheckCircle color="success"/>}
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Matches: {regexResult.length}</Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1 }}>
                {regexError ? (
                  <Typography color="error" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', p: 2, bgcolor: '#fff1f2', borderRadius: '8px' }}>{regexError}</Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {regexResult.length > 0 ? regexResult.map((m, i) => (
                      <Chip key={i} label={m} size="small" sx={{ bgcolor: '#4f46e5', color: '#fff', fontWeight: 700, borderRadius: '6px' }} />
                    )) : <Typography variant="body2" color="textSecondary">No matches found.</Typography>}
                  </Stack>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* --- DIFF CHECKER --- */}
      {tool === 'diff' && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}><TextField multiline fullWidth rows={6} label="Original Text" value={textA} onChange={(e) => setTextA(e.target.value)} sx={{ bgcolor: '#fff' }}/></Grid>
            <Grid item xs={6}><TextField multiline fullWidth rows={6} label="Modified Text" value={textB} onChange={(e) => setTextB(e.target.value)} sx={{ bgcolor: '#fff' }}/></Grid>
          </Grid>
          <Card variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', minHeight: '300px' }}>
              <Box sx={{ p: 1, borderBottom: '1px solid #1e293b', display: 'flex', gap: 1, alignItems: 'center' }}>
                <Info sx={{ color: '#94a3b8', fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>SIDE-BY-SIDE COMPARISON</Typography>
              </Box>
              {getDiff().map((line, i) => (
                <Box key={i} sx={{ display: 'flex', borderBottom: '1px solid #1e293b', fontSize: '13px', fontFamily: "'Fira Code', monospace" }}>
                  <Box sx={{ flex: 1, p: 1, color: line.same ? '#94a3b8' : '#f87171', bgcolor: line.same ? 'transparent' : 'rgba(248, 113, 113, 0.1)' }}>
                    {line.a || ' '}
                  </Box>
                  <Box sx={{ flex: 1, p: 1, color: line.same ? '#94a3b8' : '#4ade80', bgcolor: line.same ? 'transparent' : 'rgba(74, 222, 128, 0.1)', borderLeft: '1px solid #1e293b' }}>
                    {line.b || ' '}
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* --- TEXT COUNTER --- */}
      {tool === 'counter' && (
        <Card variant="outlined" sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#4f46e5' }}>{countText.length}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>CHARACTERS</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{countText.trim() ? countText.trim().split(/\s+/).length : 0}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>WORDS</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{countText.split('\n').filter(l => l).length}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>LINES</Typography>
            </Grid>
          </Grid>
          <TextField 
            multiline fullWidth rows={12} 
            value={countText} onChange={(e) => setCountText(e.target.value)}
            placeholder="Type or paste your text here for real-time analysis..."
            sx={{ "& fieldset": { borderRadius: '16px', borderColor: '#f1f5f9' } }}
          />
        </Card>
      )}
    </Box>
  );
}

export default Utilities;