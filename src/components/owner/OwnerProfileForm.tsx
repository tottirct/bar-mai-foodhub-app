import { User } from "lucide-react";
import { OwnerInfo } from "./types";

interface Props {
    data: OwnerInfo;
    onChange: (data: OwnerInfo) => void;
}

export function OwnerProfileForm({ data, onChange }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">แก้ไขข้อมูลผู้ใช้ทั่วไป</h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-2 xl:col-span-2 max-w-2xl">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                    <input
                        type="text" required
                        value={data.name} onChange={e => onChange({ ...data, name: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 text-gray-900"
                        placeholder="เช่น สมชาย ใจดี"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อผู้ใช้ (Username) <span className="text-red-500">*</span></label>
                    <input
                        type="text" required
                        value={data.username} onChange={e => onChange({ ...data, username: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 text-gray-900"
                        placeholder="เช่น owner_123"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">อีเมล <span className="text-red-500">*</span></label>
                    <input
                        type="email" required
                        value={data.email} onChange={e => onChange({ ...data, email: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 text-gray-900"
                        placeholder="เช่น owner@example.com"
                    />
                </div>
            </div>
        </div>
    );
}
