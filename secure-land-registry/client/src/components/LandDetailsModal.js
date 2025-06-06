import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";

console.log("Rendering LandDetailsModal with props:", { isOpen, onClose, land, onEnquire });

const LandDetailsModal = ({ isOpen, onClose, land, onEnquire }) => {
    if (!isOpen || !land) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto p-6 shadow-lg z-50">
                    <Dialog.Title className="text-2xl font-bold mb-4">{land.title}</Dialog.Title>

                    {/* Images */}
                    <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
                        {Array.isArray(land.images) && land.images.length > 0 ? (
                            land.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img || "https://placehold.co/300x200?text=No+Image"}
                                    alt={`Land ${idx}`}
                                    className="w-40 h-28 object-cover rounded border"
                                />
                            ))
                        ) : (
                            <img
                                src="https://placehold.co/300x200?text=No+Image"
                                alt="No images"
                                className="w-40 h-28 object-cover rounded border"
                            />
                        )}
                    </div>

                    {/* Land Info */}
                    <div className="space-y-1 text-sm text-gray-700 mb-4">
                        <p><strong>Description:</strong> {land.description}</p>
                        <p><strong>Type:</strong> {land.type}</p>
                        <p><strong>Size:</strong> {land.size} sq.ft</p>
                        <p><strong>Price:</strong> ₹{land.price}</p>
                        <p><strong>Availability:</strong> {land.availableFor}</p>
                        <p><strong>Location:</strong> {land.location.city}, {land.location.district}, {land.location.state} - {land.location.pincode}</p>
                        <p><strong>Contact Name:</strong> {land.contactName}</p>
                        <p><strong>Phone:</strong> {land.contactPhone}</p>
                        <p><strong>Email:</strong> {land.contactEmail}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-6 gap-2">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={onEnquire}>Enquire</Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default LandDetailsModal;
