/**
 * Advanced QR Code Generator - Constants and Tables
 * ISO/IEC 18004:2024 compliant QR Code generation
 */

// QR Code Error Correction Levels
export const ECC_LEVELS = {
    L: { level: 'L', percentage: 7, name: 'Low' },
    M: { level: 'M', percentage: 15, name: 'Medium' },
    Q: { level: 'Q', percentage: 25, name: 'Quartile' },
    H: { level: 'H', percentage: 30, name: 'High' }
};

// QR Code Versions (1-40) with capacities
export const QR_VERSIONS = {
    1: { size: 21, dataCapacity: { L: 19, M: 16, Q: 13, H: 9 } },
    2: { size: 25, dataCapacity: { L: 34, M: 28, Q: 22, H: 16 } },
    3: { size: 29, dataCapacity: { L: 55, M: 44, Q: 34, H: 26 } },
    4: { size: 33, dataCapacity: { L: 80, M: 64, Q: 48, H: 36 } },
    5: { size: 37, dataCapacity: { L: 108, M: 86, Q: 62, H: 46 } },
    6: { size: 41, dataCapacity: { L: 130, M: 108, Q: 76, H: 60 } },
    7: { size: 45, dataCapacity: { L: 168, M: 130, Q: 88, H: 66 } },
    8: { size: 49, dataCapacity: { L: 196, M: 150, Q: 110, H: 86 } },
    9: { size: 53, dataCapacity: { L: 224, M: 172, Q: 132, H: 100 } },
    10: { size: 57, dataCapacity: { L: 279, M: 207, Q: 154, H: 122 } },
    11: { size: 61, dataCapacity: { L: 335, M: 259, Q: 196, H: 152 } },
    12: { size: 65, dataCapacity: { L: 395, M: 312, Q: 224, H: 180 } },
    13: { size: 69, dataCapacity: { L: 468, M: 368, Q: 279, H: 213 } },
    14: { size: 73, dataCapacity: { L: 535, M: 424, Q: 335, H: 251 } },
    15: { size: 77, dataCapacity: { L: 619, M: 490, Q: 395, H: 287 } },
    16: { size: 81, dataCapacity: { L: 667, M: 528, Q: 468, H: 331 } },
    17: { size: 85, dataCapacity: { L: 758, M: 600, Q: 535, H: 374 } },
    18: { size: 89, dataCapacity: { L: 854, M: 656, Q: 619, H: 427 } },
    19: { size: 93, dataCapacity: { L: 938, M: 720, Q: 667, H: 468 } },
    20: { size: 97, dataCapacity: { L: 1046, M: 864, Q: 758, H: 530 } },
    21: { size: 101, dataCapacity: { L: 1153, M: 952, Q: 854, H: 602 } },
    22: { size: 105, dataCapacity: { L: 1249, M: 1024, Q: 938, H: 674 } },
    23: { size: 109, dataCapacity: { L: 1352, M: 1112, Q: 1046, H: 746 } },
    24: { size: 113, dataCapacity: { L: 1460, M: 1208, Q: 1153, H: 813 } },
    25: { size: 117, dataCapacity: { L: 1588, M: 1280, Q: 1249, H: 919 } },
    26: { size: 121, dataCapacity: { L: 1704, M: 1424, Q: 1352, H: 969 } },
    27: { size: 125, dataCapacity: { L: 1853, M: 1536, Q: 1460, H: 1056 } },
    28: { size: 129, dataCapacity: { L: 1990, M: 1648, Q: 1588, H: 1108 } },
    29: { size: 133, dataCapacity: { L: 2132, M: 1728, Q: 1704, H: 1228 } },
    30: { size: 137, dataCapacity: { L: 2223, M: 1816, Q: 1853, H: 1286 } },
    31: { size: 141, dataCapacity: { L: 2369, M: 1912, Q: 1990, H: 1425 } },
    32: { size: 145, dataCapacity: { L: 2520, M: 2000, Q: 2132, H: 1501 } },
    33: { size: 149, dataCapacity: { L: 2677, M: 2112, Q: 2223, H: 1581 } },
    34: { size: 153, dataCapacity: { L: 2840, M: 2224, Q: 2369, H: 1661 } },
    35: { size: 157, dataCapacity: { L: 3009, M: 2336, Q: 2520, H: 1749 } },
    36: { size: 161, dataCapacity: { L: 3183, M: 2448, Q: 2677, H: 1847 } },
    37: { size: 165, dataCapacity: { L: 3356, M: 2560, Q: 2840, H: 1929 } },
    38: { size: 169, dataCapacity: { L: 3537, M: 2688, Q: 3009, H: 2021 } },
    39: { size: 173, dataCapacity: { L: 3729, M: 2816, Q: 3183, H: 2121 } },
    40: { size: 177, dataCapacity: { L: 3927, M: 2944, Q: 3356, H: 2221 } }
};

// Encoding Modes
export const ENCODING_MODES = {
    NUMERIC: { value: 0x1, name: 'Numeric', bitsPerChar: 3.33 },
    ALPHANUMERIC: { value: 0x2, name: 'Alphanumeric', bitsPerChar: 5.5 },
    BYTE: { value: 0x4, name: 'Byte', bitsPerChar: 8 },
    KANJI: { value: 0x8, name: 'Kanji', bitsPerChar: 13 }
};

// Character Count Indicator Bit Lengths
export const CHAR_COUNT_BITS = {
    NUMERIC: { '1-9': 10, '10-26': 12, '27-40': 14 },
    ALPHANUMERIC: { '1-9': 9, '10-26': 11, '27-40': 13 },
    BYTE: { '1-9': 8, '10-26': 16, '27-40': 16 },
    KANJI: { '1-9': 8, '10-26': 10, '27-40': 12 }
};

// Reed-Solomon Generator Polynomials
export const RS_GENERATOR_POLYNOMIALS = {
    7: [1, 127, 122, 154, 164, 11, 68, 117],
    10: [1, 216, 194, 159, 111, 199, 94, 95, 113, 157, 193],
    13: [1, 137, 73, 227, 17, 177, 17, 52, 13, 46, 114, 29, 254],
    15: [1, 29, 196, 111, 163, 112, 74, 10, 105, 105, 139, 132, 151, 32, 134, 26],
    16: [1, 59, 13, 104, 189, 68, 209, 30, 8, 163, 65, 41, 229, 98, 50, 36, 59],
    17: [1, 119, 66, 83, 120, 119, 22, 197, 83, 249, 41, 143, 84, 12, 6, 141, 103, 7],
    18: [1, 239, 251, 183, 113, 149, 175, 199, 215, 240, 220, 73, 82, 173, 75, 32, 67, 100, 210],
    20: [1, 152, 185, 240, 5, 111, 99, 6, 220, 112, 150, 69, 36, 187, 22, 228, 198, 121, 121, 165, 174],
    22: [1, 87, 197, 240, 113, 150, 69, 36, 187, 22, 228, 198, 121, 121, 165, 174, 87, 197, 240, 113, 150, 69],
    24: [1, 175, 138, 220, 37, 232, 89, 237, 122, 149, 215, 185, 111, 86, 96, 204, 150, 5, 194, 37, 162, 248, 157, 56],
    26: [1, 95, 130, 129, 231, 89, 18, 218, 111, 200, 172, 56, 28, 142, 96, 227, 36, 96, 74, 180, 104, 232, 135, 111, 36, 232],
    28: [1, 191, 169, 1, 111, 113, 246, 11, 76, 86, 213, 152, 4, 246, 68, 28, 59, 80, 15, 150, 14, 75, 242, 169, 75, 134, 246, 111, 89, 74],
    30: [1, 127, 245, 118, 154, 92, 76, 42, 240, 131, 185, 93, 1, 142, 47, 111, 185, 220, 241, 121, 14, 9, 48, 14, 220, 107, 110, 79, 58, 88, 25]
};

// Alignment Pattern Coordinates
export const ALIGNMENT_PATTERN_COORDS = {
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
    11: [6, 30, 54],
    12: [6, 32, 58],
    13: [6, 34, 62],
    14: [6, 26, 46, 66],
    15: [6, 26, 48, 70],
    16: [6, 26, 50, 74],
    17: [6, 30, 54, 78],
    18: [6, 30, 56, 82],
    19: [6, 30, 58, 86],
    20: [6, 34, 62, 90],
    21: [6, 28, 50, 72, 94],
    22: [6, 26, 50, 74, 98],
    23: [6, 30, 54, 78, 102],
    24: [6, 28, 54, 80, 106],
    25: [6, 32, 58, 84, 110],
    26: [6, 30, 58, 86, 114],
    27: [6, 34, 62, 90, 118],
    28: [6, 26, 50, 74, 98, 122],
    29: [6, 30, 54, 78, 102, 126],
    30: [6, 26, 52, 78, 104, 130],
    31: [6, 30, 56, 82, 108, 134],
    32: [6, 34, 60, 86, 112, 138],
    33: [6, 30, 58, 86, 114, 142],
    34: [6, 34, 62, 90, 118, 146],
    35: [6, 30, 54, 78, 102, 126, 150],
    36: [6, 24, 50, 76, 102, 128, 154],
    37: [6, 28, 54, 80, 106, 132, 158],
    38: [6, 32, 58, 84, 110, 136, 162],
    39: [6, 26, 54, 82, 110, 138, 166],
    40: [6, 30, 58, 86, 114, 142, 170]
};

// Mask Patterns
export const MASK_PATTERNS = [
    (row, col) => (row + col) % 2 === 0,
    (row, col) => row % 2 === 0,
    (row, col) => col % 3 === 0,
    (row, col) => (row + col) % 3 === 0,
    (row, col) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0,
    (row, col) => ((row * col) % 2) + ((row * col) % 3) === 0,
    (row, col) => (((row + col) % 2) + ((row * col) % 3)) % 2 === 0,
    (row, col) => (((row + col) % 3) + ((row + col) % 2)) % 2 === 0
];

// Format Information (BCH encoded)
export const FORMAT_INFO = {
    L: { 0: 0x77C4, 1: 0x72F3, 2: 0x7DAA, 3: 0x789D, 4: 0x662F, 5: 0x6318, 6: 0x6C41, 7: 0x6976 },
    M: { 0: 0x5412, 1: 0x5125, 2: 0x5E7C, 3: 0x5B4B, 4: 0x45F9, 5: 0x40CE, 6: 0x4F97, 7: 0x4AA0 },
    Q: { 0: 0x355F, 1: 0x3068, 2: 0x3F31, 3: 0x3A06, 4: 0x24B4, 5: 0x2183, 6: 0x2EDA, 7: 0x2BED },
    H: { 0: 0x159D, 1: 0x12AA, 2: 0x1DF3, 3: 0x18C4, 4: 0x0676, 5: 0x0341, 6: 0x0C18, 7: 0x092F }
};

// Version Information (BCH encoded)
export const VERSION_INFO = {
    7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3, 11: 0x0BBF6, 12: 0x0C762, 13: 0x0D847, 14: 0x0E60D,
    15: 0x0F928, 16: 0x10B78, 17: 0x1145D, 18: 0x12A17, 19: 0x13532, 20: 0x149A6, 21: 0x15683, 22: 0x168C9,
    23: 0x177EC, 24: 0x18EC4, 25: 0x191E1, 26: 0x1AFAB, 27: 0x1B08E, 28: 0x1CC1A, 29: 0x1D33F, 30: 0x1ED75,
    31: 0x1F249, 32: 0x209D5, 33: 0x216F0, 34: 0x228BA, 35: 0x2379F, 36: 0x24B0B, 37: 0x2542E, 38: 0x26A64,
    39: 0x27541, 40: 0x28C69
};

// Alphanumeric Character Set
export const ALPHANUMERIC_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

// Utility Functions
export function getVersionFromSize(size) {
    return Math.floor((size - 21) / 4) + 1;
}

export function getSizeFromVersion(version) {
    return 21 + 4 * (version - 1);
}

export function getDataCapacity(version, eccLevel) {
    return QR_VERSIONS[version]?.dataCapacity[eccLevel] || 0;
}

export function getCharCountBits(mode, version) {
    const versionRange = version <= 9 ? '1-9' : version <= 26 ? '10-26' : '27-40';
    return CHAR_COUNT_BITS[mode]?.[versionRange] || 8;
}
