import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// IMPORTANT: Create a .env.local file in your project root and add your Resend API key:
// RESEND_API_KEY=your_api_key_here
// Make sure .env.local is added to your .gitignore file!
const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'jvsteps@gmail.com';
// You should use a verified domain with Resend for the FROM_EMAIL in production
// For testing, 'onboarding@resend.dev' might work, but check Resend's documentation.
const FROM_EMAIL = 'onboarding@resend.dev'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Basic validation
    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: `Quote Request <${FROM_EMAIL}>`, // Use a descriptive sender name
      to: [TO_EMAIL],
      subject: `New Quote Request from ${name}`,
      html: `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Service Interested In:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p> 
      `,
      replyTo: email, // Corrected property name from reply_to to replyTo
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }

    console.log('Resend success:', data);
    return NextResponse.json({ message: 'Quote request sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API route error:', error);
    // Check if error is an instance of Error to access message property safely
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
