import { supabase } from '../../../lib/supabase';

export async function POST(req) {
    try {
        const { id, name, question, imageUrl, notifyEmail, paymentId } = await req.json();

        const { data, error } = await supabase
            .from('proposals')
            .insert([
                {
                    id,
                    name,
                    question,
                    image_url: imageUrl,
                    notify_email: notifyEmail,
                    payment_id: paymentId,
                    created_at: new Date().toISOString(),
                    status: 'active'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            if (error.code === '22P02') {
                return Response.json({ error: 'Database requires a UUID format for the ID. Please refresh your builder page.' }, { status: 400 });
            }
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, proposal: data });
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json({ error: 'Proposal ID is required' }, { status: 400 });
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)) {
            console.error('CRITICAL: Supabase keys are missing on Vercel! Add them to Environment Variables.');
            return Response.json({ error: 'Server Configuration Error' }, { status: 500 });
        }

        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Handle the case where the ID is not a valid UUID or not found
            if (error.code === '22P02') {
                return Response.json({ error: 'Invalid proposal link format' }, { status: 400 });
            }
            console.error('Supabase Fetch Error:', error);
            return Response.json({ error: 'Proposal not found' }, { status: 404 });
        }

        return Response.json({ proposal: data });
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
