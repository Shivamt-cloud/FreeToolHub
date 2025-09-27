/**
 * Color Palette Generator
 * Generates color palettes with accessibility features
 */
class ColorPaletteGenerator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
    }

    /**
     * Generate color palette from base color
     */
    generatePalette(baseColor, type = 'complementary', count = 5) {
        try {
            if (!baseColor) {
                throw new Error('Base color is required');
            }

            const rgb = this.hexToRgb(baseColor);
            if (!rgb) {
                throw new Error('Invalid color format');
            }

            let palette = [];
            
            switch (type) {
                case 'complementary':
                    palette = this.generateComplementaryPalette(rgb, count);
                    break;
                case 'analogous':
                    palette = this.generateAnalogousPalette(rgb, count);
                    break;
                case 'triadic':
                    palette = this.generateTriadicPalette(rgb, count);
                    break;
                case 'tetradic':
                    palette = this.generateTetradicPalette(rgb, count);
                    break;
                case 'monochromatic':
                    palette = this.generateMonochromaticPalette(rgb, count);
                    break;
                case 'split-complementary':
                    palette = this.generateSplitComplementaryPalette(rgb, count);
                    break;
                case 'random':
                    palette = this.generateRandomPalette(rgb, count);
                    break;
                default:
                    throw new Error('Invalid palette type');
            }

            const accessibility = this.checkAccessibility(palette);
            
            return {
                success: true,
                palette: palette,
                accessibility: accessibility,
                type: type,
                baseColor: baseColor,
                count: count
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate complementary palette
     */
    generateComplementaryPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        // Base color
        palette.push({
            hex: this.rgbToHex(rgb.r, rgb.g, rgb.b),
            rgb: rgb,
            hsl: hsl,
            name: 'Base'
        });

        // Complementary color
        const complementaryHsl = {
            h: (hsl.h + 180) % 360,
            s: hsl.s,
            l: hsl.l
        };
        const complementaryRgb = this.hslToRgb(complementaryHsl.h, complementaryHsl.s, complementaryHsl.l);
        palette.push({
            hex: this.rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b),
            rgb: complementaryRgb,
            hsl: complementaryHsl,
            name: 'Complementary'
        });

        // Generate variations
        for (let i = 2; i < count; i++) {
            const variationHsl = {
                h: (hsl.h + (i * 30)) % 360,
                s: Math.max(0, Math.min(100, hsl.s + (i * 10))),
                l: Math.max(0, Math.min(100, hsl.l + (i * 5)))
            };
            const variationRgb = this.hslToRgb(variationHsl.h, variationHsl.s, variationHsl.l);
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: `Variation ${i - 1}`
            });
        }

        return palette;
    }

    /**
     * Generate analogous palette
     */
    generateAnalogousPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const hue = (hsl.h + (i * 30)) % 360;
            const saturation = Math.max(20, Math.min(100, hsl.s + (i * 5)));
            const lightness = Math.max(10, Math.min(90, hsl.l + (i * 10)));
            
            const variationHsl = { h: hue, s: saturation, l: lightness };
            const variationRgb = this.hslToRgb(hue, saturation, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: i === 0 ? 'Base' : `Analogous ${i}`
            });
        }

        return palette;
    }

    /**
     * Generate triadic palette
     */
    generateTriadicPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        const triadicHues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
        
        for (let i = 0; i < count; i++) {
            const hueIndex = i % triadicHues.length;
            const hue = triadicHues[hueIndex];
            const lightness = Math.max(20, Math.min(80, hsl.l + (i * 10)));
            
            const variationHsl = { h: hue, s: hsl.s, l: lightness };
            const variationRgb = this.hslToRgb(hue, hsl.s, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: i === 0 ? 'Base' : `Triadic ${i}`
            });
        }

        return palette;
    }

    /**
     * Generate tetradic palette
     */
    generateTetradicPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        const tetradicHues = [hsl.h, (hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360];
        
        for (let i = 0; i < count; i++) {
            const hueIndex = i % tetradicHues.length;
            const hue = tetradicHues[hueIndex];
            const lightness = Math.max(20, Math.min(80, hsl.l + (i * 8)));
            
            const variationHsl = { h: hue, s: hsl.s, l: lightness };
            const variationRgb = this.hslToRgb(hue, hsl.s, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: i === 0 ? 'Base' : `Tetradic ${i}`
            });
        }

        return palette;
    }

    /**
     * Generate monochromatic palette
     */
    generateMonochromaticPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const lightness = Math.max(10, Math.min(90, 20 + (i * 15)));
            const saturation = Math.max(20, Math.min(100, hsl.s + (i * 5)));
            
            const variationHsl = { h: hsl.h, s: saturation, l: lightness };
            const variationRgb = this.hslToRgb(hsl.h, saturation, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: i === 0 ? 'Base' : `Shade ${i}`
            });
        }

        return palette;
    }

    /**
     * Generate split-complementary palette
     */
    generateSplitComplementaryPalette(rgb, count) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        const baseHue = hsl.h;
        const splitHues = [(baseHue + 150) % 360, (baseHue + 210) % 360];
        
        palette.push({
            hex: this.rgbToHex(rgb.r, rgb.g, rgb.b),
            rgb: rgb,
            hsl: hsl,
            name: 'Base'
        });

        for (let i = 1; i < count; i++) {
            const hueIndex = (i - 1) % splitHues.length;
            const hue = splitHues[hueIndex];
            const lightness = Math.max(20, Math.min(80, hsl.l + (i * 10)));
            
            const variationHsl = { h: hue, s: hsl.s, l: lightness };
            const variationRgb = this.hslToRgb(hue, hsl.s, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: `Split ${i}`
            });
        }

        return palette;
    }

    /**
     * Generate random palette
     */
    generateRandomPalette(rgb, count) {
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const hue = Math.random() * 360;
            const saturation = Math.random() * 60 + 30; // 30-90%
            const lightness = Math.random() * 60 + 20; // 20-80%
            
            const variationHsl = { h: hue, s: saturation, l: lightness };
            const variationRgb = this.hslToRgb(hue, saturation, lightness);
            
            palette.push({
                hex: this.rgbToHex(variationRgb.r, variationRgb.g, variationRgb.b),
                rgb: variationRgb,
                hsl: variationHsl,
                name: i === 0 ? 'Base' : `Random ${i}`
            });
        }

        return palette;
    }

    /**
     * Check accessibility of palette
     */
    checkAccessibility(palette) {
        const results = {
            contrastRatios: [],
            wcagAA: [],
            wcagAAA: [],
            recommendations: []
        };

        // Check contrast ratios between all color pairs
        for (let i = 0; i < palette.length; i++) {
            for (let j = i + 1; j < palette.length; j++) {
                const ratio = this.getContrastRatio(palette[i].rgb, palette[j].rgb);
                results.contrastRatios.push({
                    color1: palette[i].hex,
                    color2: palette[j].hex,
                    ratio: ratio,
                    level: this.getContrastLevel(ratio)
                });
            }
        }

        // Check WCAG compliance
        palette.forEach((color, index) => {
            const luminance = this.getLuminance(color.rgb);
            results.wcagAA.push({
                color: color.hex,
                luminance: luminance,
                aaNormal: luminance >= 0.5,
                aaLarge: luminance >= 0.3
            });
            results.wcagAAA.push({
                color: color.hex,
                luminance: luminance,
                aaaNormal: luminance >= 0.7,
                aaaLarge: luminance >= 0.5
            });
        });

        // Generate recommendations
        const lowContrast = results.contrastRatios.filter(r => r.ratio < 3);
        if (lowContrast.length > 0) {
            results.recommendations.push('Some color combinations have low contrast. Consider adjusting colors for better accessibility.');
        }

        const darkColors = results.wcagAA.filter(w => w.luminance < 0.5);
        if (darkColors.length > 0) {
            results.recommendations.push('Some colors may be too dark for text on light backgrounds.');
        }

        return results;
    }

    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Convert RGB to hex
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Get contrast ratio between two colors
     */
    getContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    /**
     * Get luminance of a color
     */
    getLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * Get contrast level description
     */
    getContrastLevel(ratio) {
        if (ratio >= 7) return 'AAA Large';
        if (ratio >= 4.5) return 'AA Normal';
        if (ratio >= 3) return 'AA Large';
        return 'Fail';
    }

    /**
     * Generate CSS variables
     */
    generateCSSVariables(palette, prefix = 'color') {
        let css = ':root {\n';
        palette.forEach((color, index) => {
            css += `  --${prefix}-${index + 1}: ${color.hex};\n`;
        });
        css += '}';
        return css;
    }

    /**
     * Generate SCSS variables
     */
    generateSCSSVariables(palette, prefix = 'color') {
        let scss = '';
        palette.forEach((color, index) => {
            scss += `$${prefix}-${index + 1}: ${color.hex};\n`;
        });
        return scss;
    }

    /**
     * Generate Tailwind config
     */
    generateTailwindConfig(palette, prefix = 'color') {
        let config = 'colors: {\n';
        palette.forEach((color, index) => {
            config += `  '${prefix}-${index + 1}': '${color.hex}',\n`;
        });
        config += '}';
        return config;
    }

    /**
     * Add to history
     */
    addToHistory(operation, input, output) {
        this.history.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            input: input,
            output: output
        });

        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Get history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }
}
