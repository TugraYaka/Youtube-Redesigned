import { io } from "socket.io-client";
import backendConfig from "../config/backendConfig";

let socket;

if (backendConfig.useCustomBackend) {
    socket = io(backendConfig.backendUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });
} else {
    
    socket = {
        on: () => {},
        off: () => {},
        emit: () => {},
        connect: () => {},
        disconnect: () => {},
    };
}

export default socket;
