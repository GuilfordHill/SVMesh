using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace SVMesh.Server.Controllers;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ContentController> _logger;
    private static readonly Regex FileNameValidator = new Regex(@"^[a-zA-Z0-9_\-]+\.md$", RegexOptions.Compiled);

    public ContentController(IWebHostEnvironment environment, ILogger<ContentController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpGet("updates")]
    public IActionResult GetUpdateFiles()
    {
        try
        {
            var updatesPath = Path.Combine(_environment.WebRootPath, "content", "updates");
            
            if (!Directory.Exists(updatesPath))
            {
                _logger.LogWarning("Updates directory not found: {Path}", updatesPath);
                return Ok(new { files = Array.Empty<string>() });
            }

            var files = Directory.GetFiles(updatesPath, "*.md")
                .Select(file => Path.GetFileName(file))
                .Where(file => file != null && FileNameValidator.IsMatch(file)) // Validate file names
                .OrderByDescending(file => file)
                .ToArray();

            _logger.LogInformation("Retrieved {Count} update files", files.Length);
            return Ok(new { files });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Unauthorized access to updates directory");
            return StatusCode(403, new { error = "Access denied" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list update files");
            return StatusCode(500, new { error = "Failed to list update files" });
        }
    }

    [HttpGet("pages")]
    public IActionResult GetPageFiles()
    {
        try
        {
            var pagesPath = Path.Combine(_environment.WebRootPath, "content", "pages");
            
            if (!Directory.Exists(pagesPath))
            {
                _logger.LogWarning("Pages directory not found: {Path}", pagesPath);
                return Ok(new { files = Array.Empty<string>() });
            }

            var files = Directory.GetFiles(pagesPath, "*.md")
                .Select(file => Path.GetFileName(file))
                .Where(file => file != null && FileNameValidator.IsMatch(file)) // Validate file names
                .OrderBy(file => file)
                .ToArray();

            _logger.LogInformation("Retrieved {Count} page files", files.Length);
            return Ok(new { files });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Unauthorized access to pages directory");
            return StatusCode(403, new { error = "Access denied" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list page files");
            return StatusCode(500, new { error = "Failed to list page files" });
        }
    }

    [HttpGet("knowledgebase")]
    public IActionResult GetKnowledgebaseFiles()
    {
        try
        {
            var kbPath = Path.Combine(_environment.WebRootPath, "content", "pages", "knowledgebase");
            
            if (!Directory.Exists(kbPath))
            {
                _logger.LogWarning("Knowledgebase directory not found: {Path}", kbPath);
                return Ok(new { files = Array.Empty<object>() });
            }

            var files = Directory.GetFiles(kbPath, "*.md")
                .Select(file => {
                    var fileName = Path.GetFileName(file);
                    if (fileName == null || !FileNameValidator.IsMatch(fileName))
                        return null;
                    var lines = System.IO.File.ReadLines(file).Take(50).ToList();

                    var title = fileName.Replace(".md", "").Replace("-", " ");
                    var description = "";
                    var authors = new List<string>();
                    var tags = new List<string>();

                    // Frontmatter parsing: --- key: value ---
                    if (lines.FirstOrDefault()?.Trim() == "---")
                    {
                        for (int i = 1; i < lines.Count; i++)
                        {
                            var line = lines[i].Trim();
                            if (line == "---")
                            {
                                break;
                            }

                            if (line.StartsWith("title:"))
                            {
                                title = line.Substring(6).Trim();
                            }
                            else if (line.StartsWith("author:") || line.StartsWith("authors:"))
                            {
                                var authorLine = line.Contains(":") ? line[(line.IndexOf(":") + 1)..].Trim() : string.Empty;
                                if (!string.IsNullOrEmpty(authorLine))
                                {
                                    authors.AddRange(authorLine.Split(',').Select(a => a.Trim()).Where(a => !string.IsNullOrEmpty(a)));
                                }
                            }
                            else if (line.StartsWith("tags:"))
                            {
                                var tagLine = line.Substring(5).Trim().Trim('[', ']');
                                if (!string.IsNullOrEmpty(tagLine))
                                {
                                    tags.AddRange(tagLine.Split(',').Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)));
                                }
                            }
                            else if (line.StartsWith("description:"))
                            {
                                description = line.Substring(12).Trim();
                            }
                        }
                    }

                    // Fallback extraction from headings / body
                    for (int i = 0; i < lines.Count; i++)
                    {
                        var line = lines[i].Trim();
                        if (line.StartsWith("# "))
                        {
                            title = string.IsNullOrWhiteSpace(title) ? line.Substring(2).Trim() : title;
                        }
                        else if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("---") && string.IsNullOrEmpty(description))
                        {
                            if (!line.StartsWith("#") && !line.Contains(":"))
                            {
                                description = line.Length > 150 ? line.Substring(0, 150) + "..." : line;
                            }
                        }
                    }

                    return new
                    {
                        slug = fileName.Replace(".md", ""),
                        title,
                        description,
                        authors = authors.Distinct(StringComparer.OrdinalIgnoreCase).ToArray(),
                        tags = tags.Distinct(StringComparer.OrdinalIgnoreCase).ToArray()
                    };
                })
                .Where(file => file != null)
                .OrderBy(file => file!.title)
                .ToArray();

            _logger.LogInformation("Retrieved {Count} knowledgebase files", files.Length);
            return Ok(new { files });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Unauthorized access to knowledgebase directory");
            return StatusCode(403, new { error = "Access denied" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list knowledgebase files");
            return StatusCode(500, new { error = "Failed to list knowledgebase files" });
        }
    }
}