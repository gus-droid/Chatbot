'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi, I'm the Support Agent. How may I assist you today?"
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "..." },  // Temporary placeholder
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
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="white"  // White background for the chat box
        borderRadius={2}  // Slight rounding of corners
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
              >
                {message.content}
              </Box>
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
