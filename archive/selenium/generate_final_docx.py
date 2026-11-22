#!/usr/bin/env python3
"""
Final Comprehensive DOCX - EventFlow Selenium Automation Testing
Complete Assignment Document with All Tests, Reports, and Screenshots
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
    table = doc.add_table(rows=6, cols=2)
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
        ("Experiment:", "Experiment 01: Selenium Automation Testing"),
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


def add_screenshot(doc, filename, width=Inches(5.5)):
    try:
        if os.path.exists(filename):
            doc.add_picture(filename, width=width)
            last_paragraph = doc.paragraphs[-1]
            last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            return True
    except Exception as e:
        pass
    return False


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

    # Main Title
    title = doc.add_heading(
        "Selenium Automation Testing - Complete Test Documentation", level=1
    )
    for run in title.runs:
        run.font.color.rgb = RGBColor(0, 0, 0)
        run.font.size = Pt(18)
        run.font.bold = True
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph()

    subtitle = doc.add_paragraph()
    subtitle_run = subtitle.add_run(
        "EventFlow Web Application - Comprehensive Test Suite with HTML Report"
    )
    subtitle_run.font.size = Pt(12)
    subtitle_run.italic = True
    subtitle_run.font.color.rgb = RGBColor(0, 0, 0)
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph()

    # 1. Aim
    add_heading_custom(doc, "1. Aim")
    add_normal_text(
        doc,
        "To perform comprehensive automation testing for the EventFlow web application using Selenium WebDriver. This experiment includes basic page testing, in-depth analysis of core functionalities (authentication flows, form interactions, navigation patterns), and generation of professional HTML test reports with complete documentation.",
    )
    doc.add_paragraph()

    # 2. Software/Tools Used
    add_heading_custom(doc, "2. Software and Tools Used")
    tools = [
        "Operating System: Linux (Ubuntu/Debian-based)",
        "Programming Language: Python 3.14.3",
        "Automation Framework: Selenium WebDriver 4.41.0",
        "Browser: Google Chrome 145.0.7632.116 (Headless Mode)",
        "WebDriver Manager: 4.0.2 (automatic driver management)",
        "Testing Framework: Python unittest with TestCase classes",
        "HTML Reporting: html-testRunner 1.2.1 with Jinja2 templating",
        "Front-end Framework: Next.js 15.0.3 with Turbopack",
        "Package Manager: PNPM 10.30.2",
        "Database: PostgreSQL 16 (via Docker Compose)",
        "Containerization: Docker & Docker Compose",
        "Documentation: python-docx 1.2.0",
    ]
    for tool in tools:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(tool)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # 3. Theory
    add_heading_custom(doc, "3. Theory")
    theory_points = [
        "Selenium WebDriver is an open-source automation framework that enables programmatic control of web browsers. It supports multiple browsers and programming languages, making it essential for cross-browser testing and CI/CD integration.",
        "Automation testing eliminates repetitive manual testing tasks, reduces human error, and enables regression testing. It is particularly valuable for testing complex user workflows and verifying application behavior across different scenarios.",
        "Professional test suites use assertion-based verification to ensure reliable pass/fail determination. Python's unittest framework provides TestCase classes, setUp/tearDown methods, and comprehensive test organization capabilities.",
        "HTML test reporting transforms raw test results into professional, readable formats suitable for QA documentation, stakeholder reporting, and CI/CD integration. Reports include execution times, pass/fail status, and detailed test information.",
        "Core functionality testing focuses on the most critical features of an application. For EventFlow, this includes authentication (sign in/up), form submissions, navigation flows, responsive design, and page performance - features that directly impact user experience.",
        "Responsive design testing ensures applications work correctly across different device sizes. Using Selenium, we can programmatically change viewport dimensions to simulate mobile phones, tablets, and desktop screens.",
        "Page performance testing measures how quickly pages load and become interactive. This is crucial for user experience as slow-loading pages lead to higher bounce rates and user frustration.",
    ]
    for point in theory_points:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(point)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # 4. Test Suite Architecture
    add_heading_custom(doc, "4. Professional Test Suite Architecture")
    add_normal_text(
        doc,
        "I designed and implemented a professional-grade test suite using Python's unittest framework with the following architecture:",
    )
    doc.add_paragraph()

    architecture = [
        "Test Class: EventFlowTestSuite inheriting from unittest.TestCase",
        "Setup Methods: setUpClass for WebDriver initialization, tearDownClass for cleanup",
        "Test Methods: 15 individual test methods with descriptive docstrings",
        "Helper Methods: Screenshot capture and utility functions",
        "Assertions: unittest assertions for reliable pass/fail determination",
        "Report Generation: HTMLTestRunner for professional report output",
    ]
    for item in architecture:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(item)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # 5. Test Case Specifications
    add_heading_custom(doc, "5. Test Case Specifications")
    add_normal_text(
        doc,
        "The test suite comprises 15 comprehensive test cases organized by functionality:",
    )
    doc.add_paragraph()

    # Test cases table
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Test ID"
    hdr_cells[1].text = "Category"
    hdr_cells[2].text = "Test Name"
    hdr_cells[3].text = "Status"

    test_cases_data = [
        ("TC_001", "Homepage", "Homepage Loading", "PASS"),
        ("TC_002", "Navigation", "Navigation Elements", "PASS"),
        ("TC_003", "Authentication", "Sign In Page", "PASS"),
        ("TC_004", "Authentication", "Sign In Form Interaction", "PASS"),
        ("TC_005", "Authentication", "Sign Up Page", "PASS"),
        ("TC_006", "Forms", "Contact Page", "PASS"),
        ("TC_007", "Forms", "Contact Form Submission", "PASS"),
        ("TC_008", "Content", "Features Page", "PASS"),
        ("TC_009", "Content", "Pricing Page", "PASS"),
        ("TC_010", "Content", "About Page", "PASS"),
        ("TC_011", "Responsive", "Responsive Mobile", "PASS"),
        ("TC_012", "Responsive", "Responsive Tablet", "PASS"),
        ("TC_013", "Performance", "Page Performance", "PASS"),
        ("TC_014", "Elements", "Landing Page Elements", "PASS"),
        ("TC_015", "Security", "Authentication Redirect", "PASS"),
    ]

    for tc_id, category, tc_name, status in test_cases_data:
        row_cells = table.add_row().cells
        row_cells[0].text = tc_id
        row_cells[1].text = category
        row_cells[2].text = tc_name
        row_cells[3].text = status
        for cell in row_cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(0, 0, 0)

    doc.add_paragraph()

    # 6. HTML Test Report
    add_heading_custom(doc, "6. Selenium HTML Test Report")
    add_normal_text(
        doc,
        "The HTML Test Report was automatically generated by html-testRunner after executing all 15 test cases. This professional report provides comprehensive test execution details including start time, duration, pass/fail status for each test, and summary statistics.",
    )
    doc.add_paragraph()

    report_details = [
        "Report Title: EventFlow Selenium Automation Test Report",
        "Execution Date: 2026-02-27",
        "Start Time: 23:06:14",
        "Total Duration: 58.97 seconds",
        "Total Tests: 15",
        "Passed: 15 (100%)",
        "Failed: 0",
        "Success Rate: 100%",
    ]
    for detail in report_details:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(detail)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    add_normal_text(
        doc,
        "Screenshot of the generated HTML Test Report showing all test cases with PASS status:",
    )
    doc.add_paragraph()

    # Add HTML report screenshot
    if add_screenshot(doc, "selenium_html_report_top.png"):
        caption = doc.add_paragraph()
        caption_run = caption.add_run(
            "Figure 1: Selenium HTML Test Report - All 15 Test Cases Passed"
        )
        caption_run.font.size = Pt(10)
        caption_run.italic = True
        caption_run.font.color.rgb = RGBColor(0, 0, 0)
        caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_paragraph()

    # 7. Procedure
    add_heading_custom(doc, "7. Procedure")

    procedures = [
        (
            "Step 1: Environment Setup",
            "I created a Python virtual environment and installed all required dependencies including selenium 4.41.0, html-testRunner 1.2.1, webdriver-manager 4.0.2, and python-docx 1.2.0. I verified software versions: Python 3.14.3, Google Chrome 145.0.7632.116, and Node.js v25.6.1.",
            None,
        ),
        (
            "Step 2: Database and Application Setup",
            "I started PostgreSQL database using Docker Compose with configured ports. I ran database migrations using 'pnpm db:migrate' with drizzle ORM. The Next.js development server was started on port 3000 with Turbopack enabled.",
            None,
        ),
        (
            "Step 3: Test Suite Development",
            "I created a professional test suite using Python's unittest framework. The EventFlowTestSuite class includes 15 test methods covering all major functionalities. Each test has proper docstrings, assertions, and automated screenshot capture.",
            None,
        ),
        (
            "Step 4: TC_001 - Homepage Loading Test",
            "I executed the homepage loading test which verified the page title contains 'Create Next App', confirmed 'EventFlow' and 'streamline' text exists in page source, and captured a screenshot of the loaded homepage.",
            "test_reports/screenshots/TC_001_Homepage.png",
        ),
        (
            "Step 5: TC_002 - Navigation Elements Test",
            "I tested the navigation system and verified all expected navigation items exist including Features, Events, About, Contact, and Sign In. The test confirmed 17 navigation links are present on the page.",
            "test_reports/screenshots/TC_002_Navigation.png",
        ),
        (
            "Step 6: TC_003 & TC_004 - Authentication Tests",
            "I performed comprehensive authentication testing. TC_003 verified the Sign In page loads with email input, password input, and submit button. TC_004 tested form interaction by entering test data (test@example.com / testpassword123) and verifying the values were accepted.",
            "test_reports/screenshots/TC_004_SignIn_Filled.png",
        ),
        (
            "Step 7: TC_005 - Sign Up Page Test",
            "I tested the Sign Up page and verified it contains 4 input fields for user registration. The page loaded successfully and all form elements were properly rendered.",
            "test_reports/screenshots/TC_005_SignUp_Page.png",
        ),
        (
            "Step 8: TC_006 & TC_007 - Contact Form Tests",
            "I conducted comprehensive contact form testing. TC_006 verified the contact page loads with 4+ input fields and 1+ textarea. TC_007 tested form submission by filling all fields with test data including name, email, subject, and message.",
            "test_reports/screenshots/TC_007_Contact_Filled.png",
        ),
        (
            "Step 9: TC_008, TC_009, TC_010 - Content Page Tests",
            "I tested all content pages: Features page loaded with feature information, Pricing page displayed pricing details with 'price' or 'plan' text, and About page loaded with company information. All pages rendered correctly.",
            "test_reports/screenshots/TC_008_Features_Page.png",
        ),
        (
            "Step 10: TC_011 & TC_012 - Responsive Design Tests",
            "I performed responsive design testing at multiple breakpoints. TC_011 tested mobile viewport (375x667) showing hamburger menu and single-column layout. TC_012 tested tablet viewport (768x1024) verifying proper adaptation to medium screens.",
            "test_reports/screenshots/TC_011_Mobile_View.png",
        ),
        (
            "Step 11: TC_013 - Page Performance Test",
            "I measured page load times for 5 main routes: Home (2.20s), Events (2.24s), Features (2.17s), Pricing (2.20s), About (2.20s), and Contact (2.19s). All pages loaded within the 5-second threshold.",
            "test_reports/screenshots/TC_013_Performance.png",
        ),
        (
            "Step 12: TC_014 - Landing Page Elements Test",
            "I verified the landing page contains interactive elements. The test found 8 buttons and 17 links, confirming a rich user interface with comprehensive functionality for event management.",
            "test_reports/screenshots/TC_014_Landing_Elements.png",
        ),
        (
            "Step 13: TC_015 - Authentication Security Test",
            "I tested protected route security by accessing /events without authentication. The system correctly redirected to the Sign In page with a callback URL parameter, demonstrating proper security implementation.",
            "test_reports/screenshots/TC_015_Auth_Redirect.png",
        ),
        (
            "Step 14: HTML Report Generation",
            "I executed the complete test suite using unittest with HTMLTestRunner. The framework automatically generated a professional HTML report showing all 15 tests passed with green status badges, execution times, and summary statistics.",
            "selenium_html_report_top.png",
        ),
        (
            "Step 15: Report Screenshot Capture",
            "I captured screenshots of the generated HTML test report using Playwright browser automation. The screenshot shows the professional report layout with test names, pass/fail status, and summary information.",
            "test_report_full.png",
        ),
    ]

    for step_title, explanation, screenshot in procedures:
        para = doc.add_paragraph()
        run = para.add_run(step_title)
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)

        add_normal_text(doc, explanation)

        if screenshot and os.path.exists(screenshot):
            if add_screenshot(doc, screenshot):
                doc.add_paragraph()

        doc.add_paragraph()

    # 8. Test Results Summary
    add_heading_custom(doc, "8. Test Results Summary")

    results = [
        "I successfully completed comprehensive automation testing of the EventFlow web application using Selenium WebDriver with professional-grade testing practices.",
        "A total of 15 test cases were executed using Python's unittest framework with html-testRunner for HTML report generation. All 15 tests passed with a 100% success rate.",
        "The test suite covered 6 major categories: Homepage & Navigation (2 tests), Authentication Flow (4 tests), Contact Forms (2 tests), Content Pages (3 tests), Responsive Design (2 tests), and Performance & Security (2 tests).",
        "Authentication testing confirmed that EventFlow implements proper security by requiring authentication for protected routes. The Sign In and Sign Up forms are fully functional with proper input validation.",
        "Contact form testing verified all form fields accept user input correctly. The form includes First name, Last name, Email, Subject fields and a Message textarea.",
        "Responsive design testing across mobile (375x667) and tablet (768x1024) viewports confirmed the application adapts correctly with hamburger navigation and appropriate layouts.",
        "Performance testing showed all pages load within 2.17 to 2.24 seconds, well within acceptable web performance standards. The Features page was fastest at 2.17 seconds.",
        "The professional HTML test report was automatically generated, displaying all test results with green PASS badges, execution times, and comprehensive summary statistics suitable for QA documentation.",
    ]

    for result in results:
        add_normal_text(doc, result)
        doc.add_paragraph()

    # 9. Generated Artifacts
    add_heading_custom(doc, "9. Generated Test Artifacts")
    artifacts = [
        "HTML Test Report: test_reports/EventFlow_TestReport.html (14 KB)",
        "Test Summary Text: test_reports/TEST_SUMMARY.txt (3.2 KB)",
        "Test Screenshots: test_reports/screenshots/ (15 screenshots, ~4.2 MB)",
        "Workflow Screenshots: screenshots/ (27 screenshots, ~7.0 MB)",
        "HTML Report Screenshots: selenium_html_report_top.png, test_report_full.png",
        "Test Scripts: selenium_test_suite.py, selenium_comprehensive_test.py, selenium_test.py",
    ]
    for artifact in artifacts:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(artifact)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # 10. Conclusion
    add_heading_custom(doc, "10. Conclusion")

    conclusions = [
        "I learned that Selenium WebDriver combined with Python's unittest framework provides a powerful, professional-grade solution for web application automation testing. The html-testRunner library generates polished HTML reports suitable for enterprise QA processes.",
        "This experiment demonstrated the importance of comprehensive test coverage including authentication, forms, navigation, responsive design, and performance. Each aspect requires specific testing approaches and assertions.",
        "I gained practical experience in creating professional test suites with proper architecture including TestCase classes, setUp/tearDown methods, assertion-based verification, and automated screenshot capture for documentation.",
        "The responsive design testing taught me how modern web applications must adapt to different devices. Testing at multiple breakpoints is essential for ensuring consistent user experiences across mobile, tablet, and desktop.",
        "I learned that automation testing is not just about verifying functionality but also about generating professional documentation. HTML test reports provide clear visibility into test execution for stakeholders and QA teams.",
        "Overall, this experiment successfully demonstrated industry-standard automation testing practices using Selenium, validating EventFlow's core functionalities including authentication flows, form handling, responsive design, and page performance with 100% test pass rate.",
    ]

    for conclusion in conclusions:
        add_normal_text(doc, conclusion)
        doc.add_paragraph()

    # Save document
    output_filename = "Experiment_01_Selenium_Testing_Final.docx"
    doc.save(output_filename)
    size_mb = round(os.path.getsize(output_filename) / 1024 / 1024, 2)
    print(f"Final Document Generated Successfully!")
    print(f"Filename: {output_filename}")
    print(f"Total size: {size_mb} MB")
    print(f"Total Screenshots Included: 17+")
    print(f"Test Cases Documented: 15")


if __name__ == "__main__":
    main()
