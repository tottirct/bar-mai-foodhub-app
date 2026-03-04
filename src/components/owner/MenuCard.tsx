import { Edit, X} from "lucide-react";
import React, { useState } from "react";

interface MenuCardProps {
  name: string;
  price: number;
  status: "available" | "out";
  image?: string;
}

export default function MenuCard({ name, price, status }: MenuCardProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden hover:shadow-md transition-all duration-300">

      <div className=" bg-gray-200 w-40 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>

      <div className="p-4 w-full hover:bg-gray-100 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h2>{name}</h2>
          <span className={`mx-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
            status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`
          }>
            {status === 'available' ? 'คงเหลือ' : 'หมด'}
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

    {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">แก้ไขเมนู: {name}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6"></p>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
            </div>

          </div>
        </div>
    )}
    </>
  );
}