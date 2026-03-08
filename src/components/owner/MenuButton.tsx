import React, { useState } from "react"; // 1. อย่าลืม import useState
import { Plus } from "lucide-react";
import MenuFormPopUpMain from "@/components/owner/MenuFormPopUp_main";

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  shopId: number;
  menu?: { id: number; name: string; price: number; isAvailable: boolean; imageUrl?: string | null };
  onSaveSuccess?: () => Promise<void>;
}

export const MenuButton = ({ text, shopId, menu, onSaveSuccess, ...props }: MenuButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('main');

  const handleClose = () => {
    setIsModalOpen(false);
    setView('main');
  };

  return (
    <>
      <button
        {...props}
        onClick={() => setIsModalOpen(true)} // 4. เพิ่ม onClick ให้ปุ่ม
        className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-gray-200 flex items-center gap-2"
      >
        <Plus className="w-5 h-5 text-green-400" /> {text}
      </button>

      {isModalOpen && view === 'main' && (
        <MenuFormPopUpMain
          isOpen={isModalOpen}
          onClose={handleClose}
          shopId={shopId}
          menu={menu}
          onEditOptions={() => setView('options')}
          onSaveSuccess={onSaveSuccess}
        />
      )}
    </>
  );
};