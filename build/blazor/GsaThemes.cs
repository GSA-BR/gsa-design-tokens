// GSA Design Tokens — Theme Enum
// Auto-generated. Do not edit directly.

namespace Gsa.DesignTokens;

/// <summary>
/// Available themes in the GSA ecosystem.
/// Apply the value as a data-theme attribute on the page root element.
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
    /// <summary>Returns the data-theme attribute value for the given theme.</summary>
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
