using System.Text.Json;
using System.Net.Http.Json;
using System.Text.RegularExpressions;

namespace SVMesh.Server.Services;

public class KnowledgebaseNotificationService : BackgroundService
{
    private readonly ILogger<KnowledgebaseNotificationService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _trackingFile = "/app/data/knowledgebase-tracking.json";
    private readonly string _kbDirectory = "/app/wwwroot/content/pages/knowledgebase";

    public KnowledgebaseNotificationService(
        ILogger<KnowledgebaseNotificationService> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait for app to fully start
        await Task.Delay(5000, stoppingToken);

        var webhookUrl = _configuration["Discord:WebhookUrl"];
        if (string.IsNullOrEmpty(webhookUrl))
        {
            _logger.LogInformation("Discord webhook not configured, skipping knowledgebase notifications");
            return;
        }

        try
        {
            var currentArticles = Directory.GetFiles(_kbDirectory, "*.md")
                .Select(Path.GetFileName)
                .ToHashSet();

            HashSet<string>? previousArticles = null;
            if (File.Exists(_trackingFile))
            {
                var json = await File.ReadAllTextAsync(_trackingFile, stoppingToken);
                previousArticles = JsonSerializer.Deserialize<HashSet<string>>(json);
            }

            if (previousArticles != null)
            {
                var newArticles = currentArticles.Except(previousArticles).ToList();
                if (newArticles.Any())
                {
                    await SendDiscordNotification(webhookUrl, newArticles, stoppingToken);
                }
            }

            // Update tracking file
            await File.WriteAllTextAsync(_trackingFile, 
                JsonSerializer.Serialize(currentArticles), stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in knowledgebase notification service");
        }
    }

    private async Task<Dictionary<string, string>> ParseFrontmatter(string filePath)
    {
        var frontmatter = new Dictionary<string, string>();
        var content = await File.ReadAllTextAsync(filePath);
        
        // Match frontmatter between --- markers
        var match = Regex.Match(content, @"^---\s*\n(.*?)\n---", RegexOptions.Singleline);
        if (!match.Success) return frontmatter;

        var frontmatterText = match.Groups[1].Value;
        foreach (var line in frontmatterText.Split('\n'))
        {
            var colonIndex = line.IndexOf(':');
            if (colonIndex > 0)
            {
                var key = line.Substring(0, colonIndex).Trim();
                var value = line.Substring(colonIndex + 1).Trim();
                // Remove brackets and quotes from arrays/strings
                value = value.Trim('[', ']', '"', '\'');
                frontmatter[key] = value;
            }
        }

        return frontmatter;
    }

    private string ExtractArticleExcerpt(string content)
    {
        // Remove frontmatter
        var withoutFrontmatter = Regex.Replace(content, @"^---\s*\n.*?\n---\s*\n", "", RegexOptions.Singleline);
        
        // Remove markdown formatting
        var plainText = Regex.Replace(withoutFrontmatter, @"#{1,6}\s+", ""); // Headers
        plainText = Regex.Replace(plainText, @"\[([^\]]+)\]\([^\)]+\)", "$1"); // Links
        plainText = Regex.Replace(plainText, @"[*_~`]", ""); // Bold, italic, etc
        plainText = Regex.Replace(plainText, @"```.*?```", "", RegexOptions.Singleline); // Code blocks
        plainText = Regex.Replace(plainText, @"::[a-z]+\[.*?\]", "", RegexOptions.Singleline); // Custom components
        
        // Get first paragraph or first 200 characters
        var lines = plainText.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        var excerpt = lines.FirstOrDefault()?.Trim() ?? "";
        
        if (excerpt.Length > 200)
        {
            excerpt = excerpt.Substring(0, 197) + "...";
        }
        
        return excerpt;
    }

    private async Task SendDiscordNotification(string webhookUrl, List<string> newArticles, CancellationToken ct)
    {
        using var client = new HttpClient();
        
        var embeds = new List<object>();
        foreach (var article in newArticles)
        {
            var filePath = Path.Combine(_kbDirectory, article);
            var content = await File.ReadAllTextAsync(filePath);
            var frontmatter = await ParseFrontmatter(filePath);
            var excerpt = ExtractArticleExcerpt(content);
            
            var slug = Path.GetFileNameWithoutExtension(article);
            var articleUrl = $"{_configuration["BaseUrl"]}/knowledgebase/{slug}";
            var logoUrl = $"{_configuration["BaseUrl"]}/svmesh.png";
            
            // Use frontmatter title or fallback to formatted filename
            var title = frontmatter.ContainsKey("title") 
                ? frontmatter["title"] 
                : slug.Replace("-", " ").Replace("_", " ");
            
            var embed = new
            {
                title = title,
                description = excerpt,
                url = articleUrl,
                color = 7905140, // RGB(120, 159, 116)
                timestamp = DateTime.UtcNow.ToString("o"),
                thumbnail = new { url = logoUrl }
            };

            // Add author field if present
            var fields = new List<object>();
            if (frontmatter.ContainsKey("author"))
            {
                fields.Add(new { name = "Author", value = frontmatter["author"], inline = true });
            }

            // Add tags field if present
            if (frontmatter.ContainsKey("tags"))
            {
                fields.Add(new { name = "Tags", value = frontmatter["tags"], inline = true });
            }

            if (fields.Any())
            {
                embeds.Add(new
                {
                    title = embed.title,
                    description = embed.description,
                    url = embed.url,
                    color = embed.color,
                    timestamp = embed.timestamp,
                    thumbnail = embed.thumbnail,
                    fields = fields.ToArray()
                });
            }
            else
            {
                embeds.Add(embed);
            }
        }

        var payload = new
        {
            content = newArticles.Count == 1 
                ? "**New Knowledgebase Article!**" 
                : $"**{newArticles.Count} New Knowledgebase Articles!**",
            embeds = embeds.ToArray()
        };

        await client.PostAsJsonAsync(webhookUrl, payload, ct);
        _logger.LogInformation("Sent Discord notification for {Count} new articles", newArticles.Count);
    }
}
