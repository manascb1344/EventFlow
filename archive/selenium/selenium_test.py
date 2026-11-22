#!/usr/bin/env python3
"""
Selenium Automation Test Script for EventFlow Application
Tests: Homepage, Navigation, Events Page, and Key UI Elements
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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


def test_homepage(driver):
    """Test 1: Load homepage and verify basic elements"""
    print("\n=== Test 1: Homepage Loading ===")
    driver.get("http://localhost:3000")
    time.sleep(3)

    # Verify page loaded
    assert "EventFlow" in driver.title or "event" in driver.page_source.lower(), (
        "Page did not load correctly"
    )
    print("✓ Homepage loaded successfully")

    # Take screenshot
    driver.save_screenshot("screenshots/step1_homepage.png")
    print("✓ Screenshot saved: step1_homepage.png")

    # Verify key elements exist
    page_source = driver.page_source.lower()
    keywords = ["event", "manage", "create", "discover"]
    found = [k for k in keywords if k in page_source]
    print(f"✓ Found keywords: {found}")

    return True


def test_navigation_elements(driver):
    """Test 2: Verify navigation elements"""
    print("\n=== Test 2: Navigation Elements ===")

    # Look for navigation links
    nav_elements = driver.find_elements(By.TAG_NAME, "a")
    print(f"✓ Found {len(nav_elements)} navigation links")

    # Find common navigation patterns
    nav_texts = [elem.text for elem in nav_elements if elem.text]
    print(f"✓ Navigation items: {nav_texts[:10]}")  # Show first 10

    # Take screenshot
    driver.save_screenshot("screenshots/step2_navigation.png")
    print("✓ Screenshot saved: step2_navigation.png")

    return True


def test_events_page(driver):
    """Test 3: Navigate to Events page"""
    print("\n=== Test 3: Events Page ===")

    # Navigate to events page
    driver.get("http://localhost:3000/events")
    time.sleep(3)

    # Verify page loaded
    assert "event" in driver.page_source.lower(), "Events page did not load"
    print("✓ Events page loaded successfully")

    # Take screenshot
    driver.save_screenshot("screenshots/step3_events_page.png")
    print("✓ Screenshot saved: step3_events_page.png")

    # Look for event cards or listings
    event_cards = driver.find_elements(
        By.CSS_SELECTOR, "[class*='card'], [class*='event']"
    )
    print(f"✓ Found {len(event_cards)} potential event elements")

    return True


def test_features_page(driver):
    """Test 4: Navigate to Features page"""
    print("\n=== Test 4: Features Page ===")

    # Navigate to features page
    driver.get("http://localhost:3000/features")
    time.sleep(3)

    # Verify page loaded
    page_text = driver.page_source.lower()
    assert "feature" in page_text or "eventflow" in page_text, (
        "Features page did not load"
    )
    print("✓ Features page loaded successfully")

    # Take screenshot
    driver.save_screenshot("screenshots/step4_features_page.png")
    print("✓ Screenshot saved: step4_features_page.png")

    return True


def test_pricing_page(driver):
    """Test 5: Navigate to Pricing page"""
    print("\n=== Test 5: Pricing Page ===")

    # Navigate to pricing page
    driver.get("http://localhost:3000/pricing")
    time.sleep(3)

    # Verify page loaded
    page_text = driver.page_source.lower()
    assert "pricing" in page_text or "price" in page_text or "plan" in page_text, (
        "Pricing page did not load"
    )
    print("✓ Pricing page loaded successfully")

    # Take screenshot
    driver.save_screenshot("screenshots/step5_pricing_page.png")
    print("✓ Screenshot saved: step5_pricing_page.png")

    return True


def test_about_page(driver):
    """Test 6: Navigate to About page"""
    print("\n=== Test 6: About Page ===")

    # Navigate to about page
    driver.get("http://localhost:3000/about")
    time.sleep(3)

    # Verify page loaded
    page_text = driver.page_source.lower()
    assert "about" in page_text or "eventflow" in page_text, "About page did not load"
    print("✓ About page loaded successfully")

    # Take screenshot
    driver.save_screenshot("screenshots/step6_about_page.png")
    print("✓ Screenshot saved: step6_about_page.png")

    return True


def test_contact_page(driver):
    """Test 7: Navigate to Contact page"""
    print("\n=== Test 7: Contact Page ===")

    # Navigate to contact page
    driver.get("http://localhost:3000/contact")
    time.sleep(3)

    # Verify page loaded
    page_text = driver.page_source.lower()
    assert (
        "contact" in page_text
        or "get in touch" in page_text
        or "eventflow" in page_text
    ), "Contact page did not load"
    print("✓ Contact page loaded successfully")

    # Look for contact form elements
    forms = driver.find_elements(By.TAG_NAME, "form")
    inputs = driver.find_elements(By.TAG_NAME, "input")
    print(f"✓ Found {len(forms)} forms and {len(inputs)} input fields")

    # Take screenshot
    driver.save_screenshot("screenshots/step7_contact_page.png")
    print("✓ Screenshot saved: step7_contact_page.png")

    return True


def test_responsive_design(driver):
    """Test 8: Test responsive design with different viewport sizes"""
    print("\n=== Test 8: Responsive Design Test ===")

    # Test mobile viewport
    driver.set_window_size(375, 667)
    driver.get("http://localhost:3000")
    time.sleep(2)
    driver.save_screenshot("screenshots/step8_mobile_view.png")
    print("✓ Mobile viewport screenshot saved: step8_mobile_view.png")

    # Test tablet viewport
    driver.set_window_size(768, 1024)
    time.sleep(2)
    driver.save_screenshot("screenshots/step8_tablet_view.png")
    print("✓ Tablet viewport screenshot saved: step8_tablet_view.png")

    # Reset to desktop
    driver.set_window_size(1920, 1080)
    time.sleep(1)
    print("✓ Responsive design test completed")

    return True


def main():
    """Main test execution"""
    print("=" * 60)
    print("EventFlow Selenium Automation Testing")
    print("=" * 60)

    driver = None
    try:
        # Create driver
        print("\nInitializing Chrome WebDriver...")
        driver = create_driver()
        print("✓ WebDriver initialized")

        # Run all tests
        tests = [
            test_homepage,
            test_navigation_elements,
            test_events_page,
            test_features_page,
            test_pricing_page,
            test_about_page,
            test_contact_page,
            test_responsive_design,
        ]

        passed = 0
        failed = 0

        for test in tests:
            try:
                test(driver)
                passed += 1
            except Exception as e:
                print(f"✗ Test failed: {e}")
                failed += 1
                # Take screenshot on failure
                try:
                    driver.save_screenshot(f"screenshots/error_{test.__name__}.png")
                except:
                    pass

        # Print summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(tests)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {passed / len(tests) * 100:.1f}%")

        if failed == 0:
            print("\n✓ All tests passed successfully!")
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
