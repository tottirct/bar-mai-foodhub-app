import { User } from "lucide-react";
import { OwnerInfo } from "./types";

interface Props {
    data: OwnerInfo;
}

export function OwnerProfileView({ data }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">ข้อมูลผู้ใช้ทั่วไป</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-800">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ-นามสกุล</span>
                    <p className="text-lg font-bold">{data.name || "ไม่ระบุ"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อผู้ใช้ (Username)</span>
                    <p className="text-lg font-bold">@{data.username || "ไม่ระบุ"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">อีเมล</span>
                    <p className="text-lg font-bold">{data.email || "ไม่ระบุ"}</p>
                </div>
            </div>
        </div>
    );
}
