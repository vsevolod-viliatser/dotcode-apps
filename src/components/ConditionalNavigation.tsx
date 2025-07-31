"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ConditionalNavigation() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return <Navigation />;
}
