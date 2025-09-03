/**
 * Advanced QR Code Generator - Input Segmentation
 * Analyzes input data and segments it into optimal encoding modes
 */

import { ENCODING_MODES, ALPHANUMERIC_CHARS } from './qr-constants.js';

/**
 * Represents a segment of data with a specific encoding mode
 */
export class DataSegment {
    constructor(mode, data, startIndex, endIndex) {
        this.mode = mode;
        this.data = data;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.length = endIndex - startIndex;
    }

    /**
     * Get the bit length of this segment including mode and count indicators
     */
    getBitLength(version) {
        const modeBits = 4; // Mode indicator is always 4 bits
        const countBits = this.getCountIndicatorBits(version);
        const dataBits = this.getDataBits();
        return modeBits + countBits + dataBits;
    }

    /**
     * Get the number of bits needed for the character count indicator
     */
    getCountIndicatorBits(version) {
        const versionRange = version <= 9 ? '1-9' : version <= 26 ? '10-26' : '27-40';
        const countBits = {
            NUMERIC: { '1-9': 10, '10-26': 12, '27-40': 14 },
            ALPHANUMERIC: { '1-9': 9, '10-26': 11, '27-40': 13 },
            BYTE: { '1-9': 8, '10-26': 16, '27-40': 16 },
            KANJI: { '1-9': 8, '10-26': 10, '27-40': 12 }
        };
        return countBits[this.mode][versionRange];
    }

    /**
     * Get the number of bits needed for the actual data
     */
    getDataBits() {
        switch (this.mode) {
            case 'NUMERIC':
                return Math.ceil(this.length * 3.33);
            case 'ALPHANUMERIC':
                return Math.ceil(this.length * 5.5);
            case 'BYTE':
                return this.length * 8;
            case 'KANJI':
                return this.length * 13;
            default:
                return this.length * 8;
        }
    }

    /**
     * Encode the data according to the mode
     */
    encodeData() {
        switch (this.mode) {
            case 'NUMERIC':
                return this.encodeNumeric();
            case 'ALPHANUMERIC':
                return this.encodeAlphanumeric();
            case 'BYTE':
                return this.encodeByte();
            case 'KANJI':
                return this.encodeKanji();
            default:
                return this.encodeByte();
        }
    }

    /**
     * Encode numeric data (3 digits per 10 bits)
     */
    encodeNumeric() {
        const bits = [];
        const data = this.data.substring(this.startIndex, this.endIndex);
        
        for (let i = 0; i < data.length; i += 3) {
            const group = data.substring(i, i + 3);
            let value = parseInt(group, 10);
            
            if (group.length === 3) {
                // 3 digits: 10 bits
                for (let j = 9; j >= 0; j--) {
                    bits.push((value >> j) & 1);
                }
            } else if (group.length === 2) {
                // 2 digits: 7 bits
                for (let j = 6; j >= 0; j--) {
                    bits.push((value >> j) & 1);
                }
            } else {
                // 1 digit: 4 bits
                for (let j = 3; j >= 0; j--) {
                    bits.push((value >> j) & 1);
                }
            }
        }
        
        return bits;
    }

    /**
     * Encode alphanumeric data (2 characters per 11 bits)
     */
    encodeAlphanumeric() {
        const bits = [];
        const data = this.data.substring(this.startIndex, this.endIndex);
        
        for (let i = 0; i < data.length; i += 2) {
            const char1 = data[i];
            const char2 = data[i + 1];
            
            const value1 = ALPHANUMERIC_CHARS.indexOf(char1);
            const value2 = char2 ? ALPHANUMERIC_CHARS.indexOf(char2) : 0;
            
            if (char2) {
                // 2 characters: 11 bits
                const combined = value1 * 45 + value2;
                for (let j = 10; j >= 0; j--) {
                    bits.push((combined >> j) & 1);
                }
            } else {
                // 1 character: 6 bits
                for (let j = 5; j >= 0; j--) {
                    bits.push((value1 >> j) & 1);
                }
            }
        }
        
        return bits;
    }

    /**
     * Encode byte data (8 bits per character)
     */
    encodeByte() {
        const bits = [];
        const data = this.data.substring(this.startIndex, this.endIndex);
        
        for (let i = 0; i < data.length; i++) {
            const charCode = data.charCodeAt(i);
            for (let j = 7; j >= 0; j--) {
                bits.push((charCode >> j) & 1);
            }
        }
        
        return bits;
    }

    /**
     * Encode Kanji data (13 bits per character)
     * This is a simplified implementation - full Kanji support requires JIS X 0208
     */
    encodeKanji() {
        const bits = [];
        const data = this.data.substring(this.startIndex, this.endIndex);
        
        for (let i = 0; i < data.length; i++) {
            const charCode = data.charCodeAt(i);
            // Simplified: treat as byte for now
            for (let j = 7; j >= 0; j--) {
                bits.push((charCode >> j) & 1);
            }
        }
        
        return bits;
    }
}

/**
 * Analyzes input data and determines optimal segmentation
 */
export class InputSegmenter {
    constructor() {
        this.modes = Object.keys(ENCODING_MODES);
    }

    /**
     * Segment input data into optimal encoding modes
     */
    segmentInput(input) {
        if (!input || input.length === 0) {
            return [];
        }

        const segments = [];
        let currentMode = this.detectMode(input[0]);
        let startIndex = 0;

        for (let i = 1; i < input.length; i++) {
            const char = input[i];
            const charMode = this.detectMode(char);
            
            if (charMode !== currentMode) {
                // Create segment for previous mode
                segments.push(new DataSegment(
                    currentMode,
                    input,
                    startIndex,
                    i
                ));
                
                startIndex = i;
                currentMode = charMode;
            }
        }

        // Add final segment
        segments.push(new DataSegment(
            currentMode,
            input,
            startIndex,
            input.length
        ));

        return this.optimizeSegments(segments);
    }

    /**
     * Detect the encoding mode for a single character
     */
    detectMode(char) {
        if (char >= '0' && char <= '9') {
            return 'NUMERIC';
        } else if (ALPHANUMERIC_CHARS.includes(char)) {
            return 'ALPHANUMERIC';
        } else {
            return 'BYTE';
        }
    }

    /**
     * Optimize segments by combining adjacent segments of the same mode
     */
    optimizeSegments(segments) {
        if (segments.length <= 1) {
            return segments;
        }

        const optimized = [];
        let current = segments[0];

        for (let i = 1; i < segments.length; i++) {
            const next = segments[i];
            
            if (current.mode === next.mode) {
                // Extend current segment
                current = new DataSegment(
                    current.mode,
                    current.data,
                    current.startIndex,
                    next.endIndex
                );
            } else {
                // Add current segment and start new one
                optimized.push(current);
                current = next;
            }
        }

        optimized.push(current);
        return optimized;
    }

    /**
     * Calculate total bit length for all segments
     */
    calculateTotalBitLength(segments, version) {
        return segments.reduce((total, segment) => {
            return total + segment.getBitLength(version);
        }, 0);
    }

    /**
     * Find the minimum version that can accommodate the data
     */
    findMinimumVersion(segments, eccLevel) {
        // Start with version 1 and check capacity
        for (let version = 1; version <= 40; version++) {
            const totalBits = this.calculateTotalBitLength(segments, version);
            const capacity = this.getDataCapacity(version, eccLevel);
            
            if (totalBits <= capacity * 8) {
                return version;
            }
        }
        
        throw new Error('Data too large for QR Code (max version 40)');
    }

    /**
     * Get data capacity in bits for given version and ECC level
     */
    getDataCapacity(version, eccLevel) {
        // Simplified capacity calculation
        const baseCapacity = {
            'L': 0.93, 'M': 0.85, 'Q': 0.75, 'H': 0.70
        };
        const totalCodewords = Math.floor((version * 4 + 17) * (version * 4 + 17) / 8);
        return Math.floor(totalCodewords * baseCapacity[eccLevel] * 8);
    }

    /**
     * Validate if segments can fit in specified version and ECC level
     */
    canFitInVersion(segments, version, eccLevel) {
        const totalBits = this.calculateTotalBitLength(segments, version);
        const capacity = this.getDataCapacity(version, eccLevel);
        return totalBits <= capacity;
    }
}

/**
 * Utility functions for segmentation
 */
export class SegmentationUtils {
    /**
     * Check if string contains only numeric characters
     */
    static isNumeric(str) {
        return /^[0-9]+$/.test(str);
    }

    /**
     * Check if string contains only alphanumeric characters
     */
    static isAlphanumeric(str) {
        return /^[0-9A-Z $%*+\-./:]+$/i.test(str);
    }

    /**
     * Check if string contains only ASCII characters
     */
    static isASCII(str) {
        return /^[\x00-\x7F]*$/.test(str);
    }

    /**
     * Estimate the most efficient encoding mode for a string
     */
    static estimateOptimalMode(str) {
        if (SegmentationUtils.isNumeric(str)) {
            return 'NUMERIC';
        } else if (SegmentationUtils.isAlphanumeric(str)) {
            return 'ALPHANUMERIC';
        } else {
            return 'BYTE';
        }
    }

    /**
     * Calculate the cost of encoding a string in a specific mode
     */
    static calculateEncodingCost(str, mode) {
        const modeInfo = ENCODING_MODES[mode];
        if (!modeInfo) return Infinity;
        
        return Math.ceil(str.length * modeInfo.bitsPerChar);
    }
}
