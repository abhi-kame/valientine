import { supabase } from '../../../../lib/supabase';

export async function GET(req) {
  try {
    // Group commissions by affiliate where status is 'unpaid'
    const { data: unpaidCommissions, error } = await supabase
      .from('commissions')
      .select(`
        *,
        affiliates (name, upi_id, ref_code)
      `)
      .eq('status', 'unpaid');

    if (error) throw error;

    // Aggregate by affiliate
    const payouts = unpaidCommissions.reduce((acc, curr) => {
      const affId = curr.affiliate_id;
      if (!acc[affId]) {
        acc[affId] = {
          affiliateId: affId,
          name: curr.affiliates.name,
          upi: curr.affiliates.upi_id,
          totalAmount: 0,
          orders: []
        };
      }
      acc[affId].totalAmount += Number(curr.amount);
      acc[affId].orders.push(curr.order_id);
      return acc;
    }, {});

    return Response.json({ payouts: Object.values(payouts) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { affiliateId } = await req.json();

    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid' })
      .eq('affiliate_id', affiliateId)
      .eq('status', 'unpaid');

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
