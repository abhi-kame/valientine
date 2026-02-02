import { supabase } from '../../../../lib/supabase';

export async function POST(req) {
  try {
    const { refCode, userAgent, path } = await req.json();

    if (!refCode) return Response.json({ error: 'No ref code' }, { status: 400 });

    // 1. Get Affiliate ID from ref code
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('ref_code', refCode)
      .single();

    if (affError || !affiliate) {
      return Response.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // 2. Log click
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert([{
        affiliate_id: affiliate.id,
        user_agent: userAgent,
        path: path,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      }]);

    if (clickError) console.error('Click logging error:', clickError);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Track click API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
