// import Image from "next/image";
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const token = localStorage.getItem("token");
async function getNotificationList() {
  // 将查询参数转换为 URL 编码的字符串

  const url = "http://localhost:4000/friendship/request_list";
  // 将查询字符串附加到 URL
  //   const fullUrl = `${url}?${queryString}`;
  //   console.log("fullUrl", fullUrl);

  const data = await fetch(url, {
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
//通过
async function agreeFriendRequest(id: string) {
  // 将查询参数转换为 URL 编码的字符串

  const url = `http://localhost:4000/friendship/agree/${id}`;
  // 将查询字符串附加到 URL
  //   const fullUrl = `${url}?${queryString}`;
  //   console.log("fullUrl", fullUrl);

  const data = await fetch(url, {
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
//拒绝
async function rejectFriendRequest(id: string) {
  // 将查询参数转换为 URL 编码的字符串

  const url = `http://localhost:4000/friendship/reject/${id}`;
  // 将查询字符串附加到 URL
  //   const fullUrl = `${url}?${queryString}`;
  //   console.log("fullUrl", fullUrl);

  const data = await fetch(url, {
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

export default function NotificationPage() {
  const [selectTab, SetSelectTab] = useState(0);
  const [TableList, setTablelist] = useState([]);
  useEffect(() => {
    listQuery();
  }, [selectTab]);

  const listQuery = async () => {
    const result = await getNotificationList();
    console.log("列表数据", result);
    if (selectTab == 0) {
      setTablelist(result.toMe);
    } else {
      setTablelist(result.fromMe);
    }
  };

  const ActionButtons = ({ id, status }) => {
    console.log("status", status);
    if (status == 1) {
      return "已通过";
    }
    return (
      <div className="flex items-center justify-items-end">
        <button onClick={() => YesSendMes(id)} className="btn btn-blue w-16">
          通过
        </button>
        <button onClick={() => NoSendMes(id)} className=" btn btn-red  w-16">
          拒绝
        </button>
      </div>
    );
  };

  const StatusSpan = ({ status }) => {
    if (status == 2) {
      return <button className=" btn btn-red  w-16">已拒绝</button>;
    } else if (status == 1) {
      return <button className=" btn btn-red  w-16">已通过</button>;
    }
    return (
      <div className="flex items-center justify-items-end">
        <button className="btn btn-blue w-16">申请中</button>
      </div>
    );
  };
  //通过
  const YesSendMes = async (id) => {
    const result = await agreeFriendRequest(id);
    console.log("通过", result);
    if (result.code == 200) {
      listQuery();
    }

    // 编辑操作的逻辑
  };
  //拒绝
  const NoSendMes = async (id) => {
    const result = await rejectFriendRequest(id);
    console.log("拒绝", result);
    if (result.code == 200) {
      listQuery();
    }

    // 编辑操作的逻辑
  };
  return (
    <>
      <div className="flex w-[300px] ml-4">
        <div
          className={`cursor-pointer border-solid border-blue-600 ${
            selectTab == 0 ? "border-b-4" : ""
          }`}
          onClick={() => SetSelectTab(0)}
        >
          发给我的
        </div>
        <span className="mx-3">|</span>
        <div
          className={`cursor-pointer border-solid border-blue-600 ${
            selectTab == 1 ? "border-b-4" : ""
          }`}
          onClick={() => SetSelectTab(1)}
        >
          我发出的
        </div>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">用户</TableHead>
            <TableHead>请求时间</TableHead>
            <TableHead>请求理由</TableHead>
            {selectTab == 1 ? (
              <TableHead className="text-center">状态</TableHead>
            ) : (
              <TableHead className="text-center">操作</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {TableList.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {selectTab == 1 ? item?.toUser?.name : item?.fromUser?.name}
              </TableCell>

              <TableCell>
                {selectTab == 1
                  ? item?.toUser?.createTime
                  : item?.fromUser?.createTime}
              </TableCell>
              <TableCell>{item?.reason}</TableCell>
              <TableCell className="text-center w-60">
                {/* 传递编辑和删除的事件处理函数 */}
                {selectTab == 0 ? (
                  <ActionButtons
                    id={`${item?.fromUserId}`}
                    status={item.status}
                  />
                ) : (
                  <StatusSpan status={item.status} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
