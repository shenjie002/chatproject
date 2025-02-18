const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on port 8080');

// 房间管理，结构为 Map<roomName, Map<peerId, WebSocket>>
const rooms = new Map();

wss.on('connection', ws => {
    let currentId = Date.now().toString(); // 临时 ID
    let currentRoom = null;

    ws.on('message', message => {
        console.log(`Received message from ${currentId}: ${message}`);
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'join-room') {
                // 客户端加入房间
                const roomName = data.roomName;
                const peerId = data.id;

                // 创建房间（如果不存在）
                if (!rooms.has(roomName)) {
                    rooms.set(roomName, new Map());
                }

                // 加入房间
                const room = rooms.get(roomName);
                if (room.has(peerId)) {
                    ws.send(JSON.stringify({
                        type: 'join-failed',
                        message: 'Peer ID already exists in the room',
                        roomName
                    }));
                    return;
                }

                // 更新客户端 ID 和房间
                room.set(peerId, ws);
                currentId = peerId;
                currentRoom = roomName;

                // // 告知其他成员新成员加入
                const peers = Array.from(room.keys()).filter(key => key !== peerId);
                // room.forEach((clientWs, clientPeerId) => {
                //     if (clientPeerId !== peerId) {
                //         clientWs.send(JSON.stringify({
                //             type: 'new-peer',
                //             peerId: peerId,
                //             roomName
                //         }));
                //     }
                // });

                // 发送成功消息
                ws.send(JSON.stringify({
                    type: 'join-success',
                    id: peerId,
                    peers: peers,
                    roomName
                }));

                console.log(`Client ${peerId} joined room ${roomName}`);
            } else if (data.type === 'offer') {

                 console.log("转发Offer")
                console.log("当前currentId",currentId)
               console.log(data.offer)
                // 转发 Offer
                const toId = data.toId;
                const room = rooms.get(currentRoom);
                const peers = Array.from(room.keys()).filter(key => key !== toId);
               
                console.log("来自toId",toId)
                if (room) {
                    const toWs = room.get(toId);
                    if (toWs) {
                        toWs.send(JSON.stringify({
                            type: 'offer',
                            offer: data.offer,
                            fromId: currentId,
                            roomName: currentRoom,
                            peers:peers
                        }));
                    } else {
                        console.error(`Remote peer ${toId} not found in room ${currentRoom}`);
                    }
                }
            } else if (data.type === 'answer') {
                console.log("转发Answer")
                // 转发 Answer
                const toId = data.toId;
                const room = rooms.get(currentRoom);
                if (room) {
                    const toWs = room.get(toId);
                    if (toWs) {
                        toWs.send(JSON.stringify({
                            type: 'answer',
                            answer: data.answer,
                            fromId: currentId,
                            roomName: currentRoom
                        }));
                    } else {
                        console.error(`Remote peer ${toId} not found in room ${currentRoom}`);
                    }
                }
            } else if (data.type === 'candidate') {
                console.log("转发Candidate")
                // 转发 ICE Candidate
                const toId = data.toId;
                const room = rooms.get(currentRoom);
                if (room) {
                    const toWs = room.get(toId);
                    if (toWs) {
                        toWs.send(JSON.stringify({
                            type: 'candidate',
                            candidate: data.candidate,
                            fromId: currentId,
                            roomName: currentRoom
                        }));
                    } else {
                        console.error(`Remote peer ${toId} not found in room ${currentRoom}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom);
            if (room) {
                room.delete(currentId);
                console.log(`Client ${currentId} left room ${currentRoom}`);
                // 通知其他成员该用户已离开
            room.forEach((clientWs) => {
                clientWs.send(JSON.stringify({
                    type: 'peer-disconnected',
                    peerId: currentId,
                    roomName: currentRoom,
                }));
            });
            }
        }
    });
});