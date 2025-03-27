"use client";
import Link from "next/link";
import Logo from "./logo";
import { useAuth } from "@/utils/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const { token, username, phone, coin, logout } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-100/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center gap-6">
            <Logo />
            {/* 导航栏 */}
            <nav className="hidden md:flex gap-4 text-gray-900">
              <Link href="/" className="hover:text-white">主页</Link>
              <Link href="/train" className="hover:text-white">训练</Link>
              <Link href="/generate" className="hover:text-white">生图</Link>
              <Link href="/models" className="hover:text-white">模型库</Link>
            </nav>
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              {token ? (
                <button
                  onClick={logout}
                  className="btn-sm relative bg-red-600 text-white py-[5px] hover:bg-red-700 cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="btn-sm relative bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                >
                  Sign In
                </Link>
              )}
            </li>
            {token ? (
              // 用户已登录，显示头像
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <FaUserCircle className="w-10 h-10 text-gray-400" />
                {/* 悬停显示信息框 */}
                {showInfo && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white shadow-md rounded-lg p-2 z-50">
                    <p className="text-sm font-semibold">{username}</p>
                    <p className="text-xs text-gray-600">{phone}</p>
                    <Link href="/profile" className="block text-blue-500 text-sm mt-2">个人中心</Link>
                  </div>
                )}
              </div>
            ) : (
              <li>
                <Link
                  href="/signup"
                  className="btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

