// SendContact.cs
using Grpc.Core;
using IntakeAPI.DTOs;
using IntakeAPI.Extensions;
using IntakeAPI.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics.Metrics;
using System.Net;
using System.Numerics;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace IntakeAPI.Functions;


internal class RegistrationHttp(ILogger<RegistrationHttp> logger, IEmailService emailService)
{
    private readonly ILogger<RegistrationHttp> _logger = logger;
    private readonly IEmailService _emailService = emailService;

    [Function("RegistrationCampRequest")]
    public async Task<HttpResponseData> CampRegistrationRequest(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post",  Route = "registrations/gold-camp")] HttpRequestData req,
        FunctionContext ctx,
        CancellationToken ct)
    {
        try
        {
            // Read body from input
            var body = await JsonSerializer.DeserializeAsync<ActivityRegistrationDto>(req.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Basic validation
            if (body is null ||
                string.IsNullOrWhiteSpace(body.RegistrationType) ||
                string.IsNullOrWhiteSpace(body.Interest) ||
                string.IsNullOrWhiteSpace(body.ActivityId) ||

                string.IsNullOrWhiteSpace(body.Player.Givenname) ||
                string.IsNullOrWhiteSpace(body.Player.Surname) ||
                string.IsNullOrWhiteSpace(body.Player.DOB) ||

                string.IsNullOrWhiteSpace(body.Player.School) ||
                string.IsNullOrWhiteSpace(body.Player.GradeOrForm) ||

                string.IsNullOrWhiteSpace(body.Player.Position) ||
                string.IsNullOrWhiteSpace(body.Player.SkillLevel) ||
                string.IsNullOrWhiteSpace(body.Player.TshirtSize) ||

                string.IsNullOrWhiteSpace(body.Guardian.GuardianName) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianEmail) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianPhone) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianRelation)
            )
            {

                return await req.BadRequestAsync(new { 
                    message = "Request body is null or invalid.", 
                    errors = new[] { "The request body could not be deserialized into a valid object." } 
                }, HttpStatusCode.BadRequest);

            }

            // Honeypot trap (hidden input should be empty)
            if (!string.IsNullOrEmpty(body.Honeypot))
            {
                _logger.LogWarning("Bot submission detected.");

                return await req.BadRequestAsync(new
                {
                    message = "Bot submission detected.",
                    errors = new[] { "Bot submission detected." }
                }, HttpStatusCode.BadRequest);

            }

            // Send via Gmail SMTP (SSL 465 or STARTTLS 587)
            var sentAsync = await _emailService.SendRegistrationEmailAsync(body, null, ct);

            return await req.OkAsync(new { data = sentAsync });

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed");

            return await req.BadRequestAsync(new
            {
                message = $"{ex.Message}",
                errors = new[] { "InternalServerError-Registration failed" }
            }, HttpStatusCode.InternalServerError);
        }
    }

    [Function("RegistrationAfterschoolRequest")]
    public async Task<HttpResponseData> RegistrationAfterschoolRequest(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "registrations/after-school")] HttpRequestData req,
    FunctionContext ctx,
    CancellationToken ct)
    {
        try
        {
            // Read body from input
            var body = await JsonSerializer.DeserializeAsync<ActivityRegistrationDto>(req.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Basic validation
            if (body is null ||
                string.IsNullOrWhiteSpace(body.RegistrationType) ||
                string.IsNullOrWhiteSpace(body.Interest) ||
                string.IsNullOrWhiteSpace(body.ActivityId) ||

                string.IsNullOrWhiteSpace(body.Player.Givenname) ||
                string.IsNullOrWhiteSpace(body.Player.Surname) ||
                string.IsNullOrWhiteSpace(body.Player.DOB) ||

                string.IsNullOrWhiteSpace(body.Player.School) ||
                string.IsNullOrWhiteSpace(body.Player.GradeOrForm) ||

                string.IsNullOrWhiteSpace(body.Player.Position) ||
                string.IsNullOrWhiteSpace(body.Player.SkillLevel) ||
                string.IsNullOrWhiteSpace(body.Player.TshirtSize) ||

                string.IsNullOrWhiteSpace(body.Guardian.GuardianName) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianEmail) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianPhone) ||
                string.IsNullOrWhiteSpace(body.Guardian.GuardianRelation)
            )
            {

                return await req.BadRequestAsync(new
                {
                    message = "Request body is null or invalid.",
                    errors = new[] { "The request body could not be deserialized into a valid object." }
                }, HttpStatusCode.BadRequest);

            }

            // Honeypot trap (hidden input should be empty)
            if (!string.IsNullOrEmpty(body.Honeypot))
            {
                _logger.LogWarning("Bot submission detected.");

                return await req.BadRequestAsync(new
                {
                    message = "Bot submission detected.",
                    errors = new[] { "Bot submission detected." }
                }, HttpStatusCode.BadRequest);

            }

            // Send via Gmail SMTP (SSL 465 or STARTTLS 587)
            var sentAsync = await _emailService.SendRegistrationEmailAsync(body, null, ct);

            return await req.OkAsync(new { data = sentAsync });

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed");

            return await req.BadRequestAsync(new
            {
                message = $"{ex.Message}",
                errors = new[] { "InternalServerError-Registration failed" }
            }, HttpStatusCode.InternalServerError);
        }
    }

}
