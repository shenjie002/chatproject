export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <div className="h-[30px]">聊天</div>
      {children}
    </div>
  );
}
