import { supabaseAdmin as supabase } from '../../../../lib/supabase-admin';
import { nanoid } from 'nanoid';

export async function POST(req) {
  try {
    const { name, upiId, password } = await req.json();

    // 1. Auto-generate internal email to avoid 'email existed' issues
    const internalEmail = `${upiId.replace(/[^a-zA-Z0-9]/g, '_')}@valentiny.partners`;

    // 1. Check if affiliate already exists in our table first
    const { data: existingAff } = await supabase
      .from('affiliates')
      .select('id')
      .eq('upi_id', upiId)
      .single();

    if (existingAff) {
      return Response.json({ error: 'This UPI ID is already registered. Please go to the Login page.' }, { status: 400 });
    }

    // 2. Attempt Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        data: { full_name: name, upi_id: upiId }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return Response.json({ error: 'This UPI ID is already registered as a partner. Please log in.' }, { status: 400 });
      }
      return Response.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) return Response.json({ error: 'User creation failed' }, { status: 500 });

    // 2. Generate unique ref code
    const refCode = name.split(' ')[0].toUpperCase() + nanoid(4).toUpperCase();

    // 3. Create Affiliate entry
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .insert([{
        user_id: userId,
        ref_code: refCode,
        name: name,
        upi_id: upiId,
        status: 'pending' // Admin must approve
      }])
      .select()
      .single();

    if (affError) return Response.json({ error: affError.message }, { status: 500 });

    return Response.json({ success: true, affiliate });
  } catch (error) {
    console.error('Affiliate register API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
