# ECE Advanced GPA & CGPA Calculator (Reg 2021)

A modern web application for calculating semester-wise GPA and cumulative CGPA for ECE students following the 2021 regulation curriculum.

## Features

- **Live GPA Calculation** - Semester GPAs update instantly as you select grades
- **CGPA Computation** - Calculate final CGPA using complete or partial semesters
- **Auto-save** - Progress automatically saved to browser LocalStorage
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Regulation 2021 Compliant** - Pre-loaded with all ECE subjects across 8 semesters

## Getting Started

1. Save the HTML file as `ece-gpa-calculator.html`
2. Open in any modern web browser
3. Select semester range (1-8)
4. Enter grades for each subject
5. Click "Calculate Final CGPA" when ready

No installation or dependencies required!

## Grade Points

| Grade | Points |
|-------|--------|
| O     | 10     |
| A+    | 9      |
| A     | 8      |
| B+    | 7      |
| B     | 6      |
| C     | 5      |
| RA    | 0      |
| U/A   | 0      |

## Status Indicators

- **Complete** - All subjects graded
- **Partial** - Some subjects graded
- **No grades** - No grades entered

## Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S` - Save progress

## Formulas

**GPA**: `Σ(Grade Point × Credit) / Σ(Credits)`  
**CGPA**: `Σ(All Semester Points) / Σ(All Credits)`

## Subject Coverage

- **Semester 1**: 7 subjects (19 credits)
- **Semester 2**: 6 subjects (16 credits)
- **Semester 3**: 6 subjects (16 credits)
- **Semester 4**: 8 subjects (25 credits)
- **Semester 5**: 6 subjects (16 credits)
- **Semester 6**: 5 subjects (15 credits)
- **Semester 7**: 6 subjects (15 credits)
- **Semester 8**: 1 subject (10 credits)

## Data Storage

All data is stored locally in your browser using LocalStorage. No data is sent to any server. Data persists until you clear browser data or use the "Clear All" button.

## Browser Compatibility

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Troubleshooting

**Data not saving?** Ensure you're not in Incognito mode and LocalStorage is enabled.  
**Wrong calculations?** Verify all grades are entered correctly using the proper grade scale.  
**Dark mode not working?** Check that JavaScript is enabled in your browser.

## License

Free to use for educational purposes.

---

**Version**: 1.0  
**Regulation**: Anna University 2021