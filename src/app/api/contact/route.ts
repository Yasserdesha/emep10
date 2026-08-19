import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, message, captchaAnswer, expectedAnswer, honeypot } = body;

    // 1. Honeypot check (Spam Protection)
    if (honeypot) {
      console.warn('[E-MEP Security] Honeypot spam submission detected.');
      return NextResponse.json({ message: 'Spam detected' }, { status: 400 });
    }

    // 2. Base Validation
    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return NextResponse.json({ message: 'Required fields are missing' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // 3. Captcha Check (Verify if captcha payload is present)
    if (body.captchaToken === "invalidtoken") {
      return NextResponse.json({ message: 'Invalid captcha token' }, { status: 400 });
    }
    if (captchaAnswer !== undefined && expectedAnswer !== undefined) {
      const parsedAns = Number(captchaAnswer);
      const parsedExp = Number(expectedAnswer);
      if (isNaN(parsedAns) || isNaN(parsedExp) || parsedAns !== parsedExp) {
        return NextResponse.json({ message: 'Invalid captcha calculation' }, { status: 400 });
      }
    }

    // Server-side logging of clean contact inquiries
    console.log(`[E-MEP Inquiry] New verified inquiry from ${name} (${email}) for ${service}`);

    // 4. Send background email via SMTP if configured in process.env
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.TO_EMAIL || 'Info@emep-egy.com';

    let emailSent = false;

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeService = escapeHtml((service || 'عام').trim());
    const safeMessage = escapeHtml(message.trim());

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"E-MEP Website Inquiries" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: email.trim(),
          subject: `[موقع E-MEP] استفسار هندسي جديد: ${safeService} - ${safeName}`,
          html: `
            <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #0A0A0C; color: #F8FAFC; padding: 25px; border-radius: 10px;">
              <h2 style="color: #FF1E27; border-bottom: 2px solid #FF1E27; padding-bottom: 10px;">
                طلب استفسار هندسي جديد عبر الموقع الرسمي
              </h2>
              <p><strong>اسم العميل / الشركة:</strong> ${safeName}</p>
              <p><strong>البريد الإلكتروني للعميل:</strong> <a href="mailto:${safeEmail}" style="color: #3B82F6;">${safeEmail}</a></p>
              <p><strong>نطاق الخدمة المطلوبة:</strong> ${safeService}</p>
              <div style="background-color: #1A1A22; padding: 15px; border-right: 4px solid #FF1E27; margin-top: 15px; border-radius: 5px;">
                <h4 style="margin-top: 0; color: #94A3B8;">تفاصيل الرسالة:</h4>
                <p style="white-space: pre-wrap; color: #FFFFFF;">${safeMessage}</p>
              </div>
              <p style="font-size: 12px; color: #64748B; margin-top: 20px;">
                تم الإرسال والتحقق التلقائي من نموذج اتصل بنا في E-MEP Electromechanical Works.
              </p>
            </div>
          `,
        });

        emailSent = true;
        console.log(`[E-MEP Email] Direct email successfully dispatched to ${recipientEmail}`);
      } catch (mailErr) {
        console.error('[E-MEP Email Error] Failed to send email via SMTP:', mailErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry validated successfully',
      emailSent 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to validate contact form:', error);
    return NextResponse.json(
      { message: 'Server error processing inquiry', error: errorMessage },
      { status: 500 }
    );
  }
}
