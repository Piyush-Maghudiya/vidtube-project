import dotenv from "dotenv";
dotenv.config();

import { sendBrevoEmail } from "./src/utils/brevoEmail.js";

async function testEmail() {
    console.log("Starting VidTube Brevo Email Test...");
    const testEmail = process.env.EMAIL_FROM || "test@example.com"; // Sending to yourself
    const testHtml = "<h1>VidTube Brevo Test</h1><p>If you are reading this, Brevo is working perfectly for VidTube!</p>";
    
    const success = await sendBrevoEmail(testEmail, "VidTube - Brevo Test Email", testHtml);
    
    if (success) {
        console.log("✅ SUCCESS! Check your inbox.");
    } else {
        console.log("❌ FAILED! Check the error logs above.");
    }
    process.exit(0);
}

testEmail();
