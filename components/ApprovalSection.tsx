
import React, { useRef } from 'react';
import type { SignatureData } from '../types.ts';

interface SignatureBoxProps {
    title: string;
    name: string;
    role: string;
    signatureImage: string | null;
    onUpdate: (field: 'name' | 'role' | 'signatureImage', value: string | null) => void;
}

const SignatureBox: React.FC<SignatureBoxProps> = ({ title, name, role, signatureImage, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const formattedDate = new Date().toLocaleDateString('ar-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleSignatureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onUpdate('signatureImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSignature = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate('signatureImage', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-700 p-3 text-white text-center">
                <h3 className="font-bold text-lg">{title}</h3>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">الاسم</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className="signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none text-base transition-colors duration-300"
                            aria-label={`${title} Name`}
                        />
                    </div>
                     {/* Role Input */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">المنصب</label>
                         <input
                            type="text"
                            value={role}
                            onChange={(e) => onUpdate('role', e.target.value)}
                            className="signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-sm text-gray-600 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                            aria-label={`${title} Role`}
                        />
                    </div>
                </div>

                {/* Signature Area */}
                <div className="mt-10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-800 font-semibold">التاريخ:</span>
                        <span className="w-3/5 text-center font-medium text-black">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between items-start text-sm mt-6">
                        <span className="text-gray-800 font-semibold pt-4">التوقيع:</span>
                        <div 
                            className="w-3/5 h-24 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-50 relative group transition-colors duration-300"
                            onClick={handleSignatureClick}
                            role="button"
                            tabIndex={0}
                            aria-label="Add signature"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/svg+xml" 
                            />
                            {signatureImage ? (
                                <>
                                    <img src={signatureImage} alt="Signature" className="max-w-full max-h-full object-contain p-2" />
                                    <button 
                                        onClick={handleRemoveSignature} 
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs shadow-lg hover:bg-red-700"
                                        aria-label="Remove signature"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-500 text-xs text-center">انقر لإضافة توقيع</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface ApprovalSectionProps {
    data: SignatureData[];
    onUpdate: (index: number, field: keyof SignatureData, value: string | null) => void;
}

export const ApprovalSection: React.FC<ApprovalSectionProps> = ({ data, onUpdate }) => {
  return (
    <div className="pt-8 border-t-2 border-gray-200 approval-section">
        <div className="flex flex-col md:flex-row gap-8">
            {data.map((signature, index) => (
                 <SignatureBox
                    key={signature.id}
                    title={signature.title}
                    name={signature.name}
                    role={signature.role}
                    signatureImage={signature.signatureImage}
                    onUpdate={(field, value) => onUpdate(index, field, value)}
                />
            ))}
        </div>
    </div>
  );
};