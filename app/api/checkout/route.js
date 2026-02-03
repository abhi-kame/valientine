import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error("CRITICAL: Razorpay API keys are missing in environment variables!");
}

const razorpay = new Razorpay({
  key_id: key_id || 'MISSING_KEY',
  key_secret: key_secret || 'MISSING_SECRET',
});

export async function POST(req) {
  try {
    const { amount, currency = 'INR', proposalId } = await req.json();

    const options = {
      amount: amount * 100, // Amount in paise (199 INR = 19900 paise)
      currency,
      receipt: proposalId,
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order.id);
    console.log("Razorpay Key Mode:", key_id.startsWith('rzp_live') ? 'LIVE (Real Money)' : 'TEST (Dummy Money)');
    return Response.json(order);
  } catch (error) {
    console.error("Razorpay Order Error Details:", {
      message: error.message,
      code: error.code,
      description: error.description,
      metadata: error.metadata
    });
    return Response.json(
      { error: error.message || "Failed to create Razorpay order" }, 
      { status: 500 }
    );
  }
}
