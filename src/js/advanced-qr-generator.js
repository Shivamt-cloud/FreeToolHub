/**
 * Advanced QR Code Generator - Main Class
 * ISO/IEC 18004:2024 compliant QR Code generation
 * Orchestrates all components for complete QR code generation
 */

import { 
    ECC_LEVELS, 
    QR_VERSIONS, 
    MASK_PATTERNS,
    getSizeFromVersion,
    getDataCapacity 
} from './qr-constants.js';

import { InputSegmenter, DataSegment } from './qr-segmentation.js';
import { ReedSolomonEncoder, RSUtils } from './qr-reed-solomon.js';
import { 
    QRMatrix, 
    FunctionPatternPlacer, 
    DataPlacer, 
    InformationPlacer 
} from './qr-matrix.js';

/**
 * Advanced QR Code Generator
 * Implements complete QR Code generation pipeline
 */
export class AdvancedQRGenerator {
    constructor() {
        this.segmenter = new InputSegmenter();
        // Override the capacity function with the correct one
        this.segmenter.getDataCapacity = this.getDataCapacity.bind(this);
        this.version = 1;
        this.eccLevel = 'M';
        this.maskPattern = 0;
        this.quietZone = 4;
    }

    /**
     * Generate QR Code from input data
     */
    generate(data, options = {}) {
        try {
            // Validate input
            if (!data || typeof data !== 'string') {
                throw new Error('Input data must be a non-empty string');
            }

            // Apply options
            this.eccLevel = options.eccLevel || 'M';
            this.quietZone = options.quietZone || 4;
            const autoVersion = options.autoVersion !== false;
            const autoMask = options.autoMask !== false;

            // Step 1: Segment input data
            const segments = this.segmenter.segmentInput(data);
            console.log('Segmented input:', segments.map(s => ({ mode: s.mode, length: s.length })));

            // Step 2: Determine version
            if (autoVersion) {
                this.version = this.segmenter.findMinimumVersion(segments, this.eccLevel);
            } else {
                this.version = options.version || 1;
                if (!this.segmenter.canFitInVersion(segments, this.version, this.eccLevel)) {
                    throw new Error(`Data too large for version ${this.version} with ${this.eccLevel} ECC`);
                }
            }
            console.log(`Selected version: ${this.version}, ECC level: ${this.eccLevel}`);

            // Step 3: Build data bitstream
            const dataBits = this.buildDataBitstream(segments);
            console.log(`Data bitstream length: ${dataBits.length} bits`);

            // Step 4: Apply Reed-Solomon error correction
            const dataBytes = this.bitsToBytes(dataBits);
            const errorCorrectedBytes = this.applyErrorCorrection(dataBytes);
            console.log(`Data bytes: ${dataBytes.length}, Total codewords: ${errorCorrectedBytes.length}`);

            // Step 5: Create and populate matrix
            const matrix = this.createMatrix();
            console.log(`Matrix size: ${matrix.size}x${matrix.size}`);

            // Step 6: Place data (data bits + error correction bits)
            const allBits = this.bytesToBits(errorCorrectedBytes);
            DataPlacer.placeData(matrix, allBits);

            // Step 7: Apply best mask pattern
            if (autoMask) {
                this.maskPattern = this.findBestMask(matrix);
            } else {
                this.maskPattern = options.maskPattern || 0;
            }
            console.log(`Selected mask pattern: ${this.maskPattern}`);

            const finalMatrix = matrix.applyMask(MASK_PATTERNS[this.maskPattern]);

            // Step 8: Place format and version information
            InformationPlacer.placeFormatInfo(finalMatrix, this.eccLevel, this.maskPattern);
            if (this.version >= 7) {
                InformationPlacer.placeVersionInfo(finalMatrix, this.version);
            }

            // Step 9: Generate result
            const result = {
                matrix: finalMatrix,
                version: this.version,
                size: finalMatrix.size,
                eccLevel: this.eccLevel,
                maskPattern: this.maskPattern,
                data: data,
                segments: segments,
                totalBits: dataBits.length,
                totalCodewords: codewords.length
            };

            console.log('QR Code generation completed successfully');
            return result;

        } catch (error) {
            console.error('QR Code generation failed:', error);
            throw error;
        }
    }

    /**
     * Build complete data bitstream from segments
     */
    buildDataBitstream(segments) {
        const bits = [];
        
        // Add segments
        for (const segment of segments) {
            // Mode indicator (4 bits)
            const modeValue = this.getModeValue(segment.mode);
            for (let i = 3; i >= 0; i--) {
                bits.push((modeValue >> i) & 1);
            }
            
            // Character count indicator
            const countBits = segment.getCountIndicatorBits(this.version);
            const count = segment.length;
            for (let i = countBits - 1; i >= 0; i--) {
                bits.push((count >> i) & 1);
            }
            
            // Data bits
            const segmentBits = segment.encodeData();
            bits.push(...segmentBits);
        }
        
        // Add terminator
        const terminatorBits = Math.min(4, this.getRemainingCapacity(bits));
        for (let i = 0; i < terminatorBits; i++) {
            bits.push(0);
        }
        
        // Pad to byte boundary
        const paddingBits = (8 - (bits.length % 8)) % 8;
        for (let i = 0; i < paddingBits; i++) {
            bits.push(0);
        }
        
        // Add pad bytes
        const padBytes = this.calculatePadBytes(bits);
        for (const byte of padBytes) {
            for (let i = 7; i >= 0; i--) {
                bits.push((byte >> i) & 1);
            }
        }
        
        return bits;
    }

    /**
     * Get mode value for encoding
     */
    getModeValue(mode) {
        const modeValues = {
            'NUMERIC': 0x1,
            'ALPHANUMERIC': 0x2,
            'BYTE': 0x4,
            'KANJI': 0x8
        };
        return modeValues[mode] || 0x4;
    }

    /**
     * Calculate remaining capacity in bits
     */
    getRemainingCapacity(currentBits) {
        const totalCapacity = this.getDataCapacity(this.version, this.eccLevel) * 8;
        return Math.max(0, totalCapacity - currentBits.length);
    }

    /**
     * Get data capacity in codewords for given version and ECC level
     */
    getDataCapacity(version, eccLevel) {
        const versionInfo = QR_VERSIONS[version];
        if (!versionInfo) {
            throw new Error(`Invalid QR version: ${version}`);
        }
        const capacityInCodewords = versionInfo.dataCapacity[eccLevel];
        if (capacityInCodewords === undefined) {
            throw new Error(`Invalid ECC level: ${eccLevel}`);
        }
        return capacityInCodewords;
    }

    /**
     * Calculate pad bytes needed
     */
    calculatePadBytes(currentBits) {
        const totalCapacity = this.getDataCapacity(this.version, this.eccLevel) * 8;
        const remainingBits = totalCapacity - currentBits.length;
        const remainingBytes = Math.floor(remainingBits / 8);
        
        const padBytes = [];
        for (let i = 0; i < remainingBytes; i++) {
            padBytes.push(i % 2 === 0 ? 0xEC : 0x11);
        }
        
        return padBytes;
    }

    /**
     * Convert bits to bytes
     */
    bitsToBytes(bits) {
        const bytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8 && i + j < bits.length; j++) {
                byte = (byte << 1) | bits[i + j];
            }
            bytes.push(byte);
        }
        return bytes;
    }

    /**
     * Convert bytes to bits
     */
    bytesToBits(bytes) {
        const bits = [];
        for (const byte of bytes) {
            for (let i = 7; i >= 0; i--) {
                bits.push((byte >> i) & 1);
            }
        }
        return bits;
    }

    /**
     * Apply Reed-Solomon error correction
     */
    applyErrorCorrection(dataBytes) {
        // Get ECC parameters
        const eccCodewords = RSUtils.getECCCodewords(this.version, this.eccLevel);
        
        // Create Reed-Solomon encoder
        const generatorPolynomial = ReedSolomonEncoder.createGeneratorPolynomial(eccCodewords);
        const encoder = new ReedSolomonEncoder(generatorPolynomial);
        
        // Encode with error correction
        const encoded = encoder.encode(dataBytes);
        
        return encoded;
    }

    /**
     * Create QR matrix with function patterns
     */
    createMatrix() {
        const size = getSizeFromVersion(this.version);
        const matrix = new QRMatrix(size);
        
        // Place all function patterns
        FunctionPatternPlacer.placeAllPatterns(matrix);
        
        return matrix;
    }

    /**
     * Find the best mask pattern by evaluating all 8 patterns
     */
    findBestMask(matrix) {
        let bestMask = 0;
        let bestPenalty = Infinity;
        
        for (let maskIndex = 0; maskIndex < 8; maskIndex++) {
            const masked = matrix.applyMask(MASK_PATTERNS[maskIndex]);
            const penalty = masked.calculatePenalty();
            
            if (penalty < bestPenalty) {
                bestPenalty = penalty;
                bestMask = maskIndex;
            }
        }
        
        return bestMask;
    }

    /**
     * Render QR code as SVG
     */
    renderSVG(matrix, options = {}) {
        const moduleSize = options.moduleSize || 4;
        const foreground = options.foreground || '#000000';
        const background = options.background || '#FFFFFF';
        const quietZone = options.quietZone || this.quietZone;
        
        const totalSize = matrix.size + (quietZone * 2);
        const svgSize = totalSize * moduleSize;
        
        let svg = `<svg width="${svgSize}" height="${svgSize}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="${svgSize}" height="${svgSize}" fill="${background}"/>`;
        
        for (let row = 0; row < matrix.size; row++) {
            for (let col = 0; col < matrix.size; col++) {
                const value = matrix.get(row, col);
                if (value === true) {
                    const x = (col + quietZone) * moduleSize;
                    const y = (row + quietZone) * moduleSize;
                    svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${foreground}"/>`;
                }
            }
        }
        
        svg += '</svg>';
        return svg;
    }

    /**
     * Render QR code as Canvas
     */
    renderCanvas(matrix, canvas, options = {}) {
        const moduleSize = options.moduleSize || 4;
        const foreground = options.foreground || '#000000';
        const background = options.background || '#FFFFFF';
        const quietZone = options.quietZone || this.quietZone;
        
        const totalSize = matrix.size + (quietZone * 2);
        const canvasSize = totalSize * moduleSize;
        
        // Set canvas size
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        
        // Draw modules
        ctx.fillStyle = foreground;
        for (let row = 0; row < matrix.size; row++) {
            for (let col = 0; col < matrix.size; col++) {
                const value = matrix.get(row, col);
                if (value === true) {
                    const x = (col + quietZone) * moduleSize;
                    const y = (row + quietZone) * moduleSize;
                    ctx.fillRect(x, y, moduleSize, moduleSize);
                }
            }
        }
        
        return canvas;
    }

    /**
     * Get QR code information and statistics
     */
    getInfo() {
        return {
            version: this.version,
            size: getSizeFromVersion(this.version),
            eccLevel: this.eccLevel,
            eccPercentage: ECC_LEVELS[this.eccLevel].percentage,
            maskPattern: this.maskPattern,
            dataCapacity: getDataCapacity(this.version, this.eccLevel),
            quietZone: this.quietZone
        };
    }

    /**
     * Validate input parameters
     */
    static validateInput(data, options = {}) {
        const errors = [];
        
        if (!data || typeof data !== 'string') {
            errors.push('Data must be a non-empty string');
        }
        
        if (options.eccLevel && !['L', 'M', 'Q', 'H'].includes(options.eccLevel)) {
            errors.push('ECC level must be L, M, Q, or H');
        }
        
        if (options.version && (options.version < 1 || options.version > 40)) {
            errors.push('Version must be between 1 and 40');
        }
        
        if (options.maskPattern && (options.maskPattern < 0 || options.maskPattern > 7)) {
            errors.push('Mask pattern must be between 0 and 7');
        }
        
        return errors;
    }
}

/**
 * Utility functions for QR code generation
 */
export class QRUtils {
    /**
     * Generate QR code with default settings
     */
    static generate(data, options = {}) {
        const generator = new AdvancedQRGenerator();
        return generator.generate(data, options);
    }

    /**
     * Generate QR code SVG
     */
    static generateSVG(data, options = {}) {
        const generator = new AdvancedQRGenerator();
        const result = generator.generate(data, options);
        return generator.renderSVG(result.matrix, options);
    }

    /**
     * Generate QR code on canvas
     */
    static generateCanvas(data, canvas, options = {}) {
        const generator = new AdvancedQRGenerator();
        const result = generator.generate(data, options);
        return generator.renderCanvas(result.matrix, canvas, options);
    }

    /**
     * Check if data can fit in specified version and ECC level
     */
    static canFit(data, version, eccLevel = 'M') {
        const segmenter = new InputSegmenter();
        const segments = segmenter.segmentInput(data);
        return segmenter.canFitInVersion(segments, version, eccLevel);
    }

    /**
     * Get recommended version for data
     */
    static getRecommendedVersion(data, eccLevel = 'M') {
        const segmenter = new InputSegmenter();
        const segments = segmenter.segmentInput(data);
        return segmenter.findMinimumVersion(segments, eccLevel);
    }
}


