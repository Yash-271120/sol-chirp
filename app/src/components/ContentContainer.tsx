import { FC } from "react";
import Link from "next/link";

interface ContentContainerProps {
  children: React.ReactNode;
}

export const ContentContainer = (props:any) => {
  return (
    <div className="flex-1 drawer h-52">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center  drawer-content">{props.children}</div>

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
          <li>
            <h1>Menu</h1>
          </li>
          <li>
            <Link href="/">Home</Link>
          </li>

        </ul>
      </div>
    </div>
  );
};
