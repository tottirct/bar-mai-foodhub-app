import { useState } from "react";
import UniversalPopUp from "@/components/UniversalPopUp";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

interface Menu {
  id?: number;
  name: string;
  price: number;
  isAvailable: boolean;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      userId: session?.user?.id // Added userId to payload
    };
    console.log("Saving:", payload);
    await fetch(`/api/shops/${shopId}/menus${isEditMode ? `/${menu?.id}` : ""}`, {
      method: isEditMode ? "PATCH" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    })
    await onSaveSuccess?.();
    onClose();
  };

  return (
    <UniversalPopUp isOpen={isOpen} onClose={onClose} title={isEditMode ? "แก้ไขเมนู" : "เพิ่มเมนู"}>
      <div className="flex flex-col gap-4">
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
        {isEditMode &&(
          <button type="button" onClick={onEditOptions} className=" bg-blue-500 text-white p-2 rounded ">
            จัดการตัวเลือก
          </button>
        )}
        <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded ">
          บันทึกข้อมูล
        </button>
      </div>
    </UniversalPopUp>
  );
}