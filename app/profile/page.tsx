"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BottomNav } from "@/components/bottom-nav";
import {
  ArrowRight,
  Building2,
  FileText,
  Users,
  Lock,
  LogOut,
  Send,
  Banknote,
} from "lucide-react";

interface Profile {
  phone: string;
  balance: number;
  uniqueId: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    (async () => {
      const { getCurrentUser } = useAuthStore.getState();
      await getCurrentUser();
    })();
  }, []);

  // redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // fetch latest profile from backend
    (async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setProfile({
          phone: currentUser.phone,
          balance: currentUser.balance,
          uniqueId: currentUser.uniqueId,
        });
      }
    })();
  }, [isAuthenticated, router, getCurrentUser]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <div className="bg-[#ff2d7a] text-white px-6 pt-10 pb-8 rounded-b-[40px] shadow-md">
          <div className="flex items-center space-x-3">
            <div className="h-16 w-16 rounded-full bg-white/30" />
            <div>
              <p className="font-semibold text-lg leading-tight">
                {profile?.phone ?? "Loading..."}
              </p>
              <p className="text-xs opacity-90 mt-1">
                ID: {profile?.uniqueId ?? "Loading..."}
              </p>
            </div>
          </div>

          <div className="mt-5 bg-white/20 backdrop-blur-sm px-5 py-4 rounded-2xl">
            <p className="text-xs opacity-90">My Balance</p>
            <p className="text-3xl font-bold tracking-wide mt-1">
              ₦{profile?.balance ?? "..."}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="px-4 mt-6 space-y-7">
          <Section title="FINANCIAL">
            <Item icon={<Send size={20} />} text="Withdraw" path="/withdraw" />
            <Item
              icon={<Building2 size={20} />}
              text="Bank Account"
              path="/bank-account"
            />
          </Section>

          <Section title="RECORDS">
            <Item icon={<Banknote size={20} />} text="Deposit Records" />
            <Item icon={<Banknote size={20} />} text="Withdrawal Records" />
            <Item icon={<FileText size={20} />} text="Income Records" />
          </Section>

          <Section title="NETWORK">
            <Item icon={<Users size={20} />} text="My Team" />
          </Section>

          <Section title="SUPPORT">
            <Item icon={<Users size={20} />} text="Telegram Group" />
          </Section>

          <Section title="ACCOUNT">
            <Item icon={<Lock size={20} />} text="Change Password" />
            <Item
              icon={<LogOut size={20} />}
              text="Logout"
              onClick={handleLogout}
            />
          </Section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-500 mb-2 tracking-wide">
        {title}
      </p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  text: string;
  path?: string;
  onClick?: () => void;
}

function Item({ icon, text, path, onClick }: ItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) return onClick();
    if (path) router.push(path);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between py-4 px-4 hover:bg-slate-50 transition"
    >
      <div className="flex items-center space-x-3 text-slate-700">
        {icon}
        <span className="text-[15px]">{text}</span>
      </div>
      <ArrowRight size={18} className="text-slate-400" />
    </button>
  );
}
