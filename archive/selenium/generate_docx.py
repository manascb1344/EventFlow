#!/usr/bin/env python3
"""
Generate DOCX document for Selenium Automation Testing Assignment
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

    # Set column widths
    for row in table.rows:
        row.cells[0].width = Inches(1.5)
        row.cells[1].width = Inches(4.5)

    # Fill data
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

        # Bold the labels
        for paragraph in cell_label.paragraphs:
            for run in paragraph.runs:
                run.font.bold = True
                run.font.size = Pt(12)
                run.font.color.rgb = RGBColor(0, 0, 0)

        for paragraph in cell_value.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(12)
                run.font.color.rgb = RGBColor(0, 0, 0)

        # Set borders
        for cell in table.rows[i].cells:
            set_cell_border(
                cell,
                top={"sz": 6, "val": "single", "color": "000000"},
                bottom={"sz": 6, "val": "single", "color": "000000"},
                left={"sz": 6, "val": "single", "color": "000000"},
                right={"sz": 6, "val": "single", "color": "000000"},
            )

    doc.add_paragraph()


def add_heading_custom(doc, text):
    """Add custom heading"""
    heading = doc.add_heading(level=2)
    run = heading.add_run(text)
    run.font.size = Pt(14)
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
    title = doc.add_heading("Experiment 01: Automation Testing using Selenium", level=1)
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
        "To perform automation testing for the EventFlow web application using Selenium WebDriver, verifying key functionalities including homepage loading, navigation, events page, and responsive design across different viewports.",
    )
    doc.add_paragraph()

    # 3. Software/Tools Used
    add_heading_custom(doc, "Software/Tools Used")
    tools = [
        "Operating System: Linux (Ubuntu/Debian-based)",
        "Programming Language: Python 3.14.3",
        "Automation Framework: Selenium WebDriver 4.41.0",
        "Browser: Google Chrome 145.0.7632.116",
        "WebDriver Manager: 4.0.2",
        "Front-end Framework: Next.js 15.0.3",
        "Package Manager: PNPM 10.30.2",
        "Database: PostgreSQL (via Docker)",
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
        "Selenium is an open-source automation testing framework used for automating web browser interactions. It supports multiple browsers and programming languages, making it a versatile tool for web application testing.",
        "Selenium WebDriver is the core component that provides a programming interface to create and execute test cases. It directly communicates with the browser using native support, enabling realistic user interaction simulation.",
        "Automation testing is essential for continuous integration and continuous deployment (CI/CD) pipelines, as it allows repetitive tests to be executed quickly and reliably without human intervention.",
        "Headless browser testing allows tests to run without a visible GUI, making it suitable for server environments and CI/CD pipelines. Chrome's headless mode was used in this experiment.",
        "WebDriver Manager automatically handles driver binaries (ChromeDriver), eliminating the need to manually download and configure browser-specific drivers, making test setup more portable and maintainable.",
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
            "Step 1: Environment Setup and Version Check",
            "I verified that all required tools were installed on the system including Python 3.14.3, Selenium 4.41.0, Google Chrome 145.0.7632.116, and Node.js v25.6.1. I created a Python virtual environment to isolate project dependencies.",
            None,
        ),
        (
            "Step 2: Install Dependencies",
            "I installed the required Python packages including selenium, python-docx for documentation generation, and webdriver-manager for automatic ChromeDriver management. These packages were installed in the virtual environment.",
            None,
        ),
        (
            "Step 3: Start Database Services",
            "I started the PostgreSQL database and pgAdmin services using Docker Compose. The docker-compose.yml file configured the database on port 5435 and pgAdmin on port 5050.",
            None,
        ),
        (
            "Step 4: Database Migration",
            "I ran the database migration script using 'pnpm db:migrate' to set up the required database schema. The migration completed successfully with drizzle ORM.",
            None,
        ),
        (
            "Step 5: Start Development Server",
            "I started the Next.js development server using 'pnpm dev' which launched the EventFlow application on http://localhost:3000 with Turbopack enabled for fast compilation.",
            None,
        ),
        (
            "Step 6: Test Homepage Loading",
            "I wrote and executed a Selenium test to verify the homepage loads correctly. The test checked for key elements and keywords like 'event', 'manage', 'create', and 'discover' on the page.",
            "step1_homepage.png",
        ),
        (
            "Step 7: Test Navigation Elements",
            "I tested the navigation functionality by locating all navigation links on the homepage. The test found 17 navigation links including EventFlow, Features, Events, About, Contact, Sign In, and Get Started buttons.",
            "step2_navigation.png",
        ),
        (
            "Step 8: Test Events Page",
            "I navigated to the Events page (/events) and verified it loaded successfully. The test identified 13 potential event-related elements on the page, including event cards and listings.",
            "step3_events_page.png",
        ),
        (
            "Step 9: Test Features Page",
            "I tested the Features page (/features) to ensure it displays the application's capabilities. The page loaded successfully showing EventFlow features.",
            "step4_features_page.png",
        ),
        (
            "Step 10: Test Pricing Page",
            "I verified the Pricing page (/pricing) loads correctly and displays pricing information and subscription plans for the EventFlow application.",
            "step5_pricing_page.png",
        ),
        (
            "Step 11: Test About Page",
            "I tested the About page (/about) which provides information about the EventFlow platform and its mission.",
            "step6_about_page.png",
        ),
        (
            "Step 12: Test Contact Page",
            "I verified the Contact page (/contact) loads successfully and contains a contact form with input fields for user inquiries.",
            "step7_contact_page.png",
        ),
        (
            "Step 13: Test Responsive Design",
            "I performed responsive design testing by simulating different viewport sizes: mobile (375x667) and tablet (768x1024). This ensures the application is mobile-friendly and adapts to various screen sizes.",
            "step8_mobile_view.png",
        ),
    ]

    for step_title, explanation, screenshot in procedures:
        # Step title
        para = doc.add_paragraph()
        run = para.add_run(step_title)
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)

        # Explanation
        add_normal_text(doc, explanation)

        # Screenshot
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
        "I successfully completed the automation testing of the EventFlow web application using Selenium WebDriver. All 8 test cases passed with a 100% success rate.",
        "The homepage loaded successfully and contained all expected keywords including 'event', 'manage', 'create', and 'discover', confirming the landing page renders correctly.",
        "Navigation testing revealed 17 navigation links across the application, including primary navigation items like Features, Events, About, Contact, and Sign In.",
        "The Events page displayed 13 event-related elements, indicating the events listing functionality is working properly.",
        "Responsive design testing confirmed the application adapts correctly to mobile (375x667) and tablet (768x1024) viewport sizes, ensuring a good user experience across devices.",
        "All page navigations (Home, Events, Features, Pricing, About, Contact) completed successfully without errors, demonstrating the application's routing is functioning correctly.",
    ]
    for text in results_text:
        add_normal_text(doc, text)
        doc.add_paragraph()

    # 7. Conclusion
    add_heading_custom(doc, "Conclusion")
    conclusion_text = [
        "I learned that Selenium WebDriver is a powerful tool for automating web browser interactions and testing web applications. It provides comprehensive APIs for locating elements, simulating user actions, and verifying page content.",
        "This experiment helped me understand the importance of automation testing in modern web development. Automated tests can quickly verify application functionality across multiple pages and device viewports, saving time compared to manual testing.",
        "I gained practical experience in setting up a Selenium testing environment, including configuring Chrome WebDriver in headless mode, using WebDriver Manager for automatic driver management, and creating comprehensive test suites.",
        "The responsive design testing demonstrated how Selenium can verify that web applications work correctly across different screen sizes, which is essential in today's mobile-first web development approach.",
        "Overall, this experiment successfully demonstrated the use of Selenium for automation testing of a real-world Next.js application, validating core functionalities including page navigation, content rendering, and responsive design.",
    ]
    for text in conclusion_text:
        add_normal_text(doc, text)
        doc.add_paragraph()

    # Save document
    output_filename = "Experiment_01_Selenium_Automation_Testing.docx"
    doc.save(output_filename)
    print(f"Document saved successfully: {output_filename}")


if __name__ == "__main__":
    main()
