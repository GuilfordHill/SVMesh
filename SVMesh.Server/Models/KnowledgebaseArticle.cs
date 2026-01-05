namespace SVMesh.Server.Models;

public class KnowledgebaseArticle
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Authors { get; set; } = Array.Empty<string>();
    public string[] Tags { get; set; } = Array.Empty<string>();
}
