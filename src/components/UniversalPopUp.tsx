import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function UniversalPopUp({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
                <button
                    onClick={onClose}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="m-7">{children}</div>
        </div>
    </div>
  );
}