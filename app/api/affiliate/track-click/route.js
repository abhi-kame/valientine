import { supabaseAdmin as supabase } from '../../../../lib/supabase-admin';

export async function POST(req) {
  try {
    const { refCode, userAgent, path, referrer } = await req.json();

    if (!refCode) return Response.json({ error: 'No ref code' }, { status: 400 });

    // 1. Get Affiliate ID from ref code
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('ref_code', refCode)
      .single();

    if (affError || !affiliate) {
      console.error('Affiliate not found for ref:', refCode);
      return Response.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // 2. Log click
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert([{
        affiliate_id: affiliate.id,
        // visited_path: path, // Not in schema
        // user_agent: userAgent, // Not in schema
        referrer_url: referrer,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      }]);

    console.log(`Track Click debug: Inserted for Ref ${refCode}, ID ${affiliate.id}`);

    if (clickError) {
      console.error('Click logging error:', clickError);
      return Response.json({ error: 'Database insert failed', details: clickError }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Track click API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
