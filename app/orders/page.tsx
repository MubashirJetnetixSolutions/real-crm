"use client";

import { useState, useMemo } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Order {
    id: string;
    orderNumber: string;
    company: string;
    country: string;
    bank: string;
    branch: string;
    requestDate: string;
    startTime: string;
    startDate: string;
    assignedTo: string;
    availability: "Online" | "Offline";
    action: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ordersData: Order[] = [
    { id: "1", orderNumber: "JI456M9", company: "S&P Credit Mkt SVCS Eurpoe Ltd", country: "Russian Federation", bank: "MBL", branch: "Hyderi Branch", requestDate: "26 MAR 2026", startTime: "10:30 am", startDate: "26 MAR 2026", assignedTo: "Zaki Javed", availability: "Online", action: "Review" },
    { id: "2", orderNumber: "JI456M9", company: "Pharma International", country: "Italy", bank: "UBL", branch: "Gulshan Branch", requestDate: "15 MAR 2026", startTime: "10:30 am", startDate: "15 MAR 2026", assignedTo: "Asad Chaudhry", availability: "Online", action: "Start" },
    { id: "3", orderNumber: "JI456M9", company: "Credit Suisse (Hong Kong) Limited", country: "Australia", bank: "MCB", branch: "IJ Churidgram Branch", requestDate: "24 FEB 2026", startTime: "10:30 am", startDate: "24 FEB 2026", assignedTo: "Khalil Rizvi", availability: "Online", action: "Reuse" },
    { id: "4", orderNumber: "4PO78N", company: "Targaryen Restoration", country: "China", bank: "MBL", branch: "Johar Branch", requestDate: "24 FEB 2026", startTime: "10:30 am", startDate: "24 FEB 2026", assignedTo: "Tariq Javed", availability: "Online", action: "Send" },
    { id: "5", orderNumber: "Y98MYO", company: "Master Facility", country: "Hong Kong", bank: "HBL", branch: "3 Talwar Branch", requestDate: "19 FEB 2026", startTime: "10:30 am", startDate: "19 FEB 2026", assignedTo: "Zain Raza", availability: "Offline", action: "Review" },
    { id: "6", orderNumber: "B34KL2", company: "Global Trade Partners LLC", country: "United Kingdom", bank: "NBP", branch: "Karachi Branch", requestDate: "12 FEB 2026", startTime: "09:15 am", startDate: "12 FEB 2026", assignedTo: "Sara Ahmed", availability: "Online", action: "Review" },
    { id: "7", orderNumber: "X91MN5", company: "Pacific Rim Industries", country: "Japan", bank: "ABL", branch: "Clifton Branch", requestDate: "08 FEB 2026", startTime: "11:00 am", startDate: "08 FEB 2026", assignedTo: "Hassan Ali", availability: "Offline", action: "Start" },
    { id: "8", orderNumber: "R67TY9", company: "Euro Capital Group", country: "Germany", bank: "SCB", branch: "DHA Branch", requestDate: "05 FEB 2026", startTime: "02:00 pm", startDate: "05 FEB 2026", assignedTo: "Nadia Khan", availability: "Online", action: "Reuse" },
    { id: "9", orderNumber: "M23QP1", company: "Nexus Financial Services", country: "UAE", bank: "MCB", branch: "Gulberg Branch", requestDate: "01 FEB 2026", startTime: "10:00 am", startDate: "01 FEB 2026", assignedTo: "Omer Sheikh", availability: "Online", action: "Send" },
    { id: "10", orderNumber: "K88LM4", company: "Allied Merchant Bank", country: "Singapore", bank: "HBL", branch: "F-7 Branch", requestDate: "28 JAN 2026", startTime: "03:30 pm", startDate: "28 JAN 2026", assignedTo: "Amna Saleem", availability: "Offline", action: "Review" },
];

const ITEMS_PER_PAGE = 7;

// ── Colour tokens (dark theme) ────────────────────────────────────────────────
const C = {
    bg: "#13151a",
    card: "#1b1e26",
    rowHover: "#22252e",
    rowSelected: "rgba(59,130,246,0.06)",
    border: "#272a33",
    rowBorder: "#1f2229",
    textPrimary: "#dde1ea",
    textMuted: "#6b7280",
    textDim: "#9ca3af",
    badge: {
        onlineBg: "rgba(16,185,129,0.13)",
        onlineText: "#34d399",
        onlineBdr: "rgba(52,211,153,0.22)",
        offlineBg: "rgba(239,68,68,0.12)",
        offlineText: "#f87171",
        offlineBdr: "rgba(248,113,113,0.22)",
    },
    btn: {
        bg: "#23262f",
        bgHover: "#2c2f3c",
        border: "#343742",
        bdrHvr: "#4a4d5c",
        text: "#dde1ea",
    },
    input: {
        bg: "#1b1e26",
        border: "#2e313b",
        text: "#dde1ea",
        placeholder: "#6b7280",
    },
};

// ── Column definitions ────────────────────────────────────────────────────────
type SortableKey = keyof Order;

const COLUMNS: { label: string; key: SortableKey | null; width?: string }[] = [
    { label: "Order Number", key: "orderNumber", width: "120px" },
    { label: "Company", key: "company", width: "220px" },
    { label: "Country", key: "country", width: "160px" },
    { label: "Bank", key: "bank", width: "160px" },
    { label: "Request Date", key: "requestDate", width: "130px" },
    { label: "Start Time", key: "startTime", width: "120px" },
    { label: "Assigned to", key: "assignedTo", width: "130px" },
    { label: "Availability", key: "availability", width: "110px" },
    { label: "Actions", key: null, width: "90px" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
    const [search, setSearch] = useState("");
    const [availFilter, setAvailFilter] = useState<"All" | "Online" | "Offline">("All");
    const [sortKey, setSortKey] = useState<SortableKey | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

    // Filter + sort
    const filtered = useMemo(() => {
        let data = ordersData;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            data = data.filter(o =>
                o.orderNumber.toLowerCase().includes(q) ||
                o.company.toLowerCase().includes(q) ||
                o.country.toLowerCase().includes(q) ||
                o.bank.toLowerCase().includes(q) ||
                o.assignedTo.toLowerCase().includes(q)
            );
        }
        if (availFilter !== "All") {
            data = data.filter(o => o.availability === availFilter);
        }
        if (sortKey) {
            data = [...data].sort((a, b) => {
                const av = String(a[sortKey]);
                const bv = String(b[sortKey]);
                return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
            });
        }
        return data;
    }, [search, availFilter, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    function toggleSort(key: SortableKey) {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    }

    function toggleSelect(id: string) {
        setSelectedIds(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    }

    function toggleAll() {
        if (selectedIds.size === paginated.length && paginated.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginated.map(o => o.id)));
        }
    }

    const allSelected = paginated.length > 0 && paginated.every(o => selectedIds.has(o.id));

    return (
        <div
            style={{
                backgroundColor: C.bg,
                minHeight: "100%",
                fontFamily: "'Inter', sans-serif",
                padding: "28px 28px 40px",
                boxSizing: "border-box",
            }}
        >
            {/* ── Page header ────────────────────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: C.textPrimary,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.3,
                        }}
                    >
                        Recent Orders
                    </h1>
                    <p style={{ margin: "5px 0 0", fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>
                        Review and update your most recent orders.
                    </p>
                </div>

                {/* Search */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span
                        className="material-symbols-outlined"
                        style={{
                            position: "absolute",
                            left: "10px",
                            fontSize: "17px",
                            color: C.textMuted,
                            pointerEvents: "none",
                        }}
                    >
                        search
                    </span>
                    <input
                        id="orders-search"
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Find Orders"
                        style={{
                            backgroundColor: C.input.bg,
                            border: `1px solid ${C.input.border}`,
                            borderRadius: "8px",
                            padding: "8px 14px 8px 34px",
                            color: C.input.text,
                            fontSize: "13px",
                            outline: "none",
                            width: "210px",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = "#3b82f6")}
                        onBlur={e => (e.currentTarget.style.borderColor = C.input.border)}
                    />
                </div>
            </div>

            {/* ── Filter pills ─────────────────────────────────────────────── */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                {(["All", "Online", "Offline"] as const).map(f => (
                    <button
                        key={f}
                        id={`filter-${f.toLowerCase()}`}
                        onClick={() => { setAvailFilter(f); setPage(1); }}
                        style={{
                            padding: "4px 14px",
                            borderRadius: "9999px",
                            border: `1px solid ${availFilter === f ? "#3b82f6" : C.border}`,
                            backgroundColor: availFilter === f ? "rgba(59,130,246,0.14)" : "transparent",
                            color: availFilter === f ? "#60a5fa" : C.textMuted,
                            fontSize: "12px",
                            fontWeight: availFilter === f ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                    >
                        {f}
                    </button>
                ))}
                {selectedIds.size > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: "12px", color: C.textMuted }}>
                        {selectedIds.size} selected
                    </span>
                )}
            </div>

            {/* ── Table card ───────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: C.card,
                    borderRadius: "12px",
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                }}
            >
                {/* Scrollable table area */}
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "900px",
                        }}
                    >
                        {/* ── Head ── */}
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                {/* Checkbox */}
                                <th style={{backgroundColor: "#121112", padding: "13px 16px", width: "44px" }}>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        style={{ accentColor: "#3b82f6", cursor: "pointer", width: "14px", height: "14px" }}
                                        aria-label="Select all orders"
                                    />
                                </th>
                                {COLUMNS.map(col => (
                                    <th
                                        key={col.label}
                                        id={`col-${col.label.replace(/\s/g, "-").toLowerCase()}`}
                                        style={{
                                            padding: "13px 16px",
                                            textAlign: "left",
                                            color: C.textMuted,
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            whiteSpace: "nowrap",
                                            width: col.width,
                                            cursor: col.key ? "pointer" : "default",
                                            userSelect: "none",
                                            letterSpacing: "0.01em",
                                        }}
                                        onClick={() => col.key && toggleSort(col.key)}
                                    >
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            {col.label}
                                            {col.key && (
                                                <span style={{ opacity: sortKey === col.key ? 1 : 0.3, fontSize: "10px" }}>
                                                    {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                                                </span>
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* ── Body ── */}
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={COLUMNS.length + 1}
                                        style={{ padding: "56px 16px", textAlign: "center" }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "44px", color: C.textMuted, opacity: 0.4, display: "block", marginBottom: "10px" }}
                                        >
                                            inbox
                                        </span>
                                        <p style={{ color: C.textMuted, fontSize: "14px", margin: 0 }}>
                                            No orders match your search.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((order, i) => {
                                    const isSelected = selectedIds.has(order.id);
                                    const isHovered = hoveredRow === order.id;
                                    const isLast = i === paginated.length - 1;

                                    let rowBg = "transparent";
                                    if (isSelected) rowBg = C.rowSelected;
                                    else if (isHovered) rowBg = C.rowHover;

                                    return (
                                        <tr
                                            key={order.id}
                                            style={{
                                                backgroundColor: rowBg,
                                                borderBottom: isLast ? "none" : `1px solid ${C.rowBorder}`,
                                                transition: "background-color 0.12s",
                                            }}
                                            onMouseEnter={() => setHoveredRow(order.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            {/* Checkbox */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(order.id)}
                                                    style={{ accentColor: "#3b82f6", cursor: "pointer", width: "14px", height: "14px" }}
                                                    aria-label={`Select order ${order.orderNumber}`}
                                                />
                                            </td>

                                            {/* Order Number */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span
                                                    style={{
                                                        color: C.textPrimary,
                                                        fontSize: "13px",
                                                        fontWeight: 500,
                                                        letterSpacing: "0.02em",
                                                    }}
                                                >
                                                    {order.orderNumber}
                                                </span>
                                            </td>

                                            {/* Company */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span style={{ color: C.textPrimary, fontSize: "13px" }}>{order.company}</span>
                                            </td>

                                            {/* Country */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span style={{ color: C.textDim, fontSize: "13px" }}>{order.country}</span>
                                            </td>

                                            {/* Bank + Branch */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <div style={{ color: C.textPrimary, fontSize: "13px", fontWeight: 500, lineHeight: 1.3 }}>
                                                    {order.bank}
                                                </div>
                                                <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "3px", lineHeight: 1.3 }}>
                                                    {order.branch}
                                                </div>
                                            </td>

                                            {/* Request Date */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span style={{ color: C.textPrimary, fontSize: "13px" }}>{order.requestDate}</span>
                                            </td>

                                            {/* Start Time + Date */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <div style={{ color: C.textPrimary, fontSize: "13px", lineHeight: 1.3 }}>
                                                    {order.startTime}
                                                </div>
                                                <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "3px", lineHeight: 1.3 }}>
                                                    {order.startDate}
                                                </div>
                                            </td>

                                            {/* Assigned to */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span style={{ color: C.textPrimary, fontSize: "13px" }}>{order.assignedTo}</span>
                                            </td>

                                            {/* Availability badge */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        padding: "3px 11px",
                                                        borderRadius: "9999px",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        backgroundColor:
                                                            order.availability === "Online"
                                                                ? C.badge.onlineBg
                                                                : C.badge.offlineBg,
                                                        color:
                                                            order.availability === "Online"
                                                                ? C.badge.onlineText
                                                                : C.badge.offlineText,
                                                        border: `1px solid ${order.availability === "Online"
                                                                ? C.badge.onlineBdr
                                                                : C.badge.offlineBdr
                                                            }`,
                                                    }}
                                                >
                                                    {order.availability}
                                                </span>
                                            </td>

                                            {/* Action button */}
                                            <td style={{ padding: "0 16px", height: "58px", verticalAlign: "middle" }}>
                                                <button
                                                    id={`action-${order.id}`}
                                                    style={{
                                                        padding: "5px 18px",
                                                        borderRadius: "6px",
                                                        border: `1px solid ${hoveredBtn === order.id ? C.btn.bdrHvr : C.btn.border
                                                            }`,
                                                        backgroundColor:
                                                            hoveredBtn === order.id ? C.btn.bgHover : C.btn.bg,
                                                        color: C.btn.text,
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        whiteSpace: "nowrap",
                                                        transition: "all 0.15s",
                                                    }}
                                                    onMouseEnter={() => setHoveredBtn(order.id)}
                                                    onMouseLeave={() => setHoveredBtn(null)}
                                                >
                                                    {order.action}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ──────────────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderTop: `1px solid ${C.border}`,
                        flexWrap: "wrap",
                        gap: "10px",
                    }}
                >
                    <span style={{ color: C.textMuted, fontSize: "12px" }}>
                        {filtered.length === 0
                            ? "No results"
                            : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                                safePage * ITEMS_PER_PAGE,
                                filtered.length
                            )} of ${filtered.length} orders`}
                    </span>

                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {/* Prev */}
                        <button
                            id="pagination-prev"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            style={{
                                padding: "5px 12px",
                                borderRadius: "6px",
                                border: `1px solid ${C.border}`,
                                backgroundColor: safePage === 1 ? "transparent" : C.btn.bg,
                                color: safePage === 1 ? "#3a3d47" : C.textDim,
                                fontSize: "12px",
                                cursor: safePage === 1 ? "default" : "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => {
                            const p = i + 1;
                            const active = p === safePage;
                            return (
                                <button
                                    key={p}
                                    id={`page-${p}`}
                                    onClick={() => setPage(p)}
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: "6px",
                                        border: `1px solid ${active ? "rgba(59,130,246,0.5)" : C.border}`,
                                        backgroundColor: active ? "rgba(59,130,246,0.15)" : C.btn.bg,
                                        color: active ? "#60a5fa" : C.textDim,
                                        fontSize: "12px",
                                        fontWeight: active ? 600 : 400,
                                        cursor: "pointer",
                                        minWidth: "32px",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            id="pagination-next"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            style={{
                                padding: "5px 12px",
                                borderRadius: "6px",
                                border: `1px solid ${C.border}`,
                                backgroundColor: safePage === totalPages ? "transparent" : C.btn.bg,
                                color: safePage === totalPages ? "#3a3d47" : C.textDim,
                                fontSize: "12px",
                                cursor: safePage === totalPages ? "default" : "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
