// Test script to verify form functionality
// This script can be run in the browser console to test the form

console.log('🧪 Starting Form Functionality Test...');

// Test data
const testData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '0123456789',
  service: 'commercial',
  message: 'I need professional cleaning services for my office building. Please provide a quote for weekly cleaning services.'
};

// Function to test form validation
function testFormValidation() {
  console.log('📋 Testing Form Validation...');
  
  // Test empty form submission
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log('✅ Submit button found');
    
    // Try to submit empty form
    submitButton.click();
    
    setTimeout(() => {
      const errorMessages = document.querySelectorAll('[role="alert"], .text-destructive');
      if (errorMessages.length > 0) {
        console.log('✅ Validation working - found error messages:', errorMessages.length);
      } else {
        console.log('❌ Validation not working - no error messages found');
      }
    }, 1000);
  } else {
    console.log('❌ Submit button not found');
  }
}

// Function to fill form with test data
function fillFormWithTestData() {
  console.log('📝 Filling form with test data...');
  
  // Fill name field
  const nameInput = document.querySelector('input[placeholder*="name"], input[name="name"]');
  if (nameInput) {
    nameInput.value = testData.name;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Name field filled');
  } else {
    console.log('❌ Name field not found');
  }
  
  // Fill email field
  const emailInput = document.querySelector('input[type="email"], input[placeholder*="email"]');
  if (emailInput) {
    emailInput.value = testData.email;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Email field filled');
  } else {
    console.log('❌ Email field not found');
  }
  
  // Fill phone field
  const phoneInput = document.querySelector('input[type="tel"], input[placeholder*="phone"]');
  if (phoneInput) {
    phoneInput.value = testData.phone;
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Phone field filled');
  } else {
    console.log('❌ Phone field not found');
  }
  
  // Fill service select
  const serviceSelect = document.querySelector('select, [role="combobox"]');
  if (serviceSelect) {
    // For regular select
    if (serviceSelect.tagName === 'SELECT') {
      serviceSelect.value = testData.service;
      serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('✅ Service field filled (select)');
    } else {
      // For shadcn select component
      serviceSelect.click();
      setTimeout(() => {
        const commercialOption = document.querySelector('[data-value="commercial"], [value="commercial"]');
        if (commercialOption) {
          commercialOption.click();
          console.log('✅ Service field filled (shadcn)');
        } else {
          console.log('❌ Commercial service option not found');
        }
      }, 500);
    }
  } else {
    console.log('❌ Service field not found');
  }
  
  // Fill message field
  const messageTextarea = document.querySelector('textarea, input[placeholder*="message"]');
  if (messageTextarea) {
    messageTextarea.value = testData.message;
    messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    messageTextarea.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Message field filled');
  } else {
    console.log('❌ Message field not found');
  }
}

// Function to test form submission
function testFormSubmission() {
  console.log('🚀 Testing Form Submission...');
  
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    // Monitor for success/error messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const successMessage = document.querySelector('.text-green-600');
          const errorMessage = document.querySelector('.text-red-600');
          
          if (successMessage) {
            console.log('✅ Success message displayed:', successMessage.textContent);
            console.log('🎉 Form submission test PASSED!');
          }
          
          if (errorMessage) {
            console.log('⚠️ Error message displayed:', errorMessage.textContent);
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Submit the form
    submitButton.click();
    console.log('📤 Form submitted, waiting for response...');
    
    // Stop observing after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log('🔍 Test completed');
    }, 10000);
  } else {
    console.log('❌ Submit button not found');
  }
}

// Function to check API configuration
async function checkAPIConfiguration() {
  console.log('🔧 Checking API Configuration...');
  
  try {
    const response = await fetch('/api/send-quote-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API endpoint working');
      console.log('📧 Response:', result);
      
      if (result.warning) {
        console.log('⚠️ Warning: Using dummy API key - emails will not be sent');
      } else {
        console.log('✅ Email should be sent to contact@jayanexus.com');
      }
    } else {
      console.log('❌ API error:', result);
    }
  } catch (error) {
    console.log('❌ API request failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🎯 Running Complete Form Test Suite...');
  console.log('='.repeat(50));
  
  // Test 1: Validation
  testFormValidation();
  
  // Wait a bit then fill form
  setTimeout(() => {
    // Test 2: Fill form
    fillFormWithTestData();
    
    // Wait a bit then test submission
    setTimeout(() => {
      // Test 3: Submit form
      testFormSubmission();
    }, 2000);
  }, 2000);
  
  // Test 4: API configuration
  await checkAPIConfiguration();
  
  console.log('='.repeat(50));
  console.log('🏁 Test suite initiated. Check console for results.');
}

// Export for manual testing
window.testForm = {
  runAllTests,
  testFormValidation,
  fillFormWithTestData,
  testFormSubmission,
  checkAPIConfiguration
};

console.log('🎮 Test functions available:');
console.log('- testForm.runAllTests() - Run complete test suite');
console.log('- testForm.testFormValidation() - Test validation only');
console.log('- testForm.fillFormWithTestData() - Fill form with test data');
console.log('- testForm.testFormSubmission() - Test form submission');
console.log('- testForm.checkAPIConfiguration() - Test API endpoint');
console.log('');
console.log('💡 To run all tests: testForm.runAllTests()');
