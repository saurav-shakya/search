import React from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  searchInfo: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, query, searchInfo }) => {
  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
      <button onClick={onClose} className="absolute top-4 right-4">
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4">Search Information</h2>
      <p className="mb-4"><strong>Query:</strong> {query}</p>
      {searchInfo && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Brief Summary:</h3>
          <p>{searchInfo}</p>
        </div>
      )}
    </div>
  );
};

export default SidePanel;