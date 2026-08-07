import { BrevoClient } from '@getbrevo/brevo';

/**
 * Utility function to send emails using Brevo (Sendinblue) Transactional Email API.
 * 
 * @param {string} email - Destination email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 */
export const sendBrevoEmail = async (email, subject, htmlContent) => {
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
        console.error(`[Brevo Email Error] BREVO_API_KEY is not defined in environment variables.`);
        // Fallback to console for development
        console.log("\n=======================================================");
        console.log("📨  DEVELOPMENT EMAIL SIMULATION (Brevo Fallback)");
        console.log(`👤  To: ${email}`);
        console.log(`✉️   Subject: ${subject}`);
        console.log(`=======================================================\n`);
        return false;
    }

    try {
        console.log(`[Brevo Email] Attempting to send email via Brevo API to ${email}...`);
        
        const brevo = new BrevoClient({
            apiKey: brevoApiKey,
        });

        const data = await brevo.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: htmlContent,
            sender: { 
                name: process.env.EMAIL_FROM_NAME || "VidTube", 
                email: process.env.EMAIL_FROM || "no-reply@vidtube.com" 
            },
            to: [{ email: email }]
        });

        console.log(`[Brevo Email] Email sent successfully to ${email}. Message ID: ${data.messageId}`);
        return true;
    } catch (error) {
        console.error(`[Brevo Email Error] Failed to send email via Brevo API:`, error);
        return false;
    }
};
