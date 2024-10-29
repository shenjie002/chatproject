"use server";
//登录
export async function login(data: any) {
  const response = await fetch("http://localhost:4000/user/login", {
    method: "POST", // 指定请求方法为POST
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
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
//获取邮箱验证码
export async function getEmailCode(data: string) {
  //   const email = new URLSearchParams({ emailCode: data }).toString();
  //   console.log("email", email);
  await fetch(`http://localhost:4000/email/code?address=${data}`, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
    },
    // 请求体中包含要传递给服务器的数据
    // body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
}
//注册
export async function register(data: any) {
  const response = await fetch("http://localhost:4000/user/register", {
    method: "POST", // 指定请求方法为POST
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
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
//获取书籍列表
export async function getBookList(params: any) {
  // 将查询参数转换为 URL 编码的字符串
  const queryString = new URLSearchParams(params).toString();
  const url = "http://apis.juhe.cn/goodbook/query";
  // 将查询字符串附加到 URL
  const fullUrl = `${url}?${queryString}`;
  console.log("fullUrl", fullUrl);
  await fetch(fullUrl, {
    method: "Get", // 指定请求方法为Get
    headers: {
      "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是JSON格式的数据
    },
    // 请求体中包含要传递给服务器的数据
    // body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
}
//获取好友列表
export async function getPeopleList(params: any) {
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
    },

    // 请求体中包含要传递给服务器的数据
    // body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
  });
  console.log("服务端返回数据", data);
}
