import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserStatus, deleteUser } from "../../store/slices/adminSlice";
import { FiCheck, FiX, FiFilter, FiTrash2 } from "react-icons/fi";

export default function Users() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        dispatch(fetchUsers(filter));
    }, [dispatch, filter]);

    const handleUpdateStatus = (id, status) => {
        let reason = "";
        if (status === "rejected") {
            reason = prompt("Enter reason for rejection:");
            if (reason === null) return; // Cancelled
        }
        dispatch(updateUserStatus({ id, status, reason }));
    };

    const handleDeleteUser = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this registration?"
        );

        if (confirmDelete) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                        <option value="">All Groups</option>
                        <option value="Jr.">Junior (Jr.)</option>
                        <option value="Middle">Middle</option>
                        <option value="Sr">Senior (Sr.)</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
                    Error loading users: {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            Payment Verification
                        </h2>
                        <p className="text-blue-100 text-sm">
                            Manage user payment approvals
                        </p>
                    </div>

                    <div className="bg-white/20 px-4 py-2 rounded-xl text-white text-sm font-semibold w-fit">
                        Total Users : {users.length}
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                                <th className="px-4 py-4 text-left font-bold">User</th>
                                <th className="px-4 py-4 text-left font-bold">Phone</th>
                                <th className="px-4 py-4 text-left font-bold">Group</th>
                                <th className="px-4 py-4 text-left font-bold">Amount</th>
                                <th className="px-4 py-4 text-left font-bold">
                                    Transaction
                                </th>
                                <th className="px-4 py-4 text-left font-bold">
                                    Screenshot
                                </th>
                                <th className="px-4 py-4 text-left font-bold">Status</th>
                                <th className="px-4 py-4 text-right font-bold">
                                    Actions
                                </th>
                                <th className="px-4 py-4 text-right font-bold">
                                    Remove
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => {
                                const isFinal = u.isRound2Selected || u.registrationStatus === "rejected";
                                return (
                                    <tr
                                        key={u._id}
                                        className={`transition duration-300 ${isFinal ? "bg-gray-50/50 opacity-60 grayscale-[0.5]" : "hover:bg-blue-50/40"}`}
                                    >
                                        {/* User */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-start gap-3">
                                                {u.photo ? (
                                                    <img
                                                        src={`http://localhost:5000/${u.photo}`}
                                                        alt={u.name}
                                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 break-words">
                                                        {u.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 break-all">
                                                        {u.naatTitle}
                                                    </p>

                                                    <p className="text-xs text-blue-600 mt-1 break-all">
                                                        {u.candidateRegId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-medium text-gray-700 break-all">
                                                {u.phone}
                                            </span>
                                        </td>

                                        {/* Group */}
                                        <td className="px-4 py-4">
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                                {u.group}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-4">
                                            <span className="font-bold text-green-600">
                                                ₹ {u.payment.amount}
                                            </span>
                                        </td>

                                        {/* Transaction */}
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-700 break-all max-w-[180px]">
                                                {u.payment.transactionId}
                                            </div>
                                        </td>

                                        {/* Screenshot */}
                                        <td className="px-4 py-4">
                                            {u.transactionProof ? (
                                                <a
                                                    href={`http://localhost:5000/${u.transactionProof}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block w-fit"
                                                >
                                                    <img
                                                        src={`http://localhost:5000/${u.transactionProof}`}
                                                        alt="Payment Proof"
                                                        className="h-14 w-14 rounded-xl object-cover border shadow-md transition duration-300 group-hover:scale-110"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    No Image
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                    
                                    ${u.payment?.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : u.payment?.status === "rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {u.payment?.status || "pending"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                {/* Approve */}
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(u._id, "approved")
                                                    }
                                                    disabled={u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected"}
                                                    className={`p-2 rounded-lg transition duration-300
                                                 ${(u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected")
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white"
                                                        }`}
                                                >
                                                    <FiCheck />
                                                </button>

                                                {/* Reject */}
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(u._id, "rejected")
                                                    }
                                                    disabled={u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected"}
                                                    className={`p-2 rounded-lg transition duration-300
                                                 ${(u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected")
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
                                                        }`}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {/* Delete Registration */}
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg transition duration-300 font-medium shadow-sm bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
                                            >
                                                <FiTrash2 className="text-sm" />
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-4">
                    {users.map((u) => (
                        console.log(u.photo),
                        <div
                            key={u._id}
                            className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
                        >
                            <div className="flex items-start gap-3">
                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-100 shadow-md shrink-0">
                                    {
                                        u.photo ? (
                                            <img
                                                src={`http://localhost:5000/${u.photo}`}
                                                alt={u.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-900 break-words">
                                        {u.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 break-all">
                                        {u.email}
                                    </p>

                                    <p className="text-xs text-blue-600 mt-1 break-all">
                                        {u.candidateRegId}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400">Phone</p>
                                    <p className="font-medium break-all">{u.phone}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400">Group</p>
                                    <p className="font-medium">{u.group}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400">Amount</p>
                                    <p className="font-bold text-green-600">
                                        ₹ {u.payment.amount}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-400">Status</p>

                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-1
                                
                                ${u.payment?.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : u.payment?.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {u.payment?.status || "pending"}
                                    </span>
                                </div>
                            </div>

                            {/* Transaction */}
                            <div className="mt-4">
                                <p className="text-gray-400 text-sm">Transaction ID</p>

                                <p className="text-sm font-medium text-gray-700 break-all">
                                    {u.payment.transactionId}
                                </p>
                            </div>

                            {/* Screenshot */}
                            {u.transactionProof && (
                                <div className="mt-4">
                                    <a
                                        href={`http://localhost:5000/${u.transactionProof}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`http://localhost:5000/${u.transactionProof}`}
                                            alt="Payment Proof"
                                            className="h-24 w-24 rounded-xl object-cover shadow-md hover:scale-105 transition"
                                        />
                                    </a>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 mt-5">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(u._id, "approved")
                                        }
                                        disabled={u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected"}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition
                                        ${(u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected")
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-green-500 text-white hover:bg-green-600 shadow-md"
                                            }`}
                                    >
                                        <FiCheck />
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(u._id, "rejected")
                                        }
                                        disabled={u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected"}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition
                                        ${(u.payment?.status === "approved" || u.payment?.status === "rejected" || u.isRound2Selected || u.registrationStatus === "rejected")
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-red-500 text-white hover:bg-red-600 shadow-md"
                                            }`}
                                    >
                                        <FiX />
                                        Reject
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition bg-red-100 text-red-600 hover:bg-red-500 hover:text-white shadow-sm"
                                >
                                    <FiTrash2 />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}