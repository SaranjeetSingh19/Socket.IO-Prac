import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const port = 3000;

app.get("/", (req, res) => {
  res.send("Home route working..");
});

io.on("connection", (socket) => {  
  console.log("User connected on port id:", socket.id);

  socket.on("message", ({message, room})=> {  // Messaging to a particular user through Room ID
    console.log(room, message);
   io.to(room).emit("receive-msg", message)
  })

  socket.on("disconnect", () => {  // To disconnet ID
    console.log(`User Disconnected on port id: ${socket.id}`);  
  });

  socket.on("join-room", (room) => {   // To connect room (or we can say "Creating Group")
    socket.join(room)
  })
  // socket.emit("wlcum", `Aaiye padhariye aur aapki server id hai: ${socket.id}`);
});

server.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
