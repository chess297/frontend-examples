import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo List Page",
  description: "Todo List Page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1 className="text-3xl  text-center">Todo List Page</h1>
      <main>{children}</main>
    </div>
  );
}
