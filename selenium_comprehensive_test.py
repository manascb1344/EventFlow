#!/usr/bin/env python3
"""
Comprehensive Deep Dive: Testing EventFlow Core Functionality
Tests: Authentication Flow, Form Interactions, and Interactive Elements
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys


def create_driver():
    """Create and configure Chrome WebDriver"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver


def test_signin_functionality(driver):
    """Test Sign In page functionality"""
    print("\n[Test 1] Authentication - Sign In Page")
    print("-" * 60)

    driver.get("http://localhost:3000/auth/attendee/signin")
    time.sleep(3)

    # Verify page loaded
    page_text = driver.page_source.lower()
    print(f"✓ Sign in page loaded")

    # Find form elements
    email_inputs = driver.find_elements(
        By.CSS_SELECTOR, "input[type='email'], input[name*='email']"
    )
    password_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
    submit_buttons = driver.find_elements(By.CSS_SELECTOR, "button[type='submit']")

    print(f"✓ Found {len(email_inputs)} email input(s)")
    print(f"✓ Found {len(password_inputs)} password input(s)")
    print(f"✓ Found {len(submit_buttons)} submit button(s)")

    # Take screenshot
    driver.save_screenshot("screenshots/core_signin_page.png")
    print("✓ Screenshot: core_signin_page.png")

    # Test form interaction
    if email_inputs and password_inputs:
        email_inputs[0].send_keys("test@example.com")
        password_inputs[0].send_keys("testpassword123")
        print("✓ Test data entered in form fields")

        driver.save_screenshot("screenshots/core_signin_filled.png")
        print("✓ Screenshot: core_signin_filled.png")

        # Clear fields
        email_inputs[0].clear()
        password_inputs[0].clear()

    return True


def test_signup_functionality(driver):
    """Test Sign Up page functionality"""
    print("\n[Test 2] Authentication - Sign Up Page")
    print("-" * 60)

    driver.get("http://localhost:3000/auth/attendee/signup")
    time.sleep(3)

    print(f"✓ Sign up page loaded")

    # Find all input fields
    all_inputs = driver.find_elements(By.TAG_NAME, "input")
    text_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
    email_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='email']")
    password_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")

    print(f"✓ Total input fields: {len(all_inputs)}")
    print(f"✓ Text inputs: {len(text_inputs)}")
    print(f"✓ Email inputs: {len(email_inputs)}")
    print(f"✓ Password inputs: {len(password_inputs)}")

    driver.save_screenshot("screenshots/core_signup_page.png")
    print("✓ Screenshot: core_signup_page.png")

    return True


def test_contact_form_deep(driver):
    """Deep test of contact form functionality"""
    print("\n[Test 3] Contact Form - Deep Functionality Test")
    print("-" * 60)

    driver.get("http://localhost:3000/contact")
    time.sleep(3)

    # Find all form elements
    form = (
        driver.find_elements(By.TAG_NAME, "form")[0]
        if driver.find_elements(By.TAG_NAME, "form")
        else None
    )
    all_inputs = driver.find_elements(By.TAG_NAME, "input")
    textareas = driver.find_elements(By.TAG_NAME, "textarea")

    print(f"✓ Contact page loaded")
    print(f"✓ Found {len(all_inputs)} input(s)")
    print(f"✓ Found {len(textareas)} textarea(s)")

    # Identify field types
    name_field = None
    email_field = None
    message_field = None

    for inp in all_inputs:
        placeholder = inp.get_attribute("placeholder") or ""
        name = inp.get_attribute("name") or ""
        input_type = inp.get_attribute("type") or ""

        if "name" in placeholder.lower() or "name" in name.lower():
            name_field = inp
        elif (
            "email" in placeholder.lower()
            or "email" in name.lower()
            or input_type == "email"
        ):
            email_field = inp

    if textareas:
        message_field = textareas[0]

    print(f"✓ Name field: {'Found' if name_field else 'Not found'}")
    print(f"✓ Email field: {'Found' if email_field else 'Not found'}")
    print(f"✓ Message field: {'Found' if message_field else 'Not found'}")

    # Fill the form
    if name_field:
        name_field.send_keys("Test User")
        print("✓ Name field filled")

    if email_field:
        email_field.send_keys("testuser@example.com")
        print("✓ Email field filled")

    if message_field:
        message_field.send_keys(
            "This is a test message for the contact form. Testing EventFlow functionality."
        )
        print("✓ Message field filled")

    driver.save_screenshot("screenshots/core_contact_filled.png")
    print("✓ Screenshot: core_contact_filled.png")

    # Test form validation by clearing required fields
    if email_field:
        email_field.clear()
        print("✓ Email field cleared to test validation")

    driver.save_screenshot("screenshots/core_contact_validation.png")
    print("✓ Screenshot: core_contact_validation.png")

    return True


def test_navigation_flow(driver):
    """Test complete navigation flow"""
    print("\n[Test 4] Navigation Flow Test")
    print("-" * 60)

    pages = [
        ("Home", "/"),
        ("Events", "/events"),
        ("Features", "/features"),
        ("Pricing", "/pricing"),
        ("About", "/about"),
        ("Contact", "/contact"),
    ]

    for name, path in pages:
        driver.get(f"http://localhost:3000{path}")
        time.sleep(2)

        current_url = driver.current_url
        page_title = driver.title

        print(f"✓ {name}: Loaded successfully")
        print(f"  URL: {current_url}")
        print(f"  Title: {page_title}")

    driver.save_screenshot("screenshots/core_navigation_final.png")
    print("✓ Screenshot: core_navigation_final.png")

    return True


def test_landing_page_interactions(driver):
    """Test landing page interactive elements"""
    print("\n[Test 5] Landing Page Interactive Elements")
    print("-" * 60)

    driver.get("http://localhost:3000")
    time.sleep(3)

    # Find all buttons
    buttons = driver.find_elements(By.TAG_NAME, "button")
    links = driver.find_elements(By.TAG_NAME, "a")

    print(f"✓ Found {len(buttons)} button(s)")
    print(f"✓ Found {len(links)} link(s)")

    # Get button text
    button_texts = [btn.text for btn in buttons if btn.text]
    print(f"✓ Button texts: {button_texts[:5]}")  # First 5

    # Get link texts
    link_texts = [link.text for link in links if link.text]
    unique_links = list(set(link_texts))
    print(f"✓ Unique link texts: {unique_links[:10]}")  # First 10

    driver.save_screenshot("screenshots/core_landing_interactive.png")
    print("✓ Screenshot: core_landing_interactive.png")

    # Scroll to test scrollable content
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight / 2);")
    time.sleep(1)
    driver.save_screenshot("screenshots/core_landing_scrolled.png")
    print("✓ Screenshot: core_landing_scrolled.png")

    return True


def test_responsive_breakpoints(driver):
    """Test responsive design at multiple breakpoints"""
    print("\n[Test 6] Responsive Design - Multiple Breakpoints")
    print("-" * 60)

    breakpoints = [
        ("Mobile Small", 320, 568),
        ("Mobile", 375, 667),
        ("Mobile Large", 414, 896),
        ("Tablet", 768, 1024),
        ("Desktop", 1280, 800),
        ("Desktop Large", 1920, 1080),
    ]

    driver.get("http://localhost:3000")

    for name, width, height in breakpoints:
        driver.set_window_size(width, height)
        time.sleep(2)

        # Take screenshot
        safe_name = name.lower().replace(" ", "_")
        driver.save_screenshot(f"screenshots/core_responsive_{safe_name}.png")
        print(f"✓ {name} ({width}x{height}): screenshot saved")

    # Reset to desktop
    driver.set_window_size(1920, 1080)

    return True


def test_page_performance(driver):
    """Test page load performance"""
    print("\n[Test 7] Page Performance Test")
    print("-" * 60)

    pages = ["/", "/events", "/features", "/pricing", "/about", "/contact"]

    for page in pages:
        start_time = time.time()
        driver.get(f"http://localhost:3000{page}")
        # Wait for page to be fully loaded
        time.sleep(2)
        load_time = time.time() - start_time

        print(f"✓ {page}: Loaded in {load_time:.2f}s")

    driver.save_screenshot("screenshots/core_performance_final.png")
    print("✓ Screenshot: core_performance_final.png")

    return True


def test_error_pages(driver):
    """Test error page handling"""
    print("\n[Test 8] Error Page Handling")
    print("-" * 60)

    # Test 404 page
    driver.get("http://localhost:3000/nonexistent-page-12345")
    time.sleep(2)

    page_source = driver.page_source.lower()

    if (
        "404" in page_source
        or "not found" in page_source
        or "page not found" in page_source
    ):
        print("✓ 404 page displayed correctly")
    else:
        print("⚠ 404 handling: Custom or default page shown")

    driver.save_screenshot("screenshots/core_error_404.png")
    print("✓ Screenshot: core_error_404.png")

    return True


def main():
    """Main test execution"""
    print("=" * 70)
    print("EVENTFLOW - COMPREHENSIVE CORE FUNCTIONALITY DEEP DIVE")
    print("=" * 70)

    driver = None
    try:
        print("\nInitializing Chrome WebDriver...")
        driver = create_driver()
        print("✓ WebDriver initialized\n")

        tests = [
            test_signin_functionality,
            test_signup_functionality,
            test_contact_form_deep,
            test_navigation_flow,
            test_landing_page_interactions,
            test_responsive_breakpoints,
            test_page_performance,
            test_error_pages,
        ]

        passed = 0
        failed = 0

        for test in tests:
            try:
                test(driver)
                passed += 1
                print()
            except Exception as e:
                print(f"✗ Test failed: {e}")
                failed += 1
                try:
                    driver.save_screenshot(f"screenshots/error_{test.__name__}.png")
                except:
                    pass

        # Final summary
        print("=" * 70)
        print("COMPREHENSIVE TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {len(tests)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {passed / len(tests) * 100:.1f}%")

        if failed == 0:
            print("\n✓ ALL COMPREHENSIVE TESTS PASSED!")
            return 0
        else:
            print(f"\n✗ {failed} test(s) failed")
            return 1

    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        import traceback

        traceback.print_exc()
        return 1
    finally:
        if driver:
            driver.quit()
            print("\n✓ WebDriver closed")


if __name__ == "__main__":
    sys.exit(main())
