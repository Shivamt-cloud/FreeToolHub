/**
 * Citation Generator
 * Advanced citation generation for multiple formats and source types
 */
class CitationGenerator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.citationFormats = {
            'apa': {
                name: 'APA (American Psychological Association)',
                version: '7th Edition',
                description: 'Used in psychology, education, and social sciences'
            },
            'mla': {
                name: 'MLA (Modern Language Association)',
                version: '9th Edition',
                description: 'Used in literature, arts, and humanities'
            },
            'chicago': {
                name: 'Chicago Manual of Style',
                version: '17th Edition',
                description: 'Used in history, literature, and arts'
            },
            'harvard': {
                name: 'Harvard Referencing',
                version: 'Latest',
                description: 'Used in business, law, and social sciences'
            },
            'ieee': {
                name: 'IEEE (Institute of Electrical and Electronics Engineers)',
                version: 'Latest',
                description: 'Used in engineering and computer science'
            },
            'vancouver': {
                name: 'Vancouver Style',
                version: 'Latest',
                description: 'Used in medical and scientific fields'
            }
        };
        
        this.sourceTypes = {
            'book': {
                name: 'Book',
                fields: ['author', 'title', 'publisher', 'year', 'city', 'pages', 'edition', 'isbn'],
                required: ['author', 'title', 'publisher', 'year']
            },
            'journal': {
                name: 'Journal Article',
                fields: ['author', 'title', 'journal', 'volume', 'issue', 'pages', 'year', 'doi'],
                required: ['author', 'title', 'journal', 'year']
            },
            'website': {
                name: 'Website',
                fields: ['author', 'title', 'website', 'url', 'date', 'accessDate'],
                required: ['title', 'website', 'url']
            },
            'newspaper': {
                name: 'Newspaper Article',
                fields: ['author', 'title', 'newspaper', 'date', 'pages', 'url'],
                required: ['title', 'newspaper', 'date']
            },
            'conference': {
                name: 'Conference Paper',
                fields: ['author', 'title', 'conference', 'location', 'date', 'pages', 'publisher'],
                required: ['author', 'title', 'conference', 'date']
            },
            'thesis': {
                name: 'Thesis/Dissertation',
                fields: ['author', 'title', 'degree', 'university', 'year', 'pages'],
                required: ['author', 'title', 'degree', 'university', 'year']
            },
            'video': {
                name: 'Video/YouTube',
                fields: ['author', 'title', 'platform', 'url', 'date', 'duration'],
                required: ['title', 'platform', 'url']
            },
            'podcast': {
                name: 'Podcast',
                fields: ['author', 'title', 'podcast', 'episode', 'date', 'url'],
                required: ['title', 'podcast', 'date']
            }
        };
        
        this.citations = [];
    }

    /**
     * Generate citation
     */
    generateCitation(sourceData, format = 'apa') {
        try {
            if (!sourceData || !sourceData.type) {
                throw new Error('Source data and type are required');
            }

            const sourceType = this.sourceTypes[sourceData.type];
            if (!sourceType) {
                throw new Error('Invalid source type');
            }

            const formatInfo = this.citationFormats[format];
            if (!formatInfo) {
                throw new Error('Invalid citation format');
            }

            // Validate required fields
            const missingFields = this.validateRequiredFields(sourceData, sourceType);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            let citation = '';
            switch (format) {
                case 'apa':
                    citation = this.generateAPACitation(sourceData);
                    break;
                case 'mla':
                    citation = this.generateMLACitation(sourceData);
                    break;
                case 'chicago':
                    citation = this.generateChicagoCitation(sourceData);
                    break;
                case 'harvard':
                    citation = this.generateHarvardCitation(sourceData);
                    break;
                case 'ieee':
                    citation = this.generateIEEECitation(sourceData);
                    break;
                case 'vancouver':
                    citation = this.generateVancouverCitation(sourceData);
                    break;
                default:
                    throw new Error('Unsupported citation format');
            }

            const result = {
                success: true,
                citation: citation,
                format: format,
                sourceType: sourceData.type,
                formatInfo: formatInfo,
                sourceData: sourceData,
                message: `Citation generated successfully in ${formatInfo.name} format`
            };

            this.citations.push(result);
            this.addToHistory('generate_citation', { sourceData, format }, result);
            
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate APA citation
     */
    generateAPACitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateAPABook(sourceData);
            case 'journal':
                return this.generateAPAJournal(sourceData);
            case 'website':
                return this.generateAPAWebsite(sourceData);
            case 'newspaper':
                return this.generateAPANewspaper(sourceData);
            case 'conference':
                return this.generateAPAConference(sourceData);
            case 'thesis':
                return this.generateAPAThesis(sourceData);
            case 'video':
                return this.generateAPAVideo(sourceData);
            case 'podcast':
                return this.generateAPAPodcast(sourceData);
            default:
                throw new Error('Unsupported source type for APA format');
        }
    }

    /**
     * Generate APA Book citation
     */
    generateAPABook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatAPAAuthor(author);
        citation += ` (${year}). `;
        citation += `<em>${this.formatTitle(title)}</em>`;
        
        if (edition) {
            citation += ` (${edition} ed.)`;
        }
        
        citation += `. ${publisher}`;
        
        if (city) {
            citation += `, ${city}`;
        }
        
        if (isbn) {
            citation += `. ISBN: ${isbn}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate APA Journal citation
     */
    generateAPAJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatAPAAuthor(author);
        citation += ` (${year}). `;
        citation += `${this.formatTitle(title)}. `;
        citation += `<em>${journal}</em>`;
        
        if (volume) {
            citation += `, ${volume}`;
        }
        
        if (issue) {
            citation += `(${issue})`;
        }
        
        if (pages) {
            citation += `, ${pages}`;
        }
        
        if (doi) {
            citation += `. https://doi.org/${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate APA Website citation
     */
    generateAPAWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatAPAAuthor(author) + ' ';
        }
        
        citation += `(${date || 'n.d.'}). `;
        citation += `${this.formatTitle(title)}. `;
        citation += `<em>${website}</em>. `;
        citation += `Retrieved ${accessDate || 'n.d.'}, from ${url}`;
        
        return citation + '.';
    }

    /**
     * Generate MLA citation
     */
    generateMLACitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateMLABook(sourceData);
            case 'journal':
                return this.generateMLAJournal(sourceData);
            case 'website':
                return this.generateMLAWebsite(sourceData);
            case 'newspaper':
                return this.generateMLANewspaper(sourceData);
            case 'conference':
                return this.generateMLAConference(sourceData);
            case 'thesis':
                return this.generateMLAThesis(sourceData);
            case 'video':
                return this.generateMLAVideo(sourceData);
            case 'podcast':
                return this.generateMLAPodcast(sourceData);
            default:
                throw new Error('Unsupported source type for MLA format');
        }
    }

    /**
     * Generate MLA Book citation
     */
    generateMLABook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatMLAAuthor(author);
        citation += `. <em>${this.formatTitle(title)}</em>`;
        
        if (edition) {
            citation += `. ${edition} ed.`;
        }
        
        citation += `, ${publisher}`;
        
        if (city) {
            citation += `, ${city}`;
        }
        
        citation += `, ${year}`;
        
        if (pages) {
            citation += `, pp. ${pages}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate MLA Journal citation
     */
    generateMLAJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatMLAAuthor(author);
        citation += `. "${this.formatTitle(title)}." `;
        citation += `<em>${journal}</em>`;
        
        if (volume) {
            citation += `, vol. ${volume}`;
        }
        
        if (issue) {
            citation += `, no. ${issue}`;
        }
        
        citation += `, ${year}`;
        
        if (pages) {
            citation += `, pp. ${pages}`;
        }
        
        if (doi) {
            citation += `, doi:${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate MLA Website citation
     */
    generateMLAWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatMLAAuthor(author) + '. ';
        }
        
        citation += `"${this.formatTitle(title)}." `;
        citation += `<em>${website}</em>`;
        
        if (date) {
            citation += `, ${date}`;
        }
        
        citation += `, ${url}`;
        
        if (accessDate) {
            citation += `. Accessed ${accessDate}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Chicago citation
     */
    generateChicagoCitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateChicagoBook(sourceData);
            case 'journal':
                return this.generateChicagoJournal(sourceData);
            case 'website':
                return this.generateChicagoWebsite(sourceData);
            case 'newspaper':
                return this.generateChicagoNewspaper(sourceData);
            case 'conference':
                return this.generateChicagoConference(sourceData);
            case 'thesis':
                return this.generateChicagoThesis(sourceData);
            case 'video':
                return this.generateChicagoVideo(sourceData);
            case 'podcast':
                return this.generateChicagoPodcast(sourceData);
            default:
                throw new Error('Unsupported source type for Chicago format');
        }
    }

    /**
     * Generate Chicago Book citation
     */
    generateChicagoBook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatChicagoAuthor(author);
        citation += `. <em>${this.formatTitle(title)}</em>`;
        
        if (edition) {
            citation += `. ${edition} ed.`;
        }
        
        citation += `. ${city}: ${publisher}, ${year}`;
        
        if (pages) {
            citation += `. ${pages}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Chicago Journal citation
     */
    generateChicagoJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatChicagoAuthor(author);
        citation += `. "${this.formatTitle(title)}." `;
        citation += `<em>${journal}</em>`;
        
        if (volume) {
            citation += ` ${volume}`;
        }
        
        if (issue) {
            citation += `, no. ${issue}`;
        }
        
        citation += ` (${year})`;
        
        if (pages) {
            citation += `: ${pages}`;
        }
        
        if (doi) {
            citation += `. https://doi.org/${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Chicago Website citation
     */
    generateChicagoWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatChicagoAuthor(author) + '. ';
        }
        
        citation += `"${this.formatTitle(title)}." `;
        citation += `<em>${website}</em>`;
        
        if (date) {
            citation += `. ${date}`;
        }
        
        citation += `. ${url}`;
        
        if (accessDate) {
            citation += ` (accessed ${accessDate})`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Harvard citation
     */
    generateHarvardCitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateHarvardBook(sourceData);
            case 'journal':
                return this.generateHarvardJournal(sourceData);
            case 'website':
                return this.generateHarvardWebsite(sourceData);
            case 'newspaper':
                return this.generateHarvardNewspaper(sourceData);
            case 'conference':
                return this.generateHarvardConference(sourceData);
            case 'thesis':
                return this.generateHarvardThesis(sourceData);
            case 'video':
                return this.generateHarvardVideo(sourceData);
            case 'podcast':
                return this.generateHarvardPodcast(sourceData);
            default:
                throw new Error('Unsupported source type for Harvard format');
        }
    }

    /**
     * Generate Harvard Book citation
     */
    generateHarvardBook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatHarvardAuthor(author);
        citation += ` (${year}) `;
        citation += `<em>${this.formatTitle(title)}</em>`;
        
        if (edition) {
            citation += `, ${edition} edn`;
        }
        
        citation += `. ${city}: ${publisher}`;
        
        if (pages) {
            citation += `, pp. ${pages}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Harvard Journal citation
     */
    generateHarvardJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatHarvardAuthor(author);
        citation += ` (${year}) `;
        citation += `"${this.formatTitle(title)}", `;
        citation += `<em>${journal}</em>`;
        
        if (volume) {
            citation += `, ${volume}`;
        }
        
        if (issue) {
            citation += `(${issue})`;
        }
        
        if (pages) {
            citation += `, pp. ${pages}`;
        }
        
        if (doi) {
            citation += `. Available at: https://doi.org/${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Harvard Website citation
     */
    generateHarvardWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatHarvardAuthor(author) + ' ';
        }
        
        citation += `(${date || 'n.d.'}) `;
        citation += `"${this.formatTitle(title)}", `;
        citation += `<em>${website}</em>`;
        citation += `. Available at: ${url}`;
        
        if (accessDate) {
            citation += ` (accessed ${accessDate})`;
        }
        
        return citation + '.';
    }

    /**
     * Generate IEEE citation
     */
    generateIEEECitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateIEEEBook(sourceData);
            case 'journal':
                return this.generateIEEEJournal(sourceData);
            case 'website':
                return this.generateIEEEWebsite(sourceData);
            case 'conference':
                return this.generateIEEEConference(sourceData);
            default:
                throw new Error('Unsupported source type for IEEE format');
        }
    }

    /**
     * Generate IEEE Book citation
     */
    generateIEEEBook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatIEEEAuthor(author);
        citation += `, <em>${this.formatTitle(title)}</em>`;
        
        if (edition) {
            citation += `, ${edition} ed.`;
        }
        
        citation += `. ${city}: ${publisher}, ${year}`;
        
        if (pages) {
            citation += `, pp. ${pages}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate IEEE Journal citation
     */
    generateIEEEJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatIEEEAuthor(author);
        citation += `, "${this.formatTitle(title)}," `;
        citation += `<em>${journal}</em>`;
        
        if (volume) {
            citation += `, vol. ${volume}`;
        }
        
        if (issue) {
            citation += `, no. ${issue}`;
        }
        
        citation += `, pp. ${pages}, ${year}`;
        
        if (doi) {
            citation += `. doi: ${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate IEEE Website citation
     */
    generateIEEEWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatIEEEAuthor(author) + ', ';
        }
        
        citation += `"${this.formatTitle(title)}," `;
        citation += `<em>${website}</em>`;
        
        if (date) {
            citation += `, ${date}`;
        }
        
        citation += `. [Online]. Available: ${url}`;
        
        if (accessDate) {
            citation += ` [Accessed ${accessDate}]`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Vancouver citation
     */
    generateVancouverCitation(sourceData) {
        const { type } = sourceData;
        
        switch (type) {
            case 'book':
                return this.generateVancouverBook(sourceData);
            case 'journal':
                return this.generateVancouverJournal(sourceData);
            case 'website':
                return this.generateVancouverWebsite(sourceData);
            case 'newspaper':
                return this.generateVancouverNewspaper(sourceData);
            case 'conference':
                return this.generateVancouverConference(sourceData);
            case 'thesis':
                return this.generateVancouverThesis(sourceData);
            case 'video':
                return this.generateVancouverVideo(sourceData);
            case 'podcast':
                return this.generateVancouverPodcast(sourceData);
            default:
                throw new Error('Unsupported source type for Vancouver format');
        }
    }

    /**
     * Generate Vancouver Book citation
     */
    generateVancouverBook(sourceData) {
        const { author, title, publisher, year, city, pages, edition, isbn } = sourceData;
        
        let citation = this.formatVancouverAuthor(author);
        citation += `. ${this.formatTitle(title)}`;
        
        if (edition) {
            citation += `. ${edition} ed.`;
        }
        
        citation += `. ${city}: ${publisher}; ${year}`;
        
        if (pages) {
            citation += `. ${pages} p.`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Vancouver Journal citation
     */
    generateVancouverJournal(sourceData) {
        const { author, title, journal, volume, issue, pages, year, doi } = sourceData;
        
        let citation = this.formatVancouverAuthor(author);
        citation += `. ${this.formatTitle(title)}. `;
        citation += `${journal}`;
        
        if (volume) {
            citation += `. ${year};${volume}`;
        }
        
        if (issue) {
            citation += `(${issue})`;
        }
        
        if (pages) {
            citation += `:${pages}`;
        }
        
        if (doi) {
            citation += `. doi: ${doi}`;
        }
        
        return citation + '.';
    }

    /**
     * Generate Vancouver Website citation
     */
    generateVancouverWebsite(sourceData) {
        const { author, title, website, url, date, accessDate } = sourceData;
        
        let citation = '';
        if (author) {
            citation += this.formatVancouverAuthor(author) + '. ';
        }
        
        citation += `${this.formatTitle(title)}. `;
        citation += `${website}`;
        
        if (date) {
            citation += `. ${date}`;
        }
        
        citation += `. Available from: ${url}`;
        
        if (accessDate) {
            citation += ` [cited ${accessDate}]`;
        }
        
        return citation + '.';
    }

    /**
     * Format author for APA
     */
    formatAPAAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]} & ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]}, & ${authors[2]}`;
        }
    }

    /**
     * Format author for MLA
     */
    formatMLAAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]} and ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
        }
    }

    /**
     * Format author for Chicago
     */
    formatChicagoAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]} and ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
        }
    }

    /**
     * Format author for Harvard
     */
    formatHarvardAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]} and ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]} and ${authors[2]}`;
        }
    }

    /**
     * Format author for IEEE
     */
    formatIEEEAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]} and ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
        }
    }

    /**
     * Format author for Vancouver
     */
    formatVancouverAuthor(author) {
        if (!author) return '';
        
        const authors = author.split(',').map(a => a.trim());
        
        if (authors.length === 1) {
            return authors[0];
        } else if (authors.length === 2) {
            return `${authors[0]}, ${authors[1]}`;
        } else {
            return `${authors[0]}, ${authors[1]}, ${authors[2]}`;
        }
    }

    /**
     * Format title
     */
    formatTitle(title) {
        if (!title) return '';
        
        // Capitalize first letter of each word
        return title.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    /**
     * Validate required fields
     */
    validateRequiredFields(sourceData, sourceType) {
        const missingFields = [];
        
        sourceType.required.forEach(field => {
            if (!sourceData[field] || sourceData[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        return missingFields;
    }

    /**
     * Get citation formats
     */
    getCitationFormats() {
        return this.citationFormats;
    }

    /**
     * Get source types
     */
    getSourceTypes() {
        return this.sourceTypes;
    }

    /**
     * Get source type fields
     */
    getSourceTypeFields(sourceType) {
        return this.sourceTypes[sourceType] || null;
    }

    /**
     * Get citations
     */
    getCitations() {
        return this.citations;
    }

    /**
     * Clear citations
     */
    clearCitations() {
        this.citations = [];
    }

    /**
     * Export citations
     */
    exportCitations(format = 'json') {
        const data = {
            citations: this.citations,
            exportDate: new Date().toISOString(),
            totalCitations: this.citations.length
        };

        if (format === 'csv') {
            return this.exportToCSV(data);
        } else {
            return {
                success: true,
                data: data,
                format: format
            };
        }
    }

    /**
     * Export to CSV
     */
    exportToCSV(data) {
        const headers = ['Format', 'Source Type', 'Citation', 'Author', 'Title', 'Year'];
        const rows = data.citations.map(citation => [
            citation.format,
            citation.sourceType,
            citation.citation,
            citation.sourceData.author || '',
            citation.sourceData.title || '',
            citation.sourceData.year || ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return {
            success: true,
            content: csvContent,
            format: 'csv'
        };
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
            this.history.shift();
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
        this.citations = [];
    }
}
