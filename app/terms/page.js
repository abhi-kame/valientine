import TermsContent from './TermsContent';

export const metadata = {
  title: 'Terms and Conditions | ValenTiny',
  description: 'Read the Terms and Conditions for using ValenTiny, the personalized Valentine proposal builder.',
  robots: {
    index: false, 
    follow: true,
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
