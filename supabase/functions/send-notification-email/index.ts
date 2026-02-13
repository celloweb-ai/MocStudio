import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailRequest {
  notification_id: string;
  to_email: string;
  to_name?: string;
  subject: string;
  notification_type: "moc_status" | "moc_approval" | "task_assigned" | "task_due" | "comment";
  data: {
    moc_title?: string;
    moc_number?: string;
    moc_id?: string;
    task_title?: string;
    task_id?: string;
    old_status?: string;
    new_status?: string;
    due_date?: string;
    assigned_by?: string;
    comment_author?: string;
    comment_preview?: string;
    action_url?: string;
  };
}

function generateEmailHtml(type: EmailRequest["notification_type"], data: EmailRequest["data"], toName?: string): string {
  const greeting = toName ? `Hello ${toName},` : "Hello,";
  const appUrl = "https://mocstudio.lovable.app";
  const actionUrl = data.action_url || appUrl;

  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
      .content { background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; }
      .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
      .status-approved { background: #dcfce7; color: #166534; }
      .status-rejected { background: #fee2e2; color: #991b1b; }
      .status-submitted { background: #dbeafe; color: #1e40af; }
      .status-under_review { background: #fef3c7; color: #92400e; }
      .status-default { background: #f1f5f9; color: #475569; }
      .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px; }
      .button:hover { background: #2563eb; }
      .footer { background: #f8fafc; padding: 16px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #64748b; }
      .moc-info { background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0; }
      .moc-info-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
      .moc-info-value { font-weight: 600; color: #0f172a; margin-top: 4px; }
    </style>
  `;

  let content = "";
  let subject = "";

  switch (type) {
    case "moc_status":
      const statusClass = `status-${data.new_status || "default"}`;
      content = `
        <p>${greeting}</p>
        <p>The status of an MOC request you're following has been updated.</p>
        <div class="moc-info">
          <div class="moc-info-label">MOC Request</div>
          <div class="moc-info-value">${data.moc_number || "N/A"} - ${data.moc_title || "Untitled"}</div>
        </div>
        <p>
          <strong>Status changed:</strong> 
          <span class="status-badge status-${data.old_status || "default"}">${data.old_status || "Unknown"}</span>
          → 
          <span class="status-badge ${statusClass}">${data.new_status || "Unknown"}</span>
        </p>
        <a href="${actionUrl}" class="button">View MOC Details</a>
      `;
      break;

    case "moc_approval":
      content = `
        <p>${greeting}</p>
        <p>You have been requested to review and approve the following MOC request.</p>
        <div class="moc-info">
          <div class="moc-info-label">MOC Request</div>
          <div class="moc-info-value">${data.moc_number || "N/A"} - ${data.moc_title || "Untitled"}</div>
        </div>
        <p>Please review this request at your earliest convenience and provide your approval decision.</p>
        <a href="${actionUrl}" class="button">Review MOC Request</a>
      `;
      break;

    case "task_assigned":
      content = `
        <p>${greeting}</p>
        <p>You have been assigned a new action item that requires your attention.</p>
        <div class="moc-info">
          <div class="moc-info-label">Task</div>
          <div class="moc-info-value">${data.task_title || "Untitled Task"}</div>
          ${data.moc_title ? `
          <div class="moc-info-label" style="margin-top: 12px;">Related MOC</div>
          <div class="moc-info-value">${data.moc_number || "N/A"} - ${data.moc_title}</div>
          ` : ""}
          ${data.due_date ? `
          <div class="moc-info-label" style="margin-top: 12px;">Due Date</div>
          <div class="moc-info-value">${new Date(data.due_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          ` : ""}
        </div>
        ${data.assigned_by ? `<p>Assigned by: <strong>${data.assigned_by}</strong></p>` : ""}
        <a href="${actionUrl}" class="button">View Task</a>
      `;
      break;

    case "task_due":
      content = `
        <p>${greeting}</p>
        <p>This is a reminder that you have a task due soon.</p>
        <div class="moc-info">
          <div class="moc-info-label">Task</div>
          <div class="moc-info-value">${data.task_title || "Untitled Task"}</div>
          ${data.due_date ? `
          <div class="moc-info-label" style="margin-top: 12px;">Due Date</div>
          <div class="moc-info-value" style="color: #dc2626;">${new Date(data.due_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          ` : ""}
        </div>
        <a href="${actionUrl}" class="button">Complete Task</a>
      `;
      break;

    case "comment":
      content = `
        <p>${greeting}</p>
        <p>${data.comment_author || "Someone"} commented on an MOC you're following.</p>
        <div class="moc-info">
          <div class="moc-info-label">MOC Request</div>
          <div class="moc-info-value">${data.moc_number || "N/A"} - ${data.moc_title || "Untitled"}</div>
          ${data.comment_preview ? `
          <div class="moc-info-label" style="margin-top: 12px;">Comment</div>
          <div class="moc-info-value" style="font-style: italic;">"${data.comment_preview}"</div>
          ` : ""}
        </div>
        <a href="${actionUrl}" class="button">View Comment</a>
      `;
      break;

    default:
      content = `
        <p>${greeting}</p>
        <p>You have a new notification from MOC Studio.</p>
        <a href="${appUrl}" class="button">Go to MOC Studio</a>
      `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${styles}
    </head>
    <body>
      <div class="header">
        <h1>MOC Studio</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>This is an automated notification from MOC Studio.</p>
        <p>© ${new Date().getFullYear()} MOC Studio. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { notification_id, to_email, to_name, subject, notification_type, data }: EmailRequest = await req.json();

    // Validate required fields
    if (!to_email || !subject || !notification_type) {
      throw new Error("Missing required fields: to_email, subject, notification_type");
    }

    console.log(`Sending ${notification_type} email to ${to_email}`);

    const html = generateEmailHtml(notification_type, data, to_name);

    // Send the email
    // Note: Replace onboarding@resend.dev with your verified domain once set up
    // e.g., "MOC Studio <notifications@yourdomain.com>"
    const emailResponse = await resend.emails.send({
      from: "MOC Studio <onboarding@resend.dev>",
      to: [to_email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Mark notification as email_sent if notification_id provided
    if (notification_id) {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ email_sent: true })
        .eq("id", notification_id);

      if (updateError) {
        console.error("Failed to update notification email_sent status:", updateError);
      }
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-notification-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
