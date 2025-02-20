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

const ChatroomLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [info, useInfo] = useState<userInfo>();
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
        {/* <div className="text-5xl">聊天室</div> */}
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
          <Link
            href="/chatroom/FriendsAddressBook"
            className="w-full  hover:bg-blue-300 text-center"
          >
            好友
          </Link>
          <Link
            href="/chatroom/group"
            className="w-full hover:bg-blue-300 text-center"
          >
            群聊
          </Link>
          <Link
            href="/chatroom/chat"
            className="w-full hover:bg-blue-300 text-center"
          >
            1v1聊天
          </Link>
          <Link
            href="/chatroom/collection"
            className="w-full hover:bg-blue-300 text-center"
          >
            收藏
          </Link>
          <Link
            href="/chatroom/notification"
            className="w-full hover:bg-blue-300 text-center"
          >
            通知
          </Link>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
export default ChatroomLayout;
