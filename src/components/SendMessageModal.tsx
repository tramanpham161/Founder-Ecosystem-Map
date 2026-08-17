import React, { useState } from 'react';
import { Organisation } from '../types';

interface SendMessageModalProps {
  organisation: Organisation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  organisation,
  isOpen,
  onClose,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('founder-application');
  const [messageText, setMessageText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !organisation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setSenderName('');
      setSenderEmail('');
      setMessageText('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2521]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#e1e1db] rounded-xl max-w-lg w-full overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#e1e1db] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1a2521]">
              Contact {organisation.name}
            </h3>
            <p className="text-[11px] text-[#51615a]">
              Direct enquiry to {organisation.director}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#f4f4f0] text-[#51615a] rounded-lg transition-colors font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#3EB049]/15 text-[#2c8535] font-bold text-lg flex items-center justify-center mx-auto">
              ✓
            </div>
            <h4 className="text-sm font-bold text-[#1a2521]">
              Enquiry sent successfully
            </h4>
            <p className="text-xs text-[#51615a] max-w-sm mx-auto">
              Your message has been routed to {organisation.director} at {organisation.name} ({organisation.email}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div className="bg-[#fbfbf9] border border-[#e5e5e0] rounded-lg p-3 text-xs text-[#51615a]">
              <div className="font-semibold text-[#1a2521]">
                Recipient: {organisation.director} ({organisation.directorRole})
              </div>
              <div className="text-[11px] text-[#51615a] mt-0.5">
                Location: {organisation.locationDisplay} • Email: {organisation.email}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                  Your full name *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Maya Sterling"
                  className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] rounded-lg px-3 py-1.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                  Your email address *
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="founder@venture.co.uk"
                  className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] rounded-lg px-3 py-1.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                Enquiry topic
              </label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full bg-white border border-[#d8d8d2] text-xs text-[#1a2521] rounded-lg px-3 py-1.5 outline-none"
              >
                <option value="founder-application">
                  Founder programme application / eligibility
                </option>
                <option value="mentor-inquiry">
                  Offering mentorship or advisory support
                </option>
                <option value="angel-vc-cofunding">
                  Co-investment / syndicate partnership
                </option>
                <option value="general-collaboration">
                  University or regional ecosystem collaboration
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                Your message & founder overview *
              </label>
              <textarea
                rows={3}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Briefly introduce your venture stage, background, and what specific support you are seeking..."
                className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] rounded-lg p-2.5 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#51615a] hover:bg-[#f4f4f0] border border-[#e1e1db] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#F79B1C] hover:bg-[#e08912] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Send message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
