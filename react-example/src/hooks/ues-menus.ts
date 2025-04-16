import { useState } from "react";

export function useMenus() {
  const [menus, setMenus] = useState([]);
  return { menus };
}
