#!/usr/bin/env python3
"""
Generate Test Report Addendum for Selenium Automation Testing
Includes HTML Test Report and Test Suite Details
"""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os


def set_cell_border(cell, **kwargs):
    tc = cell._element
    tcPr = tc.get_or_add_tcPr()
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        if edge in kwargs:
            edge_data = kwargs.get(edge)
            if edge_data:
                tag = "w:{}".format(edge)
                element = OxmlElement(tag)
                for key in ["sz", "val", "color", "space"]:
                    if key in edge_data:
                        element.set(qn("w:{}".format(key)), str(edge_data[key]))
                tcPr.append(element)


def add_header_table(doc):
    table = doc.add_table(rows=5, cols=2)
    table.style = "Table Grid"
    for row in table.rows:
        row.cells[0].width = Inches(1.5)
        row.cells[1].width = Inches(4.5)
    data = [
        ("Name:", "Manas C Bavaskar"),
        ("Roll No.:", "221080004"),
        ("Batch:", "A"),
        ("Year:", "Final Year I.T."),
        ("Lab:", "Software Testing Lab"),
    ]
    for i, (label, value) in enumerate(data):
        cell_label = table.rows[i].cells[0]
        cell_value = table.rows[i].cells[1]
        cell_label.text = label
        cell_value.text = value
        for paragraph in cell_label.paragraphs:
            for run in paragraph.runs:
                run.font.bold = True
                run.font.size = Pt(12)
                run.font.color.rgb = RGBColor(0, 0, 0)
        for paragraph in cell_value.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(12)
                run.font.color.rgb = RGBColor(0, 0, 0)
        for cell in table.rows[i].cells:
            set_cell_border(
                cell,
                top={"sz": 6, "val": "single", "color": "000000"},
                bottom={"sz": 6, "val": "single", "color": "000000"},
                left={"sz": 6, "val": "single", "color": "000000"},
                right={"sz": 6, "val": "single", "color": "000000"},
            )
    doc.add_paragraph()


def add_heading_custom(doc, text, level=2):
    heading = doc.add_heading(level=level)
    run = heading.add_run(text)
    run.font.size = Pt(14) if level == 2 else Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)


def add_normal_text(doc, text, bold=False):
    para = doc.add_paragraph()
    run = para.add_run(text)
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0, 0, 0)
    if bold:
        run.font.bold = True
    return para


def main():
    doc = Document()
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Header
    add_header_table(doc)

    # Title
    title = doc.add_heading(
        "Test Report Addendum: Professional Selenium Test Suite", level=1
    )
    for run in title.runs:
        run.font.color.rgb = RGBColor(0, 0, 0)
        run.font.size = Pt(16)
        run.font.bold = True
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph()

    # Test Suite Overview
    add_heading_custom(doc, "Professional Test Suite Overview")
    add_normal_text(
        doc,
        "I created a comprehensive professional test suite using Python's unittest framework with HTML reporting capabilities. The test suite includes 15 test cases covering all major functionalities of the EventFlow application.",
    )
    doc.add_paragraph()

    # Test Framework Details
    add_heading_custom(doc, "Test Framework and Tools")
    framework_details = [
        "Testing Framework: Python unittest with TestCase classes",
        "HTML Reporting: html-testRunner 1.2.1 with Jinja2 templating",
        "WebDriver: Selenium WebDriver 4.41.0 with ChromeDriver Manager",
        "Test Structure: Class-based test suite with setUpClass/tearDownClass",
        "Screenshot Capture: Automated screenshot capture for each test case",
        "Report Generation: Auto-generated HTML reports with pass/fail status",
    ]
    for detail in framework_details:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(detail)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # Test Cases
    add_heading_custom(doc, "Test Case Details (15 Total)")
    test_cases = [
        ("TC_001", "Homepage Loading", "Verify homepage loads with all key elements"),
        (
            "TC_002",
            "Navigation Elements",
            "Verify navigation menu contains required links",
        ),
        ("TC_003", "Sign In Page", "Verify Sign In page loads with form elements"),
        (
            "TC_004",
            "Sign In Form Interaction",
            "Verify Sign In form accepts user input",
        ),
        ("TC_005", "Sign Up Page", "Verify Sign Up page loads correctly"),
        ("TC_006", "Contact Page", "Verify Contact page loads with form elements"),
        ("TC_007", "Contact Form Submission", "Verify Contact form accepts all data"),
        ("TC_008", "Features Page", "Verify Features page loads correctly"),
        ("TC_009", "Pricing Page", "Verify Pricing page loads with pricing info"),
        ("TC_010", "About Page", "Verify About page loads correctly"),
        ("TC_011", "Responsive Mobile", "Verify responsive design on mobile viewport"),
        ("TC_012", "Responsive Tablet", "Verify responsive design on tablet viewport"),
        ("TC_013", "Page Performance", "Verify pages load within acceptable time"),
        (
            "TC_014",
            "Landing Page Elements",
            "Verify landing page has interactive elements",
        ),
        (
            "TC_015",
            "Authentication Redirect",
            "Verify protected routes redirect to sign in",
        ),
    ]

    # Create table for test cases
    table = doc.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Test ID"
    hdr_cells[1].text = "Test Name"
    hdr_cells[2].text = "Description"

    for tc_id, tc_name, tc_desc in test_cases:
        row_cells = table.add_row().cells
        row_cells[0].text = tc_id
        row_cells[1].text = tc_name
        row_cells[2].text = tc_desc
        for cell in row_cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(11)
                    run.font.color.rgb = RGBColor(0, 0, 0)

    doc.add_paragraph()

    # Test Results Summary
    add_heading_custom(doc, "Test Execution Results")
    add_normal_text(
        doc,
        "All 15 test cases were executed successfully with a 100% pass rate. The complete test suite ran in 58.97 seconds.",
    )
    doc.add_paragraph()

    results_summary = [
        "Total Test Cases: 15",
        "Passed: 15 (100%)",
        "Failed: 0",
        "Skipped: 0",
        "Execution Time: 58.97 seconds",
        "Browser: Google Chrome 145.0.7632.116 (Headless)",
        "Start Time: 2026-02-27 23:06:14",
    ]
    for result in results_summary:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(result)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # HTML Test Report
    add_heading_custom(doc, "Selenium HTML Test Report")
    add_normal_text(
        doc,
        "The HTML Test Report was automatically generated by html-testRunner after test execution. It provides a comprehensive overview of all test cases with their execution status, duration, and detailed information. Below is a screenshot of the generated HTML report showing all 15 test cases with 'Pass' status.",
    )
    doc.add_paragraph()

    # Add report screenshot
    try:
        doc.add_picture("selenium_html_report_top.png", width=Inches(5.8))
        last_paragraph = doc.paragraphs[-1]
        last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_paragraph()

        caption = doc.add_paragraph()
        caption_run = caption.add_run(
            "Figure 1: Selenium HTML Test Report showing all 15 test cases passed"
        )
        caption_run.font.size = Pt(10)
        caption_run.italic = True
        caption_run.font.color.rgb = RGBColor(0, 0, 0)
        caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    except Exception as e:
        add_normal_text(doc, "[HTML Test Report Screenshot]")

    doc.add_paragraph()

    # Test Artifacts
    add_heading_custom(doc, "Generated Test Artifacts")
    artifacts = [
        "HTML Test Report: test_reports/EventFlow_TestReport.html",
        "Test Summary Text: test_reports/TEST_SUMMARY.txt",
        "Test Screenshots: test_reports/screenshots/ (15 screenshots)",
        "Individual test screenshots for each TC_001 to TC_015",
    ]
    for artifact in artifacts:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(artifact)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # Key Features of Test Suite
    add_heading_custom(doc, "Professional Test Suite Features")
    features = [
        "Automated Screenshot Capture: Each test case automatically captures a screenshot upon completion",
        "HTML Report Generation: Professional HTML reports with green/red pass/fail indicators",
        "Test Case Documentation: Every test has a docstring describing its purpose and verification points",
        "Assertion-Based Verification: Tests use unittest assertions for reliable pass/fail determination",
        "Setup and Teardown: Proper setUpClass and tearDownClass methods for WebDriver management",
        "Error Handling: Graceful handling of test failures with screenshot capture",
        "Test Categorization: Tests organized by functionality (Auth, Forms, Responsive, Performance)",
        "Performance Metrics: Page load time measurements with configurable thresholds",
    ]
    for feature in features:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(feature)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # Conclusion
    add_heading_custom(doc, "Conclusion")
    add_normal_text(
        doc,
        "This professional test suite demonstrates industry-standard automation testing practices using Selenium WebDriver. The HTML test report provides clear visibility into test execution results, making it suitable for QA documentation, CI/CD integration, and stakeholder reporting. All 15 test cases passed successfully, confirming that EventFlow's core functionalities work as expected.",
    )

    # Save document
    output_filename = "Experiment_01_Test_Report_Addendum.docx"
    doc.save(output_filename)
    size_mb = round(os.path.getsize(output_filename) / 1024 / 1024, 2)
    print(f"Document saved successfully: {output_filename}")
    print(f"Total size: {size_mb} MB")


if __name__ == "__main__":
    main()
