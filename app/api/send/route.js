import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, to } = await req.json();
    
    // Check if configuration exists
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail configuration missing in .env.local");
      return Response.json({ error: "Email configuration missing" }, { status: 500 });
    }

    console.log("Attempting to send email via Gmail user:", process.env.GMAIL_USER);

    // Create a transporter using explicit Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ValenTiny" <${process.env.GMAIL_USER}>`,
      to: to || process.env.RECIPIENT_EMAIL,
      subject: `${name} said YES! ❤️`,
      html: `
        <div style="font-family: 'Quicksand', sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h1 style="color: #ff4d79;">Great News! 🎉</h1>
          <p style="font-size: 1.1rem;">
            <strong>${name}</strong> just clicked <strong>YES</strong> on your Valentine proposal!
          </p>
          <p>Get ready for Feb 14th! 🌹</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8rem; color: #999;">Sent with ❤️ by ValenTiny</p>
        </div>
      `,
    };

    // Verify connection configuration
    await transporter.verify();

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return Response.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Detailed Nodemailer Error:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return Response.json({ error: error.message }, { status: 500 });
  }
}
