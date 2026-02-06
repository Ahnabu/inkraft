"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <main className="min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions, feedback, or suggestions? We&apos;d love to hear from you.
                        Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <GlassCard className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="What&apos;s this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>

                                {status === "success" && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600">
                                        ✓ Message sent successfully! We&apos;ll get back to you soon.
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                                        ✗ Something went wrong. Please try again.
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={status === "sending"}
                                >
                                    {status === "sending" ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send size={18} className="mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </GlassCard>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <GlassCard className="p-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <Mail className="text-primary" size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Email Us</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                For general inquiries and support
                            </p>
                            <a href="mailto:hello@inkraft.com" className="text-primary hover:underline">
                                hello@inkraft.com
                            </a>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="text-primary" size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Response Time</h3>
                            <p className="text-sm text-muted-foreground">
                                We typically respond within 24-48 hours during business days.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </main>
    );
}
