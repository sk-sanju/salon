/**
 * Luxe Beauty Studio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default behavior only if the target exists
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (window.getComputedStyle(navbarToggler).display !== 'none' && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // --- Active Section Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.navbar-nav a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // --- Booking Form Validation ---
    const bookingForm = document.getElementById('booking-form');
    const successMessage = document.getElementById('booking-success');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();

            let isValid = true;
            
            // Validate all required fields
            const requiredFields = bookingForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    
                    // Specific validations
                    if (field.type === 'email' && !validateEmail(field.value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                    if (field.type === 'tel' && !validatePhone(field.value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            });

            // Validate service checkboxes
            const checkedServices = bookingForm.querySelectorAll('input[name="service"]:checked');
            const serviceError = document.getElementById('service-error');
            if (checkedServices.length === 0) {
                isValid = false;
                if(serviceError) serviceError.classList.remove('d-none');
            } else {
                if(serviceError) serviceError.classList.add('d-none');
            }

            // If form is valid, construct WhatsApp URL
            if (isValid) {
                const timeInput = bookingForm.querySelector('input[name="time"]:checked');
                const dateVal = document.getElementById('selected-date').value;
                const nameVal = document.getElementById('name').value;
                const phoneVal = document.getElementById('phone').value;
                
                const service = Array.from(checkedServices).map(input => input.value).join(', ');
                const time = timeInput ? timeInput.value : '';
                
                // Format Date
                let formattedDate = dateVal;
                if(dateVal) {
                    const d = new Date(dateVal);
                    formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                }

                // Construct WhatsApp Message
                const shopPhone = "919539251789";
                const message = `*New Appointment Request* 📅%0A%0A*Name:* ${nameVal}%0A*Phone:* ${phoneVal}%0A*Service:* ${service}%0A*Date:* ${formattedDate}%0A*Time:* ${time}%0A%0APlease confirm my booking.`;
                
                const whatsappUrl = `https://wa.me/${shopPhone}?text=${message}`;
                
                // Open WhatsApp
                window.open(whatsappUrl, '_blank');

                bookingForm.classList.remove('was-validated');
                successMessage.classList.remove('d-none');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 5000);
                
                bookingForm.reset();
                
                // Reset active date state
                document.querySelectorAll('.date-card').forEach((c, i) => {
                    if(i === 0) c.classList.add('active');
                    else c.classList.remove('active');
                });
                const firstCard = document.querySelector('.date-card');
                if(firstCard) {
                    document.getElementById('selected-date').value = firstCard.getAttribute('data-date');
                }
            } else {
                bookingForm.classList.add('was-validated');
            }
        });

        // Remove invalid class on input
        bookingForm.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
            });
        });
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Phone validation helper (basic)
    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.trim().length >= 10;
    }
    // --- Generate Dates for Booking UI ---
    const dateContainer = document.getElementById('date-container');
    if (dateContainer) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        let today = new Date();
        let dateHTML = '';
        
        for (let i = 0; i < 14; i++) {
            let d = new Date();
            d.setDate(today.getDate() + i);
            
            let dayName = days[d.getDay()];
            let dateNum = d.getDate();
            let monthName = months[d.getMonth()];
            let fullDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            let isActive = i === 0 ? 'active' : '';
            
            dateHTML += `
                <div class="date-card rounded-4 p-2 text-center flex-shrink-0 ${isActive}" data-date="${fullDateStr}" onclick="selectDate(this)">
                    <small class="d-block text-muted fw-bold mb-1">${dayName}</small>
                    <h4 class="mb-0 fw-bold">${dateNum}</h4>
                    <small class="d-block text-muted">${monthName}</small>
                </div>
            `;
            
            if (i === 0) {
                document.getElementById('selected-date').value = fullDateStr;
            }
        }
        dateContainer.innerHTML = dateHTML;
        
        // Handle native date picker
        const customDatePicker = document.getElementById('custom-date-picker');
        if (customDatePicker) {
            // Set min date to today
            customDatePicker.min = new Date().toISOString().split('T')[0];
            
            customDatePicker.addEventListener('change', function() {
                if(this.value) {
                    const selectedDate = new Date(this.value);
                    const dayName = days[selectedDate.getDay()];
                    const dateNum = selectedDate.getDate();
                    const monthName = months[selectedDate.getMonth()];
                    
                    // Create a new card for the selected date and insert it at the beginning
                    const newCard = document.createElement('div');
                    newCard.className = 'date-card rounded-4 p-2 text-center flex-shrink-0 active';
                    newCard.setAttribute('data-date', this.value);
                    newCard.setAttribute('onclick', 'selectDate(this)');
                    newCard.innerHTML = `
                        <small class="d-block text-muted fw-bold mb-1">${dayName}</small>
                        <h4 class="mb-0 fw-bold text-gold">${dateNum}</h4>
                        <small class="d-block text-muted">${monthName}</small>
                    `;
                    
                    // Remove active from others
                    document.querySelectorAll('.date-card').forEach(card => card.classList.remove('active'));
                    
                    // Add to container
                    dateContainer.prepend(newCard);
                    
                    // Update hidden input
                    document.getElementById('selected-date').value = this.value;
                }
            });
        }
    }

    window.selectDate = function(element) {
        // Remove active class from all
        document.querySelectorAll('.date-card').forEach(card => card.classList.remove('active'));
        // Add active class to clicked
        element.classList.add('active');
        // Set hidden input value
        document.getElementById('selected-date').value = element.getAttribute('data-date');
    }
});

// --- Custom Lightbox Functionality ---
let lightboxElement = null;
let lightboxImg = null;

// Initialize lightbox elements
document.addEventListener('DOMContentLoaded', () => {
    lightboxElement = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    
    // Close lightbox on click outside image
    if (lightboxElement) {
        lightboxElement.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && lightboxElement && lightboxElement.style.display === "block") {
            closeLightbox();
        }
    });
});

// Global functions for inline onclick handlers
window.openLightbox = function(element) {
    if (!lightboxElement || !lightboxImg) return;
    
    // Get image source from the clicked element
    const imgSrc = element.querySelector('img').src;
    
    // Set lightbox image source
    lightboxImg.src = imgSrc;
    
    // Show lightbox
    lightboxElement.style.display = "block";
    
    // Trigger reflow for transition
    void lightboxElement.offsetWidth;
    
    // Add show class for fade in
    lightboxElement.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
    if (!lightboxElement) return;
    
    // Remove show class for fade out
    lightboxElement.classList.remove('show');
    
    // Hide after transition
    setTimeout(() => {
        lightboxElement.style.display = "none";
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }, 300);
}
