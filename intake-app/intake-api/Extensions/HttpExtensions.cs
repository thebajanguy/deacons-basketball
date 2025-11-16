using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using System.Text;
using System.Text.Json;

namespace IntakeAPI.Extensions;

public static class JsonDefaults
{
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = false
    };
}

public static class HttpExtensions
{

    public static async Task<T?> ReadBodyAsync<T>(HttpRequestData req, JsonSerializerOptions opts)
    {
        using var sr = new StreamReader(req.Body, Encoding.UTF8);
        var json = await sr.ReadToEndAsync();
        return string.IsNullOrWhiteSpace(json) ? default : JsonSerializer.Deserialize<T>(json, opts);
    }
    public static async Task<T?> ReadBodyAsync<T>(HttpRequestData req)
    {
        using var sr = new StreamReader(req.Body, Encoding.UTF8);
        var json = await sr.ReadToEndAsync();
        return string.IsNullOrWhiteSpace(json) ? default : JsonSerializer.Deserialize<T>(json, JsonDefaults.Options);
    }

    private async static Task<HttpResponseData> Response(HttpRequestData req, object payload, HttpStatusCode code = HttpStatusCode.OK, string? correlationId = null)
    {
        var res = req.CreateResponse(code);
        res.Headers.Add("Content-Type", "application/json; charset=utf-8");
        res.Headers.Add("x-correlation-id", correlationId ??= req.GetCorrelationId());
        await res.WriteStringAsync(JsonSerializer.Serialize(payload, JsonDefaults.Options), Encoding.UTF8);
        return res;
    }

    public static async Task<HttpResponseData> OkAsync(this HttpRequestData req, object payload)
        => await Response(req, payload, HttpStatusCode.OK);

    public static async Task<HttpResponseData> OkAsync<T>(this HttpRequestData req, T payload)
        => await Response(req, payload, HttpStatusCode.OK);

    public static async Task<HttpResponseData> BadRequestAsync(this HttpRequestData req, object payload, HttpStatusCode code)
        => await Response(req, payload, code);

    public static async Task<HttpResponseData> BadRequestAsync(this HttpRequestData req, string payload)
        => await Response(req, payload, HttpStatusCode.BadRequest);

    public static async Task<HttpResponseData> ProblemAsync(this HttpRequestData req, string payload, HttpStatusCode code, string? correlationId = null)
        => await Response(req, new { error = payload, code = code.ToString(), correlationId = req.GetCorrelationId() }, code);

    public static string? GetCorrelationId(this HttpRequestData req)
    {
        // header has priority, fallback to query
        if (req.Headers.TryGetValues("x-correlation-id", out var ids))
            return ids.FirstOrDefault();

        var uri = req.Url;
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        var qid = query.Get("correlationId");
        return string.IsNullOrWhiteSpace(qid) ? req.FunctionContext.InvocationId : qid;
    }
}