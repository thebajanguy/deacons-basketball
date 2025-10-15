using IntakeAPI.DTOs;
using IntakeAPI.Extensions;
using IntakeAPI.Settings;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using MimeKit;
using Org.BouncyCastle.Ocsp;
using System.Diagnostics.Metrics;
using System.Net;
using System.Numerics;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace IntakeAPI.Services;

internal interface IEmailService
{
    Task<string> SendCorrespondenceEmailAsync(CorrespondenceDto c, IEnumerable<string>? additionalTo = null, CancellationToken ct = default);
    Task<string> SendRegistrationEmailAsync(ActivityRegistrationDto c, IEnumerable<string>? additionalTo = null, CancellationToken ct = default);

}


internal class EmailService(IOptions<GmailOptions> mailOptions) : IEmailService
{
    private readonly GmailOptions _mailOptions = mailOptions.Value ?? throw new ArgumentNullException(nameof(mailOptions));

    public async Task<string> SendRegistrationEmailAsync(ActivityRegistrationDto r, IEnumerable<string>? additionalTo = null, CancellationToken ct = default)
    {
        var (subject, html, text) = BuildForRegistration(r);

        string? GetSetting(string? optValue, string envKey)
            => !string.IsNullOrWhiteSpace(optValue) ? optValue.Trim()
               : Environment.GetEnvironmentVariable(envKey)?.Trim();

        var gmailUser = GetSetting(_mailOptions?.GmailUser, "GMAIL_USER");
        var gmailAppPass = GetSetting(_mailOptions?.GmailAppPassword, "GMAIL_APP_PASSWORD");
        var contactToRaw = GetSetting(_mailOptions?.MailTo, "CONTACT_TO");

        if (string.IsNullOrWhiteSpace(gmailUser)) throw new InvalidOperationException("Missing configuration: GMAIL_USER");
        if (string.IsNullOrWhiteSpace(gmailAppPass)) throw new InvalidOperationException("Missing configuration: GMAIL_APP_PASSWORD");

        // Split CONTACT_TO (supports ; or ,) + merge in additionalTo
        var toList = SplitRecipients(contactToRaw ?? gmailUser);
        if (additionalTo is not null) toList.AddRange(additionalTo);
        toList = toList
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress("VSA Prep", gmailUser));
        foreach (var addr in toList)
            msg.To.Add(MailboxAddress.Parse(addr));

        // Reply-To: use guardian email if present; otherwise player email
        var replyName = r.Guardian?.GuardianName ?? $"{r.Player?.Givenname} {r.Player?.Surname}".Trim();
        var replyEmail = FirstNonEmpty(r.Guardian?.GuardianEmail, r.Player?.Email);
        if (!string.IsNullOrWhiteSpace(replyEmail))
            msg.ReplyTo.Add(new MailboxAddress(replyName ?? "Sender", replyEmail));

        msg.Subject = subject;
        msg.Body = new BodyBuilder { TextBody = text, HtmlBody = html }.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.gmail.com", 465, MailKit.Security.SecureSocketOptions.SslOnConnect, ct);
        await smtp.AuthenticateAsync(gmailUser, gmailAppPass, ct);
        var messageId = await smtp.SendAsync(msg, ct);
        await smtp.DisconnectAsync(true, ct);

        return messageId;
    }

    public async Task<string> SendCorrespondenceEmailAsync(CorrespondenceDto c, IEnumerable<string>? additionalTo = null, CancellationToken ct = default)
    {
        var (subject, html, text) = BuildForCorrespondence(c);

        string? GetSetting(string? optValue, string envKey)
            => !string.IsNullOrWhiteSpace(optValue) ? optValue.Trim()
               : Environment.GetEnvironmentVariable(envKey)?.Trim();

        var gmailUser = GetSetting(_mailOptions?.GmailUser, "GMAIL_USER");
        var gmailAppPass = GetSetting(_mailOptions?.GmailAppPassword, "GMAIL_APP_PASSWORD");
        var contactToRaw = GetSetting(_mailOptions?.MailTo, "CONTACT_TO");

        if (string.IsNullOrWhiteSpace(gmailUser)) throw new InvalidOperationException("Missing configuration: GMAIL_USER");
        if (string.IsNullOrWhiteSpace(gmailAppPass)) throw new InvalidOperationException("Missing configuration: GMAIL_APP_PASSWORD");

        var toList = SplitRecipients(contactToRaw ?? gmailUser);
        if (additionalTo is not null) toList.AddRange(additionalTo);
        toList = toList
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress("VSA Prep", gmailUser));
        foreach (var addr in toList)
            msg.To.Add(MailboxAddress.Parse(addr));

        // Reply-To: visitor's email, if present
        if (!string.IsNullOrWhiteSpace(c.Email))
        {
            var display = $"{c.GivenName} {c.Surname}".Trim();
            msg.ReplyTo.Add(new MailboxAddress(string.IsNullOrWhiteSpace(display) ? "Sender" : display, c.Email));
        }

        msg.Subject = subject;
        msg.Body = new BodyBuilder { TextBody = text, HtmlBody = html }.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.gmail.com", 465, MailKit.Security.SecureSocketOptions.SslOnConnect, ct);
        await smtp.AuthenticateAsync(gmailUser, gmailAppPass, ct);
        var messageId = await smtp.SendAsync(msg, ct);
        await smtp.DisconnectAsync(true, ct);

        return messageId;
    }

    // --- helpers ---

    private static List<string> SplitRecipients(string csvOrSsv) =>
        csvOrSsv.Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

    private static string? FirstNonEmpty(params string?[] items) =>
        items.FirstOrDefault(s => !string.IsNullOrWhiteSpace(s));

    private static (string subject, string html, string text) BuildForCorrespondence(CorrespondenceDto c)
    {
        var kind = ResolveKindDisplay(c);
        var when = c.Timestamp.ToString("u");
        var subject = $"[{c.ApplicationName}] {kind}: {c.Interest ?? "New submission"}";

        var sb = new StringBuilder()
            .Append("<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4\">")
            .Append($"<h2 style=\"margin:0 0 8px\">{Escape(subject)}</h2>")
            .Append("<table style=\"border-collapse:collapse\">");

        Row(sb, "Type", kind);
        Row(sb, "When", when);
        Row(sb, "Given Name", c.GivenName);
        Row(sb, "Surname", c.Surname);
        Row(sb, "Phone", c.Phone);
        Row(sb, "Email", c.Email);
        Row(sb, "Country", c.Country);
        Row(sb, "Interest", c.Interest);
        Row(sb, "Day", c.Day);
        Row(sb, "Time", c.Time);
        Row(sb, "Year", c.Year);
        Row(sb, "Message", c.Message);
        sb.Append("</table></div>");
        var html = sb.ToString();

        var lines = new List<string>
        {
            subject,
            $"Type: {kind}",
            $"When: {when}"
        };
        Line(lines, "Given Name", c.GivenName);
        Line(lines, "Surname", c.Surname);
        Line(lines, "Email", c.Email);
        Line(lines, "Phone", c.Phone);
        Line(lines, "Country", c.Country);
        Line(lines, "Interest", c.Interest);
        Line(lines, "Day", c.Day);
        Line(lines, "Time", c.Time);
        Line(lines, "Year", c.Year);
        if (!string.IsNullOrWhiteSpace(c.Message))
        {
            lines.Add("");
            lines.Add("Message:");
            lines.Add(c.Message!);
        }
        var text = string.Join(Environment.NewLine, lines);
        return (subject, html, text);
    }

    private static (string subject, string html, string text) BuildForRegistration(ActivityRegistrationDto r)
    {
        var subject = $"[{r.ApplicationName}] {r.RegistrationType}: {r.Interest ?? "New Registration"}";
        var when = r.Timestamp.ToString("u");

        var sb = new StringBuilder()
            .Append("<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4\">")
            .Append($"<h2 style=\"margin:0 0 8px\">{Escape(subject)}</h2>")
            .Append("<table style=\"border-collapse:collapse\">");

        Row(sb, "Type", r.RegistrationType);
        Row(sb, "Country", r.Country);
        Row(sb, "Interest", r.Interest);
        Row(sb, "ActivityId", r.ActivityId);
        Row(sb, "When", when);

        // Player (null-safe)
        Row(sb, "Given Name", r.Player?.Givenname);
        Row(sb, "Surname", r.Player?.Surname);
        Row(sb, "DOB", r.Player?.DOB);
        Row(sb, "Phone", r.Player?.Phone);
        Row(sb, "Email", r.Player?.Email);

        Row(sb, "School", r.Player?.School);
        Row(sb, "GradeOrForm", r.Player?.GradeOrForm);
        Row(sb, "Position", r.Player?.Position);
        Row(sb, "SkillLevel", r.Player?.SkillLevel);
        Row(sb, "TshirtSize", r.Player?.TshirtSize);

        // Guardian (null-safe)
        Row(sb, "GuardianName", r.Guardian?.GuardianName);
        Row(sb, "GuardianEmail", r.Guardian?.GuardianEmail);
        Row(sb, "GuardianPhone", r.Guardian?.GuardianPhone);
        Row(sb, "GuardianRelation", r.Guardian?.GuardianRelation);

        // Payment (null-safe)
        Row(sb, "PaymentMethod", r.Payment?.PaymentMethod);
        Row(sb, "PaymentAmount", r.Payment?.PaymentAmount?.ToString());
        Row(sb, "PaymentCurrency", r.Payment?.PaymentCurrency);
        Row(sb, "PaymentStatus", r.Payment?.PaymentStatus);
        Row(sb, "PaymentTransactionId", r.Payment?.PaymentTransactionId);

        Row(sb, "Notes", r.Notes);
        sb.Append("</table></div>");
        var html = sb.ToString();

        var lines = new List<string>
        {
            subject,
            $"Type: {r.RegistrationType}",
            $"When: {when}"
        };
        Line(lines, "Country", r.Country);
        Line(lines, "Interest", r.Interest);
        Line(lines, "ActivityId", r.ActivityId);

        Line(lines, "Given Name", r.Player?.Givenname);
        Line(lines, "Surname", r.Player?.Surname);
        Line(lines, "DOB", r.Player?.DOB);
        Line(lines, "Phone", r.Player?.Phone);
        Line(lines, "Email", r.Player?.Email);

        Line(lines, "School", r.Player?.School);
        Line(lines, "GradeOrForm", r.Player?.GradeOrForm);
        Line(lines, "Position", r.Player?.Position);
        Line(lines, "SkillLevel", r.Player?.SkillLevel);
        Line(lines, "TshirtSize", r.Player?.TshirtSize);

        Line(lines, "GuardianName", r.Guardian?.GuardianName);
        Line(lines, "GuardianEmail", r.Guardian?.GuardianEmail);
        Line(lines, "GuardianPhone", r.Guardian?.GuardianPhone);
        Line(lines, "GuardianRelation", r.Guardian?.GuardianRelation);

        Line(lines, "PaymentMethod", r.Payment?.PaymentMethod);
        Line(lines, "PaymentAmount", r.Payment?.PaymentAmount?.ToString());
        Line(lines, "PaymentCurrency", r.Payment?.PaymentCurrency);
        Line(lines, "PaymentStatus", r.Payment?.PaymentStatus);
        Line(lines, "PaymentTransactionId", r.Payment?.PaymentTransactionId);

        if (!string.IsNullOrWhiteSpace(r.Notes))
        {
            lines.Add("");
            lines.Add("Notes:");
            lines.Add(r.Notes!);
        }

        var text = string.Join(Environment.NewLine, lines);
        return (subject, html, text);
    }

    private static void Row(StringBuilder sb, string label, string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return;
        sb.Append("<tr>")
          .Append($"<td style=\"padding:4px 8px;color:#666;white-space:nowrap\">{Escape(label)}:</td>")
          .Append($"<td style=\"padding:4px 8px\">{Escape(value)}</td>")
          .Append("</tr>");
    }

    private static void Line(List<string> lines, string label, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value))
            lines.Add($"{label}: {value}");
    }

    private static string Escape(string s) => System.Net.WebUtility.HtmlEncode(s);
    private static string ResolveKindDisplay(CorrespondenceDto c) => c.CorrespondenceType ?? "Correspondence";
}

