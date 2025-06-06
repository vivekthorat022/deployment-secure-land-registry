import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";

const PreviewModal = ({ isOpen, onClose, formData, imageFiles, onSubmit }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
        <Dialog.Panel className="bg-white max-w-2xl p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">📸 Preview Your Listing</Dialog.Title>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Type:</strong> {formData.type}</div>
            <div><strong>Description:</strong> {formData.description}</div>
            <div><strong>State:</strong> {formData.state}</div>
            <div><strong>District:</strong> {formData.district}</div>
            <div><strong>City:</strong> {formData.city}</div>
            <div><strong>Pincode:</strong> {formData.pincode}</div>
            <div><strong>Available For:</strong> {formData.availableFor}</div>
            <div><strong>Price (₹):</strong> {formData.price}</div>
            <div><strong>Size (sq. ft):</strong> {formData.size}</div>
            <div><strong>Contact Name:</strong> {formData.contactName}</div>
            <div><strong>Contact Phone:</strong> {formData.contactPhone}</div>
            <div><strong>Contact Email:</strong> {formData.contactEmail}</div>
          </div>
          <div className="mt-4">
            <strong>📷 Uploaded Images:</strong>
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {imageFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover border rounded"
                />
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={onClose} variant="outline">Cancel</Button>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PreviewModal;
