import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Invalidate any existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${req.nextUrl.origin}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "NorthStar <onboarding@resend.dev>",
      to: email,
      subject: "Reset your NorthStar password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="margin-bottom: 32px;">
            <span style="display: inline-block; width: 36px; height: 36px; background: #e02020; border-radius: 8px; text-align: center; line-height: 36px; color: white; font-size: 18px;">&#9733;</span>
            <span style="font-weight: 700; font-size: 18px; margin-left: 8px; color: #111;">North</span><span style="font-weight: 700; font-size: 18px; color: #e02020;">Star</span>
          </div>
          <h1 style="font-size: 20px; font-weight: 700; color: #111; margin-bottom: 8px;">Reset your password</h1>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
            Hi ${user.name}, we received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #e02020; color: white; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
            Reset Password
          </a>
          <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.5;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
