import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleRoundSelection, updateUserStatus, rejectRound1 } from "../../store/slices/adminSlice";
import { FiCheck, FiFilter, FiAward, FiX, FiClock } from "react-icons/fi";

export default function AdminRoundOne() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        dispatch(fetchUsers(filter));
    }, [dispatch, filter]);

    // Filter users based on group and status
    const filteredUsers = users.filter(u => {
        // Show users who are approved or rejected (exclude pending payments)
        if (u.payment?.status === "pending" || !u.payment?.status) return false;

        const matchesGroup = !filter || u.group === filter;

        let matchesStatus = true;
        if (statusFilter === "pending") {
            matchesStatus = (u.payment?.status === "approved" && !u.isRound2Selected && !u.isRound1Rejected);
        } else if (statusFilter === "approved") {
            matchesStatus = u.isRound2Selected === true;
        } else if (statusFilter === "rejected") {
            matchesStatus = (u.payment?.status === "rejected" || u.registrationStatus === "rejected" || u.isRound1Rejected);
        }

        return matchesGroup && matchesStatus;
    });

    const handleUpdateStatus = (id, status) => {
        let reason = "";
        if (status === "rejected") {
            reason = prompt("Enter reason for rejection:");
            if (reason === null) return;
        }
        dispatch(updateUserStatus({ id, status, reason }));
    };

    const handleRejectRound1 = (id) => {
        const reason = prompt("Enter reason for Round 1 rejection:");
        if (reason === null) return;
        dispatch(rejectRound1({ id, reason }));
    };

    const handleToggleRound2 = (id, currentStatus) => {
        dispatch(toggleRoundSelection({ id, isSelected: !currentStatus }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Round 1 Management</h2>
                    <p className="text-gray-500 mt-1">Mark candidates who have Cleared Round 1</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
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

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">In Round 1 (Pending)</option>
                            <option value="approved">Cleared for Round 2</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
                    Error: {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            Round 1 Management
                        </h2>
                        <p className="text-emerald-100 text-sm">
                            Approve entries and mark cleared candidates
                        </p>
                    </div>

                    <div className="bg-white/20 px-4 py-2 rounded-xl text-white text-sm font-semibold w-fit">
                        Showing: {filteredUsers.length} | Cleared Round 1: {filteredUsers.filter(u => u.isRound2Selected).length}
                    </div>
                </div>

                <div className="hidden lg:block">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                                <th className="px-6 py-4 text-left font-bold">Candidate</th>
                                <th className="px-6 py-4 text-left font-bold">Group</th>
                                <th className="px-6 py-4 text-left font-bold">Registration ID</th>
                                <th className="px-6 py-4 text-center font-bold">Status</th>
                                <th className="px-6 py-4 text-right font-bold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => {
                                    const isApproved = u.payment?.status === "approved" || u.registrationStatus === "approved";
                                    const isFinal = u.isRound2Selected || u.registrationStatus === "rejected";
                                    return (
                                        <tr key={u._id} className={`transition duration-300 ${isFinal ? "bg-gray-50/50 opacity-60 grayscale-[0.5]" : "hover:bg-emerald-50/40"}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {u.photo ? (
                                                        <img
                                                            src={`http://localhost:5000/${u.photo}`}
                                                            alt={u.name}
                                                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
                                                        />
                                                    ) : (
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r ${isApproved ? "from-emerald-500 to-teal-600" : "from-gray-400 to-gray-500"} shrink-0 shadow-xs`}>
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{u.name}</h3>
                                                        <p className="text-xs text-gray-500">{u.naatTitle}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                                    {u.group}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {u.candidateRegId}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {u.payment?.status === "rejected" || u.registrationStatus === "rejected" || u.isRound1Rejected ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        <FiX className="text-sm" /> Rejected
                                                    </span>
                                                ) : !isApproved ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                        <FiClock className="text-sm" /> Pending Approval
                                                    </span>
                                                ) : u.isRound2Selected ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <FiCheck className="text-sm" /> Cleared Round 1
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                        <FiAward className="text-sm" /> In Round 1
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isApproved && !u.isRound2Selected ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleRound2(u._id, false)}
                                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-emerald-200 transition-all duration-200"
                                                        >
                                                            Clear Round 1
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRound1(u._id)}
                                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                                                        >
                                                            Reject Round 1
                                                        </button>
                                                    </div>
                                                ) : u.isRound2Selected ? (
                                                    <button
                                                        disabled
                                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                    >
                                                        Already Cleared
                                                    </button>
                                                ) : !isApproved && u.payment?.status !== "rejected" ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(u._id, "approved")}
                                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(u._id, "rejected")}
                                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                    >
                                                        Rejected
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No candidates found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-gray-100">
                    {filteredUsers.map((u) => {
                        const isApproved = u.payment?.status === "approved" || u.registrationStatus === "approved";
                        const isRejected = u.payment?.status === "rejected" || u.registrationStatus === "rejected" || u.isRound1Rejected;
                        return (
                            <div key={u._id} className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {u.photo ? (
                                            <img
                                                src={`http://localhost:5000/${u.photo}`}
                                                alt={u.name}
                                                className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
                                            />
                                        ) : (
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${isApproved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-gray-400"} shrink-0 shadow-xs`}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-900">{u.name}</h3>
                                            <p className="text-xs text-gray-500">{u.group}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {isRejected ? (
                                            <span className="text-red-600 text-xs font-bold uppercase tracking-wider">Rejected</span>
                                        ) : !isApproved ? (
                                            <span className="text-yellow-600 text-xs font-bold uppercase tracking-wider">Pending</span>
                                        ) : u.isRound2Selected ? (
                                            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Cleared</span>
                                        ) : (
                                            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">In Round 1</span>
                                        )}
                                    </div>
                                </div>
                                {u.isRound2Selected ? (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    >
                                        Already Cleared Round 1
                                    </button>
                                ) : (!isApproved && !isRejected) ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus(u._id, "approved")}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-white shadow-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(u._id, "rejected")}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-100 text-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : isApproved ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleToggleRound2(u._id, false)}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-lg"
                                        >
                                            Clear Round 1
                                        </button>
                                        <button
                                            onClick={() => handleRejectRound1(u._id)}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-100 text-red-600"
                                        >
                                            Reject Round 1
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    >
                                        Rejected
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
