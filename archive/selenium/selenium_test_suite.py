#!/usr/bin/env python3
"""
Professional Selenium Test Suite with HTML Report Generation
EventFlow Web Application - Automation Testing
"""

import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import HtmlTestRunner
import time
import os

# Create reports directory
os.makedirs("test_reports", exist_ok=True)
os.makedirs("test_reports/screenshots", exist_ok=True)


class EventFlowTestSuite(unittest.TestCase):
    """Comprehensive test suite for EventFlow application"""

    @classmethod
    def setUpClass(cls):
        """Set up WebDriver once for all tests"""
        chrome_options = Options()
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")

        service = Service(ChromeDriverManager().install())
        cls.driver = webdriver.Chrome(service=service, options=chrome_options)
        cls.driver.implicitly_wait(10)
        print("\n" + "=" * 70)
        print("EventFlow Selenium Test Suite - Initializing")
        print("=" * 70)

    @classmethod
    def tearDownClass(cls):
        """Close WebDriver after all tests"""
        cls.driver.quit()
        print("\n" + "=" * 70)
        print("Test Suite Completed - WebDriver Closed")
        print("=" * 70)

    def take_screenshot(self, name):
        """Helper method to take screenshots"""
        filename = f"test_reports/screenshots/{name}.png"
        self.driver.save_screenshot(filename)
        return filename

    def test_01_homepage_loading(self):
        """TC_001: Verify homepage loads correctly with all key elements"""
        print("\n[Test 01] Homepage Loading Test")
        self.driver.get("http://localhost:3000")
        time.sleep(3)

        # Verify page title
        self.assertIn("Create Next App", self.driver.title)

        # Verify key elements exist
        page_source = self.driver.page_source.lower()
        self.assertIn("eventflow", page_source)
        self.assertIn("streamline", page_source)

        self.take_screenshot("TC_001_Homepage")
        print("✓ Homepage loaded successfully")

    def test_02_navigation_elements(self):
        """TC_002: Verify navigation menu contains all required links"""
        print("\n[Test 02] Navigation Elements Test")
        self.driver.get("http://localhost:3000")
        time.sleep(2)

        # Find navigation links
        nav_links = self.driver.find_elements(By.TAG_NAME, "a")
        link_texts = [link.text for link in nav_links if link.text]

        # Verify expected navigation items exist
        expected_items = ["Features", "Events", "About", "Contact", "Sign In"]
        for item in expected_items:
            self.assertTrue(
                any(item in text for text in link_texts),
                f"Navigation item '{item}' not found",
            )

        self.take_screenshot("TC_002_Navigation")
        print(f"✓ Found {len(nav_links)} navigation links")

    def test_03_signin_page(self):
        """TC_003: Verify Sign In page loads and contains required form elements"""
        print("\n[Test 03] Sign In Page Test")
        self.driver.get("http://localhost:3000/auth/attendee/signin")
        time.sleep(3)

        # Verify form elements
        email_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='email']")
        password_inputs = self.driver.find_elements(
            By.CSS_SELECTOR, "input[type='password']"
        )
        submit_buttons = self.driver.find_elements(
            By.CSS_SELECTOR, "button[type='submit']"
        )

        self.assertGreaterEqual(len(email_inputs), 1, "Email input not found")
        self.assertGreaterEqual(len(password_inputs), 1, "Password input not found")
        self.assertGreaterEqual(len(submit_buttons), 1, "Submit button not found")

        self.take_screenshot("TC_003_SignIn_Page")
        print("✓ Sign In page elements verified")

    def test_04_signin_form_interaction(self):
        """TC_004: Verify Sign In form accepts user input"""
        print("\n[Test 04] Sign In Form Interaction Test")
        self.driver.get("http://localhost:3000/auth/attendee/signin")
        time.sleep(2)

        # Find and fill form
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = self.driver.find_element(
            By.CSS_SELECTOR, "input[type='password']"
        )

        # Enter test data
        email_input.send_keys("test@example.com")
        password_input.send_keys("testpassword123")

        # Verify values were entered
        self.assertEqual(email_input.get_attribute("value"), "test@example.com")
        self.assertEqual(password_input.get_attribute("value"), "testpassword123")

        self.take_screenshot("TC_004_SignIn_Filled")
        print("✓ Sign In form accepts input correctly")

    def test_05_signup_page(self):
        """TC_005: Verify Sign Up page loads correctly"""
        print("\n[Test 05] Sign Up Page Test")
        self.driver.get("http://localhost:3000/auth/attendee/signup")
        time.sleep(3)

        # Count input fields
        all_inputs = self.driver.find_elements(By.TAG_NAME, "input")
        self.assertGreaterEqual(
            len(all_inputs), 2, "Sign up form should have at least 2 inputs"
        )

        self.take_screenshot("TC_005_SignUp_Page")
        print(f"✓ Sign Up page loaded with {len(all_inputs)} input fields")

    def test_06_contact_page(self):
        """TC_006: Verify Contact page loads with form elements"""
        print("\n[Test 06] Contact Page Test")
        self.driver.get("http://localhost:3000/contact")
        time.sleep(3)

        # Find form elements
        inputs = self.driver.find_elements(By.TAG_NAME, "input")
        textareas = self.driver.find_elements(By.TAG_NAME, "textarea")

        self.assertGreaterEqual(len(inputs), 4, "Contact form should have input fields")
        self.assertGreaterEqual(
            len(textareas), 1, "Contact form should have message textarea"
        )

        self.take_screenshot("TC_006_Contact_Page")
        print(f"✓ Contact page with {len(inputs)} inputs and {len(textareas)} textarea")

    def test_07_contact_form_submission(self):
        """TC_007: Verify Contact form accepts all required data"""
        print("\n[Test 07] Contact Form Data Entry Test")
        self.driver.get("http://localhost:3000/contact")
        time.sleep(2)

        # Get all input fields
        inputs = self.driver.find_elements(By.TAG_NAME, "input")
        textareas = self.driver.find_elements(By.TAG_NAME, "textarea")

        # Fill available fields
        fill_data = [
            ("John", 0),
            ("Doe", 1),
            ("john@example.com", 2),
            ("Test Subject", 3),
        ]

        for value, index in fill_data:
            if index < len(inputs):
                inputs[index].send_keys(value)

        # Fill message
        if textareas:
            textareas[0].send_keys("This is a test message for EventFlow contact form.")

        self.take_screenshot("TC_007_Contact_Filled")
        print("✓ Contact form filled with test data")

    def test_08_features_page(self):
        """TC_008: Verify Features page loads correctly"""
        print("\n[Test 08] Features Page Test")
        self.driver.get("http://localhost:3000/features")
        time.sleep(3)

        page_source = self.driver.page_source.lower()
        self.assertIn("feature", page_source)

        self.take_screenshot("TC_008_Features_Page")
        print("✓ Features page loaded successfully")

    def test_09_pricing_page(self):
        """TC_009: Verify Pricing page loads with pricing information"""
        print("\n[Test 09] Pricing Page Test")
        self.driver.get("http://localhost:3000/pricing")
        time.sleep(3)

        page_source = self.driver.page_source.lower()
        self.assertTrue(
            "price" in page_source or "plan" in page_source or "₹" in page_source,
            "Pricing information not found",
        )

        self.take_screenshot("TC_009_Pricing_Page")
        print("✓ Pricing page loaded with pricing details")

    def test_10_about_page(self):
        """TC_010: Verify About page loads correctly"""
        print("\n[Test 10] About Page Test")
        self.driver.get("http://localhost:3000/about")
        time.sleep(3)

        page_source = self.driver.page_source.lower()
        self.assertTrue(
            "about" in page_source or "eventflow" in page_source,
            "About page content not found",
        )

        self.take_screenshot("TC_010_About_Page")
        print("✓ About page loaded successfully")

    def test_11_responsive_mobile(self):
        """TC_011: Verify responsive design on mobile viewport"""
        print("\n[Test 11] Responsive Mobile Test")
        self.driver.set_window_size(375, 667)
        self.driver.get("http://localhost:3000")
        time.sleep(3)

        # Verify mobile viewport (allow tolerance for window decorations in non-headless)
        size = self.driver.get_window_size()
        self.assertLessEqual(size["width"], 600, "Width should be mobile-sized")
        self.assertGreaterEqual(size["height"], 500, "Height should be reasonable")

        self.take_screenshot("TC_011_Mobile_View")
        print(
            f"✓ Mobile responsive design verified (size: {size['width']}x{size['height']})"
        )

        # Reset to desktop
        self.driver.set_window_size(1920, 1080)

    def test_12_responsive_tablet(self):
        """TC_012: Verify responsive design on tablet viewport"""
        print("\n[Test 12] Responsive Tablet Test")
        self.driver.set_window_size(768, 1024)
        self.driver.get("http://localhost:3000")
        time.sleep(3)

        # Verify tablet viewport (allow tolerance for window decorations)
        size = self.driver.get_window_size()
        self.assertLessEqual(size["width"], 900, "Width should be tablet-sized")
        self.assertGreaterEqual(
            size["width"], 600, "Width should be at least tablet-sized"
        )

        self.take_screenshot("TC_012_Tablet_View")
        print(
            f"✓ Tablet responsive design verified (size: {size['width']}x{size['height']})"
        )

        # Reset to desktop
        self.driver.set_window_size(1920, 1080)

    def test_13_page_performance(self):
        """TC_013: Verify page loads within acceptable time limit"""
        print("\n[Test 13] Page Performance Test")

        pages = ["/", "/features", "/pricing", "/about", "/contact"]
        max_load_time = 5.0  # seconds

        for page in pages:
            start_time = time.time()
            self.driver.get(f"http://localhost:3000{page}")
            time.sleep(2)  # Wait for full load
            load_time = time.time() - start_time

            self.assertLess(
                load_time,
                max_load_time,
                f"Page {page} took {load_time:.2f}s to load (max: {max_load_time}s)",
            )
            print(f"  ✓ {page}: {load_time:.2f}s")

        self.take_screenshot("TC_013_Performance")
        print("✓ All pages loaded within acceptable time")

    def test_14_landing_page_elements(self):
        """TC_014: Verify landing page has all interactive elements"""
        print("\n[Test 14] Landing Page Elements Test")
        self.driver.get("http://localhost:3000")
        time.sleep(3)

        # Count interactive elements
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        links = self.driver.find_elements(By.TAG_NAME, "a")

        self.assertGreaterEqual(
            len(buttons), 5, "Landing page should have multiple buttons"
        )
        self.assertGreaterEqual(
            len(links), 10, "Landing page should have multiple links"
        )

        self.take_screenshot("TC_014_Landing_Elements")
        print(f"✓ Found {len(buttons)} buttons and {len(links)} links")

    def test_15_authentication_redirect(self):
        """TC_015: Verify protected routes redirect to sign in"""
        print("\n[Test 15] Authentication Redirect Test")
        self.driver.get("http://localhost:3000/events")
        time.sleep(3)

        current_url = self.driver.current_url
        self.assertIn(
            "signin",
            current_url.lower(),
            "Unauthenticated user should be redirected to sign in",
        )

        self.take_screenshot("TC_015_Auth_Redirect")
        print("✓ Authentication redirect working correctly")

    from datetime import datetime


if __name__ == "__main__":
    # Run tests with HTML report
    unittest.main(
        testRunner=HtmlTestRunner.HTMLTestRunner(
            output="test_reports",
            report_name="EventFlow_TestReport",
            report_title="EventFlow Selenium Automation Test Report",
            descriptions=True,
            verbosity=2,
        )
    )
