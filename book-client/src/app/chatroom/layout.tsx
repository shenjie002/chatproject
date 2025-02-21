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
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between p-[40px]  h-[20%]">
        <div className="text-5xl">聊天室</div>
        <div className="flex items-center">
          <Image
            src="/124599.jfif"
            alt=""
            width={50}
            height={50}
            className="rounded-full"
          />
          {info && info.name}
        </div>
      </div>
      <div className="flex flex-1 ">
        <div className="w-[20%] flex flex-col justify-around items-center text-2xl border  border-solid border-gray-10">
          {tab.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full  hover:bg-blue-300 text-center ${
                item.checked ? "bg-blue-300" : ""
              }`}
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
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
export default ChatroomLayout;
