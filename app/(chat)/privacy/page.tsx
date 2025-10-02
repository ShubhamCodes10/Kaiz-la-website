import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last Updated: October 2025</p>


      {/* Sections */}
      <section id="introduction" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Kaiz La International Co., Ltd (“Kaiz La”, “we”, “our”, “us”) respects your privacy and is committed
          to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and
          safeguard information when you interact with our website, services, and business operations.
        </p>
      </section>

      <section id="information-collected" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p className="mb-2">We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Personal Information:</strong> Name, email, phone number, company details.</li>
          <li><strong>Transactional Information:</strong> Orders, contracts, invoices, payment data.</li>
          <li><strong>Technical Information:</strong> IP address, browser type, device identifiers.</li>
          <li><strong>Behavioral Data:</strong> Website usage, search queries, preferences.</li>
        </ul>
      </section>

      <section id="how-we-use" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p>We use collected data to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Provide sourcing, supply chain, and manufacturing services.</li>
          <li>Process payments, fulfill orders, and deliver goods.</li>
          <li>Improve our website, offerings, and customer experience.</li>
          <li>Communicate with you regarding inquiries, updates, and opportunities.</li>
          <li>Ensure compliance with legal obligations.</li>
        </ul>
      </section>

      <section id="sharing" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Sharing & Disclosure</h2>
        <p>
          We do not sell or rent personal data. We may share your information with:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Trusted third-party service providers (e.g., logistics, IT support).</li>
          <li>Business partners and suppliers for fulfilling orders.</li>
          <li>Legal authorities when required by law.</li>
        </ul>
      </section>

      <section id="cookies" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Cookies & Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze usage, and
          provide relevant content. You may manage cookie preferences through your browser settings.
        </p>
      </section>

      <section id="data-security" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to safeguard personal data against
          unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section id="data-retention" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this
          Policy, comply with legal obligations, resolve disputes, and enforce agreements.
        </p>
      </section>

      <section id="your-rights" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Your Privacy Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict use of your
          data. To exercise these rights, contact us at privacy@kaizla.com.
        </p>
      </section>

      <section id="international" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
        <p>
          As a global company, we may transfer personal data to countries outside your jurisdiction. We take
          steps to ensure such transfers comply with applicable laws.
        </p>
      </section>

      <section id="children" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Children’s Privacy</h2>
        <p>
          Our services are not intended for children under 16. We do not knowingly collect personal data from
          children. If we learn that we have, we will delete it immediately.
        </p>
      </section>

      <section id="updates" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Updated versions will be posted with a revised
          “Last Updated” date.
        </p>
      </section>

      <section id="contact" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p>
          For any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="mt-2">
          Kaiz La International Co., Ltd<br />
          Email: privacy@kaizla.com<br />
          Address: 2F, No. 3rd Building, Fufengda Industrial Park, Fu Yong, Bao’an District, Shenzhen City, China
        </p>
      </section>
    </div>
  );
}