import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image src={"/icons/logo.png"} alt="logo" width={20} height={20} />
          <p> DevEvent</p>
        </Link>
        <ul>
          <Link href={"/"}>Home</Link>
          <Link href={"/events"}>Events</Link>
          <Link href={"/create"}> Create an Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
