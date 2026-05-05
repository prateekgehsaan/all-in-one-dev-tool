import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Stack, Button, TextField, 
  MenuItem, Select, FormControl, IconButton, Tooltip, 
  Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { 
  ContentCopy, DeleteSweep, SwapHoriz, 
  Lock, Link, Code, Settings 
} from '@mui/icons-material';

function Transformer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('base64'); // base64 | url | html
  const [direction, setDirection] = useState('encode'); // encode | decode

  // Automatically transform when input, mode, or direction changes
  useEffect(() => {
    handleTransform();
  }, [input, mode, direction]);

  const handleTransform = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      let result = '';
      if (mode === 'base64') {
        result = direction === 'encode' ? btoa(input) : atob(input);
      } else if (mode === 'url') {
        result = direction === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      } else if (mode === 'html') {
        if (direction === 'encode') {
          const div = document.createElement('div');
          div.textContent = input;
          result = div.innerHTML;
        } else {
          const div = document.createElement('div');
          div.innerHTML = input;
          result = div.textContent;
        }
      }
      setOutput(result);
    } catch (err) {
      setOutput(`// Error: Invalid input for ${direction}ing ${mode.toUpperCase()}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* 1. PROFESSIONAL ACTION BAR */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, mb: 4, borderRadius: '16px', border: '1px solid #e2e8f0',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={3}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
              Data <span style={{ color: '#4f46e5' }}>Transformer</span>
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            {/* TOOL SELECTOR */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, next) => next && setMode(next)}
              size="small"
              sx={{ bgcolor: '#fff', '& .MuiToggleButton-root': { px: 2, fontWeight: 700, textTransform: 'none' } }}
            >
              <ToggleButton value="base64"><Lock sx={{ fontSize: 18, mr: 1 }}/> Base64</ToggleButton>
              <ToggleButton value="url"><Link sx={{ fontSize: 18, mr: 1 }}/> URL</ToggleButton>
              <ToggleButton value="html"><Code sx={{ fontSize: 18, mr: 1 }}/> HTML</ToggleButton>
            </ToggleButtonGroup>

            {/* DIRECTION TOGGLE */}
            <Button
              variant="contained"
              onClick={() => setDirection(direction === 'encode' ? 'decode' : 'encode')}
              startIcon={<SwapHoriz />}
              sx={{ 
                borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none',
                background: direction === 'encode' ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #10b981, #34d399)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Mode: {direction.toUpperCase()}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 2. DUAL PANE GRID */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
          gap: 3, 
          height: 'calc(100vh - 250px)',
          minHeight: '500px'
        }}
      >
        {/* SOURCE PANEL */}
        <Card variant="outlined" sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 1 }}>
              {direction === 'encode' ? 'PLAIN TEXT' : 'ENCODED DATA'}
            </Typography>
            <IconButton size="small" onClick={() => setInput('')}><DeleteSweep fontSize="small" /></IconButton>
          </Box>
          <TextField
            multiline fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste here..."
            sx={{ 
              flexGrow: 1,
              "& .MuiOutlinedInput-root": { 
                height: '100%', alignItems: 'flex-start', p: 3,
                fontFamily: "'Fira Code', monospace", fontSize: '14px',
                "& fieldset": { border: 'none' }
              }
            }}
          />
        </Card>

        {/* RESULT PANEL */}
        <Card variant="outlined" sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', border: '1px solid #1e293b' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: 1 }}>
              {direction === 'encode' ? 'TRANSFORMED OUTPUT' : 'DECODED TEXT'}
            </Typography>
            <Tooltip title="Copy Output">
              <IconButton size="small" onClick={copyToClipboard} sx={{ color: '#94a3b8' }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            <Typography 
              component="pre" 
              sx={{ 
                margin: 0, color: '#38bdf8', fontFamily: "'Fira Code', monospace", 
                fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' 
              }}
            >
              {output || `// Result will appear here...`}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default Transformer;