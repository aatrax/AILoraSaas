"use client";
// export const metadata = {
//   title: "Sign In - Open PRO",
//   description: "Page description",
// };
import SignIn from "./signin";
import { AuthProvider } from "@/utils/AuthContext";

export default function SignIn_Page() {
  return (
    <AuthProvider>
        <SignIn />
    </AuthProvider>
  );
}
