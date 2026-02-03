'use client';

export default function TermsContent() {
  return (
    <main className="legal-container">
      <div className="legal-content">
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: February 3, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to ValenTiny ("we," "our," or "us"). By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you differ to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2>2. Service Description</h2>
          <p>ValenTiny provides a digital platform that allows users to create personalized, interactive web pages for romantic proposals ("Proposals") for a one-time fee. We also offer an affiliate program for partners to earn commissions by referring new users.</p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>By using our service, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information when creating a proposal or registering as an affiliate.</li>
            <li>Not use the platform for any unlawful, harassing, or abusive purpose.</li>
            <li>Ensure you have the right to use any images or media you upload to your personalized page.</li>
            <li>Not upload content that is offensive, explicit, or violates any third-party rights.</li>
          </ul>
        </section>

        <section>
          <h2>4. Payments and Refunds</h2>
          <p><strong>4.1 Pricing:</strong> The cost to create and publish a Proposal is ₹49 (Inclusive of all taxes). This is a one-time payment.</p>
          <p><strong>4.2 Payment Processing:</strong> Payments are processed securely via Razorpay. We do not store your card or banking details on our servers.</p>
          <p><strong>4.3 Refund Policy:</strong> Due to the digital nature of the product (instant access to the personalized link), <strong>all sales are final and non-refundable</strong> once the proposal link has been generated. If you face a technical error preventing access, please contact support for a resolution.</p>
        </section>

        <section>
          <h2>5. Affiliate Program</h2>
          <p><strong>5.1 Commissions:</strong> Registered affiliates earn a 30% commission (approx. ₹14.7) on every successful sale made through their unique referral link.</p>
          <p><strong>5.2 Payouts:</strong> Payouts are processed to the Affiliate's provided UPI ID once the accrued earnings reach a minimum threshold of ₹500.</p>
          <p><strong>5.3 Termination:</strong> We reserve the right to ban any affiliate found engaging in fraudulent activity, spamming, or misleading marketing practices.</p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>The ValenTiny platform, including its code, design, logos, and interactive elements, is the intellectual property of ValenTiny. You are granted a limited, non-exclusive license to use the generated proposal page for personal use.</p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>ValenTiny shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service. We do not guarantee that the recipient will say "Yes" to your proposal! 😉</p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: <a href="mailto:support@valentiny.com">support@valentiny.com</a></p>
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
