// import Image from "next/image";
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useStore from "../../../store";
import JoinChatroomPage from "@/components/chatroomJoinModel";

// import { getPeopleList } from "@/app/actions";
export async function getPeopleList(params: any) {
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
//查询聊天室的所有用户-详情
async function getchatroomAllPeople(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chatroom/members";
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
//创建群聊
async function createGroup(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", params);
  const queryString = new URLSearchParams(params).toString();
  const url = "http://localhost:4000/chatroom/create-group";
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
//添加成员
export async function JoinChatroom(id: number, joinUsername: any) {
  // 将查询参数转换为 URL 编码的字符串
  console.log("进来了么", joinUsername);
  const queryString = new URLSearchParams(joinUsername).toString();
  const url = "http://localhost:4000/chatroom/join";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}/${id}?${queryString}`;
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
interface GroupSearchResult {
  id: number;
  name: string;
  type: boolean;
  userCount: number;
  userIds: Array<number>;
  createTime: Date;
}
export default function GroupPage({ props }) {
  console.log(props);
  const router = useRouter();
  const [TableList, setTablelist] = useState([]);
  const [chatroomPeopel, setChatroomPeopel] = useState([]);
  const { changeChatroomId } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const [groupName, setGroupName] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const Addform = useForm({
    defaultValues: {
      joinUsername: "",
    },
  });
  useEffect(() => {
    onSearch();
  }, []);
  const onSearch = async () => {
    // e.preventDefault();
    console.log("搜索");
    const data = await getPeopleList({ name: form.watch("name") });
    console.log("返回", data);
    const list = data?.list
      ?.filter((item: GroupSearchResult) => {
        return item.type === true;
      })
      .map((item: GroupSearchResult) => {
        return {
          ...item,
          key: item.id,
        };
      });
    if (data.code === 200) {
      setTablelist(list);
    }
  };

  //聊天
  const GoSendMes = (id: number) => {
    // 编辑操作的逻辑
    console.log("要去的聊天室id", id);
    changeChatroomId(id);
    router.push(`/chatroom/chat`); // 跳转
  };
  //详情
  const goDetail = async (id: number) => {
    const data = await getchatroomAllPeople({ chatroomId: id });
    if (data.code == 200) {
      setChatroomPeopel(data.users);
      setIsOpen(true);
    }
    console.log("xiangqing", data);
  };
  //添加成员
  const AddUsers = () => {
    Addform.clearErrors("joinUsername");
    // setIsOpenAdd(true);
  };
  const ActionButtons = ({ id }) => (
    <div className="flex items-center justify-items-end">
      <button onClick={() => GoSendMes(id)} className=" w-16 text-sky-400">
        聊天
      </button>
      <>
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => goDetail(id)}
              className=" btn btn-red  w-16 text-sky-400"
            >
              详情
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>群聊成员</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>昵称</TableHead>
                  <TableHead className="text-center">邮箱</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chatroomPeopel.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>

                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.nick_name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell className="text-center w-60">
                      {/* 传递编辑和删除的事件处理函数 */}
                      {/* <ActionButtons id={item.id} /> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
      <JoinChatroomPage AddUsers={AddUsers} id={id} onSearch={onSearch} />
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {" "}
                  <Button className="ml-4">创建群聊</Button>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>创建群聊</DialogTitle>
                  {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription> */}
                </DialogHeader>
                <Input
                  placeholder="群聊名字"
                  onBlur={(E) => setGroupName(E.target.value)}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={async () => {
                      console.log("创建的群聊名称:", groupName);
                      const data = await createGroup({ name: groupName });
                      if (data.code == 200) {
                      }
                    }}
                  >
                    创建
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">名称</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>人数</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TableList.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>

                <TableCell>{item.createTime}</TableCell>
                <TableCell>{item.userCount}</TableCell>
                <TableCell className="text-center w-60">
                  {/* 传递编辑和删除的事件处理函数 */}
                  <ActionButtons id={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
