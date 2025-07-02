export default function decorate(block) {
  // Utility to get formatted date (YYYY-MM-DD)
  function getFormattedDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
  }

  // Utility to get display date (e.g., 02 Jul, 25)
  function getDisplayDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }).replace(/ /g, ' ');
  }

  // Clear existing content
  block.textContent = '';

  // Create the booking form container
  const bookingForm = document.createElement('div');
  bookingForm.className = 'booking-form';

  // Create form element
  const form = document.createElement('form');
  form.className = 'booking-form-container';

  // Field definitions
  const fields = [
    {
      type: 'text',
      name: 'destination',
      placeholder: 'Where to?',
      label: 'Destination',
      required: true,
    },
    {
      type: 'date',
      name: 'checkin',
      label: 'Check-in Date',
      required: true,
    },
    {
      type: 'date',
      name: 'checkout',
      label: 'Check-out Date',
      required: true,
     
    },
    {
      type: 'select',
      name: 'guests',
      label: 'No. of Guests & Rooms',
      options: [
        { value: '1', text: '1 Adult, 1 Room' },
        { value: '2', text: '2 Adults, 1 Room' },
        { value: '3', text: '2 Adults, 2 Rooms' },
        { value: '4', text: '3 Adults, 2 Rooms' },
        { value: '5', text: '4 Adults, 2 Rooms' },
      ],
      required: true,
    },
  ];

  // Create and append fields
  fields.forEach((field) => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'booking-field';

    const label = document.createElement('label');
    label.textContent = field.label;
    label.setAttribute('for', field.name);

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.name = field.name;
      input.id = field.name;
      input.required = field.required;

      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '1 Adult, 1 Room';
      defaultOption.selected = true;
      input.appendChild(defaultOption);

      // Add options
      field.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        input.appendChild(optionElement);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.name = field.name;
      input.id = field.name;
      input.placeholder = field.placeholder || '';
      input.required = field.required;

      // Set minimum date for check-in and check-out
      if (field.name === 'checkin') {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        input.addEventListener('change', () => {
          const checkoutField = form.querySelector('#checkout');
          if (checkoutField) {
            checkoutField.min = input.value;
          }
        });
      }
      if (field.name === 'checkout') {
        const checkinField = form.querySelector('#checkin');
        if (checkinField && checkinField.value) {
          input.min = checkinField.value;
        }
      }
    }

    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    form.appendChild(fieldContainer);
  });

  // Create search button
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'booking-search-btn';
  searchButton.textContent = 'Search';

  form.appendChild(searchButton);

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const bookingData = {
      destination: formData.get('destination'),
      checkin: formData.get('checkin'),
      checkout: formData.get('checkout'),
      guests: formData.get('guests'),
    };

    // Mock search functionality
    console.log('Searching for hotels with:', bookingData);

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'booking-success';
    successMessage.textContent = `Searching for hotels in ${bookingData.destination} for ${bookingData.guests} guests from ${bookingData.checkin} to ${bookingData.checkout}`;

    // Remove any existing success message
    const existingMessage = bookingForm.querySelector('.booking-success');
    if (existingMessage) {
      existingMessage.remove();
    }

    bookingForm.appendChild(successMessage);

    // Remove success message after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  });

  // Add form to container and container to block
  bookingForm.appendChild(form);
  block.appendChild(bookingForm);
} 