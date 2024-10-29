// import Image from "next/image";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

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

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: Message;
    }
  | {
      type: "joinRoom";
      userId: number;
    };

interface ChatHistory {
  id: number;
  content: string;
  type: number;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: UserInfo;
}
const token = localStorage.getItem("token");
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
  console.log("服务端返回数据");
  return result;
}
export default function ChatPage({ props }) {
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>();
  const socketRef = useRef<Socket>();
  const [roomList, setRoomList] = useState<Array<Chatroom>>();
  const [roomId, setChatroomId] = useState<number>();
  const [inputText, setInputText] = useState<string>("");

  async function queryChatroomList() {
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
      }
    } catch (e: any) {
      //   message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
    }
  }
  async function queryChatHistoryList(chatroomId: number) {
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
  }
  useEffect(() => {
    queryChatroomList();
  }, []);
  //websocket长连接
  useEffect(() => {
    const socket = (socketRef.current = io("http://localhost:4000"));
    socket.on("connect", function () {
      const payload: JoinRoomPayload = {
        chatroomId: 1,
        userId: 1,
      };

      socket.emit("joinRoom", payload);

      socket.on("message", (reply: Reply) => {
        if (reply.type === "joinRoom") {
          setMessageList((messageList) => [
            ...messageList,
            {
              type: "text",
              content: "用户 " + reply.userId + "加入聊天室",
            },
          ]);
        } else {
          setMessageList((messageList) => [...messageList, reply.message]);
        }
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);
  function sendMessage(value: string) {
    const payload2: SendMessagePayload = {
      sendUserId: 1,
      chatroomId: 1,
      message: {
        type: "text",
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload2);
  }
  return (
    <>
      <div className="flex">
        <div className="flex flex-col w-[20%]">
          {/* 聊天室列表 */}
          {roomList?.map((item) => {
            return (
              <div
                className="cursor-pointer"
                key={item.id}
                data-id={item.id}
                onClick={() => {
                  queryChatHistoryList(item.id);
                  setChatroomId(item.id);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col">
            {/* 消息区 */}

            {chatHistory?.map((item) => {
              console.log(item, "item");
              return (
                <div className="message-item" data-id={item.id} key={item.id}>
                  <div className="message-sender">
                    <img src={item.sender.headPic} />
                    <span className="sender-nickname">{item.sender.name}</span>
                  </div>
                  <div className="message-content">{item.content}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <span>表情</span>
              <span>文件</span>
              <span>图片</span>
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
    </>
  );
}
