import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export async function POST(request: NextRequest) {
    try {
        const data: ContactFormData = await request.json();
        const { name, email, subject, message } = data;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Check if Gmail credentials are configured
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error("Gmail credentials not configured");
            return NextResponse.json(
                { error: "Email service not configured. Please contact the administrator." },
                { status: 500 }
            );
        }

        // Create nodemailer transporter with Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Email to you (admin) - notification of new contact
        const mailOptionsToAdmin = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to yourself
            subject: `New Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;">
                            <strong style="color: #333;">From:</strong> 
                            <span style="color: #666;">${name}</span>
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="color: #333;">Email:</strong> 
                            <a href="mailto:${email}" style="color: #4F46E5;">${email}</a>
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="color: #333;">Subject:</strong> 
                            <span style="color: #666;">${subject}</span>
                        </p>
                    </div>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #333;"><strong>Message:</strong></p>
                        <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        This email was sent from the contact form on Inkraft.
                    </p>
                </div>
            `,
        };

        // Email to the sender - confirmation
        const mailOptionsToSender = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Thank you for contacting Inkraft - We received your message`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        Thank You for Contacting Us!
                    </h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Hi <strong>${name}</strong>,
                    </p>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for reaching out to Inkraft. We have received your message and will get back to you within 24-48 hours.
                    </p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #333;"><strong>Your Message:</strong></p>
                        <p style="margin: 0 0 10px 0; color: #666;"><strong>Subject:</strong> ${subject}</p>
                        <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Best regards,<br>
                        <strong>The Inkraft Team</strong>
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #999; margin: 0;">
                            This is an automated confirmation email. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            `,
        };

        // Send both emails
        await transporter.sendMail(mailOptionsToAdmin);
        await transporter.sendMail(mailOptionsToSender);

        return NextResponse.json(
            { 
                success: true, 
                message: "Message sent successfully! We'll get back to you soon." 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}
