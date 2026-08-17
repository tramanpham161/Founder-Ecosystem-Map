import React, { useState } from 'react';

interface TalkToUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'Founder' | 'Organisation' | 'Investor' | 'Others';

export const TalkToUsModal: React.FC<TalkToUsModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Founder');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setRole('Founder');
      setMessage('');
      onClose();
    }, 2000);
  };

  const ROLE_CONFIG: Record<UserRole, { color: string }> = {
    Founder: { color: '#F79B1C' }, // Logo Orange
    Organisation: { color: '#25B4BE' }, // Logo Teal
    Investor: { color: '#3FB049' }, // Logo Green
    Others: { color: '#8A9091' }, // Logo Grey
  };

  const ROLES: UserRole[] = ['Founder', 'Organisation', 'Investor', 'Others'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2521]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#e1e1db] rounded-xl max-w-md w-full overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#e1e1db] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1a2521]">Talk to us</h3>
            <p className="text-[11px] text-[#51615a]">Reach out to the OAHA ecosystem team</p>
          </div>
          <button
            id="close-talk-to-us-btn"
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
            <h4 className="text-sm font-bold text-[#1a2521]">Thank you for reaching out</h4>
            <p className="text-xs text-[#51615a]">We will get back to you shortly at {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] rounded-lg px-3 py-2 outline-none"
              />
            </div>

            {/* Who are you? */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1.5">
                Who are you? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {ROLES.map((r) => {
                  const isSelected = role === r;
                  const cfg = ROLE_CONFIG[r];
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                        isSelected
                          ? 'text-white shadow-2xs'
                          : 'bg-[#fbfbf9] hover:bg-[#f2f2ee] border-[#d8d8d2] text-[#1a2521]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? cfg.color : undefined,
                        borderColor: isSelected ? cfg.color : undefined,
                      }}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a2521] mb-1">
                Message *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help or collaborate?"
                className="w-full bg-white border border-[#d8d8d2] focus:border-[#F79B1C] text-xs text-[#1a2521] rounded-lg p-2.5 outline-none resize-none"
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
                id="submit-talk-to-us-btn"
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
