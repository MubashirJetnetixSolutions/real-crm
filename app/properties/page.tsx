"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import PageHeaderActions from "../components/PageHeaderActions";
import ActionDropdown from "../components/ActionDropdown";
import FileUpload, { type UploadedFile } from "../components/FileUpload";
import { getCustomProperties, saveCustomProperty, type PropertyData } from "../lib/mockData";
import AppSelect from "../components/forms/AppSelect";
import CurrencyInput from "../components/forms/CurrencyInput";
import NumericInput from "../components/forms/NumericInput";

function PropActionMenu({ propId }: { propId: string }) {
    return (
        <ActionDropdown
            ariaLabel="Property actions"
            items={[
                { label: "View Details", icon: "visibility", href: `/properties/${propId}` },
                { label: "Edit Listing", icon: "edit" },
                { label: "Share", icon: "share" },
                { label: "Schedule Viewing", icon: "schedule" },
                { label: "Remove Listing", icon: "delete", danger: true },
            ]}
        />
    );
}

interface Property {
    id: string;
    propId: string;
    title: string;
    location: string;
    type: string;
    price: string;
    priceNum: number;
    beds: number;
    baths: number;
    sqft: number;
    status: "Available" | "Sold" | "Rented";
    statusColor: string;
    listedDate: string;
    imageUrl: string;
    gallery?: string[];
    agentName: string;
    agentRole: string;
    agentAvatar: string;
}

const initialProperties: Property[] = [
    {
        id: "prop-1",
        propId: "PROP-8241",
        title: "Skyline Penthouse",
        location: "Upper West Side, NY",
        type: "Apartment",
        price: "$4,250,000",
        priceNum: 4250000,
        beds: 4,
        baths: 3,
        sqft: 3200,
        status: "Available",
        statusColor: "text-tertiary",
        listedDate: "Oct 12, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst",
        agentName: "Alex Rivera",
        agentRole: "Senior Associate",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAV8sZ7Dx2KULsgVP_vp0vL_f8ky2ycJMnueiVZg2E982_tmDqoTbXafOaDHNEFY85kDYDy2-6d3-8fuqqyD5Gb-6Im9pigoeCg20Jb5WKLwqJnmNqIwqmVRDOQDHSyeko1k6wGbS0ASMeDnN6IUC8GMc-_D_wFMn5bUehI0I1Gfl-SFH_JL4xcNIIqpdIjXpyzPI4MaWT6urgaFmG3ewLKxA7z3uU5Dp5dwdk_K3KK7kk3dVh2WgErOY8rfp4f_D992Jq4Ajl9s1p",
    },
    {
        id: "prop-2",
        propId: "PROP-9102",
        title: "Serene Waters Villa",
        location: "Miami Beach, FL",
        type: "Villa",
        price: "$8,900,000",
        priceNum: 8900000,
        beds: 6,
        baths: 7,
        sqft: 5800,
        status: "Sold",
        statusColor: "text-error",
        listedDate: "Sep 28, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ncIOyIOVaP9w5PiKXbznbkZ92sxSxfkingZt0mQNDT5WmacU2XAUs5grg_NSL00-OYy_MvLt_sBF4ztgOS_lwV1f2otCEqiYyqkRf63MsmaeFgCDM40qE1ygEeZu_imcsxWeI61YJBmUAY-i6W8ph-FQo2SWOeWpH_yjkAdIkTbE86Y_9V_2q6RI89CgxxF3WLfBp1qdYfaVA3lkJ4fs8ZGhnErEjZINsvKyBCrlBJT0u-P_8UCxozEZNtk2So5xvenHDxlFzti9",
        agentName: "Sarah Chen",
        agentRole: "Listing Expert",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
    },
    {
        id: "prop-3",
        propId: "PROP-4452",
        title: "The Hub Plaza",
        location: "Chicago, IL",
        type: "Commercial",
        price: "$15,500/mo",
        priceNum: 15500,
        beds: 0,
        baths: 4,
        sqft: 12000,
        status: "Rented",
        statusColor: "text-primary",
        listedDate: "Nov 05, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnclJog3tgWGbHJQ9Pc15Zbie3WIJep_ws_ptwOE3IHdEwanNLFO89uZry6nFqfwQl3awIrxef9mD57dm5TdLZwRKwyI_d43w6o5RsbSjVNiXxAtqHOdhQW-XChJOVEujB2r3sDRKIwwnlpr8SM_KMPoClHOBKg2HQlvL7fvUiQ3Tf4qL1x200wjEjucJ2p-MrM-eKKjF3P3P2BBTkQECfnIZrBSR1gaEE1H9PkwiwyLtmGisrdLtwDG6VCGoZ1K40TXeAsGW-AGa3",
        agentName: "David Miller",
        agentRole: "Commercial Specialist",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYz5lS7DC22aFJjSW8HN9UGfbQBXN5JdN1Z1Rt9m7OC9SfNYifgViloYN8WMrno6R75bPOyWkJEULEa0PB4QOQD90oMHgSe9s3UFaYpLLKAlCsA_HuvimaaX06_xJmI9NmLQQt7JWtXx2SZ9WdOd2L4vsCb82zyCJ1fjGhCR-dUaS77f9sYBRfZL6VmPq-NAFLGXhzDQVzn-rBBKpi3T36HY8LICPVT1puW4Ie6orzQhB4uNg_FtGJi5Hif13DLFiwq07OFEjHhXM",
    },
    {
        id: "prop-4",
        propId: "PROP-1122",
        title: "Grand Central Plaza",
        location: "Manhattan, NY",
        type: "Commercial",
        price: "$22,000/mo",
        priceNum: 22000,
        beds: 0,
        baths: 6,
        sqft: 18000,
        status: "Available",
        statusColor: "text-tertiary",
        listedDate: "Nov 12, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnclJog3tgWGbHJQ9Pc15Zbie3WIJep_ws_ptwOE3IHdEwanNLFO89uZry6nFqfwQl3awIrxef9mD57dm5TdLZwRKwyI_d43w6o5RsbSjVNiXxAtqHOdhQW-XChJOVEujB2r3sDRKIwwnlpr8SM_KMPoClHOBKg2HQlvL7fvUiQ3Tf4qL1x200wjEjucJ2p-MrM-eKKjF3P3P2BBTkQECfnIZrBSR1gaEE1H9PkwiwyLtmGisrdLtwDG6VCGoZ1K40TXeAsGW-AGa3",
        agentName: "Sarah Chen",
        agentRole: "Listing Expert",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
    },
    {
        id: "prop-5",
        propId: "PROP-3344",
        title: "Emerald Gardens",
        location: "Austin, TX",
        type: "Villa",
        price: "$1,850,000",
        priceNum: 1850000,
        beds: 4,
        baths: 3,
        sqft: 3500,
        status: "Sold",
        statusColor: "text-error",
        listedDate: "Nov 20, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ncIOyIOVaP9w5PiKXbznbkZ92sxSxfkingZt0mQNDT5WmacU2XAUs5grg_NSL00-OYy_MvLt_sBF4ztgOS_lwV1f2otCEqiYyqkRf63MsmaeFgCDM40qE1ygEeZu_imcsxWeI61YJBmUAY-i6W8ph-FQo2SWOeWpH_yjkAdIkTbE86Y_9V_2q6RI89CgxxF3WLfBp1qdYfaVA3lkJ4fs8ZGhnErEjZINsvKyBCrlBJT0u-P_8UCxozEZNtk2So5xvenHDxlFzti9",
        agentName: "David Miller",
        agentRole: "Commercial Specialist",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYz5lS7DC22aFJjSW8HN9UGfbQBXN5JdN1Z1Rt9m7OC9SfNYifgViloYN8WMrno6R75bPOyWkJEULEa0PB4QOQD90oMHgSe9s3UFaYpLLKAlCsA_HuvimaaX06_xJmI9NmLQQt7JWtXx2SZ9WdOd2L4vsCb82zyCJ1fjGhCR-dUaS77f9sYBRfZL6VmPq-NAFLGXhzDQVzn-rBBKpi3T36HY8LICPVT1puW4Ie6orzQhB4uNg_FtGJi5Hif13DLFiwq07OFEjHhXM",
    },
    {
        id: "prop-6",
        propId: "PROP-5566",
        title: "Pacific View Villa",
        location: "Malibu, CA",
        type: "Villa",
        price: "$12,400,000",
        priceNum: 12400000,
        beds: 6,
        baths: 7,
        sqft: 5800,
        status: "Rented",
        statusColor: "text-primary",
        listedDate: "Nov 28, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ncIOyIOVaP9w5PiKXbznbkZ92sxSxfkingZt0mQNDT5WmacU2XAUs5grg_NSL00-OYy_MvLt_sBF4ztgOS_lwV1f2otCEqiYyqkRf63MsmaeFgCDM40qE1ygEeZu_imcsxWeI61YJBmUAY-i6W8ph-FQo2SWOeWpH_yjkAdIkTbE86Y_9V_2q6RI89CgxxF3WLfBp1qdYfaVA3lkJ4fs8ZGhnErEjZINsvKyBCrlBJT0u-P_8UCxozEZNtk2So5xvenHDxlFzti9",
        agentName: "Alex Rivera",
        agentRole: "Senior Associate",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAV8sZ7Dx2KULsgVP_vp0vL_f8ky2ycJMnueiVZg2E982_tmDqoTbXafOaDHNEFY85kDYDy2-6d3-8fuqqyD5Gb-6Im9pigoeCg20Jb5WKLwqJnmNqIwqmVRDOQDHSyeko1k6wGbS0ASMeDnN6IUC8GMc-_D_wFMn5bUehI0I1Gfl-SFH_JL4xcNIIqpdIjXpyzPI4MaWT6urgaFmG3ewLKxA7z3uU5Dp5dwdk_K3KK7kk3dVh2WgErOY8rfp4f_D992Jq4Ajl9s1p",
    },
    {
        id: "prop-7",
        propId: "PROP-7788",
        title: "Urban Loft",
        location: "Brooklyn, NY",
        type: "Apartment",
        price: "$3,200/mo",
        priceNum: 3200,
        beds: 2,
        baths: 1,
        sqft: 1450,
        status: "Available",
        statusColor: "text-tertiary",
        listedDate: "Dec 05, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst",
        agentName: "Sarah Chen",
        agentRole: "Listing Expert",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
    },
    {
        id: "prop-8",
        propId: "PROP-9900",
        title: "Sunset Ridge",
        location: "Phoenix, AZ",
        type: "Villa",
        price: "$950,000",
        priceNum: 950000,
        beds: 3,
        baths: 2,
        sqft: 2800,
        status: "Available",
        statusColor: "text-tertiary",
        listedDate: "Dec 10, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ncIOyIOVaP9w5PiKXbznbkZ92sxSxfkingZt0mQNDT5WmacU2XAUs5grg_NSL00-OYy_MvLt_sBF4ztgOS_lwV1f2otCEqiYyqkRf63MsmaeFgCDM40qE1ygEeZu_imcsxWeI61YJBmUAY-i6W8ph-FQo2SWOeWpH_yjkAdIkTbE86Y_9V_2q6RI89CgxxF3WLfBp1qdYfaVA3lkJ4fs8ZGhnErEjZINsvKyBCrlBJT0u-P_8UCxozEZNtk2So5xvenHDxlFzti9",
        agentName: "David Miller",
        agentRole: "Commercial Specialist",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYz5lS7DC22aFJjSW8HN9UGfbQBXN5JdN1Z1Rt9m7OC9SfNYifgViloYN8WMrno6R75bPOyWkJEULEa0PB4QOQD90oMHgSe9s3UFaYpLLKAlCsA_HuvimaaX06_xJmI9NmLQQt7JWtXx2SZ9WdOd2L4vsCb82zyCJ1fjGhCR-dUaS77f9sYBRfZL6VmPq-NAFLGXhzDQVzn-rBBKpi3T36HY8LICPVT1puW4Ie6orzQhB4uNg_FtGJi5Hif13DLFiwq07OFEjHhXM",
    },
    {
        id: "prop-9",
        propId: "PROP-2211",
        title: "Heritage Tower",
        location: "Chicago, IL",
        type: "Commercial",
        price: "$45,000/mo",
        priceNum: 45000,
        beds: 0,
        baths: 8,
        sqft: 25000,
        status: "Sold",
        statusColor: "text-error",
        listedDate: "Dec 15, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnclJog3tgWGbHJQ9Pc15Zbie3WIJep_ws_ptwOE3IHdEwanNLFO89uZry6nFqfwQl3awIrxef9mD57dm5TdLZwRKwyI_d43w6o5RsbSjVNiXxAtqHOdhQW-XChJOVEujB2r3sDRKIwwnlpr8SM_KMPoClHOBKg2HQlvL7fvUiQ3Tf4qL1x200wjEjucJ2p-MrM-eKKjF3P3P2BBTkQECfnIZrBSR1gaEE1H9PkwiwyLtmGisrdLtwDG6VCGoZ1K40TXeAsGW-AGa3",
        agentName: "Alex Rivera",
        agentRole: "Senior Associate",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAV8sZ7Dx2KULsgVP_vp0vL_f8ky2ycJMnueiVZg2E982_tmDqoTbXafOaDHNEFY85kDYDy2-6d3-8fuqqyD5Gb-6Im9pigoeCg20Jb5WKLwqJnmNqIwqmVRDOQDHSyeko1k6wGbS0ASMeDnN6IUC8GMc-_D_wFMn5bUehI0I1Gfl-SFH_JL4xcNIIqpdIjXpyzPI4MaWT6urgaFmG3ewLKxA7z3uU5Dp5dwdk_K3KK7kk3dVh2WgErOY8rfp4f_D992Jq4Ajl9s1p",
    },
    {
        id: "prop-10",
        propId: "PROP-4433",
        title: "Azure Heights",
        location: "Seattle, WA",
        type: "Apartment",
        price: "$2,100,000",
        priceNum: 2100000,
        beds: 3,
        baths: 2,
        sqft: 2100,
        status: "Rented",
        statusColor: "text-primary",
        listedDate: "Dec 18, 2023",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst",
        agentName: "Sarah Chen",
        agentRole: "Listing Expert",
        agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
    }
];

// ── Add Property Modal ────────────────────────────────────────────────────────
function AddPropertyModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (prop: Property) => void;
}) {
    const [form, setForm] = useState({
        title: "",
        type: "Apartment",
        location: "",
        price: "",
        beds: "2",
        baths: "2",
        sqft: "1200",
        status: "Available" as "Available" | "Sold" | "Rented",
    });
    const [saved, setSaved] = useState(false);
    const [images, setImages] = useState<UploadedFile[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const defaultImage =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(form.price.replace(/[$,]/g, "")) || 0;
        const formattedPrice = `$${priceNum.toLocaleString("en-US")}`;
        const gallery = images.map((img) => img.url);
        const imageUrl = gallery[0] ?? defaultImage;

        const newProp: Property = {
            id: `prop-${Date.now()}`,
            propId: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
            title: form.title,
            location: form.location,
            type: form.type,
            price: formattedPrice,
            priceNum,
            beds: parseInt(form.beds) || 0,
            baths: parseFloat(form.baths) || 0,
            sqft: parseInt(form.sqft) || 0,
            status: form.status,
            statusColor: form.status === "Available" ? "text-tertiary" : form.status === "Sold" ? "text-error" : "text-primary",
            listedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
            imageUrl,
            gallery: gallery.length > 0 ? gallery : undefined,
            agentName: "Sarah Chen",
            agentRole: "Listing Expert",
            agentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
        };

        const stored: PropertyData = {
            ...newProp,
            description: `A ${form.type.toLowerCase()} located in ${form.location}.`,
        };
        saveCustomProperty(stored);

        setSaved(true);
        setTimeout(() => {
            onAdd(newProp);
            onClose();
        }, 1000);
    };

    const fieldClass =
        "w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-outline";

    const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
        <div>
            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">{label}</label>
            {key === "price" ? (
                <CurrencyInput required value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} placeholder={placeholder} className={fieldClass} ariaLabel={label} />
            ) : type === "number" ? (
                <NumericInput required mode={key === "baths" ? "decimal" : "integer"} value={form[key]} onChange={(v) => setForm((f) => ({ ...f, [key]: v }))} placeholder={placeholder} className={fieldClass} ariaLabel={label} />
            ) : (
                <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={fieldClass}
                />
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                    <div>
                        <h2 className="text-headline-md font-bold text-on-surface">Add New Property</h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">Enter listing details to publish.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                    </button>
                </div>
                {saved ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <p className="text-headline-md font-bold text-on-surface">Listing Added!</p>
                        <p className="text-body-sm text-on-surface-variant mt-1">Property listing successfully published.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {field("Property Title", "title", "text", "Skyline Penthouse")}
                        {field("Location / Address", "location", "text", "Manhattan, NY")}
                        <div className="grid grid-cols-2 gap-3">
                            {field("Price", "price", "text", "$1,200,000")}
                            <div>
                                <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Property Type</label>
                                <AppSelect instanceId="quick-property-type" value={form.type}
                                    onChange={(v) => setForm((f) => ({ ...f, type: v ?? "Apartment" }))}
                                    options={["Apartment", "Villa", "Commercial"].map((t) => ({ value: t, label: t }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {field("Beds", "beds", "number", "3")}
                            {field("Baths", "baths", "number", "2.5")}
                            {field("Sq Ft", "sqft", "number", "1800")}
                        </div>
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Status</label>
                            <AppSelect instanceId="quick-property-status" value={form.status}
                                onChange={(v) => setForm((f) => ({ ...f, status: (v ?? "Available") as Property["status"] }))}
                                options={["Available", "Sold", "Rented"].map((s) => ({ value: s, label: s }))} />
                        </div>
                        <div>
                            <label className="text-label-sm text-on-surface-variant font-medium block mb-1.5">Property Photos</label>
                            <FileUpload
                                variant="dropzone"
                                compact
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                multiple
                                maxFiles={12}
                                maxSize={5 * 1024 * 1024}
                                files={images}
                                onChange={setImages}
                                onError={setUploadError}
                                label="Upload Property Images"
                                hint="Drag & drop or click to add photos (up to 12)"
                                buttonLabel="Browse Images"
                            />
                            {uploadError && (
                                <p className="text-body-sm text-error mt-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                    {uploadError}
                                </p>
                            )}
                            {images.length > 0 && (
                                <p className="text-body-sm text-tertiary mt-2 font-medium">
                                    {images.length} photo{images.length !== 1 ? "s" : ""} selected
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all">Publish Listing</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function toListProperty(p: PropertyData): Property {
    return {
        ...p,
        statusColor:
            p.status === "Available"
                ? "text-tertiary"
                : p.status === "Sold"
                    ? "text-error"
                    : "text-primary",
    };
}

export default function PropertiesPage() {
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All");
    const [favorites, setFavorites] = useState<Record<string, boolean>>({});
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const custom = getCustomProperties().map(toListProperty);
        if (custom.length === 0) return;
        setProperties((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const novel = custom.filter((p) => !ids.has(p.id));
            return novel.length ? [...novel, ...prev] : prev;
        });
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddProperty = () => {
        setShowAddModal(true);
    };

    // Filter logic
    const filteredProperties = properties.filter((prop) => {
        // Search filter
        if (
            searchQuery &&
            !prop.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !prop.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !prop.propId.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false;
        }

        // Type filter
        if (typeFilter !== "Property Type" && typeFilter !== "All Types" && prop.type !== typeFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== "All" && prop.status !== statusFilter) {
            return false;
        }

        return true;
    });

    return (
        <>
            {showAddModal && (
                <AddPropertyModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={(p) => setProperties((prev) => [p, ...prev])}
                />
            )}
            {/* Sticky Header */}
            <header className="sticky top-14 lg:top-0 z-40 bg-surface/80 backdrop-blur-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 min-h-[4.5rem] py-3 sm:py-0 sm:h-20 px-4 sm:px-6 lg:px-8 w-full">
                <div>
                    <h2 className="text-headline-lg font-headline-lg text-on-surface">Properties</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                        {viewMode === "grid"
                            ? "Visual overview of all listed properties"
                            : "Manage, track and organize all property listings"}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-end w-full sm:w-auto">
                    {/* View Toggle */}
                    <div className="flex bg-surface-container rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            <span className="material-symbols-outlined">list</span>
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                    </div>
                    <button
                        onClick={handleAddProperty}
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add Property
                    </button>
                    <PageHeaderActions />
                    <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
                    <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border-2 border-surface">
                        <img
                            alt="User Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUG3Rs0rEtdjMdVQJ4AQdS6gyPU0gFtHm7QcIy_npMyFyTSpPWP63Yd_2F6wA7sfDwn0fM6bZooxPf4BYsiDWD3jk4iSTwfJwekaa8RiBlN-tDNpeW4qpMbpe4UO1jYeheJl5BgwKg_ESGWwEajgISpl0xsxBnK3FFk2voLZY1AAzWCmyHjhHOJf38F7u7d8Ymlk14kc-JsxILhlCbbyy9it_vglT3PO4QnmIFilkAPYnjJ5p0Ni6zEL6zV9mCxSHSFMcQUCO5cvFA"
                        />
                    </div>
                </div>
            </header>

            <div className="p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 space-y-gutter">
                {/* KPI Row */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between h-32 border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Properties</span>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                <span className="material-symbols-outlined">home_work</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-metric-lg font-metric-lg text-on-surface">1,248</span>
                            <span className="flex items-center text-label-sm text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between h-32 border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Available</span>
                            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-primary transition-colors">
                                <span className="material-symbols-outlined">sell</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-metric-lg font-metric-lg text-on-surface">854</span>
                            <span className="flex items-center text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Stable</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between h-32 border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Sold Units</span>
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-metric-lg font-metric-lg text-on-surface">312</span>
                            <span className="flex items-center text-label-sm text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">+8%</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between h-32 border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Rented</span>
                            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error group-hover:bg-error group-hover:text-on-primary transition-colors">
                                <span className="material-symbols-outlined">key</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-metric-lg font-metric-lg text-on-surface">82</span>
                            <span className="flex items-center text-label-sm text-error bg-error/10 px-2 py-0.5 rounded-full">-2%</span>
                        </div>
                    </div>
                </section>

                {/* Horizontal Filter Bar */}
                <section className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-outline-variant focus:ring-primary focus:border-primary bg-surface-container-low border text-body-md"
                            placeholder="Search by name, ID, or location..."
                            type="text"
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-surface-container rounded-lg">
                        {["All Types", "Apartment", "Villa", "Commercial"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-4 py-1.5 rounded-md text-label-md transition-all ${typeFilter === t ? "bg-surface-container-lowest shadow-sm text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 p-1 bg-surface-container rounded-lg">
                        <button
                            onClick={() => setStatusFilter("All")}
                            className={`px-4 py-1.5 rounded-md text-label-md transition-all ${statusFilter === "All" ? "bg-surface-container-lowest shadow-sm text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter("Available")}
                            className={`px-4 py-1.5 rounded-md text-label-md transition-all ${statusFilter === "Available" ? "bg-surface-container-lowest shadow-sm text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            Available
                        </button>
                        <button
                            onClick={() => setStatusFilter("Sold")}
                            className={`px-4 py-1.5 rounded-md text-label-md transition-all ${statusFilter === "Sold" ? "bg-surface-container-lowest shadow-sm text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            Sold
                        </button>
                        <button
                            onClick={() => setStatusFilter("Rented")}
                            className={`px-4 py-1.5 rounded-md text-label-md transition-all ${statusFilter === "Rented" ? "bg-surface-container-lowest shadow-sm text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                            Rented
                        </button>
                    </div>
                </section>

                {/* View Content Conditional */}
                {viewMode === "grid" ? (
                    /* Grid View Layout */
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((prop) => (
                            <Link
                                key={prop.id}
                                href={`/properties/${prop.id}`}
                                className="group card-hover bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] border border-outline-variant/20 transition-all duration-300 block cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden image-zoom">
                                    <img
                                        alt={prop.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={prop.imageUrl}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-label-sm font-label-md shadow-lg uppercase tracking-wider">
                                            {prop.status}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(prop.id); }}
                                            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-error transition-all"
                                        >
                                            <span
                                                className={`material-symbols-outlined ${favorites[prop.id] ? "text-error" : ""}`}
                                                style={favorites[prop.id] ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                            >
                                                favorite
                                            </span>
                                        </button>
                                        <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-headline-md font-headline-md text-on-surface font-semibold group-hover:text-primary transition-colors">{prop.title}</h3>
                                            <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mt-1">
                                                <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                                                {prop.location}
                                            </div>
                                        </div>
                                        <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-label-sm">
                                            {prop.type}
                                        </span>
                                    </div>
                                    <div className="text-headline-md font-bold text-primary">{prop.price}</div>
                                    <div className="flex justify-between items-center py-4 border-y border-outline-variant/30">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-on-surface-variant">bed</span>
                                            <span className="text-label-md text-on-surface">{prop.beds} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-on-surface-variant">bathtub</span>
                                            <span className="text-label-md text-on-surface">{prop.baths} Baths</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-on-surface-variant">square_foot</span>
                                            <span className="text-label-md text-on-surface">{prop.sqft} sqft</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt="Agent"
                                                className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                                                src={prop.agentAvatar}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-label-md text-on-surface font-semibold">{prop.agentName}</span>
                                                <span className="text-body-sm text-on-surface-variant">{prop.agentRole}</span>
                                            </div>
                                        </div>
                                        <span className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-label-md font-label-md group-hover:bg-primary group-hover:text-on-primary transition-all font-semibold inline-block">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </section>
                ) : (
                    /* List View Layout */
                    <div className="bg-surface-container-lowest rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden border border-outline-variant/20">
                        <div className="table-responsive custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                    <tr>
                                        <th className="px-6 py-4 w-12">
                                            <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                                        </th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider" style={{ width: "280px" }}>
                                            Property
                                        </th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider" style={{ width: "140px" }}>
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider" style={{ width: "120px" }}>
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-4 text-label-sm font-label-sm text-outline uppercase tracking-wider">Listed Date</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {filteredProperties.map((prop) => (
                                        <tr
                                            key={prop.id}
                                            className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                                            onClick={() => router.push(`/properties/${prop.id}`)}
                                        >
                                            <td className="px-6 h-[72px]">
                                                <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/properties/${prop.id}`} className="w-12 h-12 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden">
                                                        <img alt={prop.title} className="w-full h-full object-cover" src={prop.imageUrl} />
                                                    </Link>
                                                    <div>
                                                        <Link href={`/properties/${prop.id}`} className="hover:text-primary transition-colors">
                                                            <p className="font-headline-md text-headline-md text-on-surface truncate max-w-[180px] font-semibold">{prop.title}</p>
                                                        </Link>
                                                        <p className="text-body-sm text-on-surface-variant">ID: {prop.propId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <div className="flex items-center gap-1 text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                    <span className="text-body-md">{prop.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-label-sm">
                                                    {prop.type}
                                                </span>
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <p className="font-headline-md text-headline-md text-primary font-semibold">{prop.price}</p>
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <div className={`flex items-center gap-2 ${prop.status === "Available" ? "text-tertiary" : prop.status === "Sold" ? "text-error" : "text-primary"}`}>
                                                    <span className={`w-2 h-2 rounded-full ${prop.status === "Available" ? "bg-tertiary" : prop.status === "Sold" ? "bg-error" : "bg-primary"}`}></span>
                                                    <span className="text-label-md font-semibold">{prop.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 h-[72px]">
                                                <div className="flex items-center gap-2">
                                                    <img alt={prop.agentName} className="w-8 h-8 rounded-full border-2 border-surface object-cover" src={prop.agentAvatar} />
                                                    <span className="text-body-md font-medium text-on-surface">{prop.agentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 h-[72px] text-body-md text-on-surface-variant">{prop.listedDate}</td>
                                            <td className="px-6 h-[72px] text-right">
                                                <PropActionMenu propId={prop.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 sm:px-8 py-4 bg-surface-container-low border-t border-outline-variant/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <span className="text-body-sm text-on-surface-variant">
                                Showing 1-{filteredProperties.length} of {filteredProperties.length} properties
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-all" disabled>
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-all" disabled>
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination footer in Grid Mode */}
                {viewMode === "grid" && (
                    <div className="flex justify-between items-center py-8">
                        <p className="text-body-md text-on-surface-variant">
                            Showing <span className="font-bold text-on-surface">{filteredProperties.length > 0 ? `1 - ${filteredProperties.length}` : "0"}</span> of{" "}
                            <span className="font-bold text-on-surface">{filteredProperties.length}</span> properties
                        </p>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all" disabled>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
