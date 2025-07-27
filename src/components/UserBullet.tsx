"use client";
import { useState, useRef, useEffect } from "react";
import { LogOut, UserIcon, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import { deleteSession } from "@/service/auth/auth";
import { toast } from "sonner";
import { ClientUser } from "@/lib/types";

const UserBullet = ({ user }: { user: ClientUser }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    // Logout handler (replace with your actual logout logic)
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            deleteSession().then(() => router.push('/auth/login'))
                .catch((err) => toast.error(err.message));
        }
        router.push("/auth/login");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200 focus:outline-none bg-slate-900"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={open}
            >
                <div className="relative">
                    <Image
                        className="w-7 h-7 rounded-full ring-2 ring-slate-800 shadow-sm"
                        src={user.picture}
                        alt="Profile"
                        width={28}
                        height={28}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <span>{user.firstName}</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50 animate-fade-in">
                    <ul className="py-1">
                        <li>
                            <Link
                                href={"/zhi"}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-slate-800 hover:text-blue-400 transition"
                                onClick={() => setOpen(false)}
                            >
                                <UserIcon className="w-4 h-4" />
                                Profile
                            </Link>
                        </li> 
                        <li>
                            <Link
                                href="/zhi/qatarat"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-slate-800 hover:text-blue-400 transition"
                                onClick={() => setOpen(false)}
                            >
                                <Waves className="w-4 h-4" />
                                My Ocean
                            </Link>
                        </li> 
                        <li>
                            <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-slate-800 hover:text-blue-400 transition"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserBullet;