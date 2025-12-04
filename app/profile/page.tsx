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
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen bg-[#f5f5f5] pb-24"
    >
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-[#ff2d7a] text-white px-6 pt-10 pb-8 rounded-b-[40px] shadow-md"
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.28 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.3 }}
              className="h-16 w-16 rounded-full bg-white/30"
            />
            <div>
              <motion.p
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-semibold text-lg leading-tight"
              >
                {profile?.phone ?? "Loading..."}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
                className="text-xs opacity-90 mt-1"
              >
                ID: {profile?.uniqueId ?? "Loading..."}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.28 }}
            className="mt-5 bg-white/20 backdrop-blur-sm px-5 py-4 rounded-2xl"
          >
            <p className="text-xs opacity-90">My Balance</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.16 }}
              className="text-3xl font-bold tracking-wide mt-1"
            >
              ₦{profile?.balance ?? "..."}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* BODY */}
        <motion.div
          layout
          className="px-4 mt-6 space-y-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        >
          <Section title="FINANCIAL" delay={0.2}>
            <Item icon={<Send size={20} />} text="Withdraw" path="/withdraw" />
            <Item
              icon={<Building2 size={20} />}
              text="Bank Account"
              path="/bank-account"
            />
          </Section>

          <Section title="RECORDS" delay={0.24}>
            <Item icon={<Banknote size={20} />} text="Deposit Records" />
            <Item icon={<Banknote size={20} />} text="Withdrawal Records" />
            <Item icon={<FileText size={20} />} text="Income Records" />
          </Section>

          <Section title="NETWORK" delay={0.28}>
            <Item icon={<Users size={20} />} text="My Team" />
          </Section>

          <Section title="SUPPORT" delay={0.32}>
            <Item icon={<Users size={20} />} text="Telegram Group" />
          </Section>

          <Section title="ACCOUNT" delay={0.36}>
            <Item
              icon={<Lock size={20} />}
              text="Change Password"
              path="/change-password"
            />
            <Item
              icon={<LogOut size={20} />}
              text="Logout"
              onClick={handleLogout}
            />
          </Section>
        </motion.div>
      </div>

      <BottomNav />
    </motion.div>
  );
}

function Section({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <p className="text-[11px] font-semibold text-slate-500 mb-2 tracking-wide">
        {title}
      </p>
      <motion.div
        layout
        initial={{ scale: 0.995, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.02 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
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
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.98, backgroundColor: "rgba(15, 23, 42, 0.03)" }}
      whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.03)" }}
      className="w-full flex items-center justify-between py-4 px-4 transition"
    >
      <div className="flex items-center space-x-3 text-slate-700">
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          {icon}
        </motion.div>
        <span className="text-[15px]">{text}</span>
      </div>
      <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
        <ArrowRight size={18} className="text-slate-400" />
      </motion.div>
    </motion.button>
  );
}
