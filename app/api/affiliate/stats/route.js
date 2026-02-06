import { supabaseAdmin as supabase } from '../../../../lib/supabase-admin';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Get Affiliate Profile
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (affError || !affiliate) return Response.json({ error: 'Affiliate profile not found' }, { status: 404 });

    // 2. Get Clicks
    const { data: clicks, error: clickError } = await supabase
      .from('affiliate_clicks')
      .select('id')
      .eq('affiliate_id', affiliate.id);

    const totalClicks = clicks?.length || 0;
    if (clickError) console.error('Stats click fetch error:', clickError);

    console.log(`Stats debug: Affiliate ID ${affiliate.id}, Clicks Found: ${totalClicks}`);

    // 3. Get Commissions (Conversions)
    const { data: commissions } = await supabase
      .from('commissions')
      .select('*')
      .eq('affiliate_id', affiliate.id);

    const totalConversions = commissions?.length || 0;
    const totalEarnings = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
    const pendingPayout = commissions?.filter(c => c.status === 'unpaid').reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    return Response.json({
      affiliate,
      stats: {
        totalClicks,
        totalConversions,
        totalEarnings,
        pendingPayout,
        conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
