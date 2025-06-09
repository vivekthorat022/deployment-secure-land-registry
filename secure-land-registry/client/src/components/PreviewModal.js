import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";

const PreviewModal = ({ isOpen, onClose, formData, imageFiles, onSubmit }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 px-4">
        <Dialog.Panel className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-2xl border border-gray-200">
          <Dialog.Title className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Preview Your Land Listing
          </Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-gray-800">
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Type:</strong> {formData.type}</div>
            <div className="md:col-span-2"><strong>Description:</strong> {formData.description}</div>
            <div><strong>State:</strong> {formData.state}</div>
            <div><strong>District:</strong> {formData.district}</div>
            <div><strong>City:</strong> {formData.city}</div>
            <div><strong>Pincode:</strong> {formData.pincode}</div>
            <div><strong>Available For:</strong> {formData.availableFor}</div>
            <div><strong>Price (₹):</strong> {formData.price}</div>
            <div><strong>Size (sq. ft):</strong> {formData.size}</div>
            <div><strong>Contact Name:</strong> {formData.contactName}</div>
            <div><strong>Contact Phone:</strong> {formData.contactPhone}</div>
            <div className="md:col-span-2"><strong>Contact Email:</strong> {formData.contactEmail}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">📷 Uploaded Images</h3>
            <div className="flex gap-3 overflow-x-auto p-2 bg-gray-50 rounded border border-dashed border-gray-300">
              {imageFiles.length > 0 ? (
                imageFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md border shadow-sm flex-shrink-0"
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No images uploaded.</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Edit Listing</Button>
            <Button onClick={onSubmit}>✅ Submit Listing</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PreviewModal;
