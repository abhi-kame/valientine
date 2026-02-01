import './globals.css';

export const metadata = {
  title: 'ValenTiny | Create Your Personalized Valentine Proposal ❤️',
  description: 'The #1 site to create a cute, interactive, and personalized Valentine proposal page. Get notified instantly when they say YES!',
  openGraph: {
    title: 'ValenTiny | Create Your Personalized Valentine Proposal ❤️',
    description: 'Surprise your special someone with a custom Valentine proposal page. Interactive buttons, cute animations, and instant alerts!',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ValenTiny | Personalized Valentine Proposals',
    description: 'Make your Valentine proposal unforgettable with a custom interactive page.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
