
import { supabase } from '../../../lib/supabase';

export async function generateMetadata({ params }) {
  const { id } = params;

  // Fetch proposal data for SEO
  const { data: proposal } = await supabase
    .from('proposals')
    .select('name')
    .eq('id', id)
    .single();

  if (!proposal) {
    return {
      title: 'Valentine Proposal ❤️',
      description: 'A special surprise awaits you!',
    };
  }

  return {
    title: `Special Proposal for ${proposal.name} ❤️`,
    description: `Hey ${proposal.name}, someone has a very special question for you! Click to see your personalized surprise.`,
    openGraph: {
      title: `Special Proposal for ${proposal.name} ❤️`,
      description: `Hey ${proposal.name}, a special surprise is waiting for you!`,
      images: [
        {
          url: 'https://valentinyyy.vercel.app/og-image.jpg', // Replace with a generic cute image if you have one
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function ProposalLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Personalized Valentine Proposal',
    description: 'A special, interactive Valentine proposal page created with ValenTiny.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
