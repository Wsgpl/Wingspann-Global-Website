import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto font-['Rajdhani'] text-white">
      <div className="relative w-full max-w-4xl mx-auto my-12 px-6 py-10 bg-black border border-gray-800 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)]">
        <button
          aria-label="Close"
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-all"
        >
          ✕
        </button>

        <div className="text-red-600 font-bold tracking-[0.4em] mb-4 uppercase">Legal</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Terms <span className="text-red-600">and Conditions</span>
        </h1>
        <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_12px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-300 text-lg leading-relaxed mb-10">
          These Terms and Conditions govern your access to and use of the Wingspann Global website (www.wingspannglobal.com). By using
          this site, you confirm that you have read, understood, and agree to be bound by these terms.
        </p>

        <div className="space-y-10 text-gray-200">

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">1. Use of the Website</h3>
            <p className="leading-relaxed mb-3">
              This website is intended for informational and professional engagement purposes. You agree to use it only for lawful
              purposes and in a manner that does not infringe on the rights of others or restrict their use of the site.
            </p>
            <p className="leading-relaxed mb-3">You must not:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Use the site for any unlawful, harmful, or fraudulent purpose</li>
              <li>Attempt to gain unauthorised access to any part of the website or its underlying systems</li>
              <li>Upload or transmit any malicious code, viruses, or disruptive content</li>
              <li>Scrape, harvest, or systematically extract content from the website without written permission</li>
              <li>Impersonate Wingspann Global or any of its employees, partners, or representatives</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">2. Intellectual Property</h3>
            <p className="leading-relaxed">
              All content on this website - including but not limited to text, graphics, logos, images, technical documentation, and
              software - is the property of Wingspann Global or its content licensors and is protected by applicable intellectual
              property laws.
            </p>
            <p className="leading-relaxed mt-3">
              You may view, download, and print content from this site for personal, non-commercial reference only. You may not reproduce,
              modify, distribute, republish, or use any content for commercial purposes without the express written consent of Wingspann
              Global.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">3. Accuracy of Information</h3>
            <p className="leading-relaxed">
              We make every effort to ensure the information on this website is accurate and up to date. However, the content is provided
              for general informational purposes only and may not always reflect the most current developments, product specifications, or
              company news.
            </p>
            <p className="leading-relaxed mt-3">
              Wingspann Global does not warrant the completeness or accuracy of the information on this site. Decisions made on the basis
              of information found here should always be confirmed directly with our team before being acted upon.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">4. Disclaimer of Warranties</h3>
            <p className="leading-relaxed mb-3">
              The website and its content are provided on an "as is" and "as available" basis, without any warranties of any kind, either
              express or implied. To the fullest extent permitted by law, Wingspann Global disclaims all warranties, including but not
              limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Implied warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the website will be uninterrupted, error-free, or free of viruses</li>
              <li>Warranties regarding the accuracy, completeness, or reliability of any content</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">5. Limitation of Liability</h3>
            <p className="leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Wingspann Global, its directors, employees, and affiliates shall not be
              liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of
              this website, including without limitation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Loss of data or business interruption</li>
              <li>Reliance on content found on the site</li>
              <li>Errors or omissions in any content</li>
              <li>Technical issues outside of our control</li>
            </ul>
            <p className="leading-relaxed mt-3">
              This limitation of liability applies regardless of the legal theory under which such damages are claimed.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">6. Submissions and Communications</h3>
            <p className="leading-relaxed">
              When you contact us through the website - whether via a contact form, email, or inquiry submission - you acknowledge that
              any non-confidential information you share may be used by Wingspann Global for business-related purposes, including following
              up on your inquiry or improving our services.
            </p>
            <p className="leading-relaxed mt-3">
              Please do not submit any proprietary or classified information through the website's public-facing channels. Wingspann
              Global is not responsible for the security of unsolicited information submitted outside of secure agreements.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">7. Governing Law and Jurisdiction</h3>
            <p className="leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which
              Wingspann Global is incorporated, without regard to any conflict of law principles. Any disputes arising in connection with
              these terms or the use of this website shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.
            </p>
            <p className="leading-relaxed mt-3">
              If you are accessing this website from outside that jurisdiction, you are responsible for compliance with local laws to the
              extent applicable.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">8. Changes to Terms</h3>
            <p className="leading-relaxed">
              Wingspann Global reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately
              upon posting to this page. We recommend revisiting this page periodically. Continued use of the website following any
              changes constitutes your acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">9. Termination of Access</h3>
            <p className="leading-relaxed">
              We reserve the right to restrict or terminate your access to this website, at our sole discretion and without notice, if we
              believe you have violated any of these terms or applicable law. Such termination does not affect any rights or remedies
              available to Wingspann Global under law.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Contact Us</h3>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy or the Terms and Conditions outlined in this document, we welcome you to
              get in touch with us directly through our website at www.wingspannglobal.com.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-800 text-gray-400 text-sm">
            This document was last reviewed and updated in April 2026.
            <div>© 2026 Wingspann Global. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
