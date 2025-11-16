namespace IntakeAPI.DTOs;

public sealed record CorrespondenceDto(
    string CorrespondenceType,
    string ApplicationName,
    DateTimeOffset Timestamp,
    string? Fullname,
    string? GivenName,
    string? Surname,
    string? Email,
    string? Phone,
    string? Country,
    string? Interest,
    string? Message,
    string? Day,
    string? Time,
    string? Year,
    string? Honeypot
);

public sealed record CreateInformationRequestBodyDto(
    string GivenName,
    string Surname,
    string Email,
    string Phone,
    string Interest,
    string Message,
    string? Honeypot
);

public sealed record CreateConsultationRequestBodyDto(
    string GivenName,
    string Surname,
    string Email,
    string Phone,
    string Interest,
    string Message,

    string Day,
    string Time,
    string Year,
    string? Honeypot
);

public sealed record CreateNewsletterSignupBodyDto(
    string Fullname,
    string Email,
    string Country,
    string Interest,
    string? Honeypot
);
