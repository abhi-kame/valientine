import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, to } = await req.json();
    
    const { data, error } = await resend.emails.send({
      from: 'Valentine Proposal <onboarding@resend.dev>',
      to: [to || process.env.RECIPIENT_EMAIL || 'your-email@example.com'],
      subject: `She said YES! ❤️`,
      html: `<h1>Great News!</h1><p><strong>${name}</strong> just clicked YES on your Valentine proposal!</p><p>Get ready for Feb 14th! 🌹</p>`,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
