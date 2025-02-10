const localVideo = document.getElementById('localVideo');
const remoteVideos = {}; // 用于存储远程视频流

// ICE 服务器配置
const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    {
        urls: 'turn:127.0.0.1:3478?transport=udp',
        username: 'musen',
        credential: '123456',
        realm: '127.0.0.1'
    },
    {
        urls: 'turn:127.0.0.1:3478?transport=tcp',
        username: 'musen',
        credential: '123456',
        realm: '127.0.0.1'
    },
    {
        urls: 'stun:127.0.0.1:3478',
        username: 'musen',
        credential: '123456',
        realm: '127.0.0.1'
    }
];
let localStream;//本地流
// WebSocket 信令通信
const socket = new WebSocket('ws://localhost:8080');
let clientId = Date.now().toString(); // 生成一个唯一的 ID
let roomName = 'default-room'; // 默认房间名称
console.log("我是",clientId)
// 存储所有 RTCPeerConnection 实例
let localPc;
//存储通道
const dataChannelMap = new Map();
socket.onopen = () => {
    console.log('Connected to signaling server');
    
    // 注册本地客户端并加入房间
    socket.send(JSON.stringify({
        type: 'join-room',
        id: clientId,
        roomName: roomName
    }));
};

socket.onmessage = event => {
    console.log
    const data = JSON.parse(event.data);
    
    if (data.type === 'join-success') {

        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        data.peers.forEach((user) => {
          const li = document.createElement('li');
          li.textContent = user;
          if (user !== clientId) {
            const callBtn = document.createElement('button');
            callBtn.textContent = '通话';
            callBtn.onclick = () => createPeerConnection(user,true);
            li.appendChild(callBtn);
          }
          userList.appendChild(li);
        });





    } else if (data.type === 'join-failed') {


        console.error(`Failed to join room: ${data.message}`);
        alert(`Failed to join room: ${data.message}`);



    } else if (data.type === 'offer') {
        if (!localPc) {
            createPeerConnection(data.fromId,false)
          }

        const peerId = data.fromId;
    const offer = data.offer;
        console.log("接收的offer",data)
        console.log(`来自 offer from ${data.fromId}`);

        try {
           
            
            handleRemoteOffer(peerId, offer); // 处理远端 Offer
        } catch (error) {
            console.error('Error handling offer:', error);
        }


    } else if (data.type === 'answer') {



        console.log(`来自 answer from ${data.fromId}`,data.answer);
        const conn = localPc
        if (conn) {

            conn.setRemoteDescription(data.answer);
        }



    } else if (data.type === 'candidate') {



        console.log(`Received candidate from ${data.fromId}`);
        const conn = localPc
        console.log("是否有远端的conn",conn)
        console.log("ice",data.candidate)
        if (conn) {
            console.log("交换开始")
            conn.addIceCandidate(data.candidate
            );
        }



    } else if (data.type === 'peer-disconnected') {
        // 成员离开，关闭连接
        console.log(`Peer ${data.peerId} has disconnected`);
    }

};
//创建 RTCPeerConnection
function createPeerConnection(peerId,isOfferer = false) {
   

    if (!localStream) {
        addLocalStream(peerId,) // 添加本地媒体流
    }

    const conn = new RTCPeerConnection();
    localPc=conn
    const dataChannel = conn.createDataChannel('chat');
    dataChannel.onopen = () => console.log('Data channel open');
    dataChannel.onmessage = (e) => document.getElementById('messageResponse').textContent = e.data;
    dataChannel.onclose = () => console.log('Data channel close');
    dataChannelMap.set(peerId, dataChannel);

    localStream.getTracks().forEach(track => {
        console.log("track", track);
        // console.log("stream", stream);
        conn.addTrack(track, localStream);
    });
    console.log("ice",peerId)
   
console.log("new RTCPeerConnection",conn)



    // 处理 ICE 候选者
    conn.onicecandidate = event => {
        console.log("生成ice")
        if (event.candidate) {
            console.log(`ICE candidate for ${peerId}:`, event.candidate);
            socket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate,
                toId: peerId,
                roomName: roomName
            }));
        }
    };

    

    // 处理接收到的远程流
    // 假设这是一个 function 或 class 中的一部分


conn.ontrack = (event) => {
    console.log("处理接收远处的流", event);

    // 使用 event.streams[0] 来获取完整的流
    const stream = event.streams[0];
    
    // 如果已经存在视频元素，直接更新流
    if (remoteVideos[peerId]) {
        const videoElement = remoteVideos[peerId];
        videoElement.srcObject = stream;
        // Optional: 更新其他属性，比如设置为 Playing
    } else {
        // 根据规范，可以直接访问 event.track，但 event.streams 是 best practice
        const videoElement = document.createElement('video');
        videoElement.id = `remoteVideo-${peerId}`;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.srcObject = stream; // 绑定流到 video 元素

        // 将视频元素添加到页面中
        document.body.appendChild(videoElement);

        // 存储远程视频元素，方便后续操作
        remoteVideos[peerId] = videoElement;

        // 监听媒体流结束
        stream.onended = () => {
            // 当媒体流结束时，移除对应的视频元素
            videoElement.remove();
            delete remoteVideos[peerId];
        };
    }
};

    if (isOfferer) {
        try {
            createAndSendOffer(conn,peerId)
        } catch (e) {
          console.error('创建 offer 失败', e);
        }
      }

}
//获取本地媒体流并添加到连接
function addLocalStream(peerId,) {
console.log("peerId",peerId)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream=stream
            localVideo.srcObject = stream;
            
        })
        .catch(error => console.error('Error accessing media devices.', error));
}
//创建 Offer 并发送
function createAndSendOffer(conn,peerId) {
    let offer_
    conn.createOffer()
        .then(offer => { 
            conn.setLocalDescription(offer) 
            offer_=offer
         })
        .then(() => {
            
            socket.send(JSON.stringify({
                type: 'offer',
                offer:offer_,
                toId: peerId,
                roomName: roomName
            }));
        })
        .catch(error => console.error('Error creating offer:', error));
}
//处理远端 Offer
function handleRemoteOffer(peerId, offer) {
    console.log("处理远端 Offer",peerId,offer)
    
    const conn = localPc
    console.log("conn",conn)
    conn.setRemoteDescription(offer)
        .then(() => {
          let  answer =conn.createAnswer()
            return answer
        })
        .then((answer) =>{
            conn.setLocalDescription(answer)
return answer

        } )
        .then((answer) => {

            socket.send(JSON.stringify({
                type: 'answer',
                answer: answer,
                toId: peerId,
                roomName: roomName
            }));

        })
        .catch(error => console.error('Error handling remote offer:', error));
}
function sendMessage() {
    const message = document.getElementById('messageInput').value;
    const dataChannel = dataChannelMap.get(clientId);
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(message);
      document.getElementById('messageInput').value = '';
    } else {
      alert('数据通道未建立或已关闭！');
    }
  }
// 错误和关闭处理
socket.onerror = error => {
    console.error('WebSocket error:', error);
};

socket.onclose = () => {
    console.log('Disconnected from signaling server');
};
addLocalStream(clientId)