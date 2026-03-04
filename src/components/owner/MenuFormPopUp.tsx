import { useState } from "react";
import UniversalPopUp from "@/components/UniversalPopUp";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: { id: number; name: string; price: number; isAvailable: boolean };
}

export default function MenuFormPopUp({ isOpen, onClose, menu }: MenuFormModalProps) {
  const isEditMode = !!menu;

  const [formData, setFormData] = useState({
    name: menu?.name || "",
    price: menu?.price || 0,
    isAvailable: menu?.isAvailable || false
  });

  const handleSubmit = async () => {
    const url = isEditMode ? `/api/menus/${menu.id}` : "/api/menus";
    const method = isEditMode ? "PATCH" : "POST";
    console.log(`${method} to ${url}`, formData);
    onClose();
  };

  return (
    <UniversalPopUp 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditMode ? "แก้ไขเมนูอาหาร" : "เพิ่มเมนูใหม่"}
    >
      <div className="flex flex-col gap-4">
        <label>ชื่อเมนู</label>
        <input 
          className="border p-2 rounded" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        
        <label>ราคา</label>
        <input 
          type="number"
          className="border p-2 rounded" 
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-500">ยกเลิก</button>
          <button 
            onClick={handleSubmit} 
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEditMode ? "บันทึกข้อมูล" : "สร้างเมนู"}
          </button>
        </div>
      </div>
    </UniversalPopUp>
  );
}