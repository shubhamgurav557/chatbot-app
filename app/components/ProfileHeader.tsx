"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const ProfileHeader = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false }); 
    router.push("/");
  };

  return (
    <>
      <div className="profile flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="details flex flex-col gap-0 items-end">
          <span className="text-md mb-0">{session?.user.name}</span>
          <span className="text-xs text-gray-400">{session?.user.email}</span>
        </div>
        <div className="image w-30 h-30 text-lg bg-emerald-300 p-3 rounded-full">
          {session?.user.name?.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="dropdown absolute mt-[8em] right-5 w-40 bg-gray-400 shadow-lg rounded-md p-2 z-10"
        >
          <button
            onClick={handleLogout}
            className="w-full text-white text-sm flex gap-2 items-center justify-center py-2 px-3 rounded-md hover:text-emerald-400"
          >
            Logout
            <FiLogOut />
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
