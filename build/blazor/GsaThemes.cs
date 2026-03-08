// GSA Design Tokens — Enum de Temas
// Gerado automaticamente. Não editar diretamente.

namespace Gsa.DesignTokens;

/// <summary>
/// Temas disponíveis no ecossistema GSA.
/// Aplique o valor como atributo data-theme no elemento raiz da página.
/// </summary>
public enum GsaTheme
{
    /// <summary>domain-auth</summary>
    DomainAuth,
    /// <summary>domain-factory</summary>
    DomainFactory,
    /// <summary>domain-iam</summary>
    DomainIam,
    /// <summary>domain-mdm</summary>
    DomainMdm,
    /// <summary>domain-ops</summary>
    DomainOps,
    /// <summary>domain-sgq</summary>
    DomainSgq,
    /// <summary>gsa-dark</summary>
    GsaDark,
    /// <summary>gsa-light</summary>
    GsaLight,
}

public static class GsaThemeExtensions
{
    /// <summary>Retorna o valor do atributo data-theme para o tema informado.</summary>
    public static string ToDataAttribute(this GsaTheme theme) => theme switch
    {
        GsaTheme.DomainAuth => "domain-auth",
        GsaTheme.DomainFactory => "domain-factory",
        GsaTheme.DomainIam => "domain-iam",
        GsaTheme.DomainMdm => "domain-mdm",
        GsaTheme.DomainOps => "domain-ops",
        GsaTheme.DomainSgq => "domain-sgq",
        GsaTheme.GsaDark => "gsa-dark",
        GsaTheme.GsaLight => "gsa-light",
        _ => "gsa-light"
    };
}
