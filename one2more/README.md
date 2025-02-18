这是一个一对多的webrtc示例，展示了如何进行房间一对多通话  直播的形式
pc.addTransceiver() 是 WebRTC（网页实时通信）中 RTCPeerConnection 对象的方法，用于创建和管理媒体收发器（RTCRtpTransceiver）。它的核心功能是控制媒体数据（音频/视频）的发送（send）和接收（recv）行为，允许开发者对传输过程进行精细化控制。以下是具体说明：

创建收发器

为音频或视频生成一个独立的传输通道（Transceiver），通过它管理数据的收发逻辑。
控制传输方向

通过direction` 参数设定以下模式：
sendrecv（默认）：同时发送和接收媒体。
sendonly：仅发送媒体（如输出摄像头画面）。
recvonly：仅接收媒体（如播放对方声音）。
inactive：暂不传输。
支持动态操作

允许在连接后动态修改传输方向（例如从「仅接收」切换到「发送+接收」）。





