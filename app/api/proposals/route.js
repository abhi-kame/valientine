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

        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase Fetch Error:', error);
            return Response.json({ error: 'Proposal not found' }, { status: 404 });
        }

        return Response.json({ proposal: data });
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
