import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    const user = process.env.MAIL_EMAIL || process.env.EMAIL_USER;
    const pass = process.env.MAIL_PASSWORD || process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.error("Error: MAIL_EMAIL or MAIL_PASSWORD missing in .env");
        return;
    }

    console.log(`Testing email configuration for: ${user}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    try {
        await transporter.verify();
        console.log("✅ Connection successful! Credentials are valid.");
        
        const info = await transporter.sendMail({
            from: user,
            to: user, // Send to self
            subject: "Jobify Test Email",
            text: "If you see this, your email configuration is working correctly! 🚀"
        });

        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);

    } catch (error) {
        console.error("❌ Email verification failed:", error.message);
        if (error.code === 'EAUTH') {
            console.error("Hint: Make sure you are using an 'App Password', not your login password.");
        }
    }
};

testEmail();
