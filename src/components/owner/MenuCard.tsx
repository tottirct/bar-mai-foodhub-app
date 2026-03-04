import { Edit, X} from "lucide-react";
import React, { useState } from "react";
import MenuFormPopUpMain from "@/components/owner/MenuFormPopUp_main";
import MenuFormPopUpOption from "@/components/owner/MenuFormPopUp_option";

interface MenuCardProps {
  id : number
  name: string;
  price: number;
  status: boolean;
  image?: string;
  shopId: number
  onSaveSuccess?: () => Promise<void>;
}

export default function MenuCard({ id, name, price, status, shopId, onSaveSuccess }: MenuCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('main');
  const handleClose = () => {
    setIsModalOpen(false);
    setView('main');
  };

  console.log(status);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 flex overflow-hidden hover:shadow-lg transition-all duration-300">

      <div className=" bg-gray-200 w-40 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>

      <div className="p-4 w-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h2>{name}</h2>
          <span className={`mx-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
            status === true ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`
          }>
            {status === true ? 'คงเหลือ' : 'หมด'}
          </span>
        </div>

        <div className="flex justify-between items-center pt-10">
          <span className="text-xl font-bold text-green-600">฿{price}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
            >
              <Edit size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>

    {view === 'main' && (
      <MenuFormPopUpMain
        isOpen={isModalOpen} 
        onClose={handleClose} 
        shopId={shopId}
        menu={{id, name, price, isAvailable: status}}
        onEditOptions={() => setView('options')}
        onSaveSuccess={onSaveSuccess} 
      />
    )}

    {view === 'options' && (
      <MenuFormPopUpOption
        isOpen={isModalOpen} 
        onClose={() => setView('main')}
        menuId={id} 
      />
    )}
    </>
  );
}