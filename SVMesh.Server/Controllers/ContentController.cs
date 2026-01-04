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
}