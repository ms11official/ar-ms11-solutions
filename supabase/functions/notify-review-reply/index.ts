import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewReplyRequest {
  toEmail: string;
  toName: string;
  reviewerName: string;
  itemName: string;
  replyContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toEmail, toName, reviewerName, itemName, replyContent }: ReviewReplyRequest = await req.json();
    
    console.log("Sending review reply notification to:", toEmail);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPortEnv = Deno.env.get("SMTP_PORT");
    const smtpPort = smtpPortEnv ? parseInt(smtpPortEnv, 10) : 587;
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      throw new Error("SMTP configuration missing");
    }

    const message = [
      `From: WavexFlow <${smtpUser}>`,
      `To: ${toEmail}`,
      `Subject: Someone replied to your review on ${itemName}`,
      `Content-Type: text/html; charset=utf-8`,
      "",
      `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .reply-box { background: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
            .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">WavexFlow</h1>
            </div>
            <div class="content">
              <p>Hi ${toName || 'there'},</p>
              <p><strong>${reviewerName}</strong> replied to your review on <strong>${itemName}</strong>:</p>
              <div class="reply-box">
                <p style="margin: 0;">"${replyContent}"</p>
              </div>
              <p>Log in to WavexFlow to continue the conversation.</p>
              <div class="footer">
                <p>&copy; 2026 WavexFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    ].join("\r\n");

    const conn = await Deno.connect({ hostname: smtpHost, port: smtpPort });
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const greeting = new Uint8Array(1024);
    await conn.read(greeting);

    await conn.write(encoder.encode(`EHLO ${smtpHost}\r\n`));
    const ehlo = new Uint8Array(1024);
    await conn.read(ehlo);

    await conn.write(encoder.encode("STARTTLS\r\n"));
    const starttls = new Uint8Array(1024);
    await conn.read(starttls);

    const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });

    await tlsConn.write(encoder.encode("AUTH LOGIN\r\n"));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode(`${btoa(smtpUser)}\r\n`));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode(`${btoa(smtpPassword)}\r\n`));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode(`MAIL FROM:<${smtpUser}>\r\n`));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode(`RCPT TO:<${toEmail}>\r\n`));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode("DATA\r\n"));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode(`${message}\r\n.\r\n`));
    await tlsConn.read(new Uint8Array(1024));

    await tlsConn.write(encoder.encode("QUIT\r\n"));
    tlsConn.close();

    console.log("Review reply notification sent to:", toEmail);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
