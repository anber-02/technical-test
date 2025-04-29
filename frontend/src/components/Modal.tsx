import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div
        className={`${className} bg-white rounded-lg shadow-lg  h-3/4 w-3/4 lg:w-2/4  p-4 overflow-auto `}
      >
        <header className=" sticky text-black flex justify-between items-center">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2  rounded-full hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
