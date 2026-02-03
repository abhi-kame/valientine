'use client';

export default function PrivacyContent() {
  return (
    <main className="legal-container">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: February 3, 2026</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information necessary to provide our services, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, Email address (for notifications), and uploaded images.</li>
            <li><strong>Payment Information:</strong> Transaction IDs and payment status (Processed securely via Razorpay). We do NOT store credit card numbers.</li>
            <li><strong>Affiliate Data:</strong> UPI IDs and contact details for partners receiving payouts.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our site (e.g., page views, clicks).</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the collected data for the following purposes:</p>
          <ul>
            <li>To generate and host your personalized proposal page.</li>
            <li>To send you an email notification when your partner accepts your proposal.</li>
            <li>To process payments and affiliate commissions.</li>
            <li>To improve our website functionality and user experience.</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Storage and Security</h2>
          <p>Your personal data and uploaded images are stored securely on Supabase servers. We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2>4. Sharing of Information</h2>
          <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.</p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>Our website uses "cookies" to enhance the user experience, specifically for tracking affiliate referrals to ensure our partners are paid correctly. You may choose to set your web browser to refuse cookies, but note that some parts of the site may not function properly.</p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>We use third-party services such as <strong>Razorpay</strong> for payment processing and <strong>Supabase</strong> for database/storage. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to request access to the personal information we hold about you. You may also request corrections or deletion of your data by contacting our support team.</p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p>Email: <a href="mailto:privacy@valentiny.com">privacy@valentiny.com</a></p>
        </section>
      </div>

      <style jsx>{`
        .legal-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 60px 20px;
          font-family: 'Quicksand', sans-serif;
          color: #334155;
        }
        .legal-content {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ff4d79;
          margin-bottom: 10px;
          text-align: center;
        }
        .last-updated {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 40px;
          font-size: 0.9rem;
        }
        section {
          margin-bottom: 32px;
        }
        h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 8px;
        }
        p {
          line-height: 1.7;
          margin-bottom: 12px;
        }
        ul {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        a {
          color: #ff4d79;
          text-decoration: none;
          font-weight: 600;
        }
        a:hover {
          text-decoration: underline;
        }
        strong {
            font-weight: 700;
            color: #0f172a;
        }
        @media (max-width: 600px) {
            .legal-content {
                padding: 24px;
            }
            h1 {
                font-size: 2rem;
            }
        }
      `}</style>
    </main>
  );
}
