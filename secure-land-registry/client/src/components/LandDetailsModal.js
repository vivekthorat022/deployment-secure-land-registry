import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const LandDetailsModal = (props) => {
    const { isOpen, onClose, land } = props;
    const navigate = useNavigate();

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !land) return null;

    const handleEnquire = () => {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) return alert("Please log in first.");

        const currentUser = JSON.parse(userInfo);

        if (!land.userId || !land.userId._id) {
            alert("Seller information is unavailable.");
            return;
        }

        if (currentUser._id === land.userId._id) {
            alert("You cannot enquire about your own listing.");
            return;
        }

        onClose(); // Close modal before navigating

        navigate("/chat", {
            state: {
                landId: land._id,
                sellerId: land.userId._id,
                sellerName: land.userId.name,
            },
        });
    };

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
                        <Button onClick={handleEnquire}>
                            Enquire
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandDetailsModal;
