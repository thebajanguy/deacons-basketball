using Microsoft.Extensions.Configuration;

namespace IntakeAPI.Settings;


public sealed class GmailOptions
{
    [ConfigurationKeyName("GMAIL_USER")]
    public string GmailUser { get; init; } = string.Empty;

    [ConfigurationKeyName("GMAIL_APP_PASSWORD")]
    public string GmailAppPassword { get; init; } = string.Empty;

    [ConfigurationKeyName("CONTACT_TO")]
    public string MailTo { get; init; } = string.Empty;

    public IReadOnlyList<string> MailToList =>
         MailTo.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

}

