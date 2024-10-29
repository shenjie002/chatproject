// import Image from "next/image";
"use client";
import { Button } from "@/components/ui/button";
import { login } from "../actions";
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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: any) => {
    // 处理服务端错误
    const response = await login({
      name: data.name,
      password: data.password,
    });

    if (!response?.ok) {
      // 显示服务端错误
      const errorKeys = Object.keys(response.message);
      errorKeys.forEach((key) => {
        form.setError(key, {
          type: "server",
          message: response.message[key],
        });
      });
      return;
    }

    localStorage.setItem("token", response.token);
    localStorage.setItem("userInfo", JSON.stringify(response.user));
    form.reset();
    router.push(`/book`); // 跳转
  };
  return (
    <div className="w-full h-full flex-col flex justify-center items-center ">
      <div className="text-4xl">聊天管理</div>
      <div
        className="flex-col flex justify-center items-center rounded border 
border-solid border-gray-500 w-[600px] h-[400px]"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输入您的用户名：</FormLabel>
                  <FormControl>
                    <Input placeholder="用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输入您的密码：</FormLabel>
                  <FormControl>
                    <Input placeholder="密码" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link href="/register">没有账户，马上注册</Link>
            <Button type="submit" className="w-full">
              登录
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
