// import React from "react";
// import { Dialog } from "@headlessui/react";
// import { Button } from "./ui/button";

// const LandDetailsModal = (props) => {
//   const { isOpen, onClose, land, onEnquire } = props;

//   if (!isOpen || !land) return null;

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4">
//         <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
//         <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto p-6 shadow-lg z-50">
//           <Dialog.Title className="text-2xl font-bold mb-4">{land.title}</Dialog.Title>

//           {/* Images */}
//           <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
//             {Array.isArray(land.images) && land.images.length > 0 ? (
//               land.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img || "https://placehold.co/300x200?text=No+Image"}
//                   alt={`Land ${idx}`}
//                   className="w-40 h-28 object-cover rounded border"
//                 />
//               ))
//             ) : (
//               <img
//                 src="https://placehold.co/300x200?text=No+Image"
//                 alt="No images"
//                 className="w-40 h-28 object-cover rounded border"
//               />
//             )}
//           </div>

//           {/* Land Info */}
//           <div className="space-y-1 text-sm text-gray-700 mb-4">
//             <p><strong>Description:</strong> {land.description}</p>
//             <p><strong>Type:</strong> {land.type}</p>
//             <p><strong>Size:</strong> {land.size} sq.ft</p>
//             <p><strong>Price:</strong> ₹{land.price}</p>
//             <p><strong>Availability:</strong> {land.availableFor}</p>
//             <p><strong>Location:</strong> {land.location.city}, {land.location.district}, {land.location.state} - {land.location.pincode}</p>
//             <p><strong>Contact Name:</strong> {land.contactName}</p>
//             <p><strong>Phone:</strong> {land.contactPhone}</p>
//             <p><strong>Email:</strong> {land.contactEmail}</p>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end mt-6 gap-2">
//             <Button variant="outline" onClick={onClose}>Close</Button>
//             <Button onClick={onEnquire}>Enquire</Button>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default LandDetailsModal;

import React, { useEffect } from "react";
import { Button } from "./ui/button";

const LandDetailsModal = (props) => {
    const { isOpen, onClose, land, onEnquire } = props;

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !land) return null;

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 pr-8">{land.title}</h2>

                    {/* Images */}
                    <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
                        {Array.isArray(land.images) && land.images.length > 0 ? (
                            land.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img || "https://placehold.co/300x200?text=No+Image"}
                                    alt={`Land ${idx + 1}`}
                                    className="w-40 h-28 object-cover rounded border flex-shrink-0"
                                />
                            ))
                        ) : (
                            <img
                                src="https://placehold.co/300x200?text=No+Image"
                                alt="No images available"
                                className="w-40 h-28 object-cover rounded border"
                            />
                        )}
                    </div>

                    {/* Land Info */}
                    <div className="space-y-2 text-sm text-gray-700 mb-6">
                        <div>
                            <span className="font-semibold">Description:</span> {land.description}
                        </div>
                        <div>
                            <span className="font-semibold">Type:</span> {land.type}
                        </div>
                        <div>
                            <span className="font-semibold">Size:</span> {land.size} sq.ft
                        </div>
                        <div>
                            <span className="font-semibold">Price:</span> ₹{land.price?.toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">Availability:</span> {land.availableFor}
                        </div>
                        <div>
                            <span className="font-semibold">Location:</span> {land.location?.city}, {land.location?.district}, {land.location?.state} - {land.location?.pincode}
                        </div>
                        <div>
                            <span className="font-semibold">Contact Name:</span> {land.contactName}
                        </div>
                        <div>
                            <span className="font-semibold">Phone:</span> {land.contactPhone}
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span> {land.contactEmail}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button onClick={onEnquire}>
                            Enquire
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandDetailsModal;