'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi, I'm an AI ready to help you with anything you need. How may I assist you today?"
  }]);

  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Function to format the message, removing asterisks and enhancing readability
  const formatMessage = (text) => {
    if (!text) return ''; 
    return text
      .replace(/\*/g, '')  // Remove all asterisks
      .replace(/\n/g, '<br/>')  // Replace newlines with HTML line breaks
      .trim();
  };

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "Hold on, thinking..." },  // Temporary placeholder
    ]);

    setMessage(''); // Clear the input box after sending the message

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: message }] })
    });

    const data = await response.json();
    setMessages((messages) => {
      const updatedMessages = [...messages];
      updatedMessages[updatedMessages.length - 1].content = formatMessage(data.choices[0].message.content); // Apply formatting here
      return updatedMessages;
    });
  };

  // Handle pressing Enter to send a message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2e2e2e"  // Dark gray background
      overflow="hidden"  // Prevent dragging to see white background
    >
      {/* Title at the top */}
      <Typography variant="h4" color="white" gutterBottom>
        Chat Support Interface
      </Typography>
      <Stack
        direction="column"
        width="100%"
        maxWidth="600px"  // Ensure the chat box is responsive
        height="80%"
        maxHeight="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="white"
        borderRadius={2}
        overflow="hidden"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display='flex' 
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"  // User text color is white
                borderRadius={16}
                p={3}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            </Box>
          ))}
        </Stack>
        <Stack 
          direction="row"
          spacing={2}
        >
          <TextField
            label="Message"
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}  // Handle Enter key
            inputRef={inputRef}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
