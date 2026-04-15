import { useState } from 'react';
import { X } from 'lucide-react';

export default function FraudAlertModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg w-full max-w-4xl relative shadow-2xl shadow-red-600/20 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-red-600 w-full text-center">
            Beware of Fraudulent Job Offers!
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto text-gray-300 text-center space-y-6 leading-relaxed">
          <p>
            Please beware of fake job offers by individuals/entities claiming that they are representatives or under
            contract with Wingspann Global Pvt Ltd, its subsidiaries and joint ventures. It is for the
            information of all that we, Wingspann Global Pvt Ltd as well as our subsidiaries and joint
            ventures have in place an extremely professional, comprehensive and merit-based employee selection
            process and Wingspann Global Pvt Ltd does not:
          </p>

          <div className="space-y-4 text-left mx-auto max-w-3xl">
            <p>1. Send job offers from free email services like Gmail, Rediffmail, Yahoo mail, Hotmail, etc.</p>
            <p>2. Request payment of any kind from prospective candidates for employment or any sort of fees.</p>
            <p>
              3. Authorize anyone to either collect money or arrive at any monetary arrangement in return for a job
              at Wingspann Global Pvt Ltd. However, sometimes recruitment process is done through
              professional recruiting agencies. In such cases, offers are always made directly by Wingspann
              Global Pvt Ltd and not by any third parties.
            </p>
          </div>

          <p className="pt-4">
            Any person undertaking any monetary transaction in lieu of an offer or promise to receive
            employment, training, apprenticeship or other similar benefit from Wingspann Global Pvt Ltd
            and/or its joint ventures / subsidiaries will be doing so at his/her own risks, costs and consequences.
          </p>

          <div className="pt-6 font-bold text-white">
            <p>By</p>
            <p className="mt-2 text-lg">Human Resources Department</p>
            <p className="mt-1 text-lg">Wingspann Global Pvt Ltd</p>
          </div>
        </div>
      </div>
    </div>
  );
}
