import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  otp: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, fullName }: SendOTPRequest = await req.json();
    
    console.log("Sending OTP to:", email);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      throw new Error("SMTP configuration missing");
    }

    // Create email message
    const message = [
      `From: ${smtpUser}`,
      `To: ${email}`,
      `Subject: Your OTP for AR-MS11 Signup`,
      `Content-Type: text/html; charset=utf-8`,
      "",
      `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #257bf4, #1e5bbf); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f5f7f8; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #257bf4; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #257bf4; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to AR-MS11!</h1>
            </div>
            <div class="content">
              <p>Hello ${fullName},</p>
              <p>Thank you for signing up with AR-MS11. Please use the following OTP to verify your email address:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <div class="footer">
                <p>&copy; 2025 AR-MS11. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    ].join("\r\n");

    // Connect to SMTP server and send email
    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Read greeting
    const greeting = new Uint8Array(1024);
    await conn.read(greeting);
    console.log("Server greeting:", decoder.decode(greeting));

    // EHLO
    await conn.write(encoder.encode(`EHLO ${smtpHost}\r\n`));
    const ehlo = new Uint8Array(1024);
    await conn.read(ehlo);
    console.log("EHLO response:", decoder.decode(ehlo));

    // STARTTLS
    await conn.write(encoder.encode("STARTTLS\r\n"));
    const starttls = new Uint8Array(1024);
    await conn.read(starttls);
    console.log("STARTTLS response:", decoder.decode(starttls));

    // Upgrade to TLS
    const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });

    // AUTH LOGIN
    await tlsConn.write(encoder.encode("AUTH LOGIN\r\n"));
    const authResponse = new Uint8Array(1024);
    await tlsConn.read(authResponse);

    // Send username
    const usernameB64 = btoa(smtpUser);
    await tlsConn.write(encoder.encode(`${usernameB64}\r\n`));
    const userResponse = new Uint8Array(1024);
    await tlsConn.read(userResponse);

    // Send password
    const passwordB64 = btoa(smtpPassword);
    await tlsConn.write(encoder.encode(`${passwordB64}\r\n`));
    const passResponse = new Uint8Array(1024);
    await tlsConn.read(passResponse);
    console.log("Auth response:", decoder.decode(passResponse));

    // MAIL FROM
    await tlsConn.write(encoder.encode(`MAIL FROM:<${smtpUser}>\r\n`));
    const mailFrom = new Uint8Array(1024);
    await tlsConn.read(mailFrom);

    // RCPT TO
    await tlsConn.write(encoder.encode(`RCPT TO:<${email}>\r\n`));
    const rcptTo = new Uint8Array(1024);
    await tlsConn.read(rcptTo);

    // DATA
    await tlsConn.write(encoder.encode("DATA\r\n"));
    const dataCmd = new Uint8Array(1024);
    await tlsConn.read(dataCmd);

    // Send message
    await tlsConn.write(encoder.encode(`${message}\r\n.\r\n`));
    const dataResponse = new Uint8Array(1024);
    await tlsConn.read(dataResponse);
    console.log("Data response:", decoder.decode(dataResponse));

    // QUIT
    await tlsConn.write(encoder.encode("QUIT\r\n"));
    tlsConn.close();

    console.log("OTP email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
