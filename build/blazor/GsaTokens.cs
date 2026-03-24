// GSA Design Tokens — C# Constants
// Auto-generated. Do not edit directly.

namespace Gsa.DesignTokens;

/// <summary>
/// Design tokens for the GSA ecosystem.
/// Use these constants to reference design values in a type-safe manner.
/// </summary>
public static class GsaTokens
{

    // ── breakpoints ──
    public static class Breakpoints
    {
        public const string Xs = "320px";
        public const string Sm = "480px";
        public const string Md = "768px";
        public const string Lg = "1024px";
        public const string Xl = "1280px";
        public const string Size2xl = "1440px";
        public const string Size3xl = "1920px";
    }

    // ── colors ──
    public static class Colors
    {
        public const string Blue50 = "#EFF6FF";
        public const string Blue100 = "#DBEAFE";
        public const string Blue200 = "#BFDBFE";
        public const string Blue300 = "#93C5FD";
        public const string Blue400 = "#60A5FA";
        public const string Blue500 = "#3B82F6";
        public const string Blue600 = "#2563EB";
        public const string Blue700 = "#1D4ED8";
        public const string Blue800 = "#1E40AF";
        public const string Blue900 = "#1E3A8A";
        public const string Blue950 = "#172554";
        public const string Cyan50 = "#ECFEFF";
        public const string Cyan100 = "#CFFAFE";
        public const string Cyan200 = "#A5F3FC";
        public const string Cyan300 = "#67E8F9";
        public const string Cyan400 = "#22D3EE";
        public const string Cyan500 = "#06B6D4";
        public const string Cyan600 = "#0891B2";
        public const string Cyan700 = "#0E7490";
        public const string Cyan800 = "#155E75";
        public const string Cyan900 = "#164E63";
        public const string Cyan950 = "#083344";
        public const string Gray50 = "#F8FAFC";
        public const string Gray100 = "#F1F5F9";
        public const string Gray200 = "#E2E8F0";
        public const string Gray300 = "#CBD5E1";
        public const string Gray400 = "#94A3B8";
        public const string Gray500 = "#64748B";
        public const string Gray600 = "#475569";
        public const string Gray700 = "#334155";
        public const string Gray800 = "#1E293B";
        public const string Gray900 = "#0F172A";
        public const string Gray950 = "#020617";
        public const string Green50 = "#F0FDF4";
        public const string Green100 = "#DCFCE7";
        public const string Green200 = "#BBF7D0";
        public const string Green300 = "#86EFAC";
        public const string Green400 = "#4ADE80";
        public const string Green500 = "#22C55E";
        public const string Green600 = "#16A34A";
        public const string Green700 = "#15803D";
        public const string Green800 = "#166534";
        public const string Green900 = "#14532D";
        public const string Green950 = "#052E16";
        public const string Amber50 = "#FFFBEB";
        public const string Amber100 = "#FEF3C7";
        public const string Amber200 = "#FDE68A";
        public const string Amber300 = "#FCD34D";
        public const string Amber400 = "#FBBF24";
        public const string Amber500 = "#F59E0B";
        public const string Amber600 = "#D97706";
        public const string Amber700 = "#B45309";
        public const string Amber800 = "#92400E";
        public const string Amber900 = "#78350F";
        public const string Amber950 = "#451A03";
        public const string Red50 = "#FFF1F2";
        public const string Red100 = "#FFE4E6";
        public const string Red200 = "#FECDD3";
        public const string Red300 = "#FDA4AF";
        public const string Red400 = "#FB7185";
        public const string Red500 = "#F43F5E";
        public const string Red600 = "#E11D48";
        public const string Red700 = "#BE123C";
        public const string Red800 = "#9F1239";
        public const string Red900 = "#881337";
        public const string Red950 = "#4C0519";
        public const string White = "#FFFFFF";
        public const string Black = "#000000";
        public const string Transparent = "transparent";
    }

    // ── motion ──
    public static class Motion
    {
        public const string DurationInstant = "0ms";
        public const string DurationFast = "100ms";
        public const string DurationNormal = "200ms";
        public const string DurationSlow = "300ms";
        public const string DurationSlower = "500ms";
        public const string DurationSlowest = "700ms";
        public const string EasingLinear = "linear";
        public const string EasingEaseIn = "cubic-bezier(0.4, 0, 1, 1)";
        public const string EasingEaseOut = "cubic-bezier(0, 0, 0.2, 1)";
        public const string EasingEaseInOut = "cubic-bezier(0.4, 0, 0.2, 1)";
        public const string EasingSpring = "cubic-bezier(0.34, 1.56, 0.64, 1)";
    }

    // ── radius ──
    public static class Radius
    {
        public const string None = "0rem";
        public const string Xs = "0.125rem";
        public const string Sm = "0.25rem";
        public const string Md = "0.375rem";
        public const string Lg = "0.5rem";
        public const string Xl = "0.75rem";
        public const string Size2xl = "1rem";
        public const string Size3xl = "1.5rem";
        public const string Full = "9999px";
    }

    // ── shadow ──
    public static class Shadow
    {
        public const string None = "none";
        public const string Xs = "0 1px 2px 0 rgba(15, 23, 42, 0.06)";
        public const string Sm = "0 1px 3px 0 rgba(15, 23, 42, 0.10), 0 1px 2px -1px rgba(15, 23, 42, 0.10)";
        public const string Md = "0 4px 6px -1px rgba(15, 23, 42, 0.10), 0 2px 4px -2px rgba(15, 23, 42, 0.10)";
        public const string Lg = "0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -4px rgba(15, 23, 42, 0.10)";
        public const string Xl = "0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.10)";
        public const string Size2xl = "0 25px 50px -12px rgba(15, 23, 42, 0.25)";
        public const string Inner = "inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)";
    }

    // ── sizing ──
    public static class Sizing
    {
        public const string IconXs = "0.75rem";
        public const string IconSm = "1rem";
        public const string IconMd = "1.25rem";
        public const string IconLg = "1.5rem";
        public const string IconXl = "2rem";
        public const string Icon2xl = "2.5rem";
        public const string Icon3xl = "3rem";
        public const string ComponentHeightXs = "1.5rem";
        public const string ComponentHeightSm = "2rem";
        public const string ComponentHeightMd = "2.5rem";
        public const string ComponentHeightLg = "3rem";
        public const string ComponentHeightXl = "3.5rem";
        public const string ComponentHeight2xl = "4rem";
        public const string ContainerXs = "320px";
        public const string ContainerSm = "640px";
        public const string ContainerMd = "768px";
        public const string ContainerLg = "1024px";
        public const string ContainerXl = "1280px";
        public const string Container2xl = "1440px";
        public const string SidebarCollapsed = "3.5rem";
        public const string SidebarExpanded = "15rem";
        public const string HeaderHeight = "3.5rem";
        public const string ZIndexBelow = "-1";
        public const string ZIndexBase = "0";
        public const string ZIndexRaised = "10";
        public const string ZIndexDropdown = "100";
        public const string ZIndexSticky = "200";
        public const string ZIndexOverlay = "300";
        public const string ZIndexModal = "400";
        public const string ZIndexToast = "500";
        public const string ZIndexTooltip = "600";
    }

    // ── spacing ──
    public static class Spacing
    {
        public const string Size0 = "0rem";
        public const string Size1 = "0.25rem";
        public const string Size2 = "0.5rem";
        public const string Size3 = "0.75rem";
        public const string Size4 = "1rem";
        public const string Size5 = "1.25rem";
        public const string Size6 = "1.5rem";
        public const string Size7 = "1.75rem";
        public const string Size8 = "2rem";
        public const string Size9 = "2.25rem";
        public const string Size10 = "2.5rem";
        public const string Size12 = "3rem";
        public const string Size14 = "3.5rem";
        public const string Size16 = "4rem";
        public const string Size20 = "5rem";
        public const string Size24 = "6rem";
        public const string Size28 = "7rem";
        public const string Size32 = "8rem";
        public const string Size36 = "9rem";
        public const string Size40 = "10rem";
        public const string Size48 = "12rem";
        public const string Size56 = "14rem";
        public const string Size64 = "16rem";
        public const string Size72 = "18rem";
        public const string Size80 = "20rem";
        public const string Size96 = "24rem";
        public const string Px = "0.0625rem";
        public const string Size05 = "0.125rem";
        public const string Size15 = "0.375rem";
        public const string Size25 = "0.625rem";
        public const string Size35 = "0.875rem";
    }

    // ── typography ──
    public static class Typography
    {
        public const string FamilySans = "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif";
        public const string FamilyMono = "'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Courier New', monospace";
        public const string FamilySerif = "Georgia, 'Times New Roman', serif";
        public const string SizeXs = "0.75rem";
        public const string SizeSm = "0.875rem";
        public const string SizeBase = "1rem";
        public const string SizeMd = "1.125rem";
        public const string SizeLg = "1.25rem";
        public const string SizeXl = "1.5rem";
        public const string Size2xl = "1.875rem";
        public const string Size3xl = "2.25rem";
        public const string Size4xl = "3rem";
        public const string Size5xl = "3.75rem";
        public const string WeightLight = "300";
        public const string WeightRegular = "400";
        public const string WeightMedium = "500";
        public const string WeightSemibold = "600";
        public const string WeightBold = "700";
        public const string WeightExtrabold = "800";
        public const string LineHeightNone = "1";
        public const string LineHeightTight = "1.25";
        public const string LineHeightSnug = "1.375";
        public const string LineHeightNormal = "1.5";
        public const string LineHeightRelaxed = "1.625";
        public const string LineHeightLoose = "2";
        public const string LetterSpacingTighter = "-0.05em";
        public const string LetterSpacingTight = "-0.025em";
        public const string LetterSpacingNormal = "0em";
        public const string LetterSpacingWide = "0.025em";
        public const string LetterSpacingWider = "0.05em";
        public const string LetterSpacingWidest = "0.1em";
    }
}
