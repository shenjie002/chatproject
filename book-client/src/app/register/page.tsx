// import Image from "next/image";
"use client";
import { Button } from "@/components/ui/button";
import { getEmailCode, register } from "../actions";
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
export default function RegisterPage() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "", //再次确认密码
      emailCode: "", //从邮箱获取的验证码
    },
  });
  const router = useRouter();
  const onSubmit = async (data: any) => {
    // 处理服务端错误
    const response = await register({
      name: data.name,
      email: data.email,
      emailCode: data.emailCode,
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

    form.reset();
    router.push(`/login`); // 跳转
  };
  //获取邮箱验证码
  const EmailGetCode = () => {
    form.clearErrors("email");
    console.log("EmailGetCode----------", form.watch("email"));
    if (form.watch("email")) {
      getEmailCode(form.watch("email"));
    } else {
      form.setError("email", {
        type: "server",
        message: "请输入您的邮箱",
      });
    }
  };
  //再次输入您的密码
  const confirmPasswordBlur = () => {
    if (form.watch("confirmPassword") !== form.watch("password")) {
      form.setError("confirmPassword", {
        type: "server",
        message: "两次密码不一样",
      });
    } else {
      // 如果密码相同，清除之前设置的错误
      form.clearErrors("confirmPassword");
    }
  };
  return (
    <div className="w-full h-full flex-col flex justify-center items-center ">
      <div className="text-4xl">用户注册中心</div>
      <div
        className="flex-col flex justify-center items-center rounded border 
border-solid border-gray-500 w-[600px] h-[600px]"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输入您的邮箱：</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="邮箱"
                      {...field}
                      onFocus={() => {
                        form.clearErrors("email");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a onClick={EmailGetCode} className="text-blue-500 cursor-pointer">
              发送邮箱验证码
            </a>
            <FormField
              control={form.control}
              name="emailCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>请输入您的邮箱验证码：</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="邮箱验证码"
                      type="password"
                      {...field}
                    />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>再次输入您的密码：</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="确认密码"
                      type="password"
                      {...field}
                      onBlur={confirmPasswordBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link href="/login">已有账户，马上登录</Link>
            <Button type="submit" className="w-full">
              注册
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
