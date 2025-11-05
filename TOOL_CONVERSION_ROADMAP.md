# Tool Conversion Roadmap
## Converting All Tools from Modal to Separate Pages

### ✅ **Completed**
1. ✅ Smart Calculator → `/tools/calculator.html`

### 🔄 **In Progress**
2. 🔄 Study Timer & Pomodoro → `/tools/study-timer.html` (Next)

### 📋 **Remaining Tools** (In Suggested Order)

#### **Student Tools (9 remaining)**
3. Note-Taking & Summarizer → `/tools/note-taker.html`
4. Math Problem Solver → `/tools/math-solver.html`
5. Grade Calculator → `/tools/grade-calculator.html`
6. Citation Generator → `/tools/citation-generator.html`
7. Study Planner & Schedule → `/tools/study-planner.html`
8. Flashcard Generator → `/tools/flashcard-generator.html`
9. Progress Tracker & Analytics → `/tools/progress-tracker.html`
10. Age Calculator → `/tools/age-calculator.html`
11. BMI Calculator → `/tools/bmi-calculator.html`

#### **Professional Tools (9 tools)**
12. Professional Loan Calculator → `/tools/loan-calculator.html`
13. Investment Calculator → `/tools/investment-calculator.html`
14. Tax Calculator → `/tools/tax-calculator.html`
15. Business Metrics Calculator → `/tools/business-metrics.html`
16. Currency Converter → `/tools/currency-converter.html`
17. Retirement Planning Calculator → `/tools/retirement-calculator.html`
18. Mortgage Calculator → `/tools/mortgage-calculator.html`
19. Budget Planner → `/tools/budget-planner.html`
20. Salary Calculator → `/tools/salary-calculator.html`

#### **Developer Tools (10 tools)**
21. JSON Formatter & Validator → `/tools/json-formatter.html`
22. XML Formatter & Validator → `/tools/xml-formatter.html`
23. Base64 Encoder/Decoder → `/tools/base64-encoder.html`
24. Hash Generator → `/tools/hash-generator.html`
25. URL Encoder/Decoder → `/tools/url-encoder.html`
26. Regular Expression Tester → `/tools/regex-tester.html`
27. CSS/JS Minifier → `/tools/css-js-minifier.html`
28. Color Palette Generator → `/tools/color-palette.html`
29. Lorem Ipsum Generator → `/tools/lorem-ipsum.html`
30. Timestamp Converter → `/tools/timestamp-converter.html`

#### **PDF Tools (5 tools)**
31. PDF Password Remover → `/tools/pdf-password-remover.html`
32. PDF Merger → `/tools/pdf-merger.html`
33. PDF Splitter → `/tools/pdf-splitter.html`
34. PDF Encryptor → `/tools/pdf-encryptor.html`
35. PDF to Images → `/tools/pdf-to-images.html`

#### **Image Tools (4 tools)**
36. Image to PDF → `/tools/image-to-pdf.html`
37. Image Compressor → `/tools/image-compressor.html`
38. Image Format Converter → `/tools/image-converter.html`
39. Image Resizer → `/tools/image-resizer.html`

#### **Utility Tools (2 tools)**
40. Digital Signature Generator → `/tools/signature-generator.html`
41. CSV to JSON Converter → `/tools/csv-json-converter.html`

---

## Conversion Process (Per Tool)

For each tool, we will:

1. **Create Tool Page** (`/tools/{tool-name}.html`)
   - Copy structure from `calculator.html`
   - Include header/footer templates
   - Add tool-specific content

2. **Extract Modal Content**
   - Find modal HTML in `index.html`
   - Move to tool page main content area
   - Update styling as needed

3. **Extract JavaScript**
   - Find tool-specific JavaScript functions
   - Move to tool page or separate JS file
   - Ensure all dependencies are included

4. **Update Homepage Links**
   - Change `onclick="openModal('tool-modal')"` → `href="/tools/tool.html"`
   - Update tool card buttons
   - Update navigation links

5. **Test Functionality**
   - Verify tool works on separate page
   - Check header/footer/widgets load correctly
   - Test mobile responsiveness
   - Verify share functionality

---

## Current Status
- **Total Tools:** 41
- **Completed:** 1 (Smart Calculator)
- **In Progress:** 1 (Study Timer)
- **Remaining:** 39


