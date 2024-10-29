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
import { useState } from "react";
// import { getPeopleList } from "@/app/actions";
async function getPeopleList(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chatroom/list";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);
  const token = localStorage.getItem("token");
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
export default function GroupPage({ props }) {
  console.log(props);
  const [TableList, setTablelist] = useState([]);
  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSearch = async (e) => {
    e.preventDefault();
    console.log("搜索");
    const data = await getPeopleList({ name: form.watch("name") });
    console.log("返回", data);
    if (data.code === 200) {
      setTablelist(data.list);
    }
  };
  const data = [
    {
      id: 1,
      nickname: "John Doe",
      avatar: "path/to/avatar.jpg",
      email: "john@example.com",
    },
    // ...其他行数据
  ];
  //聊天
  const GoSendMes = (id) => {
    console.log("编辑", id);
    // 编辑操作的逻辑
  };

  const ActionButtons = ({ GoSendMes }) => (
    <div className="flex items-center justify-items-end">
      <button onClick={GoSendMes} className="btn btn-blue w-16">
        聊天
      </button>
      {/* <button onClick={onDelete} className=" btn btn-red  w-16">
        删除
      </button> */}
    </div>
  );
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
              className="mt-1 ml-8 bg-gray-600 text-white rounded cursor-pointer w-[80px] h-[30px] text-center leading-8"
              onClick={onSearch}
            >
              搜索
            </span>
          </form>
        </Form>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">名称</TableHead>
              <TableHead>创建时间</TableHead>

              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TableList.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>

                <TableCell>{item.createTime}</TableCell>
                <TableCell className="text-center w-60">
                  {/* 传递编辑和删除的事件处理函数 */}
                  <ActionButtons GoSendMes={() => GoSendMes(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
