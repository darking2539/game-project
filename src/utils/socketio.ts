import { io } from 'socket.io-client';


export let socket: any;

export const initiateSocketConnection = (username: string) => {
    socket = io(process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:8080");
    socket.emit('set-username', username);
}

export const createdRoom = (roomName: string) => {
    socket.emit('create', roomName);
}

export const joinRoom = (roomName: string) => {
    socket.emit('join', roomName);
}

export const PlayGame = (payload: any) => {
    socket.emit('playgame', payload);
}