

// Display current date on page load
function showCurrentDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const formatted = dayName + ", " + monthName + " " + day + ", " + year;
    document.getElementById("current-date").textContent = formatted;
  }
  
  // Set min and max dates for DOB field
  function setDateLimits() {
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    const minDateStr = minDate.toISOString().split('T')[0];
    
    const dobField = document.getElementById("dob");
    if (dobField) {
      dobField.setAttribute("max", maxDate);
      dobField.setAttribute("min", minDateStr);
    }
  }
  
  // Format phone number as (XXX)-XXX-XXXX
  function formatPhoneNumber(value) {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format based on length
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 3) {
      return '(' + numbers;
    } else if (numbers.length <= 6) {
      return '(' + numbers.slice(0, 3) + ')-' + numbers.slice(3);
    } else {
      return '(' + numbers.slice(0, 3) + ')-' + numbers.slice(3, 6) + '-' + numbers.slice(6, 10);
    }
  }
  
  // Format SSN as ***-**-**** with hidden digits
  function formatSSN(value) {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format based on length of actual numbers entered
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 3) {
      return '*'.repeat(numbers.length);
    } else if (numbers.length <= 5) {
      return '***-' + '*'.repeat(numbers.length - 3);
    } else if (numbers.length <= 9) {
      return '***-**-' + '*'.repeat(numbers.length - 5);
    } else {
      return '***-**-****';
    }
  }
  
  // Format ZIP code as XXXXX or XXXXX-XXXX
  function formatZipCode(value) {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format based on length
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 5) {
      return numbers;
    } else {
      // Automatically add dash after 5th digit
      return numbers.slice(0, 5) + '-' + numbers.slice(5, 9);
    }
  }
  
  // Setup phone number auto-formatting
  function setupPhoneFormatting() {
    const phoneField = document.getElementById("phone");
    if (phoneField) {
      phoneField.addEventListener("input", function(e) {
        const cursorPosition = this.selectionStart;
        const oldLength = this.value.length;
        const oldValue = this.value;
        
        this.value = formatPhoneNumber(this.value);
        
        // Adjust cursor position
        if (oldValue !== this.value) {
          const newLength = this.value.length;
          let newCursorPos = cursorPosition + (newLength - oldLength);
          this.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    }
  }
  
  // Setup SSN auto-formatting with hidden digits (displays as XXX-XX-XXXX)
  function setupSSNFormatting() {
    const ssnField = document.getElementById("ssn");
    if (ssnField) {
      let actualSSN = ''; // Store the actual SSN value
      
      ssnField.addEventListener("input", function(e) {
        const inputValue = e.data; // Get the character that was just typed
        
        // If user is deleting
        if (e.inputType === 'deleteContentBackward') {
          actualSSN = actualSSN.slice(0, -1);
        } 
        // If user is typing a digit
        else if (inputValue && /\d/.test(inputValue)) {
          // Only add if we haven't reached max length (9 digits)
          if (actualSSN.length < 9) {
            actualSSN += inputValue;
          }
        }
        // Handle paste event
        else if (e.inputType === 'insertFromPaste') {
          const pastedText = this.value.replace(/\D/g, '');
          actualSSN = pastedText.slice(0, 9);
        }
        
        // Display formatted version based on actual length
        if (actualSSN.length === 0) {
          this.value = '';
        } else if (actualSSN.length <= 3) {
          this.value = 'X'.repeat(actualSSN.length);
        } else if (actualSSN.length <= 5) {
          this.value = 'XXX-' + 'X'.repeat(actualSSN.length - 3);
        } else {
          this.value = 'XXX-XX-' + 'X'.repeat(actualSSN.length - 5);
        }
        
        // Store actual value in a data attribute for form submission
        this.setAttribute('data-ssn', actualSSN);
      });
    }
  }
  
  // Setup ZIP code auto-formatting
  function setupZipFormatting() {
    const zipField = document.getElementById("zip");
    if (zipField) {
      zipField.addEventListener("input", function(e) {
        const cursorPosition = this.selectionStart;
        const oldLength = this.value.length;
        this.value = formatZipCode(this.value);
        const newLength = this.value.length;
        
        // Adjust cursor position
        const diff = newLength - oldLength;
        this.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
      });
    }
  }
  
  // Update health score display dynamically
  function updateHealthScore() {
    const slider = document.getElementById("healthscore");
    const scoreDisplay = document.getElementById("score");
    
    if (slider && scoreDisplay) {
      slider.addEventListener("input", function() {
        scoreDisplay.textContent = this.value;
      });
    }
  }
  
  // Convert User ID to lowercase on input
  function setupUserIdConversion() {
    const userIdField = document.getElementById("userId");
    if (userIdField) {
      userIdField.addEventListener("input", function() {
        this.value = this.value.toLowerCase();
      });
    }
  }
  
  // Validate DOB range
  function validateDOB(dobValue) {
    const dob = new Date(dobValue);
    const today = new Date();
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120);
    
    if (dob > today) {
      return { valid: false, message: "ERROR: Date of Birth cannot be in the future" };
    }
    if (dob < maxAge) {
      return { valid: false, message: "ERROR: Date of Birth cannot be more than 120 years ago" };
    }
    return { valid: true, message: "pass" };
  }
  
  // Validate User ID
  function validateUserId(userId) {
    if (userId.length < 5 || userId.length > 30) {
      return { valid: false, message: "ERROR: User ID must be 5-30 characters" };
    }
    if (!/^[a-z][a-z0-9_\-]*$/i.test(userId)) {
      return { valid: false, message: "ERROR: User ID must start with letter, no spaces or special chars" };
    }
    return { valid: true, message: "pass" };
  }
  
  // Validate Password
  function validatePassword(password, userId, firstName, lastName) {
    const errors = [];
    
    if (password.length < 8 || password.length > 30) {
      errors.push("8-30 characters required");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("missing lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("missing uppercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("missing number");
    }
    if (!/[!@#%^&*()\-_+=\\/<>.,`~]/.test(password)) {
      errors.push("missing special character");
    }
    if (/"/.test(password)) {
      errors.push("quotes not allowed");
    }
    
    // Check if password contains user ID or name
    const lowerPassword = password.toLowerCase();
    if (userId && lowerPassword.includes(userId.toLowerCase())) {
      errors.push("cannot contain User ID");
    }
    if (firstName && lowerPassword.includes(firstName.toLowerCase())) {
      errors.push("cannot contain first name");
    }
    if (lastName && lowerPassword.includes(lastName.toLowerCase())) {
      errors.push("cannot contain last name");
    }
    
    if (errors.length > 0) {
      return { valid: false, message: "ERROR: " + errors.join(", ") };
    }
    return { valid: true, message: "pass" };
  }
  
  // Validate passwords match
  function validatePasswordMatch(password, repassword) {
    if (password !== repassword) {
      return { valid: false, message: "ERROR: Passwords do not match" };
    }
    return { valid: true, message: "pass" };
  }
  
  // Validate ZIP code and truncate if needed
  function validateZip(zip) {
    if (zip.length === 5 && /^\d{5}$/.test(zip)) {
      return { valid: true, message: "pass", value: zip };
    }
    if (zip.length === 10 && /^\d{5}-\d{4}$/.test(zip)) {
      return { valid: true, message: "pass", value: zip };
    }
    return { valid: false, message: "ERROR: Invalid ZIP format", value: zip };
  }
  
  // Get actual SSN value (digits only)
  function getActualSSN() {
    const ssnField = document.getElementById("ssn");
    if (ssnField) {
      const actualSSN = ssnField.getAttribute('data-ssn') || '';
      if (actualSSN.length === 9) {
        return actualSSN.slice(0, 3) + '-' + actualSSN.slice(3, 5) + '-' + actualSSN.slice(5, 9);
      }
      return actualSSN;
    }
    return '';
  }
  
  // Review Form Function
  function reviewForm() {
    const form = document.getElementById("patient-form");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    
    // Get all form values
    const firstName = form.firstName.value.trim();
    const middleInitial = form.middleInitial.value.trim();
    const lastName = form.lastName.value.trim();
    const dob = form.dob.value;
    const ssnActual = form.ssn.getAttribute('data-ssn') || ''; // Get actual 9 digits
    const ssn = ssnActual; // Use actual 9 digits for review
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address1 = form.address1.value.trim();
    const address2 = form.address2.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value;
    const zip = form.zip.value.trim();
    const symptoms = form.symptoms.value.trim();
    const userId = form.userId.value.trim();
    const password = form.password.value;
    const repassword = form.repassword.value;
    const healthscore = form.healthscore.value;
    
    // Get selected values
    const historyChecked = Array.from(form.querySelectorAll('input[name="history"]:checked'))
      .map(cb => cb.value);
    const gender = form.querySelector('input[name="gender"]:checked')?.value || "";
    const vaccinated = form.querySelector('input[name="vaccinated"]:checked')?.value || "";
    const insurance = form.querySelector('input[name="insurance"]:checked')?.value || "";
    
    // Validate each field
    const dobValidation = dob ? validateDOB(dob) : { valid: false, message: "ERROR: Required" };
    const userIdValidation = userId ? validateUserId(userId) : { valid: false, message: "ERROR: Required" };
    const passwordValidation = password ? validatePassword(password, userId, firstName, lastName) : { valid: false, message: "ERROR: Required" };
    const passwordMatchValidation = (password && repassword) ? validatePasswordMatch(password, repassword) : { valid: false, message: "ERROR: Required" };
    const zipValidation = zip ? validateZip(zip) : { valid: false, message: "ERROR: Required", value: "" };
    
    // Build review HTML
    let html = '';
    
    // Personal Information Section
    html += '<div class="review-section">';
    html += '<h3>Personal Information</h3>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Name:</span>';
    html += '<span class="review-value">' + (firstName || '[Missing]') + ' ' + middleInitial + ' ' + (lastName || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (firstName && lastName ? 'pass' : 'error') + '">' + (firstName && lastName ? 'pass' : 'ERROR: Required') + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Date of Birth:</span>';
    html += '<span class="review-value">' + (dob || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (dobValidation.valid ? 'pass' : 'error') + '">' + dobValidation.message + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Social Security:</span>';
    html += '<span class="review-value">' + (ssn ? 'XXX-XX-XXXX' : '[Missing]') + '</span>';
    html += '<span class="review-status ' + (ssn && ssn.length === 9 ? 'pass' : 'error') + '">' + (ssn && ssn.length === 9 ? 'pass' : 'ERROR: Must enter 9 digits') + '</span>';
    html += '</div>';
    
    html += '</div>';
    
    // Contact Information Section
    html += '<div class="review-section">';
    html += '<h3>Contact Information</h3>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Email:</span>';
    html += '<span class="review-value">' + (email || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (email ? 'pass' : 'error') + '">' + (email ? 'pass' : 'ERROR: Required') + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Phone:</span>';
    const phoneDigits = phone.replace(/\D/g, '');
    html += '<span class="review-value">' + (phone || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (phoneDigits.length === 10 ? 'pass' : 'error') + '">' + (phoneDigits.length === 10 ? 'pass' : 'ERROR: Must be 10 digits') + '</span>';
    html += '</div>';
    
    html += '</div>';
    
    // Address Section
    html += '<div class="review-section">';
    html += '<h3>Address</h3>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Address:</span>';
    html += '<span class="review-value">';
    html += address1 || '[Missing]';
    if (address2) html += '<br>' + address2;
    html += '<br>' + (city || '[Missing]') + ', ' + (state || '[Missing]') + ' ' + (zipValidation.value || '[Missing]');
    html += '</span>';
    html += '<span class="review-status ' + (address1 && address1.length >= 2 && address1.length <= 30 && city && state && zipValidation.valid ? 'pass' : 'error') + '">';
    html += (address1 && address1.length >= 2 && address1.length <= 30 && city && state && zipValidation.valid ? 'pass' : 'ERROR: Check required fields');
    html += '</span>';
    html += '</div>';
    
    html += '</div>';
    
    // Medical Information Section
    html += '<div class="review-section">';
    html += '<h3>Medical Information</h3>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Medical History:</span>';
    html += '<span class="review-value">';
    if (historyChecked.length > 0) {
      html += historyChecked.join(', ');
    } else {
      html += 'None selected';
    }
    html += '</span>';
    html += '<span class="review-status pass">pass</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Gender:</span>';
    html += '<span class="review-value">' + (gender || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (gender ? 'pass' : 'error') + '">' + (gender ? 'pass' : 'ERROR: Required') + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Vaccinated:</span>';
    html += '<span class="review-value">' + (vaccinated || 'Not specified') + '</span>';
    html += '<span class="review-status pass">pass</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Insurance:</span>';
    html += '<span class="review-value">' + (insurance || 'Not specified') + '</span>';
    html += '<span class="review-status pass">pass</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Health Score:</span>';
    html += '<span class="review-value">' + healthscore + ' / 10</span>';
    html += '<span class="review-status pass">pass</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Symptoms:</span>';
    html += '<span class="review-value">' + (symptoms || 'None provided') + '</span>';
    html += '<span class="review-status pass">pass</span>';
    html += '</div>';
    
    html += '</div>';
    
    // User Credentials Section
    html += '<div class="review-section">';
    html += '<h3>User Credentials</h3>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">User ID:</span>';
    html += '<span class="review-value">' + (userId || '[Missing]') + '</span>';
    html += '<span class="review-status ' + (userIdValidation.valid ? 'pass' : 'error') + '">' + userIdValidation.message + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Password:</span>';
    html += '<span class="review-value">' + (password ? password.replace(/./g, '*') + ' (masked)' : '[Missing]') + '</span>';
    html += '<span class="review-status ' + (passwordValidation.valid ? 'pass' : 'error') + '">' + passwordValidation.message + '</span>';
    html += '</div>';
    
    html += '<div class="review-row">';
    html += '<span class="review-label">Password Match:</span>';
    html += '<span class="review-value">' + (password && repassword && password === repassword ? 'Confirmed' : 'Does not match') + '</span>';
    html += '<span class="review-status ' + (passwordMatchValidation.valid ? 'pass' : 'error') + '">' + passwordMatchValidation.message + '</span>';
    html += '</div>';
    
    html += '</div>';
    
    // Display the review
    reviewContent.innerHTML = html;
    reviewContainer.style.display = 'block';
    
    // Scroll to review section
    reviewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Clear form function
  function clearForm() {
    if (confirm("Are you sure you want to clear all form data?")) {
      document.getElementById("patient-form").reset();
      document.getElementById("review-container").style.display = 'none';
      document.getElementById("score").textContent = '5';
      
      // Clear SSN data attribute
      const ssnField = document.getElementById("ssn");
      if (ssnField) {
        ssnField.setAttribute('data-ssn', '');
      }
    }
  }
  
  // Form submission validation
  function validateFormOnSubmit(event) {
    const form = document.getElementById("patient-form");
    const ssnField = document.getElementById("ssn");
    
    // Get the actual SSN from data attribute (9 digits)
    const actualSSNValue = ssnField.getAttribute('data-ssn') || '';
    
    // Check if SSN has exactly 9 digits
    if (actualSSNValue.length !== 9) {
      alert("Social Security Number is required. Please enter all 9 digits.");
      event.preventDefault();
      return false;
    }
    
    // Set the actual 9-digit SSN value for submission (no dashes)
    ssnField.value = actualSSNValue;
    
    // Get form values
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const dob = form.dob.value;
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address1 = form.address1.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value;
    const zip = form.zip.value.trim();
    const userId = form.userId.value.trim();
    const password = form.password.value;
    const repassword = form.repassword.value;
    const gender = form.querySelector('input[name="gender"]:checked');
    
    // Check required fields
    if (!firstName) {
      alert("First Name is required.");
      event.preventDefault();
      return false;
    }
    
    if (!lastName) {
      alert("Last Name is required.");
      event.preventDefault();
      return false;
    }
    
    if (!dob) {
      alert("Date of Birth is required.");
      event.preventDefault();
      return false;
    }
    
    // Validate DOB
    const dobValidation = validateDOB(dob);
    if (!dobValidation.valid) {
      alert(dobValidation.message);
      event.preventDefault();
      return false;
    }
    
    if (!email) {
      alert("Email is required.");
      event.preventDefault();
      return false;
    }
    
    if (!phone) {
      alert("Phone Number is required.");
      event.preventDefault();
      return false;
    }
    
    // Validate phone has exactly 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert("Phone Number must be exactly 10 digits.");
      event.preventDefault();
      return false;
    }
    
    if (address1.length < 2 || address1.length > 30) {
      alert("Address Line 1 must be between 2 and 30 characters.");
      event.preventDefault();
      return false;
    }
    
    if (!city) {
      alert("City is required.");
      event.preventDefault();
      return false;
    }
    
    if (!state) {
      alert("State is required.");
      event.preventDefault();
      return false;
    }
    
    if (!zip) {
      alert("ZIP Code is required.");
      event.preventDefault();
      return false;
    }
    
    if (!gender) {
      alert("Gender is required.");
      event.preventDefault();
      return false;
    }
    
    if (!userId) {
      alert("User ID is required.");
      event.preventDefault();
      return false;
    }
    
    // Validate User ID
    const userIdValidation = validateUserId(userId);
    if (!userIdValidation.valid) {
      alert(userIdValidation.message);
      event.preventDefault();
      return false;
    }
    
    if (!password) {
      alert("Password is required.");
      event.preventDefault();
      return false;
    }
    
    // Validate Password
    const passwordValidation = validatePassword(password, userId, firstName, lastName);
    if (!passwordValidation.valid) {
      alert(passwordValidation.message);
      event.preventDefault();
      return false;
    }
    
    if (!repassword) {
      alert("Re-enter Password is required.");
      event.preventDefault();
      return false;
    }
    
    // Validate Password Match
    const passwordMatchValidation = validatePasswordMatch(password, repassword);
    if (!passwordMatchValidation.valid) {
      alert(passwordMatchValidation.message);
      event.preventDefault();
      return false;
    }
    
    return true;
  }
  
  // Initialize everything on page load
  window.addEventListener("DOMContentLoaded", function() {
    showCurrentDate();
    setDateLimits();
    updateHealthScore();
    setupUserIdConversion();
    setupPhoneFormatting();
    setupSSNFormatting();
    setupZipFormatting();
    
    // Add submit event listener
    const form = document.getElementById("patient-form");
    if (form) {
      form.addEventListener("submit", validateFormOnSubmit);
    }

  });
