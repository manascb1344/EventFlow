import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string;
    contentType?: string;
  }>;
}

export async function sendEmail({ to, subject, text, html, attachments }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log('Email sent successfully:', info);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function generatePaymentSuccessEmail(
  customerName: string, 
  amount: number, 
  ticketNumber: string, 
  stripeInvoiceUrl?: string,
  eventDetails?: {
    name: string;
    date: string;
    location: string;
  }
) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const dashboardUrl = `${baseUrl}/dashboard`;
  
  console.log('Generating payment success email for:', { customerName, amount, ticketNumber });
  console.log('Event details at Mailing Service:', eventDetails);
  return {
    subject: 'Payment Successful - EventFlow Ticket Confirmation',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 24px; font-weight: bold; background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #6366F1, #8B94FA, #6366F1);">EventFlow</span>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; margin-bottom: 20px;">
              <h1 style="color: #2d3748; margin-bottom: 20px; text-align: center;">Payment Successful! 🎉</h1>
              
              <p style="color: #4a5568; margin-bottom: 20px;">Dear ${customerName},</p>
              
              <p style="color: #4a5568; margin-bottom: 20px;">Thank you for your purchase! Your payment has been processed successfully, and your ticket is now confirmed.</p>
              
              <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">Payment Details</h2>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; margin-bottom: 15px;">
                  <div style="font-weight: bold; color: #4a5568;">Amount Paid:</div>
                  <div style="color: #2d3748; text-align: right;">₹${(amount / 100).toFixed(2)} INR</div>
                  <div style="font-weight: bold; color: #4a5568;">Payment Status:</div>
                  <div style="color: #48bb78; text-align: right;">Completed</div>
                  <div style="font-weight: bold; color: #4a5568;">Ticket Number:</div>
                  <div style="color: #2d3748; text-align: right;">${ticketNumber}</div>
                </div>

                ${stripeInvoiceUrl ? `
                <div style="text-align: center; margin-top: 15px;">
                  <a href="${stripeInvoiceUrl}" style="background-color: #48bb78; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 14px;">
                    <span style="vertical-align: middle;">📄</span> View Invoice
                  </a>
                </div>
                ` : ''}
              </div>
              
              ${eventDetails ? `
              <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">Event Details</h2>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px;">
                  <div style="font-weight: bold; color: #4a5568;">Event:</div>
                  <div style="color: #2d3748; text-align: right;">${eventDetails.name}</div>
                  <div style="font-weight: bold; color: #4a5568;">Date:</div>
                  <div style="color: #2d3748; text-align: right;">${eventDetails.date}</div>
                  <div style="font-weight: bold; color: #4a5568;">Location:</div>
                  <div style="color: #2d3748; text-align: right;">${eventDetails.location}</div>
                </div>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Ticket Details</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              
              <div style="font-size: 14px; color: #718096;">
                <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>The EventFlow Team</p>
              </div>
            </div>
            
            <div style="text-align: center; font-size: 12px; color: #718096;">
              <p> ${new Date().getFullYear()} EventFlow. All rights reserved.</p>
              <p>
                <a href="${baseUrl}/privacy" style="color: #4299e1; text-decoration: none;">Privacy Policy</a> | 
                <a href="${baseUrl}/terms" style="color: #4299e1; text-decoration: none;">Terms of Service</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

export function generatePaymentErrorEmail(customerName: string, errorMessage: string) {
  console.log('Generating payment error email for:', { customerName, errorMessage });
  return {
    subject: 'Payment Failed - EventFlow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Failed</h2>
        <p>Dear ${customerName},</p>
        <p>We're sorry, but there was an issue processing your payment.</p>
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Error:</strong> ${errorMessage}</p>
        </div>
        <p>Please try again or contact your bank if the issue persists.</p>
        <p>If you need assistance, our support team is here to help.</p>
        <p>Best regards,<br>EventFlow Team</p>
      </div>
    `,
  };
}
