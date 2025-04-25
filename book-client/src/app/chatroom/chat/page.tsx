// import Image from "next/image";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as SFS from "@mediapipe/selfie_segmentation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import useStore from "../../../store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}
interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: Message;
}

interface Message {
  type: "text" | "image";
  content: string;
}
interface User {
  id: number;
  email: string;
  headPic: string;
  nick_name: string;
  name: string;
  createTime: Date;
}
type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: ChatHistory;
    }
  | {
      type: "joinRoom";
      userId: number;
    }
  | {
      type: "videoCall";
    };

interface ChatHistory {
  id: number;
  content: string;
  type: number;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: User;
}
// ICE 服务器配置
const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:127.0.0.1:3478?transport=udp",
    username: "musen",
    credential: "123456",
    realm: "127.0.0.1",
  },
  {
    urls: "turn:127.0.0.1:3478?transport=tcp",
    username: "musen",
    credential: "123456",
    realm: "127.0.0.1",
  },
  {
    urls: "stun:127.0.0.1:3478",
    username: "musen",
    credential: "123456",
    realm: "127.0.0.1",
  },
];

const token = sessionStorage.getItem("token");
export function getUserInfo(): User {
  return JSON.parse(sessionStorage.getItem("userInfo")!);
}
//聊天室列表
async function chatroomList(params?: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chatroom/list";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);

  const data = await fetch(fullUrl, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
      Authorization: ("bearer " + token) as string,
    },

    // 请求体中包含要传递给服务器的数据
    // body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
  const result = await data.json();
  console.log("服务端返回数据");
  return result;
}
//某个聊天室历史记录
async function chatHistoryList(params?: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chat-history/list";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);

  const data = await fetch(fullUrl, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
      Authorization: ("bearer " + token) as string,
    },

    // 请求体中包含要传递给服务器的数据
    // body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
  const result = await data.json();
  console.log("历史记录服务端返回数据");
  return result;
}
export default function ChatPage({ props }) {
  const userInfo = getUserInfo();
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>();
  const socketRef = useRef<Socket>();
  const [roomList, setRoomList] = useState<Array<Chatroom>>();
  const [roomId, setChatroomId] = useState<number>();
  const [inputText, setInputText] = useState<string>("");
  const { chatroomId } = useStore();
  const [userIdslist, setUserIdslist] = useState<any>();
  const [userIds, setUserIds] = useState<any>();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isCallRequesting, setIsCallRequesting] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const virtualCanvasRef = useRef<HTMLCanvasElement>(null);
  const remotevirtualCanvasRef = useRef<HTMLCanvasElement>(null);
  const localPc = useRef<any>();
  const localStream = useRef<any>();
  const remoteVideos = useRef<any>({});
  const animationId = useRef<any>({});
  const canvasStream = useRef<any>({});
  const [showVirtualBg, setShowVirtualBg] = useState(false);
  const selfieSegmentation = useRef<any>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 添加自动滚动到底部的函数
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // 在消息更新后自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const queryChatroomList = async () => {
    try {
      const res = await chatroomList();
      console.log("聊天室列表:", res);
      if (res.code === 200) {
        setRoomList(
          res.list.map((item: any) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
        setUserIdslist(res.list.map((item: any) => item.userIds));
      }
    } catch (e: any) {
      //   message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
    }
  };
  const queryChatHistoryList = async (chatroomId: number) => {
    console.log("历史记录");
    try {
      const res = await chatHistoryList({ chatroomId: chatroomId });
      console.log("聊天历史", res);
      if (res.code === 200) {
        setChatHistory(
          res.res.map((item: any) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
      }
    } catch (e: any) {
      //   message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
    }
  };
  useEffect(() => {
    if (chatroomId) {
      queryChatHistoryList(chatroomId);
    }
    queryChatroomList();
  }, []);
  //websocket长连接
  useEffect(() => {
    if (!roomId) {
      return;
    }
    addLocalStream();
    const socket = (socketRef.current = io("http://localhost:4000"));
    socket.on("connect", () => {
      const payload: JoinRoomPayload = {
        chatroomId: roomId,
        userId: userInfo.id,
      };

      socket.emit("joinRoom", payload);

      socket.on("message", (reply: Reply) => {
        if (reply.type === "sendMessage") {
          console.log("接收消息", reply.message);
          setChatHistory((chatHistory) => {
            return chatHistory
              ? [...chatHistory, reply.message]
              : [reply.message];
          });
        }
        setTimeout(() => {
          document
            .getElementById("bottom-bar")
            ?.scrollIntoView({ block: "end" });
        }, 300);
        // if (reply.type === "joinRoom") {
        //   setMessageList((messageList) => [
        //     ...messageList,
        //     {
        //       type: "text",
        //       content: "用户 " + reply.userId + "加入聊天室",
        //     },
        //   ]);
        // } else {
        //   console.log("我发消息走这了么？");
        //   setMessageList((messageList) => [...messageList, reply.message]);
        // }
      });

      socket.on("videoCall", (reply: any) => {
        if (reply.type === "request") {
          console.log("接收到视频通话请求", reply);
          setIsVideoCallOpen(true);
        } else if (reply.type === "accept") {
          console.log("对方接受视频通话", reply, userInfo.id);
          // 对方接受视频通话，创建连接
          createPeerConnection(true);
          setIsInCall(true);
        } else if (reply.type === "reject") {
          console.log("对方拒绝视频通话");
          setIsVideoCallOpen(false);
          setIsInCall(false);
        } else if (reply.type === "offer") {
          console.log("reply.type === offer", reply);
          if (!localPc?.current) {
            createPeerConnection(false);
          }
          const toId = userIds?.filter((item: number) => {
            if (item !== userInfo.id) {
              return item;
            }
          });
          const peerId = toId[0];
          const offer = reply.offer;
          handleRemoteOffer(peerId, offer);
        } else if (reply.type === "answer") {
          console.log("reply.type === answer");
          const conn = localPc?.current;
          if (conn) {
            conn
              .setRemoteDescription(new RTCSessionDescription(reply.answer))
              .then(() => console.log("Answer 设置成功"))
              .catch((e) => console.error("设置 Answer 失败:", e));
          }
        } else if (reply.type === "candidate") {
          console.log("reply.type === candidate", reply.candidate);

          const conn = localPc?.current;
          if (conn && reply.candidate) {
            console.log("开始添加ICE candidate");
            try {
              conn.addIceCandidate(reply.candidate);
              console.log("ICE candidate添加成功");
            } catch (err) {
              console.error("添加ICE candidate失败:", err);
            }
          } else {
            console.warn("无法添加ICE candidate: 连接未建立或candidate为空");
          }
        } else if (reply.type === "error") {
          console.log("reply.type === error");
          alert(reply.message);
        }
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);
  function sendMessage(value: string) {
    if (!value) {
      return;
    }
    if (!roomId) {
      return;
    }
    const payload: SendMessagePayload = {
      sendUserId: getUserInfo().id,
      chatroomId: roomId,
      message: {
        type: "text",
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload);
  }
  console.log("历史机率chatHistory", chatHistory);

  //获取本地媒体流并添加到连接
  const addLocalStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (localVideoRef?.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing media devices.", error));
  };
  //创建 RTCPeerConnection
  const createPeerConnection = async (isOfferer = false) => {
    if (!localStream.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStream.current = stream;
          localVideoRef.current!.srcObject = stream;
          // // ✅ 确保流已添加后再创建 Offer
          // if (isOfferer) createAndSendOffer(localPc.current, peerId);
        })
        .catch(console.error);
    }

    const toId = userIds?.filter((item: number) => {
      if (item !== userInfo.id) {
        return item;
      }
    });
    const peerId = toId[0];
    console.log("createPeerConnection:", isOfferer);

    if (!localStream.current) {
      addLocalStream(); // 添加本地媒体流
    }
    const conn = new RTCPeerConnection({ iceServers });
    localPc.current = conn;
    // //发起方创建通过
    // if (isOfferer) {
    //   // 发起方创建数据通道并存储
    //   const localChannel = conn.createDataChannel("faqiChannel", {
    //     ordered: true,
    //     protocol: "json",
    //   });
    //   setupChannelEvents(localChannel, peerId);
    //   dataChannelMap.set(peerId, localChannel); // 存储到对应 peerId 的通道
    // } else {
    //   // ✅ 接收方通过事件获取对方创建的通道
    //   localPc.ondatachannel = (event) => {
    //     const receiveChannel = event.channel;

    //     setupChannelEvents(receiveChannel, peerId);
    //     dataChannelMap.set(peerId, receiveChannel); // 存储到对应 peerId 的通道
    //   };
    // }

    localStream?.current?.getTracks()?.forEach((track: any) => {
      console.log("track", track);
      // console.log("stream", stream);
      localPc.current.addTrack(track, localStream.current);
    });
    console.log("ice", peerId);

    console.log("new RTCPeerConnection", conn);

    // 处理 ICE 候选者
    localPc.current.onicecandidate = (event: any) => {
      console.log("生成ice");
      if (event.candidate) {
        console.log(`ICE candidate for ${peerId}:`, event.candidate);
        const toId = userIds?.find((id: number) => id !== userInfo.id);
        socketRef.current?.emit("videoCall", {
          type: "candidate",
          candidate: event.candidate,
          to: toId,
          chatroomId: roomId,
          from: userInfo.id,
        });
      } else {
        // ✅ 必须发送候选结束信号
        console.log("完整么？");
        // socketRef.current?.emit("videoCall", { type: "candidate_end" });
      }
    };

    // 处理接收到的远程流
    // 假设这是一个 function 或 class 中的一部分

    localPc.current.ontrack = (event) => {
      console.log("处理接收远程流", event);
      const stream = event.streams[0];

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        console.log("远程视频流已绑定到视频元素");

        // 确保本地视频流也正确显示
        if (localVideoRef.current && localStream.current) {
          localVideoRef.current.srcObject = localStream.current;
          console.log("本地视频流已重新绑定到视频元素");
        }

        // 监听媒体流的所有轨道状态
        stream.getTracks().forEach((track) => {
          console.log(
            `远程${track.kind}轨道状态:`,
            track.enabled,
            track.readyState
          );
          track.onended = () => {
            console.log(`远程${track.kind}轨道已结束`);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          };
        });

        // 监听视频元素的播放状态
        remoteVideoRef.current.onplay = () => {
          console.log("远程视频开始播放");
        };
        remoteVideoRef.current.onpause = () => {
          console.log("远程视频已暂停");
        };
      } else {
        console.error("远程视频元素引用不存在");
      }
    };
    localPc.current.oniceconnectionstatechange = () => {
      console.log("ICE 状态:", localPc.current.iceConnectionState);
      if (localPc.current.iceConnectionState === "connected") {
        console.log("连接成功，等待 ontrack 触发");
      }
    };
    console.log("isOfferer", isOfferer);

    if (isOfferer) {
      try {
        createAndSendOffer(conn, peerId);
        console.log("发offer");
      } catch (e) {
        console.error("创建 offer 失败", e);
      }
    }
  };
  //创建 Offer 并发送
  const createAndSendOffer = (conn: any, peerId: number) => {
    let offer_: any;
    conn
      .createOffer()
      .then((offer: any) => {
        conn.setLocalDescription(offer);
        offer_ = offer;
      })
      .then(() => {
        console.log("发送offer:", peerId, offer_);
        socketRef.current?.emit("videoCall", {
          type: "offer",
          offer: offer_,
          to: peerId,
          from: userInfo.id,
          chatroomId: roomId,
        });
      })
      .catch((error: any) => console.error("Error creating offer:", error));
  };

  //处理远端 Offer
  const handleRemoteOffer = (peerId: number, offer: any) => {
    console.log("处理远端 Offer", peerId, offer);

    const conn = localPc?.current;

    console.log("conn", conn);
    conn
      ?.setRemoteDescription(offer)
      .then(() => {
        let answer = conn?.createAnswer();
        return answer;
      })
      .then((answer: any) => {
        conn?.setLocalDescription(answer);
        return answer;
      })
      .then((answer: any) => {
        console.log("answer", answer);
        socketRef?.current?.emit("videoCall", {
          type: "answer",
          answer: answer,
          to: peerId,
          chatroomId: roomId,
          from: userInfo.id,
        });
      })
      .catch((error: any) =>
        console.error("Error handling remote offer:", error)
      );
  };
  //  初始化图像分割工具
  function initVb(bg: any) {
    console.log("触发initVB");
    console.log("bg", bg);
    if (virtualCanvasRef.current) {
      const canvasCtx = virtualCanvasRef.current.getContext("2d");
      console.log("canvasCtx", canvasCtx);
      const image = new window.Image();
      image.crossOrigin = "anonymous"; // 强制跨域请求携带凭据
      image.src = `/image/${bg}.jpeg`;
      console.log("image", image);
      selfieSegmentation.current = new SFS.SelfieSegmentation({
        locateFile: (file) => {
          console.log(file);
          return `/virtualbgmodel/${file}`; //ng  代理模型文件夹
          // return `https://cdn.jsdelivr.'net/npm/@mediapipe/selfie_segmentation@0.1.1632777926/${file}`;
        },
      });
      console.log("selfieSegmentation", selfieSegmentation.current);
      selfieSegmentation.current.setOptions({
        modelSelection: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      // 在初始化代码后添加测试逻辑
      const handleResults = (results: any) => {
        console.log("results", results);
        if (canvasCtx && virtualCanvasRef.current) {
          canvasCtx.save();
          canvasCtx.clearRect(
            0,
            0,
            virtualCanvasRef.current.width,
            virtualCanvasRef.current.height
          );

          // Prepare the new frame

          if (!image.complete || image.naturalWidth === 0) {
            console.error("图像未正确加载");
            return;
          }

          // 如果是视频，检查 readyState
          if (image.tagName === "VIDEO" && image.readyState < 2) {
            console.error("视频未就绪");
            return;
          }
          canvasCtx.drawImage(
            results.segmentationMask,
            0,
            0,
            virtualCanvasRef.current.width,
            virtualCanvasRef.current.height
          );
          //利用canvas绘制新背景
          //canvasCtx.globalCompositeOperation = 'source-in';则意味着处理分割后图像中的人体。
          canvasCtx.globalCompositeOperation = "source-out";
          canvasCtx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            virtualCanvasRef.current.width,
            virtualCanvasRef.current.height
          );
          canvasCtx.globalCompositeOperation = "destination-atop";
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            virtualCanvasRef.current.width,
            virtualCanvasRef.current.height
          );
          // Done
          canvasCtx.restore();
        }
      };
      selfieSegmentation.current.onResults(handleResults);
    }
  }
  //切换虚拟背景
  const virtualBg = () => {
    if (virtualCanvasRef?.current) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
      // if (canvasStream.current) {
      //   canvasStream.current.getTracks().forEach((track) => track.stop());
      // }
      let lastVideoTime = -1; // 使用数字类型记录上一帧的时间
      const getFrames = async () => {
        const currentTime = localVideoRef?.current?.currentTime || 0; // 获取当前视频时间
        if (currentTime > lastVideoTime) {
          // 比较视频时间戳
          await selfieSegmentation.current.send({
            image: localVideoRef.current,
          });
          lastVideoTime = currentTime; // 更新上一帧时间
        }
        animationId.current = requestAnimationFrame(getFrames);
      };
      getFrames();
      //通过此方法即可捕捉画布并转换成流。内部唯一的参数就是帧速率FPS，一般设置为 20 到 25 这个区间即可满足正常视觉上的视频流畅度。
      return virtualCanvasRef?.current.captureStream(25);
    }
    // })
  };
  //切换发送的远程流
  function changeRemoteStream(bg = "bg1") {
    initVb(bg);

    const stream = virtualBg();
    //先获取要替换的流 过滤音频 仅仅保留视频
    if (stream) {
      const [videoTrack] = stream.getVideoTracks();
      //主播端所有关联关系遍历并替换新的流

      const senders = localPc?.current?.getSenders();
      const send = senders.find((s) => s.track.kind === "video");
      send.replaceTrack(videoTrack);
      setShowVirtualBg(true); // 切换显示虚拟背景
    }
  }
  return (
    <>
      <div className="flex h-[calc(100%_-_30px)] bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="flex flex-col w-[20%] p-4 border-r border-pink-100">
          {/* 聊天室列表 */}
          {roomList?.map((item) => {
            return (
              <div
                className={`cursor-pointer mb-3 p-3 rounded-lg transition-all ${
                  roomId === item.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "hover:bg-pink-50"
                }`}
                key={item.id}
                data-id={item.id}
                onClick={() => {
                  queryChatHistoryList(item.id);
                  setChatroomId(item.id);
                  const UserIds = userIdslist.map(
                    (item_: any, index: number) => {
                      if (item.id == index + 1) {
                        return item_;
                      }
                    }
                  );
                  setUserIds(UserIds[0]);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <div
            ref={chatContainerRef}
            className="flex flex-col h-[80%] overflow-auto rounded-xl bg-white/50 backdrop-blur-sm shadow-lg p-4"
          >
            {/* 消息区 */}
            {chatHistory?.map((item) => {
              return (
                <div
                  className={`flex items-end mb-4 ${
                    item.senderId === userInfo.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                  data-id={item.id}
                  key={item.id}
                >
                  <div className="flex flex-col items-center mx-2">
                    <Image
                      src={item.sender.headPic || "/default-avatar.png"}
                      alt={item.sender.name}
                      width={40}
                      height={40}
                      className="rounded-full shadow-sm"
                    />
                    <span className="text-xs text-gray-500 mt-1">
                      {item.sender.name}
                    </span>
                  </div>
                  <div className="max-w-[60%]">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        item.senderId === userInfo.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm"
                          : "bg-white rounded-bl-sm"
                      }`}
                    >
                      {item.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(item.createTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
            <div id="bottom-bar" key="bottom-bar"></div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex">
              <Popover>
                <PopoverTrigger asChild>
                  <span className="cursor-pointer">表情</span>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <EmojiPicker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setInputText((inputText) => inputText + emoji.native);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <span className="mx-4 cursor-pointer">文件</span>
              <span className="cursor-pointer">图片</span>
              <span
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setIsCallRequesting(true);
                }}
              >
                视频通话
              </span>
            </div>
            <div className="flex">
              <Input
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  sendMessage(inputText);
                  setInputText("");
                }}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCallRequesting} onOpenChange={setIsCallRequesting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>视频通话请求</DialogTitle>
            <DialogDescription>通话中。。。</DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">是否要发起视频通话？</div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                setIsCallRequesting(false);
                setIsVideoCallOpen(true);
                setIsInCall(true);
                console.log();
                const toId = userIds?.filter((item: number) => {
                  if (item !== userInfo.id) {
                    return item;
                  }
                });
                console.log("toId", toId);
                const payload: any = {
                  type: "request",
                  from: userInfo.id,
                  to: toId[0],
                  chatroomId: roomId,
                  data: "对方请求视频通话",
                };

                socketRef.current?.emit("videoCall", payload);
              }}
            >
              确认
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCallRequesting(false)}
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoCallOpen} onOpenChange={setIsVideoCallOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>视频通话</DialogTitle>
            <DialogDescription>通话中。。。</DialogDescription>
          </DialogHeader>
          {isInCall ? (
            <>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="relative aspect-video bg-muted">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover absolute top-0 left-0
                    }`}
                  />
                  <canvas
                    ref={virtualCanvasRef}
                    className={`w-full h-full object-cover absolute top-0 left-0 ${
                      showVirtualBg ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                    {showVirtualBg ? "你的虚拟背景" : "你"}
                  </span>
                </div>

                <div className="relative aspect-video bg-muted">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                    对方
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsVideoCallOpen(false);
                    setIsInCall(false);
                  }}
                >
                  结束通话
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="ml-2 cursor-pointer" onClick={() => {}}>
                      虚拟背景
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-wrap">
                      {["bg1", "bg2", "bg3"]?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="w-[33%] h-[33%] cursor-pointer"
                            onClick={() => {
                              changeRemoteStream(item);
                            }}
                          >
                            <Image
                              src={`/image/${item}.jpeg`}
                              alt=""
                              width={100}
                              height={100}
                              className="rounded-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <div className="py-4">
              <div className="text-center mb-4">收到视频通话请求</div>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    const toId = userIds?.filter((item: number) => {
                      if (item !== userInfo.id) {
                        return item;
                      }
                    });
                    // 发送接受信号
                    socketRef.current?.emit("videoCall", {
                      type: "accept",
                      to: toId[0],
                      from: userInfo.id,
                      chatroomId: roomId,
                      data: null,
                    });
                    setIsInCall(true);
                  }}
                >
                  接受
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsVideoCallOpen(false);
                    // 发送拒绝信号
                    const toId = userIds?.filter((item: number) => {
                      if (item !== userInfo.id) {
                        return item;
                      }
                    });
                    socketRef.current?.emit("videoCall", {
                      type: "reject",
                      to: toId[0],
                      from: userInfo.id,
                      chatroomId: roomId?.toString(),
                      data: null,
                    });
                  }}
                >
                  拒绝
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
