import { Resend } from 'resend';
import type { Lead } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewLeadNotification(leadData: Lead) {
    try {
        const formattedCallDate = leadData.callDate
            ? new Date(leadData.callDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
            : 'N/A';

        await resend.emails.send({
            from: process.env.SENDER_EMAIL!,
            to: process.env.RECIPIENT_EMAILS!,
            subject: `New Sourcing Lead: ${leadData.company || 'Unknown Company'}`,
            html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="20" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td align="center" style="border-bottom: 2px solid #eeeeee;">
                      <h1 style="color: #333333; margin: 0;">New Sourcing Lead Captured</h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Contact Details</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Name:</strong> ${leadData.name || 'N/A'}<br>
                        <strong>Company:</strong> ${leadData.company || 'N/A'}<br>
                        <strong>Email:</strong> ${leadData.email || 'N/A'}<br>
                        <strong>Phone:</strong> ${leadData.phone || 'N/A'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Sourcing Requirements</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Product Interest:</strong> ${leadData.productInterest || 'N/A'}<br>
                        <strong>Order Volume:</strong> ${leadData.orderVolume || 'N/A'}<br>
                        <strong>Preferred Region:</strong> ${leadData.preferredRegion || 'N/A'}<br>
                        <strong>Sourcing Timeline:</strong> ${leadData.sourcingTimeline || 'N/A'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f9f9f9; border-top: 2px solid #eeeeee;">
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Call Status</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Call Scheduled:</strong> <span style="font-weight: bold; color: ${leadData.scheduledCall ? '#28a745' : '#dc3545'};">${leadData.scheduledCall ? 'Yes' : 'No'}</span><br>
                        <strong>Call Date:</strong> ${formattedCallDate}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
             `
        });
        console.log("New lead notification email sent successfully.");
    } catch (error) {
        console.error("Failed to send notification email:", error);
    }
}