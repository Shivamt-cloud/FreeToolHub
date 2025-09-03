// Advanced Color Converter Module for FreeToolHub
// Implements professional-grade color space conversions with proper transfer functions

class AdvancedColorConverter {
    constructor() {
        this.initializeMatrices();
        this.initializeColorSpaces();
    }

    // Initialize transformation matrices
    initializeMatrices() {
        // sRGB(D65) to XYZ transformation matrix
        this.M_RGB2XYZ = [
            [0.4124564, 0.3575761, 0.1804375],
            [0.2126729, 0.7151522, 0.0721750],
            [0.0193339, 0.1191920, 0.9503041]
        ];

        // XYZ to sRGB(D65) inverse transformation matrix
        this.M_XYZ2RGB = [
            [3.2404542, -1.5371385, -0.4985314],
            [-0.9692660, 1.8760108, 0.0415560],
            [0.0556434, -0.2040259, 1.0572252]
        ];

        // D65 reference white point
        this.D65_WHITE = [95.0489, 100.0, 108.8840];
    }

    // Initialize supported color spaces
    initializeColorSpaces() {
        this.colorSpaces = {
            'hex': { name: 'HEX', channels: ['#RRGGBB'], alpha: true },
            'srgb8': { name: 'sRGB 8-bit', channels: ['R', 'G', 'B'], alpha: true, range: [0, 255] },
            'srgb': { name: 'sRGB', channels: ['R', 'G', 'B'], alpha: true, range: [0, 1] },
            'srgb-linear': { name: 'sRGB Linear', channels: ['R', 'G', 'B'], alpha: true, range: [0, 1] },
            'hsl': { name: 'HSL', channels: ['H', 'S', 'L'], alpha: true, ranges: [[0, 360], [0, 1], [0, 1]] },
            'hsv': { name: 'HSV', channels: ['H', 'S', 'V'], alpha: true, ranges: [[0, 360], [0, 1], [0, 1]] },
            'cmyk': { name: 'CMYK', channels: ['C', 'M', 'Y', 'K'], alpha: true, range: [0, 1] },
            'xyz': { name: 'XYZ (D65)', channels: ['X', 'Y', 'Z'], alpha: true, range: [0, 100] },
            'lab': { name: 'CIELAB (D65)', channels: ['L*', 'a*', 'b*'], alpha: true, ranges: [[0, 100], [-128, 127], [-128, 127]] }
        };
    }

    // Get supported color spaces
    getSupportedColorSpaces() {
        return Object.keys(this.colorSpaces);
    }

    // Get color space information
    getColorSpaceInfo(space) {
        return this.colorSpaces[space] || null;
    }

    // Utility functions
    clamp01(x) {
        return Math.max(0, Math.min(1, x));
    }

    clamp(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

    // sRGB transfer functions
    srgbToLinear(c) {
        if (c <= 0.04045) {
            return c / 12.92;
        } else {
            return Math.pow((c + 0.055) / 1.055, 2.4);
        }
    }

    linearToSrgb(c) {
        if (c <= 0.0031308) {
            return 12.92 * c;
        } else {
            return 1.055 * Math.pow(c, 1/2.4) - 0.055;
        }
    }

    // Matrix multiplication helper
    matrixMultiply(matrix, vector) {
        const result = [];
        for (let i = 0; i < matrix.length; i++) {
            let sum = 0;
            for (let j = 0; j < matrix[i].length; j++) {
                sum += matrix[i][j] * vector[j];
            }
            result.push(sum);
        }
        return result;
    }

    // HEX parsing and encoding
    parseHex(hexString) {
        let hex = hexString.replace('#', '');
        
        // Handle different HEX formats
        if (hex.length === 3) {
            // #RGB -> #RRGGBB
            hex = hex.split('').map(c => c + c).join('');
        } else if (hex.length === 4) {
            // #RGBA -> #RRGGBBAA
            hex = hex.split('').map(c => c + c).join('');
        } else if (hex.length === 6) {
            // #RRGGBB -> #RRGGBB
            hex = hex + 'FF'; // Add alpha
        } else if (hex.length === 8) {
            // #RRGGBBAA -> #RRGGBBAA
            hex = hex;
        } else {
            throw new Error('Invalid HEX format');
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const a = parseInt(hex.substring(6, 8), 16);

        return { r, g, b, a: a / 255 };
    }

    hexFromRgba(r, g, b, a = 1.0, includeAlpha = true) {
        const r8 = Math.round(this.clamp01(r) * 255);
        const g8 = Math.round(this.clamp01(g) * 255);
        const b8 = Math.round(this.clamp01(b) * 255);
        const a8 = Math.round(this.clamp01(a) * 255);

        if (includeAlpha && a8 < 255) {
            return `#${r8.toString(16).padStart(2, '0').toUpperCase()}${g8.toString(16).padStart(2, '0').toUpperCase()}${b8.toString(16).padStart(2, '0').toUpperCase()}${a8.toString(16).padStart(2, '0').toUpperCase()}`;
        } else {
            return `#${r8.toString(16).padStart(2, '0').toUpperCase()}${g8.toString(16).padStart(2, '0').toUpperCase()}${b8.toString(16).padStart(2, '0').toUpperCase()}`;
        }
    }

    // RGB to HSL conversion
    rgbToHsl(r, g, b) {
        r = this.clamp01(r);
        g = this.clamp01(g);
        b = this.clamp01(b);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
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

        return [h * 360, s, l];
    }

    // HSL to RGB conversion
    hslToRgb(h, s, l) {
        h = (h % 360) / 360;
        s = this.clamp01(s);
        l = this.clamp01(l);

        if (s === 0) {
            return [l, l, l]; // achromatic
        }

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        return [
            hue2rgb(p, q, h + 1/3),
            hue2rgb(p, q, h),
            hue2rgb(p, q, h - 1/3)
        ];
    }

    // RGB to HSV conversion
    rgbToHsv(r, g, b) {
        r = this.clamp01(r);
        g = this.clamp01(g);
        b = this.clamp01(b);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h, s, v = max;

        if (max === 0) {
            s = 0;
            h = 0;
        } else {
            s = d / max;
            
            if (max === min) {
                h = 0;
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
        }

        return [h * 360, s, v];
    }

    // HSV to RGB conversion
    hsvToRgb(h, s, v) {
        h = (h % 360) / 60;
        s = this.clamp01(s);
        v = this.clamp01(v);

        if (s === 0) {
            return [v, v, v];
        }

        const c = v * s;
        const x = c * (1 - Math.abs((h % 2) - 1));
        const m = v - c;

        let r, g, b;

        if (h >= 0 && h < 1) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 1 && h < 2) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 2 && h < 3) {
            [r, g, b] = [0, c, x];
        } else if (h >= 3 && h < 4) {
            [r, g, b] = [0, x, c];
        } else if (h >= 4 && h < 5) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return [r + m, g + m, b + m];
    }

    // RGB to CMYK conversion (approximation)
    rgbToCmyk(r, g, b) {
        r = this.clamp01(r);
        g = this.clamp01(g);
        b = this.clamp01(b);

        const k = 1 - Math.max(r, g, b);
        
        if (k >= 1) {
            return [0, 0, 0, 1];
        }

        const c = (1 - r - k) / (1 - k);
        const m = (1 - g - k) / (1 - k);
        const y = (1 - b - k) / (1 - k);

        return [c, m, y, k];
    }

    // CMYK to RGB conversion (approximation)
    cmykToRgb(c, m, y, k) {
        c = this.clamp01(c);
        m = this.clamp01(m);
        y = this.clamp01(y);
        k = this.clamp01(k);

        const r = (1 - c) * (1 - k);
        const g = (1 - m) * (1 - k);
        const b = (1 - y) * (1 - k);

        return [r, g, b];
    }

    // sRGB linear to XYZ conversion
    srgbLinearToXyz(r, g, b) {
        const vector = [r, g, b];
        return this.matrixMultiply(this.M_RGB2XYZ, vector);
    }

    // XYZ to sRGB linear conversion
    xyzToSrgbLinear(x, y, z) {
        const vector = [x, y, z];
        return this.matrixMultiply(this.M_XYZ2RGB, vector);
    }

    // XYZ to CIELAB conversion
    xyzToLab(x, y, z) {
        const xn = this.D65_WHITE[0];
        const yn = this.D65_WHITE[1];
        const zn = this.D65_WHITE[2];

        const f = (t) => {
            if (t > Math.pow(6/29, 3)) {
                return Math.pow(t, 1/3);
            } else {
                return (t / (3 * Math.pow(6/29, 2))) + (4/29);
            }
        };

        const fx = f(x / xn);
        const fy = f(y / yn);
        const fz = f(z / zn);

        const L = 116 * fy - 16;
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);

        return [L, a, b];
    }

    // CIELAB to XYZ conversion
    labToXyz(L, a, b) {
        const xn = this.D65_WHITE[0];
        const yn = this.D65_WHITE[1];
        const zn = this.D65_WHITE[2];

        const finv = (t) => {
            if (t > 6/29) {
                return Math.pow(t, 3);
            } else {
                return 3 * Math.pow(6/29, 2) * (t - 4/29);
            }
        };

        const fy = (L + 16) / 116;
        const fx = fy + a / 500;
        const fz = fy - b / 200;

        const x = finv(fx) * xn;
        const y = finv(fy) * yn;
        const z = finv(fz) * zn;

        return [x, y, z];
    }

    // Main conversion function
    convertColor(input, fromSpace, toSpace, alpha = 1.0) {
        try {
            // Parse input based on source color space
            let r, g, b, a = alpha;

            switch (fromSpace) {
                case 'hex':
                    const parsed = this.parseHex(input);
                    r = parsed.r / 255;
                    g = parsed.g / 255;
                    b = parsed.b / 255;
                    a = parsed.a;
                    break;

                case 'srgb8':
                    if (Array.isArray(input) && input.length >= 3) {
                        r = input[0] / 255;
                        g = input[1] / 255;
                        b = input[2] / 255;
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid sRGB8 input format');
                    }
                    break;

                case 'srgb':
                    if (Array.isArray(input) && input.length >= 3) {
                        r = this.clamp01(input[0]);
                        g = this.clamp01(input[1]);
                        b = this.clamp01(input[2]);
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid sRGB input format');
                    }
                    break;

                case 'srgb-linear':
                    if (Array.isArray(input) && input.length >= 3) {
                        r = this.clamp01(input[0]);
                        g = this.clamp01(input[1]);
                        b = this.clamp01(input[2]);
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                        // Convert linear to sRGB
                        r = this.linearToSrgb(r);
                        g = this.linearToSrgb(g);
                        b = this.linearToSrgb(b);
                    } else {
                        throw new Error('Invalid sRGB-linear input format');
                    }
                    break;

                case 'hsl':
                    if (Array.isArray(input) && input.length >= 3) {
                        const rgb = this.hslToRgb(input[0], input[1], input[2]);
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid HSL input format');
                    }
                    break;

                case 'hsv':
                    if (Array.isArray(input) && input.length >= 3) {
                        const rgb = this.hsvToRgb(input[0], input[1], input[2]);
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid HSV input format');
                    }
                    break;

                case 'cmyk':
                    if (Array.isArray(input) && input.length >= 4) {
                        const rgb = this.cmykToRgb(input[0], input[1], input[2], input[3]);
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                        a = input[4] !== undefined ? this.clamp01(input[4]) : alpha;
                    } else {
                        throw new Error('Invalid CMYK input format');
                    }
                    break;

                case 'xyz':
                    if (Array.isArray(input) && input.length >= 3) {
                        // XYZ -> sRGB linear -> sRGB
                        const srgbLinear = this.xyzToSrgbLinear(input[0], input[1], input[2]);
                        r = this.linearToSrgb(srgbLinear[0]);
                        g = this.linearToSrgb(srgbLinear[1]);
                        b = this.linearToSrgb(srgbLinear[2]);
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid XYZ input format');
                    }
                    break;

                case 'lab':
                    if (Array.isArray(input) && input.length >= 3) {
                        // Lab -> XYZ -> sRGB linear -> sRGB
                        const xyz = this.labToXyz(input[0], input[1], input[2]);
                        const srgbLinear = this.xyzToSrgbLinear(xyz[0], xyz[1], xyz[2]);
                        r = this.linearToSrgb(srgbLinear[0]);
                        g = this.linearToSrgb(srgbLinear[1]);
                        b = this.linearToSrgb(srgbLinear[2]);
                        a = input[3] !== undefined ? this.clamp01(input[3]) : alpha;
                    } else {
                        throw new Error('Invalid Lab input format');
                    }
                    break;

                default:
                    throw new Error(`Unsupported input color space: ${fromSpace}`);
            }

            // Convert to target color space
            switch (toSpace) {
                case 'hex':
                    return this.hexFromRgba(r, g, b, a, true);

                case 'srgb8':
                    return [
                        Math.round(this.clamp01(r) * 255),
                        Math.round(this.clamp01(g) * 255),
                        Math.round(this.clamp01(b) * 255),
                        this.clamp01(a)
                    ];

                case 'srgb':
                    return [
                        this.clamp01(r),
                        this.clamp01(g),
                        this.clamp01(b),
                        this.clamp01(a)
                    ];

                case 'srgb-linear':
                    return [
                        this.clamp01(this.srgbToLinear(r)),
                        this.clamp01(this.srgbToLinear(g)),
                        this.clamp01(this.srgbToLinear(b)),
                        this.clamp01(a)
                    ];

                case 'hsl':
                    const hsl = this.rgbToHsl(r, g, b);
                    return [...hsl, this.clamp01(a)];

                case 'hsv':
                    const hsv = this.rgbToHsv(r, g, b);
                    return [...hsv, this.clamp01(a)];

                case 'cmyk':
                    const cmyk = this.rgbToCmyk(r, g, b);
                    return [...cmyk, this.clamp01(a)];

                case 'xyz':
                    const rLinear = this.srgbToLinear(r);
                    const gLinear = this.srgbToLinear(g);
                    const bLinear = this.srgbToLinear(b);
                    const xyz = this.srgbLinearToXyz(rLinear, gLinear, bLinear);
                    return [...xyz, this.clamp01(a)];

                case 'lab':
                    const rLinear2 = this.srgbToLinear(r);
                    const gLinear2 = this.srgbToLinear(g);
                    const bLinear2 = this.srgbToLinear(b);
                    const xyz2 = this.srgbLinearToXyz(rLinear2, gLinear2, bLinear2);
                    const lab = this.xyzToLab(xyz2[0], xyz2[1], xyz2[2]);
                    return [...lab, this.clamp01(a)];

                default:
                    throw new Error(`Unsupported target color space: ${toSpace}`);
            }

        } catch (error) {
            return {
                error: error.message,
                success: false
            };
        }
    }

    // Batch conversion
    convertColorBatch(inputs, fromSpace, toSpace) {
        const results = [];
        for (const input of inputs) {
            const result = this.convertColor(input, fromSpace, toSpace);
            results.push(result);
        }
        return results;
    }

    // Get color information
    getColorInfo(color, space) {
        try {
            const result = this.convertColor(color, space, 'srgb');
            if (result.error) {
                return { error: result.error };
            }

            // Convert to multiple spaces for comprehensive info
            const info = {
                space: space,
                original: color,
                srgb: result,
                rgb: this.convertColor(color, space, 'srgb8'),
                hex: this.convertColor(color, space, 'hex'),
                hsl: this.convertColor(color, space, 'hsl'),
                hsv: this.convertColor(color, space, 'hsv'),
                cmyk: this.convertColor(color, space, 'cmyk'),
                xyz: this.convertColor(color, space, 'xyz'),
                lab: this.convertColor(color, space, 'lab')
            };

            return info;
        } catch (error) {
            return { error: error.message };
        }
    }

    // Validate color input
    validateColor(color, space) {
        try {
            const result = this.convertColor(color, space, 'srgb');
            if (result.error) {
                return { isValid: false, error: result.error };
            }
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }

    // Generate complementary colors
    generateComplementary(color, space) {
        try {
            const srgb = this.convertColor(color, space, 'srgb');
            if (srgb.error) {
                return { error: srgb.error };
            }

            const complementary = [
                1 - srgb[0],
                1 - srgb[1],
                1 - srgb[2],
                srgb[3]
            ];

            return {
                original: this.convertColor(color, space, space),
                complementary: this.convertColor(complementary, 'srgb', space),
                srgb: srgb,
                srgbComplementary: complementary
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Generate analogous colors
    generateAnalogous(color, space, count = 3) {
        try {
            const hsl = this.convertColor(color, space, 'hsl');
            if (hsl.error) {
                return { error: hsl.error };
            }

            const colors = [];
            const step = 30; // 30 degree intervals

            for (let i = 1; i <= count; i++) {
                const h = (hsl[0] + i * step) % 360;
                const analogous = this.convertColor([h, hsl[1], hsl[2], hsl[3]], 'hsl', space);
                colors.push(analogous);
            }

            return {
                original: this.convertColor(color, space, space),
                analogous: colors
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Generate triadic colors
    generateTriadic(color, space) {
        try {
            const hsl = this.convertColor(color, space, 'hsl');
            if (hsl.error) {
                return { error: hsl.error };
            }

            const triadic1 = this.convertColor([(hsl[0] + 120) % 360, hsl[1], hsl[2], hsl[3]], 'hsl', space);
            const triadic2 = this.convertColor([(hsl[0] + 240) % 360, hsl[1], hsl[2], hsl[3]], 'hsl', space);

            return {
                original: this.convertColor(color, space, space),
                triadic1: triadic1,
                triadic2: triadic2
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Calculate color distance (Euclidean in RGB space)
    calculateColorDistance(color1, space1, color2, space2) {
        try {
            const srgb1 = this.convertColor(color1, space1, 'srgb');
            const srgb2 = this.convertColor(color2, space2, 'srgb');

            if (srgb1.error || srgb2.error) {
                return { error: 'Failed to convert colors' };
            }

            const dr = srgb1[0] - srgb2[0];
            const dg = srgb1[1] - srgb2[1];
            const db = srgb1[2] - srgb2[2];

            const distance = Math.sqrt(dr * dr + dg * dg + db * db);

            return {
                distance: distance,
                normalized: distance / Math.sqrt(3), // Normalize to [0,1]
                color1: srgb1,
                color2: srgb2
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Check if colors are similar (within threshold)
    areColorsSimilar(color1, space1, color2, space2, threshold = 0.1) {
        const distance = this.calculateColorDistance(color1, space1, color2, space2);
        if (distance.error) {
            return false;
        }
        return distance.normalized <= threshold;
    }
}

// Export for use in the main application
window.AdvancedColorConverter = AdvancedColorConverter;
