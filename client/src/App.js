// src/App.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

function App() {
  const [code, setCode] = useState('// Start coding...');
  const [language, setLanguage] = useState('javascript');
  const typingTimeoutRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      getCodeCompletion(value);
    }, 1000); // Wait for 1 second of inactivity
  };

  const getCodeCompletion = async (currentCode) => {
    try {
      const response = await axios.post('/api/complete', {
        code: currentCode,
      });
      setCode(currentCode + response.data.completion);
    } catch (error) {
      console.error('Error fetching code completion:', error);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <CodeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QuickCodeX
          </Typography>
          {/* Language Selector */}
          <FormControl variant="standard" sx={{ minWidth: 120, color: 'white' }}>
            <InputLabel sx={{ color: 'white' }}>Language</InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              label="Language"
              sx={{
                color: 'white',
                '& .MuiSelect-icon': { color: 'white' },
                '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
                '& .MuiInput-underline:after': { borderBottomColor: 'white' },
              }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="csharp">C#</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="swift">Swift</MenuItem>
              {/* Add more languages as needed */}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          AI-Powered Code Autocompletion
        </Typography>
        <Editor
          height="70vh"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
        {/* Optional: Add a button for manual autocomplete */}
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => getCodeCompletion(code)}
        >
          Autocomplete
        </Button> */}
      </Container>
    </Box>
  );
}

export default App;
