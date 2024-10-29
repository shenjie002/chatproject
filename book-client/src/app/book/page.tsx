// import Image from "next/image";
// "use client";

import { getBookList } from "../actions";

export default async function BookPage() {
  const list = await getBookList({
    key: "97ee6902c92733669b6d88516069be9a",
    catalog_id: 1,
    pn: 1,
    rn: 30,
    dtype: "json",
  });
  console.log("list", list);
  return (
    <>
      <div></div>
    </>
  );
}
