import { supabaseAdmin as supabase } from '../../../../lib/supabase-admin';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('affiliates')
      .select(`
        *,
        commissions (amount, status),
        affiliate_clicks (count)
      `);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: affiliates, error } = await query;

    if (error) throw error;

    // Formatting data for the admin
    const formatted = affiliates.map(aff => ({
      ...aff,
      totalEarnings: aff.commissions.reduce((sum, c) => sum + Number(c.amount), 0),
      unpaidEarnings: aff.commissions.filter(c => c.status === 'unpaid').reduce((sum, c) => sum + Number(c.amount), 0),
      clickCount: aff.affiliate_clicks?.[0]?.count || 0
    }));

    return Response.json({ affiliates: formatted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    const { data, error } = await supabase
      .from('affiliates')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, affiliate: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
