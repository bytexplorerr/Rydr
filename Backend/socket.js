const socketIo = require("socket.io");
const userModel = require("./models/userModel");
const captainModel = require("./models/captainModel");
const jwt = require("jsonwebtoken");

let io;

const initializeSocket = (server) => {
    try {
        io = socketIo(server, {
            cors: {
                origin: '*', // Allow all origins (Change this for security in production)
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log(`Client Connected: ${socket.id}`);

            // Join Event
            socket.on('join', async (data) => {
                try {
                    const { token, userType } = data;
                    if (!token) {
                        return console.log(`Socket ${socket.id} missing token`);
                    }

                    // Verify JWT Token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    // Update user/captain socketId
                    if (userType === 'user') {
                        await userModel.findByIdAndUpdate(decoded._id, { socketId: socket.id });
                    } else if (userType === 'captain') {
                        await captainModel.findByIdAndUpdate(decoded._id, { socketId: socket.id });
                    }
                } catch (error) {
                    if (error.name === "TokenExpiredError") {
                        console.log(`Socket ${socket.id} has an expired token`);
                    } else {
                        console.log(`Socket ${socket.id} authentication error:`, error.message);
                    }
                }
            });

            // Update Captain Location Event
            socket.on('update-captain-location', async (data) => {
                try {
                    const { token, userType, location } = data;
                    if (!location || !location.ltd || !location.lng) {
                        throw new Error('All Fields are required!');
                    }

                    // Verify JWT Token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    // Update location only for captains
                    if (userType === 'captain') {
                        await captainModel.findByIdAndUpdate(decoded._id, {
                            location: {
                                ltd: location.ltd,
                                lng: location.lng
                            }
                        });
                    }
                } catch (error) {
                    if (error.name === "TokenExpiredError") {
                        console.log(`Captain ${socket.id} has an expired token`);
                    } else {
                        console.log(`Error updating location for ${socket.id}:`, error.message);
                    }
                }
            });

            socket.on('disconnect', () => {
                console.log(`Client Disconnected: ${socket.id}`);
            });
        });

    } catch (err) {
        console.log("Socket Initialization Error:", err.message);
    }
};

const sendMessageToSocketID = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized!');
    }
};

module.exports = { initializeSocket, sendMessageToSocketID };
