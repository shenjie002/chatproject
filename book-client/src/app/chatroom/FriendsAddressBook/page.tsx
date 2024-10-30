// import Image from "next/image";
"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const token = localStorage.getItem("token");

async function getPeopleList(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/friendship/list";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);

  const data = await fetch(fullUrl, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
      Authorization: ("bearer " + token) as string,
    },
  });
  const result = await data.json();
  console.log("服务端返回数据");
  return result;
}
//创建一对一聊天窗口
async function createOneToOneChatroom(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chatroom/create-one-to-one";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);

  const data = await fetch(fullUrl, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
      Authorization: ("bearer " + token) as string,
    },
  });
  const result = await data.json();
  console.log("服务端返回数据");
  return result;
}
//添加好友
export async function addFriendsPost(data: any) {
  console.log("添加好友", data);
  const response = await fetch("http://localhost:4000/friendship/add", {
    method: "POST", // 指定请求方法为POST
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
      Authorization: ("bearer " + token) as string,
    },
    // 请求体中包含要传递给服务器的数据
    body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
  console.log("服务响应", response);
  //   // 检查响应状态
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  // 解析JSON响应体
  const json = await response.json();
  console.log("返回的json", json);
  return json; // 返回解析后的数据
}
export default function FriendsAddressBookPage({ props }) {
  console.log(props);
  const [TableList, setTablelist] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const Modelform = useForm({
    defaultValues: {
      name: "",
      reason: "",
    },
  });

  useEffect(() => {
    onSearch();
  }, []);
  const onSearch = async () => {
    // e.preventDefault();
    console.log("搜索");
    const list = await getPeopleList({ name: form.watch("name") });
    console.log("返回", list);
    setTablelist(list);
  };

  //聊天
  const GoSendMes = async (id: number) => {
    console.log("编辑", id);
    // 编辑操作的逻辑
    const data = await createOneToOneChatroom({ friendId: id });
    console.log("创建一对一聊天窗口", data);
    if (data.code == 200) {
      alert(data.ok);
    }
  };

  const ActionButtons = ({ id }) => (
    <div className="flex items-center justify-items-end">
      <button
        onClick={() => GoSendMes(id)}
        className="btn btn-blue w-16 text-blue-500"
      >
        聊天
      </button>
      {/* <button onClick={onDelete} className=" btn btn-red  w-16">
        删除
      </button> */}
    </div>
  );
  //添加好友model
  const addFriends = () => {
    setOpenModel(true);
  };
  //取消
  const onCancel = () => {
    setOpenModel(false);
  };
  //添加好友
  const addFriendsGo = async () => {
    const data = await addFriendsPost({
      name: Modelform.watch("name"),
      reason: Modelform.watch("reason"),
    });
  };
  return (
    <>
      <div className=" ">
        <Form {...form} onSubmit={(event) => event?.preventDefault()}>
          <form
            onSubmit={(event) => event?.preventDefault()}
            className="flex items-center"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel className="w-[87px] text-center leading-10">
                    名称：
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span
              className="mt-1 mx-8 bg-gray-600 text-white rounded cursor-pointer w-[80px] h-[30px] text-center leading-8"
              onClick={onSearch}
            >
              搜索
            </span>
            <Button onClick={addFriends}>添加好友</Button>
          </form>
        </Form>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">昵称</TableHead>
              <TableHead>头像</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TableList.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nick_name}</TableCell>
                <TableCell>
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell className="text-center w-60">
                  {/* 传递编辑和删除的事件处理函数 */}
                  <ActionButtons id={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          className={`${
            openModel ? "block" : "hidden"
          } relative top-[-94px] z-30 bg-gray-500 w-[70%] h-[400px] bg-opacity-90`}
        >
          <div className="flex flex-col w-full h-full items-center justify-center">
            <Form {...Modelform} onSubmit={(event) => event?.preventDefault()}>
              <form onSubmit={(event) => event?.preventDefault()} className="">
                <FormField
                  control={Modelform.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormLabel className="w-[87px] text-center leading-10">
                        用户名称：
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="用户名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={Modelform.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormLabel className="w-[87px] text-center leading-10">
                        添加理由：
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="添加理由" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span
                  className="mt-1 mr-8 bg-gray-600 text-white rounded cursor-pointer w-[80px] h-[30px] text-center leading-8"
                  onClick={onCancel}
                >
                  取消
                </span>
                <Button onClick={addFriendsGo}>添加好友</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
