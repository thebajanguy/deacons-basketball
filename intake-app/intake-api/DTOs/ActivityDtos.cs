﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntakeAPI.DTOs;

public sealed record ActivityRegistrationDto
{
    public string? RegistrationType { get; init; }   // "basketball-camp" | "soccer-camp" | "after-school" | etc.

    public string? Country { get; init; }
    public string? Interest { get; init; }
    public string? ActivityId { get; init; }

    public PlayerDto? Player { get; init; }
    public GuardianDto? Guardian { get; init; }
    public PaymentDto? Payment { get; init; }

    public string? Notes { get; init; }
    public string? CreatedAt { get; init; }          // ISO 8601 string (e.g., new Date().toISOString())
    public string? Honeypot { get; init; }           // anti-bot hidden input
}

public sealed record PlayerDto
{
    public string? Givenname { get; init; }
    public string? Surname { get; init; }
    public string? DOB { get; init; }                // 'YYYY-MM-DD' preferred

    public string? Email { get; init; }
    public string? Phone { get; init; }

    public string? School { get; init; }
    public string? GradeOrForm { get; init; }
    public string? Position { get; init; }
    public string? SkillLevel { get; init; }
    public string? TshirtSize { get; init; }
}

public sealed record GuardianDto
{
    public string? GuardianName { get; init; }
    public string? GuardianEmail { get; init; }
    public string? GuardianPhone { get; init; }
    public string? GuardianRelation { get; init; }
}

public sealed record PaymentDto
{
    public string? PaymentMethod { get; init; }
    public double? PaymentAmount { get; init; }      // use decimal? if you prefer exact currency
    public string? PaymentCurrency { get; init; }
    public string? PaymentStatus { get; init; }
    public string? PaymentTransactionId { get; init; }
}
