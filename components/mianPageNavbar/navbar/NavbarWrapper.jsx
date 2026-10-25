"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NanBar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // قائمة المسارات التي لا تريد عرض الناف بار فيها
  const hiddenRoutes = ["/dashboard", "/login", "/register"];

  // التحقق مما إذا كان المسار الحالي يبدأ بأحد المسارات المخفية
  const isHidden = hiddenRoutes.some((route) => pathname.startsWith(route));

  // إذا كانت الصفحة ضمن القائمة المخفية، لا تعرض شيئاً
  if (isHidden) return null;

  return <Navbar />;
}
