import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          Privacy <span className="text-red-600">Policy</span>
        </h1>
        <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_12px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Welcome to Wingspann Global. This document outlines our Privacy Policy for use of our website located at
          www.wingspannglobal.com. By accessing or using this website, you agree to the terms set out here. If you do not
          agree, please discontinue use of the site.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed mb-10">
          We take your privacy seriously. This policy explains what information we collect, why we collect it, how we use it,
          and your rights in relation to it. We encourage you to read this carefully.
        </p>

        <div className="space-y-10 text-gray-200">

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">1. About Wingspann Global</h3>
            <p className="leading-relaxed">
              Wingspann Global is a next-generation aerospace robotics company focused on developing advanced unmanned and autonomous
              systems for defence, commercial, and research applications. Our website serves as an informational and engagement platform
              for clients, partners, investors, and interested individuals across the world.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h3>
            <p className="leading-relaxed mb-4">
              We collect two broad categories of information when you interact with our website:
            </p>
            <p className="font-semibold text-white mb-2">a) Personal Identification Information</p>
            <p className="leading-relaxed mb-3">
              Personal identification information refers to any data that can be used to identify you as an individual. This includes,
              but is not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300">
              <li>Full name and job title</li>
              <li>Email address and phone number</li>
              <li>Company name and professional affiliation (where provided voluntarily)</li>
              <li>Mailing or physical address (where provided voluntarily)</li>
              <li>Any other information you submit through our contact or inquiry forms</li>
            </ul>
            <p className="leading-relaxed mb-6">
              We collect this information only when you voluntarily provide it to us - for example, when filling out a contact form,
              requesting a product demonstration, subscribing to updates, or reaching out via email. We do not collect personal
              information without your knowledge or consent.
            </p>

            <p className="font-semibold text-white mb-2">b) Non-Personal Identification Information</p>
            <p className="leading-relaxed mb-3">
              Non-personal identification information is collected automatically when you browse our website. This data does not
              identify you as an individual but helps us understand how visitors interact with our site. It includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>IP address and approximate geographic location (country/city level)</li>
              <li>Browser type, version, and operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring URLs (the site or link that brought you to our site)</li>
              <li>Date and time of your visit</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">3. Cookies and Web Tracking</h3>
            <p className="leading-relaxed mb-4">
              Like most websites, Wingspann Global uses cookies to enhance your browsing experience. Cookies are small text files stored
              on your device by your web browser when you visit our site. They help us remember your preferences, understand usage
              patterns, and improve site functionality.
            </p>
            <p className="font-semibold text-white mb-2">Types of Cookies We Use:</p>
            <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300">
              <li>Essential Cookies - These are necessary for the website to function. They enable core features like page navigation and access to secure areas.</li>
              <li>Analytics Cookies - These help us understand how visitors use our site. We may use tools like Google Analytics or similar platforms to track visits, session durations, and page performance. This data is aggregated and anonymised.</li>
              <li>Preference Cookies - These remember your settings and choices so you do not have to re-enter them every time you visit.</li>
              <li>Third-Party Cookies - Some embedded content or services on our website (such as maps, video, or social sharing tools) may set their own cookies. We do not control these, and they are governed by the respective third party's privacy policy.</li>
            </ul>
            <p className="leading-relaxed mb-4">
              You can control or disable cookies through your browser settings at any time. However, please note that disabling certain
              cookies may affect the functionality of parts of our website. Most modern browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300">
              <li>View which cookies are stored</li>
              <li>Delete cookies individually or in bulk</li>
              <li>Block cookies from specific websites or all websites</li>
              <li>Set preferences for first-party vs. third-party cookies</li>
            </ul>
            <p className="leading-relaxed">
              Continuing to use our website without adjusting your browser settings is taken as your acceptance of cookies as described
              in this policy.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">4. How We Use the Information We Collect</h3>
            <p className="leading-relaxed mb-3">The information we collect is used for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>To respond to your inquiries and communicate with you effectively</li>
              <li>To send updates, newsletters, or information about Wingspann Global's products and developments (only when you have opted in or made a specific request)</li>
              <li>To understand how our website is used and improve its content and performance</li>
              <li>To detect and prevent fraudulent or malicious activity</li>
              <li>To comply with applicable legal obligations</li>
              <li>To process partnership or business inquiries</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We do not use your personal information for unsolicited marketing, automated profiling, or any purpose that you have not
              been informed of.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">5. Sharing and Disclosure of Information</h3>
            <p className="leading-relaxed mb-3">
              Wingspann Global does not sell, rent, trade, or otherwise share your personal information with third parties for commercial
              purposes. We may, however, share information in limited and specific circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>With trusted service providers who assist us in operating our website and conducting our business, under strict confidentiality agreements</li>
              <li>When required by law, court order, or government authority</li>
              <li>To protect the safety, rights, or property of Wingspann Global, its employees, or the public</li>
              <li>In connection with a merger, acquisition, or sale of business assets, where appropriate notice will be provided</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Any third parties we work with are required to handle your data responsibly and in accordance with applicable privacy laws.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">6. Data Retention</h3>
            <p className="leading-relaxed">
              We retain personal information only for as long as is necessary to fulfil the purposes for which it was collected, or as
              required by applicable law. Contact form submissions and correspondence are typically retained for a period of up to three
              years. You may request deletion of your information at any time by contacting us (see Section 9).
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">7. Data Security</h3>
            <p className="leading-relaxed">
              We take reasonable and appropriate measures to protect the personal information you share with us. Our website uses
              industry-standard security practices, including HTTPS encryption, to safeguard data in transit. Access to any personal data
              we store is restricted to authorised personnel only.
            </p>
            <p className="leading-relaxed mt-3">
              That said, no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to
              use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">8. Links to Third-Party Websites</h3>
            <p className="leading-relaxed">
              Our website may contain links to external websites or resources that are not owned or controlled by Wingspann Global. We are
              not responsible for the privacy practices or content of those third-party sites. We encourage you to review the privacy
              policies of any third-party websites you visit.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">9. Your Rights and How to Contact Us</h3>
            <p className="leading-relaxed mb-3">
              Depending on your location and applicable law, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict certain types of processing</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="leading-relaxed">
              To exercise any of these rights, or if you have questions about how we handle your data, please reach out to us at:
            </p>
            <div className="mt-3 text-gray-300">
              <div>Wingspann Global</div>
              <div>Website: www.wingspannglobal.com</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">10. Changes to This Privacy Policy</h3>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or
              other factors. When we do, we will revise the "Last Updated" date at the top of this document. We encourage you to review
              this page periodically. Your continued use of the website after changes are posted constitutes your acceptance of those
              changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
