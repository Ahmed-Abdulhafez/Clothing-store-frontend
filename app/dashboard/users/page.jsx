"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Search,
  Users,
  ShieldCheck,
  UserRound,
  Mail,
  RefreshCw,
  UserCircle,
  Pencil,
  Trash2,
  X,
  Check,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

import {
  getUsers,
  updatUserById,
  deleteUserById,
} from "@/services/authService";

export default function GetAllUsers() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionError, setActionError] = useState("");

  // Fetch users
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Normalize API response
  const users = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data?.users)) return data.data.users;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.users)) return data.users;

    return [];
  }, [data]);

  // Search
  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return users;

    return users.filter((user) =>
      [user.username, user.email, user.role]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [users, search]);

  // Statistics
  const admins = users.filter(
    (user) => user.role?.toLowerCase() === "admin",
  ).length;

  const regularUsers = users.filter(
    (user) => user.role?.toLowerCase() === "user",
  ).length;

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updatUserById(id, payload),

    onSuccess: async () => {
      setEditingUser(null);
      setActionError("");
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update user.",
      );
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUserById(id),

    onSuccess: async () => {
      setDeletingUser(null);
      setActionError("");
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to delete user.",
      );
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Administrators",
      value: admins,
      icon: ShieldCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Regular Users",
      value: regularUsers,
      icon: UserRound,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  // Submit edit
  function handleUpdate(event) {
    event.preventDefault();

    if (!editingUser?._id) return;

    setActionError("");

    updateMutation.mutate({
      id: editingUser._id,
      payload: {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
      },
    });
  }

  // Confirm delete
  function handleDelete() {
    if (!deletingUser?._id) return;

    setActionError("");
    deleteMutation.mutate(deletingUser._id);
  }

  return (
    <section className="min-h-screen space-y-8 bg-[#111111] p-4 text-white sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <Users size={16} />
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-blue-400">Users</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage and monitor your registered users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1b1b1b] px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-blue-500/50 hover:bg-[#242424] disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Action Error */}
      {actionError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <p>{actionError}</p>

          <button
            type="button"
            onClick={() => setActionError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/[0.07] bg-[#191919] p-5 transition hover:border-white/15"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>

                  <p className="mt-3 text-3xl font-bold">
                    {isLoading ? "—" : stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#191919]">
        {/* Search Header */}
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">User Directory</h2>

            <p className="mt-1 text-sm text-gray-400">
              {isLoading
                ? "Loading users..."
                : `${filteredUsers.length} of ${users.length} users`}
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or role..."
              className="w-full rounded-xl border border-white/10 bg-[#111111] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
              />
            ))}
          </div>
        )}

        {/* Fetch Error */}
        {isError && !isLoading && (
          <div className="p-10 text-center">
            <p className="font-medium text-red-400">Failed to load users</p>

            <p className="mt-2 text-sm text-gray-400">
              {error?.message || "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm hover:bg-blue-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && users.length === 0 && (
          <div className="px-6 py-16 text-center">
            <UserCircle size={42} className="mx-auto text-gray-600" />

            <h3 className="mt-4 font-semibold">No users found</h3>

            <p className="mt-2 text-sm text-gray-400">
              Registered users will appear here.
            </p>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading &&
          !isError &&
          users.length > 0 &&
          filteredUsers.length === 0 && (
            <div className="px-6 py-14 text-center text-gray-400">
              No matching users found.
            </div>
          )}

        {/* Table */}
        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div className="w-full min-w-0">
            {/* Desktop & Tablet Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-4 font-medium lg:px-6">User</th>
                    <th className="px-4 py-4 font-medium lg:px-6">Email</th>
                    <th className="px-4 py-4 font-medium lg:px-6">Role</th>
                    <th className="px-4 py-4 text-right font-medium lg:px-6">
                      User ID
                    </th>
                    <th className="px-4 py-4 text-center font-medium lg:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredUsers.map((user) => {
                    const isAdmin = user.role?.toLowerCase() === "admin";

                    const initials = (user.username || user.email || "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase();

                    const busy =
                      (updateMutation.isPending &&
                        updateMutation.variables?.id === user._id) ||
                      (deleteMutation.isPending &&
                        deleteMutation.variables === user._id);

                    return (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-white/[0.025]"
                      >
                        <td className="px-4 py-4 lg:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 font-semibold text-blue-300">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <p className="break-words font-medium text-gray-100">
                                {user.username || "Unnamed User"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                ID: {user._id?.slice(-6) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[240px] px-4 py-4 text-sm text-gray-300 lg:px-6">
                          <div className="flex items-start gap-2">
                            <Mail
                              size={15}
                              className="mt-0.5 shrink-0 text-gray-500"
                            />
                            <span className="break-all">
                              {user.email || "No email"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 lg:px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                              isAdmin
                                ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            }`}
                          >
                            {isAdmin ? (
                              <ShieldCheck size={14} />
                            ) : (
                              <UserRound size={14} />
                            )}
                            {user.role || "Unknown"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-xs text-gray-500 lg:px-6">
                          {user._id ? `...${user._id.slice(-8)}` : "N/A"}
                        </td>

                        <td className="px-4 py-4 lg:px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              title="Edit user"
                              aria-label={`Edit ${user.username || user.email}`}
                              disabled={busy}
                              onClick={() => {
                                setActionError("");
                                setEditingUser({
                                  _id: user._id,
                                  username: user.username || "",
                                  email: user.email || "",
                                  role: user.role || "user",
                                });
                              }}
                              className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-2.5 text-blue-300 transition hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              title="Delete user"
                              aria-label={`Delete ${user.username || user.email}`}
                              disabled={busy}
                              onClick={() => {
                                setActionError("");
                                setDeletingUser(user);
                              }}
                              className="rounded-lg border border-red-400/20 bg-red-400/10 p-2.5 text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
              {filteredUsers.map((user) => {
                const isAdmin = user.role?.toLowerCase() === "admin";

                const initials = (user.username || user.email || "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase();

                const busy =
                  (updateMutation.isPending &&
                    updateMutation.variables?.id === user._id) ||
                  (deleteMutation.isPending &&
                    deleteMutation.variables === user._id);

                return (
                  <div
                    key={user._id}
                    className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5"
                  >
                    {/* User Info */}
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 font-semibold text-blue-300">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-gray-100">
                          {user.username || "Unnamed User"}
                        </p>

                        <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
                          <Mail
                            size={14}
                            className="mt-0.5 shrink-0 text-gray-500"
                          />
                          <span className="min-w-0 break-all">
                            {user.email || "No email"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium ${
                          isAdmin
                            ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        }`}
                      >
                        {user.role || "Unknown"}
                      </span>
                    </div>

                    {/* ID & Actions */}
                    <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">
                          User ID
                        </p>

                        <p className="mt-1 break-all font-mono text-[11px] text-gray-400">
                          {user._id || "N/A"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          title="Edit user"
                          aria-label={`Edit ${user.username || user.email}`}
                          disabled={busy}
                          onClick={() => {
                            setActionError("");
                            setEditingUser({
                              _id: user._id,
                              username: user.username || "",
                              email: user.email || "",
                              role: user.role || "user",
                            });
                          }}
                          className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-2.5 text-blue-300 transition hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete user"
                          aria-label={`Delete ${user.username || user.email}`}
                          disabled={busy}
                          onClick={() => {
                            setActionError("");
                            setDeletingUser(user);
                          }}
                          className="rounded-lg border border-red-400/20 bg-red-400/10 p-2.5 text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {busy && (
                      <p className="mt-3 text-xs text-blue-300">
                        Processing...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="px-4 py-10 text-center">
                <UserRound size={30} className="mx-auto text-gray-500" />
                <p className="mt-3 text-sm text-gray-400">No users found.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!isLoading && !isError && users.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-white/[0.08] px-6 py-4 text-xs text-gray-500 sm:flex-row sm:justify-between">
            <span>Showing {filteredUsers.length} users</span>
            <span>User Management</span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !updateMutation.isPending
            ) {
              setEditingUser(null);
            }
          }}
        >
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Edit User</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Update user information.
                </p>
              </div>

              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                aria-label="Close edit dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Username
              </label>

              <input
                required
                minLength={2}
                value={editingUser.username}
                onChange={(event) =>
                  setEditingUser((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                required
                value={editingUser.email}
                onChange={(event) =>
                  setEditingUser((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Role</label>

              <select
                value={editingUser.role}
                onChange={(event) =>
                  setEditingUser((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {updateMutation.isError && (
              <p role="alert" className="text-sm text-red-400">
                {actionError || "Failed to update user."}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}

                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={24} />
            </div>

            <h2 id="delete-user-title" className="text-xl font-bold">
              Delete User
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {deletingUser.username || deletingUser.email}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteMutation.isError && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {actionError || "Failed to delete user."}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => setDeletingUser(null)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}

                {deleteMutation.isPending ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
