import PrivacyContent from './PrivacyContent';

export const metadata = {
  title: 'Privacy Policy | ValenTiny',
  description: 'Learn how ValenTiny collects, uses, and protects your personal data.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
