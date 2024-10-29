export default function FriendsAddressBookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <div>我的好友</div>
      {children}
    </div>
  );
}
