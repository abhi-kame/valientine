import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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

    return Response.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
