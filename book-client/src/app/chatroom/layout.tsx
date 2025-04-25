"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface userInfo {
  id: string;
  name: string;
  password: string;
  nick_name: string;
  email: string;
  headPic: string;
  createTime: string;
  updateTime: string;
}
interface Tab {
  id: number;
  label: string;
  href: string;
  checked?: boolean;
}
const ChatroomLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [info, useInfo] = useState<userInfo>();
  const [tab, setTab] = useState<Tab[]>([
    {
      id: 0,
      label: "好友",
      href: "/chatroom/FriendsAddressBook",
      checked: false,
    },
    {
      id: 1,
      label: "群聊",
      href: "/chatroom/group",
      checked: false,
    },
    {
      id: 2,
      label: "1v1聊天",
      href: "/chatroom/chat",
      checked: false,
    },
    {
      id: 3,
      label: "收藏",
      href: "/chatroom/collection",
      checked: false,
    },
    {
      id: 4,
      label: "通知",
      href: "/chatroom/notification",
      checked: false,
    },
  ]);
  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useInfo(info);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          聊天室
        </div>
        <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
          <Image
            src="/124599.jfif"
            alt="用户头像"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-purple-200 hover:ring-purple-400 transition-all duration-300"
          />
          <span className="text-gray-700 font-medium">
            {info?.name || "未登录"}
          </span>
        </div>
      </div>
      <div className="flex flex-1 p-6 gap-6">
        <div className="w-[240px] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col py-4 gap-2">
            {tab.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-6 py-3 text-lg font-medium transition-all duration-300
                  ${
                    item.checked
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  }
                `}
                onClick={() => {
                  setTab(() =>
                    tab.map((item) => ({
                      ...item,
                      checked: item.id === index,
                    }))
                  );
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
export default ChatroomLayout;
