import './globals.css';

export const metadata = {
  title: 'Will You Be My Valentine? ❤️',
  description: 'A cute valentine proposal page with a dynamic name and interactive buttons.',
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
