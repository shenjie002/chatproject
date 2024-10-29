export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <div>我加入的群聊</div>
      {children}
    </div>
  );
}
