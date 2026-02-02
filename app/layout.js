import { Suspense } from 'react';
import './globals.css';
import AffiliateTracker from '../components/AffiliateTracker';

export const metadata = {
  metadataBase: new URL('https://valentiny.com'), // Replace with actual domain
  title: {
    default: 'ValenTiny | Create Your Personalized Valentine Proposal ❤️',
    template: '%s | ValenTiny'
  },
  description: 'The #1 platform to create cute, interactive, and personalized Valentine proposal pages. Surprise your partner with dynamic animations and instant YES alerts.',
  keywords: ['valentine proposal', 'personalized valentine page', 'valentine builder', 'cute proposal ideas', 'interactive valentine', 'valentiiny'],
  authors: [{ name: 'ValenTiny Team' }],
  creator: 'ValenTiny',
  publisher: 'ValenTiny',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ValenTiny | Personalized Valentine Proposal Pages',
    description: 'Surprise your special someone with a custom Valentine proposal page. Interactive buttons, cute animations, and instant alerts!',
    url: 'https://valentiny.com',
    siteName: 'ValenTiny',
    images: [
      {
        url: '/og-image.jpg', // Make sure this exists
        width: 1200,
        height: 630,
        alt: 'ValenTiny Proposal Builder Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ValenTiny | Personalized Valentine Proposals',
    description: 'Make your Valentine proposal unforgettable with a custom interactive page. Create yours in minutes.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
