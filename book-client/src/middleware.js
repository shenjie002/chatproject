import { NextResponse } from "next/server";

// 中间件可以是 async 函数，如果使用了 await
export function middleware(request) {
  return NextResponse.redirect(new URL("/login", request.url));
}

// 设置匹配路径
export const config = {
  matcher: [
    {
      source: "/book/:path*",
      has: [
        { type: "header", key: "Authorization", value: "Bearer Token" },
        { type: "query", key: "userId", value: "123" },
      ],
      //   missing: [{ type: "cookie", key: "session", value: "active" }],
    },
  ],
};
