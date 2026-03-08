"use client";
import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import UniversalPopUp from "@/components/UniversalPopUp";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

interface Menu {
  id?: number;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string | null;
}

interface MenuFormPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: Menu;
  onEditOptions?: () => void;
  shopId?: number;
  onSaveSuccess?: () => Promise<void>;
}

const MENU_FIELDS = [
  { label: "ชื่อเมนู", name: "menuName", type: "text" },
  { label: "ราคา", name: "price", type: "number" },
  { label: "สถานะพร้อมขาย", name: "isAvailable", type: "checkbox" },
] as const;

export default function MenuFormPopUpMain({ isOpen, onClose, menu, onEditOptions, shopId, onSaveSuccess }: MenuFormPopUpProps) {
  const isEditMode = !!menu;
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    shopId: shopId || 0,
    menuName: menu?.name || "",
    price: menu?.price || 0,
    isAvailable: menu?.isAvailable ?? true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(menu?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
    }));
  };

  // Upload to Cloudinary immediately on file select (same pattern as ShopProfileForm)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await res.json();

      if (uploadData.success) {
        setImagePreview(uploadData.imageUrl);
      } else {
        alert(uploadData.message || "อัปโหลดรูปล้มเหลว");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      name: formData.menuName,
      imageUrl: imagePreview,
      userId: session?.user?.id,
    };
    console.log("Saving:", payload);
    await fetch(`/api/shops/${shopId}/menus${isEditMode ? `/${menu?.id}` : ""}`, {
      method: isEditMode ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await onSaveSuccess?.();
    onClose();
  };

  return (
    <UniversalPopUp isOpen={isOpen} onClose={onClose} title={isEditMode ? "แก้ไขเมนู" : "เพิ่มเมนู"}>
      <div className="flex flex-col gap-4">
        {/* Image Upload Section */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">รูปภาพเมนู</label>
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-400 bg-gray-50 hover:bg-green-50/50 transition-all cursor-pointer">
            {imagePreview ? (
              <div className="relative w-full h-full group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                    title="เปลี่ยนรูป"
                  >
                    <ImagePlus size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500/90 rounded-full text-white hover:bg-red-500 transition-colors"
                    title="ลบรูป"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-2"
              >
                <ImagePlus size={32} className="text-gray-400" />
                <span className="text-sm text-gray-500">คลิกเพื่อเลือกรูปภาพ</span>
              </div>
            )}

            {/* Upload overlay spinner */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 pointer-events-none">
                <Loader2 size={32} className="text-green-500 animate-spin mb-2" />
                <span className="text-sm font-bold text-green-600">กำลังอัปโหลด...</span>
              </div>
            )}

            {/* Invisible File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-50"
            />
          </div>
        </div>

        {MENU_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{field.label}</label>
            {field.type === "checkbox" ? (
              <input
                type="checkbox"
                name={field.name}
                checked={!!formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-5 h-5"
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={String(formData[field.name as keyof typeof formData] || "")}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        {isEditMode && (
          <button type="button" onClick={onEditOptions} className=" bg-blue-500 text-white p-2 rounded ">
            จัดการตัวเลือก
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              กำลังอัปโหลด...
            </>
          ) : (
            "บันทึกข้อมูล"
          )}
        </button>
      </div>
    </UniversalPopUp>
  );
}