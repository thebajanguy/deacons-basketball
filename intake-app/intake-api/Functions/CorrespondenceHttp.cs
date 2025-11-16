// SendContact.cs
using Grpc.Core;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using IntakeAPI.DTOs;
using IntakeAPI.Extensions;
using IntakeAPI.Services;

namespace IntakeAPI.Functions;


internal class CorrespondenceHttp(ILogger<CorrespondenceHttp> logger, IEmailService emailService)
{
    private readonly ILogger<CorrespondenceHttp> _logger = logger;
    private readonly IEmailService _emailService = emailService;

    [Function("SendConsultationRequest")]
    public async Task<HttpResponseData> SendConsultationRequest(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post",  Route = "correspondences/consultation")] HttpRequestData req,
        FunctionContext ctx,
        CancellationToken ct)
    {
        try
        {
            // Read body from input
            var body = await JsonSerializer.DeserializeAsync<CorrespondenceDto>(req.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Basic validation
            if (body is null ||
                string.IsNullOrWhiteSpace(body.CorrespondenceType) ||
                string.IsNullOrWhiteSpace(body.ApplicationName) ||

                string.IsNullOrWhiteSpace(body.GivenName) ||
                string.IsNullOrWhiteSpace(body.Surname) ||
                string.IsNullOrWhiteSpace(body.Email) ||
                string.IsNullOrWhiteSpace(body.Phone) ||
                string.IsNullOrWhiteSpace(body.Interest) ||
                string.IsNullOrWhiteSpace(body.Message))
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

            // Length guards
            if (
                body.GivenName.Length > 120 ||
                body.Surname.Length > 120 ||
                body.Email.Length > 160 ||
                body.Phone.Length > 20 ||
                body.Interest.Length > 160 ||
                body.Message.Length > 4000)
            {
                return await req.BadRequestAsync(new
                {
                    message = "Data to large.",
                    errors = new[] { "large_data." }
                }, HttpStatusCode.BadRequest);
            }


            // Send via Gmail SMTP (SSL 465 or STARTTLS 587)
            var sentAsync = await _emailService.SendCorrespondenceEmailAsync(body, null, ct);

            return await req.OkAsync(new { data = sentAsync });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "InternalServerError-SendConsultation failed");
            return await req.BadRequestAsync(new
            {
                message = $"{ex.Message}",
                errors = new[] { "InternalServerError-SendConsultation failed" }
            }, HttpStatusCode.InternalServerError);
        }
    }

    [Function("SendContactRequest")]
    public async Task<HttpResponseData> SendContactRequest(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post",  Route = "correspondences/contact")] HttpRequestData req,
        FunctionContext ctx,
        CancellationToken ct)
    {
        try
        {
            // Read body from input
            var body = await JsonSerializer.DeserializeAsync<CorrespondenceDto>(req.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Basic validation
            if (body is null ||
                string.IsNullOrWhiteSpace(body.CorrespondenceType) ||
                string.IsNullOrWhiteSpace(body.ApplicationName) ||

                string.IsNullOrWhiteSpace(body.GivenName) ||
                string.IsNullOrWhiteSpace(body.Surname) ||
                string.IsNullOrWhiteSpace(body.Email) ||
                string.IsNullOrWhiteSpace(body.Phone) ||
                string.IsNullOrWhiteSpace(body.Interest) ||
                string.IsNullOrWhiteSpace(body.Message))
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

            // Length guards
            if (
                body.GivenName.Length > 120 ||
                body.Surname.Length > 120 ||
                body.Email.Length > 160 ||
                body.Phone.Length > 20 ||
                body.Interest.Length > 160 ||
                body.Message.Length > 4000)
            {
                return await req.BadRequestAsync(new
                {
                    message = "Data to large.",
                    errors = new[] { "large_data." }
                }, HttpStatusCode.BadRequest);
            }


            // Send via Gmail SMTP (SSL 465 or STARTTLS 587)
            var sentAsync = await _emailService.SendCorrespondenceEmailAsync(body, null, ct);

            return await req.OkAsync(new { data = sentAsync });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SendContact failed");
            return await req.BadRequestAsync(new
            {
                message = $"{ex.Message}",
                errors = new[] { "InternalServerError-SendContact failed" }
            }, HttpStatusCode.InternalServerError);
        }
    }

    [Function("SendNewsletterRequest")]
    public async Task<HttpResponseData> SendNewsletterRequest(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post",  Route = "correspondences/newsletter")] HttpRequestData req,
        FunctionContext ctx,
        CancellationToken ct)
    {
        try
        {
            // Read body from input
            var body = await JsonSerializer.DeserializeAsync<CorrespondenceDto>(req.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


            // Basic validation
            if (body is null ||
                string.IsNullOrWhiteSpace(body.CorrespondenceType) ||
                string.IsNullOrWhiteSpace(body.ApplicationName) ||

                string.IsNullOrWhiteSpace(body.Fullname) ||
                string.IsNullOrWhiteSpace(body.Email) ||
                string.IsNullOrWhiteSpace(body.Interest) ||
                string.IsNullOrWhiteSpace(body.Country))
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

            // Length guards
            if (
                body.Fullname.Length > 320 ||
                body.Email.Length > 160 ||
                body.Interest.Length > 160 ||
                body.Country.Length > 60)
            {
                return await req.BadRequestAsync(new
                {
                    message = "Data to large.",
                    errors = new[] { "large_data." }
                }, HttpStatusCode.BadRequest);
            }

            // Send via Gmail SMTP (SSL 465 or STARTTLS 587)
            var sentAsync = await _emailService.SendCorrespondenceEmailAsync(body, null, ct);

            return await req.OkAsync(new { data = sentAsync });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Newsletter Request failed");
            return await req.BadRequestAsync(new
            {
                message = $"{ex.Message}",
                errors = new[] { "InternalServerError-Newsletter Request failed" }
            }, HttpStatusCode.InternalServerError);
        }
    }

}
