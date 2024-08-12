'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi, I'm an AI ready to help you with anything you need. How may I assist you today?"
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "Hold on, thinking..." },  // Temporary placeholder
    ]);

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
      updatedMessages[updatedMessages.length - 1].content = data.choices[0].message.content;
      return updatedMessages;
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2e2e2e"  // Dark gray background
    >
      {/* Title at the top */}
      <Typography variant="h4" color="white" gutterBottom>
        Chat Support Interface
      </Typography>
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="white"
        borderRadius={2}
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
                color="white"
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
