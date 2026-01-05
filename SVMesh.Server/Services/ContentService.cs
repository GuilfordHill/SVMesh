using System.Text.RegularExpressions;
using SVMesh.Server.Models;

namespace SVMesh.Server.Services;

public interface IContentService
{
    Task<string[]> GetUpdateFilesAsync();
    Task<string[]> GetPageFilesAsync();
    Task<KnowledgebaseArticle[]> GetKnowledgebaseArticlesAsync();
}

public class ContentService : IContentService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ContentService> _logger;
    private static readonly Regex FileNameValidator = new(@"^[a-zA-Z0-9_\-]+\.md$", RegexOptions.Compiled);

    public ContentService(IWebHostEnvironment environment, ILogger<ContentService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public Task<string[]> GetUpdateFilesAsync()
    {
        var updatesPath = Path.Combine(_environment.WebRootPath, "content", "updates");

        if (!Directory.Exists(updatesPath))
        {
            _logger.LogWarning("Updates directory not found: {Path}", updatesPath);
            return Task.FromResult(Array.Empty<string>());
        }

        var files = Directory.GetFiles(updatesPath, "*.md")
            .Select(Path.GetFileName)
            .Where(file => file != null && FileNameValidator.IsMatch(file))
            .OrderByDescending(file => file)
            .ToArray();

        _logger.LogInformation("Retrieved {Count} update files", files.Length);
        return Task.FromResult(files!);
    }

    public Task<string[]> GetPageFilesAsync()
    {
        var pagesPath = Path.Combine(_environment.WebRootPath, "content", "pages");

        if (!Directory.Exists(pagesPath))
        {
            _logger.LogWarning("Pages directory not found: {Path}", pagesPath);
            return Task.FromResult(Array.Empty<string>());
        }

        var files = Directory.GetFiles(pagesPath, "*.md")
            .Select(Path.GetFileName)
            .Where(file => file != null && FileNameValidator.IsMatch(file))
            .OrderBy(file => file)
            .ToArray();

        _logger.LogInformation("Retrieved {Count} page files", files.Length);
        return Task.FromResult(files!);
    }

    public Task<KnowledgebaseArticle[]> GetKnowledgebaseArticlesAsync()
    {
        var kbPath = Path.Combine(_environment.WebRootPath, "content", "pages", "knowledgebase");

        if (!Directory.Exists(kbPath))
        {
            _logger.LogWarning("Knowledgebase directory not found: {Path}", kbPath);
            return Task.FromResult(Array.Empty<KnowledgebaseArticle>());
        }

        var articles = Directory.GetFiles(kbPath, "*.md")
            .Select(ParseKnowledgebaseArticle)
            .Where(article => article != null)
            .OrderBy(article => article!.Title)
            .ToArray();

        _logger.LogInformation("Retrieved {Count} knowledgebase files", articles.Length);
        return Task.FromResult(articles!);
    }

    private KnowledgebaseArticle? ParseKnowledgebaseArticle(string filePath)
    {
        var fileName = Path.GetFileName(filePath);
        if (fileName == null || !FileNameValidator.IsMatch(fileName))
            return null;

        var lines = File.ReadLines(filePath).Take(50).ToList();

        var title = fileName.Replace(".md", "").Replace("-", " ");
        var description = string.Empty;
        var authors = new List<string>();
        var tags = new List<string>();

        // Frontmatter parsing
        var frontmatterEndIndex = ParseFrontmatter(lines, ref title, ref description, authors, tags);

        // Fallback extraction from body content
        ExtractFallbackData(lines, frontmatterEndIndex, ref title, ref description);

        return new KnowledgebaseArticle
        {
            Slug = fileName.Replace(".md", ""),
            Title = title,
            Description = description,
            Authors = authors.Distinct(StringComparer.OrdinalIgnoreCase).ToArray(),
            Tags = tags.Distinct(StringComparer.OrdinalIgnoreCase).ToArray()
        };
    }

    private static int ParseFrontmatter(
        List<string> lines,
        ref string title,
        ref string description,
        List<string> authors,
        List<string> tags)
    {
        if (lines.FirstOrDefault()?.Trim() != "---")
            return 0;

        for (int i = 1; i < lines.Count; i++)
        {
            var line = lines[i].Trim();
            if (line == "---")
            {
                return i + 1;
            }

            if (line.StartsWith("title:"))
            {
                title = line[6..].Trim();
            }
            else if (line.StartsWith("author:") || line.StartsWith("authors:"))
            {
                var authorLine = line.Contains(':') ? line[(line.IndexOf(':') + 1)..].Trim() : string.Empty;
                if (!string.IsNullOrEmpty(authorLine))
                {
                    authors.AddRange(authorLine.Split(',').Select(a => a.Trim()).Where(a => !string.IsNullOrEmpty(a)));
                }
            }
            else if (line.StartsWith("tags:"))
            {
                var tagLine = line[5..].Trim().Trim('[', ']');
                if (!string.IsNullOrEmpty(tagLine))
                {
                    tags.AddRange(tagLine.Split(',').Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)));
                }
            }
            else if (line.StartsWith("description:"))
            {
                description = line[12..].Trim();
            }
        }

        return 0;
    }

    private static void ExtractFallbackData(
        List<string> lines,
        int frontmatterEndIndex,
        ref string title,
        ref string description)
    {
        // Get the first non-empty, non-heading line after frontmatter for description
        if (string.IsNullOrEmpty(description))
        {
            for (int i = frontmatterEndIndex; i < lines.Count; i++)
            {
                var line = lines[i].Trim();
                if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
                {
                    description = line.Length > 150 ? line[..150] + "..." : line;
                    break;
                }
            }
        }

        // Fallback to title from first heading if needed
        if (string.IsNullOrWhiteSpace(title))
        {
            for (int i = frontmatterEndIndex; i < lines.Count; i++)
            {
                var line = lines[i].Trim();
                if (line.StartsWith("# "))
                {
                    title = line[2..].Trim();
                    break;
                }
            }
        }
    }
}
