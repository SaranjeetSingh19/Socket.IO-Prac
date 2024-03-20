import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [group, setGroup] = useState("");

  console.log(allMessages);

  const socket = useMemo(() => io("http://localhost:3000"), []); // So, refreshing don't occur

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room }); // Sending Room id & Message at Backend
    setMessage("");
  };

  const groupHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", group);
    setGroup("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected with ID:", socket.id); // Establishment connection with Socket.ID
    });

    socket.on("receive-msg", (data) => {
      setAllMessages((allMessages) => [...allMessages, data]); // Through spread operator data will get printed without losing data of before
      console.log("our written data:", data);
    });

    // socket.on("wlcum", (d) => {
    //   console.log(d);
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={groupHandler}>
        <TextField
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          id="outline-basic"
          label="Gourp name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join GC
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outline-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outline-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {allMessages.map((msg, index) => (
          <Typography key={index} variant="h6" component="div" gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
