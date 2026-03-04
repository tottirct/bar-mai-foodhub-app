import { useState, useEffect } from "react";
import UniversalPopUp from "@/components/UniversalPopUp";

interface Option {
  id: number;
  name: string;
  price: number;
}

interface MenuFormPopUpOptionProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: number;
}

export default function MenuFormPopUpOption({ isOpen, onClose, menuId }: MenuFormPopUpOptionProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newOption, setNewOption] = useState({ name: "", price: 0 });

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/menus/${menuId}`);
        const data = await res.json();

        setOptions(data.data.options || []);
      } catch (err) {
        console.error("Failed to fetch options", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) fetchOptions();
  }, [menuId, isOpen]);

  const handleAdd = async () => {
    const res = await fetch(`/api/menus/${menuId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOption),
    });
    
    if (res.ok) {
      const addedOption = await res.json();
      setOptions([...options, addedOption.data]);
      setNewOption({ name: "", price: 0 });
    }
  };

  const handleDelete = async (optionId: number) => {
    await fetch(`/api/menus/${menuId}?optionId=${optionId}`, {
      method: "DELETE",
    });
    setOptions(options.filter((o) => o.id !== optionId));
  };

  return (
    <UniversalPopUp isOpen={isOpen} onClose={onClose} title="จัดการตัวเลือกเสริม">
      <div className="flex flex-col gap-4">
        
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-gray-400">กำลังโหลด...</p>
          ) : (
            options.map((opt) => (
              <div key={opt.id} className="flex justify-between items-center p-2 border rounded">
                <span>{opt.name} (+{opt.price} ฿)</span>
                <button onClick={() => handleDelete(opt.id)} className="text-red-500 text-sm">ลบ</button>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 mt-2">
          <h4 className="font-medium text-sm mb-2">เพิ่มตัวเลือกใหม่</h4>
          <div className="flex gap-2">
            <input 
              placeholder="ชื่อตัวเลือก" 
              className="border p-2 rounded w-full"
              value={newOption.name}
              onChange={(e) => setNewOption({...newOption, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="ราคา" 
              className="border p-2 rounded w-20"
              value={newOption.price}
              onChange={(e) => setNewOption({...newOption, price: Number(e.target.value)})}
            />
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded">+</button>
          </div>
        </div>

        <button onClick={onClose} className="text-gray-500 text-sm mt-4 hover:underline">
            กลับไปแก้ไขเมนูหลัก
        </button>
      </div>
    </UniversalPopUp>
  );
}