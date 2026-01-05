using Microsoft.AspNetCore.Mvc;
using SVMesh.Server.Services;

namespace SVMesh.Server.Controllers;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;
    private readonly ILogger<ContentController> _logger;

    public ContentController(IContentService contentService, ILogger<ContentController> logger)
    {
        _contentService = contentService;
        _logger = logger;
    }

    [HttpGet("updates")]
    public async Task<IActionResult> GetUpdateFiles()
    {
        try
        {
            var files = await _contentService.GetUpdateFilesAsync();
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
    public async Task<IActionResult> GetPageFiles()
    {
        try
        {
            var files = await _contentService.GetPageFilesAsync();
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
    public async Task<IActionResult> GetKnowledgebaseFiles()
    {
        try
        {
            var files = await _contentService.GetKnowledgebaseArticlesAsync();
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