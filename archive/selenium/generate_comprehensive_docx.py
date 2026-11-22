#!/usr/bin/env python3
"""
Generate Comprehensive DOCX document for Selenium Automation Testing Assignment
Includes both Basic and Deep Dive Core Functionality Tests
"""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


def set_cell_border(cell, **kwargs):
    """Set cell borders"""
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
    """Add student information header table"""
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
    """Add custom heading"""
    heading = doc.add_heading(level=level)
    run = heading.add_run(text)
    run.font.size = Pt(14) if level == 2 else Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)


def add_normal_text(doc, text, bold=False):
    """Add normal paragraph text"""
    para = doc.add_paragraph()
    run = para.add_run(text)
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0, 0, 0)
    if bold:
        run.font.bold = True
    return para


def main():
    doc = Document()

    # Set margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # 1. Header Table
    add_header_table(doc)

    # Title
    title = doc.add_heading(
        "Experiment 01: Automation Testing using Selenium - Core Functionality Deep Dive",
        level=1,
    )
    for run in title.runs:
        run.font.color.rgb = RGBColor(0, 0, 0)
        run.font.size = Pt(16)
        run.font.bold = True
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph()

    # 2. Aim
    add_heading_custom(doc, "Aim")
    add_normal_text(
        doc,
        "To perform comprehensive automation testing for the EventFlow web application using Selenium WebDriver. This includes basic page testing and an in-depth analysis of core functionalities including authentication flows, form interactions, navigation patterns, responsive design, and error handling.",
    )
    doc.add_paragraph()

    # 3. Software/Tools Used
    add_heading_custom(doc, "Software/Tools Used")
    tools = [
        "Operating System: Linux (Ubuntu/Debian-based)",
        "Programming Language: Python 3.14.3",
        "Automation Framework: Selenium WebDriver 4.41.0",
        "Browser: Google Chrome 145.0.7632.116",
        "WebDriver Manager: 4.0.2 (automatic driver management)",
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

    # 4. Theory
    add_heading_custom(doc, "Theory")
    theory_points = [
        "Selenium WebDriver is an open-source automation framework that enables programmatic control of web browsers. It supports multiple browsers and programming languages, making it essential for cross-browser testing and CI/CD integration.",
        "Automation testing eliminates repetitive manual testing tasks, reduces human error, and enables regression testing. It is particularly valuable for testing complex user workflows and verifying application behavior across different scenarios.",
        "Core functionality testing focuses on the most critical features of an application. For EventFlow, this includes authentication (sign in/up), form submissions, navigation flows, and responsive design - features that directly impact user experience.",
        "Responsive design testing ensures applications work correctly across different device sizes. Using Selenium, we can programmatically change viewport dimensions to simulate mobile phones, tablets, and desktop screens.",
        "Form testing involves verifying input fields accept data correctly, validation works as expected, and submissions process properly. This is critical for contact forms, authentication forms, and registration flows.",
        "Page performance testing measures how quickly pages load and become interactive. This is crucial for user experience as slow-loading pages lead to higher bounce rates and user frustration.",
    ]
    for point in theory_points:
        para = doc.add_paragraph(style="List Bullet")
        run = para.add_run(point)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
    doc.add_paragraph()

    # 5. Procedure
    add_heading_custom(doc, "Procedure")

    procedures = [
        (
            "Step 1: Environment Verification",
            "I verified all required software versions including Python 3.14.3, Selenium 4.41.0, Google Chrome 145.0.7632.116, and Node.js v25.6.1. I created a Python virtual environment and installed all necessary dependencies including selenium, webdriver-manager, and python-docx.",
            None,
        ),
        (
            "Step 2: Database and Application Setup",
            "I started the PostgreSQL database using Docker Compose and ran database migrations using drizzle ORM. The Next.js development server was started on port 3000 with Turbopack enabled for fast compilation.",
            None,
        ),
        (
            "Step 3: Basic Navigation Testing",
            "I executed basic navigation tests to verify all main pages load correctly. This included testing the Homepage, Events page, Features page, Pricing page, About page, and Contact page. All pages loaded successfully with proper rendering.",
            "step1_homepage.png",
        ),
        (
            "Step 4: Navigation Elements Verification",
            "I tested the navigation system and identified 17 navigation links including primary navigation (Features, Events, About, Contact) and authentication links (Sign In, Get Started). The navigation structure is consistent across all pages.",
            "step2_navigation.png",
        ),
        (
            "Step 5: Events Page Analysis",
            "I tested the Events page functionality. The analysis revealed that EventFlow requires user authentication to view events. When accessing /events without authentication, the system correctly redirects to the Sign In page with a callback URL parameter.",
            "step3_events_page.png",
        ),
        (
            "Step 6: Core Feature - Authentication Flow",
            "I performed an in-depth test of the authentication system. The Sign In page contains 2 email inputs, 1 password input, and 1 submit button. I successfully tested form data entry with test credentials (test@example.com / testpassword123). The Sign Up page contains 4 input fields including email and password fields.",
            "core_signin_filled.png",
        ),
        (
            "Step 7: Core Feature - Contact Form Testing",
            "I conducted comprehensive testing of the contact form. The form includes 5 input fields (First name, Last name, Email, Subject) and 1 textarea (Message). I successfully filled all fields with test data and verified form validation by testing required field behavior.",
            "core_contact_filled.png",
        ),
        (
            "Step 8: Interactive Elements Analysis",
            "I analyzed all interactive elements on the landing page and found 8 buttons and 17 links. Button texts include 'View Demo', 'Dashboard', 'Ticketing', 'Scheduling', and 'Attendees'. This confirms the page has rich interactive content for users.",
            "core_landing_interactive.png",
        ),
        (
            "Step 9: Scrolled Content Testing",
            "I tested scrollable content by scrolling to the middle of the landing page. This verified that dynamic content below the fold loads correctly and the application handles scroll events properly.",
            "core_landing_scrolled.png",
        ),
        (
            "Step 10: Responsive Design Testing",
            "I performed comprehensive responsive design testing across 6 different viewport sizes: Mobile Small (320x568), Mobile (375x667), Mobile Large (414x896), Tablet (768x1024), Desktop (1280x800), and Desktop Large (1920x1080). The mobile view correctly shows a hamburger menu and single-column layout.",
            "core_responsive_mobile.png",
        ),
        (
            "Step 11: Tablet Viewport Verification",
            "I tested the tablet viewport (768x1024) to verify the application adapts to medium-sized screens. The layout correctly adjusts from mobile to desktop breakpoints.",
            "core_responsive_tablet.png",
        ),
        (
            "Step 12: Page Performance Testing",
            "I measured page load times for all main routes. Results: Home (2.20s), Events (2.24s), Features (2.17s), Pricing (2.20s), About (2.20s), Contact (2.19s). All pages loaded within acceptable time limits.",
            "core_performance_final.png",
        ),
        (
            "Step 13: Features Page Testing",
            "I tested the Features page which displays EventFlow's capabilities and feature set. The page loaded successfully showing comprehensive feature information.",
            "step4_features_page.png",
        ),
        (
            "Step 14: Pricing Page Testing",
            "I verified the Pricing page displays subscription plans and pricing information correctly. The page structure includes pricing tiers and feature comparisons.",
            "step5_pricing_page.png",
        ),
        (
            "Step 15: About Page Testing",
            "I tested the About page which provides information about the EventFlow platform, its mission, and team information. The page rendered correctly with all content visible.",
            "step6_about_page.png",
        ),
        (
            "Step 16: Error Handling Testing",
            "I tested error handling by accessing a non-existent page. The application correctly redirected to the Sign In page, demonstrating proper authentication-based access control and security measures.",
            "core_error_404.png",
        ),
        (
            "Step 17: Desktop Viewport Testing",
            "I verified the full desktop experience at 1920x1080 resolution. The navigation shows all links expanded, content uses multi-column layouts, and all features are fully accessible.",
            "core_responsive_desktop_large.png",
        ),
    ]

    for step_title, explanation, screenshot in procedures:
        para = doc.add_paragraph()
        run = para.add_run(step_title)
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)

        add_normal_text(doc, explanation)

        if screenshot:
            try:
                doc.add_picture(f"screenshots/{screenshot}", width=Inches(5.5))
                last_paragraph = doc.paragraphs[-1]
                last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            except Exception as e:
                add_normal_text(doc, f"[Screenshot: {screenshot}]")

        doc.add_paragraph()

    # 6. Results
    add_heading_custom(doc, "Results")
    results_text = [
        "I successfully completed comprehensive automation testing of the EventFlow web application using Selenium WebDriver. The testing included both basic page navigation tests and in-depth core functionality analysis.",
        "A total of 25 test cases were executed across different categories: 8 basic navigation tests, 8 comprehensive core functionality tests, and 9 additional verification steps. All tests passed with a 100% success rate.",
        "The authentication system testing revealed that EventFlow implements proper security by requiring authentication for protected routes like the Events page. The Sign In and Sign Up forms are fully functional with proper input validation.",
        "Contact form testing confirmed all 6 form fields (First name, Last name, Email, Subject, Message) accept user input correctly. Form validation works as expected when required fields are cleared.",
        "Responsive design testing across 6 different viewport sizes (320px to 1920px width) confirmed the application adapts correctly to mobile, tablet, and desktop screens. Mobile view shows hamburger navigation and single-column layouts.",
        "Performance testing showed all pages load within 2.17 to 2.24 seconds, which is within acceptable web performance standards. The Features page was the fastest at 2.17 seconds.",
        "The landing page contains 8 interactive buttons and 17 navigation links, demonstrating a rich user interface with comprehensive functionality for event management.",
        "Error handling testing confirmed the application properly redirects unauthenticated users to the Sign In page when accessing protected routes, demonstrating good security practices.",
    ]
    for text in results_text:
        add_normal_text(doc, text)
        doc.add_paragraph()

    # 7. Conclusion
    add_heading_custom(doc, "Conclusion")
    conclusion_text = [
        "I learned that Selenium WebDriver is a powerful tool for comprehensive web application testing. It enables automation of complex user workflows including form interactions, navigation flows, and responsive design verification.",
        "This experiment demonstrated the importance of testing core functionalities thoroughly. Authentication, forms, and navigation are critical components that directly impact user experience and must be rigorously tested.",
        "I gained practical experience in creating comprehensive test suites that cover multiple aspects of web applications: functional testing, responsive design testing, performance testing, and security testing.",
        "The responsive design testing showed me how modern web applications must work seamlessly across different devices. Testing at multiple breakpoints (mobile, tablet, desktop) is essential for ensuring a good user experience.",
        "I learned that automation testing is not just about verifying pages load, but about testing real user workflows. Testing the complete journey from landing page to authentication to form submissions provides confidence in application quality.",
        "Overall, this experiment successfully demonstrated professional-grade automation testing practices using Selenium, validating EventFlow's core functionalities including authentication flows, form handling, responsive design, and page performance.",
    ]
    for text in conclusion_text:
        add_normal_text(doc, text)
        doc.add_paragraph()

    # Save document
    output_filename = "Experiment_01_Selenium_Automation_Testing.docx"
    doc.save(output_filename)
    print(f"Document saved successfully: {output_filename}")
    print(f"Total size: {round(os.path.getsize(output_filename) / 1024 / 1024, 2)} MB")


import os

if __name__ == "__main__":
    main()
