import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      appointmentDate,
      appointmentTime,
    } = body;

    if (!fullName || !phone || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        {
          success: false,
          message: "Required appointment details are missing.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "V G ASSOCIATES <onboarding@resend.dev>",
      to: ["vgassociates1995@gmail.com"],
      subject: `New Appointment Booking - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17202A;">
          <h2 style="color: #0B1F33;">
            New Appointment Booking
          </h2>

          <p>A new appointment has been booked through the V G ASSOCIATES website.</p>

          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${appointmentTime}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">
            Please check the Admin → Appointments section for the appointment.
          </p>

          <p>
            <strong>V G ASSOCIATES</strong><br />
            Sai Nagar, Ponnur, Guntur District, Andhra Pradesh – 522124
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Appointment email could not be sent.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Appointment notification email sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Appointment notification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send appointment notification.",
      },
      { status: 500 }
    );
  }
}