"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  status: string;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/users",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data ?? []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `https://top-mart-api.onrender.com/admin/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-pink-500 font-bold">
            Users Management
          </h1>
          <p className="text-foreground/60">
            View and manage all users in the system
          </p>
        </div>
        <Button className="gap-2 bg-pink-500">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-foreground/60"
                  >
                    {loading ? "Loading..." : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-700">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(user._id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      {deleteConfirm === user._id && (
                        <div className="absolute bg-background border border-border rounded-lg p-4 shadow-lg z-50">
                          <p className="text-sm font-medium mb-4">
                            Are you sure you want to delete this user?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
