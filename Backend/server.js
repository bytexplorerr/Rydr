const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const socket = require("./socket");


const server = http.createServer(app);

socket.initializeSocket(server); // initializing the socket

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});