"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { JoinChatroom } from "@/app/chatroom/group/page";

export default function JoinChatroomPage({ AddUsers, id, onSearch }) {
  const [AddName, setAddName] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button onClick={() => AddUsers(id)} className=" w-16 text-sky-400">
          添加成员
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加成员</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Input
          onBlur={(e) => {
            setAddName(e.target.value);
            console.log(e.target.value);
          }}
        ></Input>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div>
              <Button type="button" variant="secondary" className="mr-4">
                Close
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  console.log(AddName);
                  if (AddName) {
                    console.log("aaaa", AddName);
                    const data = await JoinChatroom(id, {
                      joinUsername: AddName,
                    });
                    // console.log("加入群聊", data);
                    if (data.code == 200) {
                      onSearch();
                    }
                    // if (!data?.ok) {
                    //   // 显示服务端错误
                    //   const errorKeys = Object.keys(data.message);
                    //   errorKeys.forEach((key) => {
                    //     Addform.setError(key, {
                    //       type: "server",
                    //       message: data.message[key],
                    //     });
                    //   });
                    //   return;
                    // } else {
                    //   setIsOpenAdd(false);
                    // }
                  } else {
                    // toast("请输入您想添加的用户名称", {
                    //   duration: 5000, // 显示时长（毫秒）
                    //   position: "top-right", // 显示位置
                    //   icon: "🟢", // 自定义图标
                    //   style: {
                    //     background: "green", // 自定义背景颜色
                    //     color: "white", // 自定义文字颜色
                    //   },
                    // });
                  }
                }}
              >
                添加成员
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
