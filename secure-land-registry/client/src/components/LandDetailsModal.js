import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const LandDetailsModal = (props) => {
  const { isOpen, onClose, land } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
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
    const userInfoRaw = localStorage.getItem("userInfo");
    if (!userInfoRaw || userInfoRaw === "undefined" || userInfoRaw === "null") {
      alert("Please log in first.");
      return;
    }

    let currentUser;
    try {
      currentUser = JSON.parse(userInfoRaw);
    } catch (err) {
      console.error("❌ Failed to parse userInfo:", err);
      alert("Corrupted session. Please log in again.");
      return;
    }

    if (!currentUser?._id) {
      alert("Please log in first.");
      return;
    }

    if (!land.user?._id) {
      alert("Seller information is unavailable.");
      return;
    }

    if (currentUser._id === land.user._id) {
      alert("You cannot enquire about your own listing.");
      return;
    }

    onClose();
    navigate("/chat", {
      state: {
        landId: land._id,
        sellerId: land.user._id,
        sellerName: land.user.fullName || "Seller",
      },
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl max-w-3xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <h2 className="text-3xl font-bold mb-6 text-blue-700">{land.title}</h2>

          {/* Images */}
          <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto">
            {Array.isArray(land.images) && land.images.length > 0 ? (
              land.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img || "https://placehold.co/300x200?text=No+Image"}
                  alt={`Land ${idx + 1}`}
                  className="w-40 h-28 object-cover rounded-md border flex-shrink-0 shadow-sm"
                />
              ))
            ) : (
              <img
                src="https://placehold.co/300x200?text=No+Image"
                alt="No images available"
                className="w-40 h-28 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Land Info */}
          <div className="space-y-3 text-[15px] text-gray-800 mb-6">
            <div><strong>Description:</strong> {land.description}</div>
            <div><strong>Type:</strong> {land.type}</div>
            <div><strong>Size:</strong> {land.size} sq.ft</div>
            <div><strong>Price:</strong> ₹{land.price?.toLocaleString()}</div>
            <div><strong>Availability:</strong> {land.availableFor}</div>
            <div><strong>Location:</strong> {land.location?.city}, {land.location?.district}, {land.location?.state} - {land.location?.pincode}</div>
            <div><strong>Contact Name:</strong> {land.contactName}</div>
            <div><strong>Phone:</strong> {land.contactPhone}</div>
            <div><strong>Email:</strong> {land.contactEmail}</div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t mt-6">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleEnquire}>Enquire</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetailsModal;
