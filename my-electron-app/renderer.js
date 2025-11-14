// Store chats for each person
const chats = {
  'John Doe': [],
  'Jane Smith': []
};

let currentChat = 'John Doe';

// Elements
const contactsList = document.getElementById('contacts-list');
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const addPersonBtn = document.getElementById('add-person-btn');
const contentArea = document.querySelector('.content');

// Modal elements
const addPersonModal = document.getElementById('add-person-modal');
const modalInput = document.getElementById('modal-input');
const modalAddBtn = document.getElementById('modal-add-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Load chat when clicking a contact
contactsList.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-btn');
  if (removeBtn) {
    removeContact(removeBtn);
    return;
  }

  const contactItem = e.target.closest('.contact-item');
  if (!contactItem) return;

  // Remove active class from all
  document.querySelectorAll('.contact-item').forEach(item => {
    item.classList.remove('active');
  });

  // Add active class to clicked item
  contactItem.classList.add('active');

  // Get contact name (trim to exclude button)
  const contactNameDiv = contactItem.querySelector('.contact-name');
  currentChat = contactNameDiv.textContent.trim();

  // Load and display the chat
  displayChat();
});

// Remove contact function
function removeContact(btn) {
  const contactItem = btn.closest('.contact-item');
  const contactNameDiv = contactItem.querySelector('.contact-name');
  const contactName = contactNameDiv.textContent.trim();

  if (confirm(`Are you sure you want to remove ${contactName}?`)) {
    // Remove from chats object
    delete chats[contactName];

    // Remove from DOM
    contactItem.remove();

    // If it was the current chat, switch to first available
    if (currentChat === contactName) {
      const firstContact = document.querySelector('.contact-item');
      if (firstContact) {
        firstContact.classList.add('active');
        const firstNameDiv = firstContact.querySelector('.contact-name');
        currentChat = firstNameDiv.textContent.trim();
      } else {
        currentChat = null;
      }
      displayChat();
    }
  }
}

// Display chat messages
function displayChat() {
  const messages = chats[currentChat] || [];
  contentArea.innerHTML = `<h2>${currentChat}</h2>`;

  const messagesContainer = document.createElement('div');
  messagesContainer.style.display = 'flex';
  messagesContainer.style.flexDirection = 'column';
  messagesContainer.style.gap = '5px';

  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.style.padding = '10px';
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.maxWidth = '70%';
    msgDiv.style.wordWrap = 'break-word';

    if (msg.sender === 'You') {
      msgDiv.style.background = '#0078d4';
      msgDiv.style.marginLeft = 'auto';
      msgDiv.style.marginRight = '0';
    } else {
      msgDiv.style.background = '#333';
      msgDiv.style.marginLeft = '0';
    }

    msgDiv.textContent = `${msg.sender}: ${msg.text}`;
    messagesContainer.appendChild(msgDiv);
  });

  contentArea.appendChild(messagesContainer);

  // Scroll to bottom
  contentArea.scrollTop = contentArea.scrollHeight;
}

// Send message
submitBtn.addEventListener('click', () => {
  const message = textInput.value.trim();
  if (!message) return;

  // Add message to current chat
  if (!chats[currentChat]) {
    chats[currentChat] = [];
  }

  chats[currentChat].push({
    sender: 'You',
    text: message
  });

  textInput.value = '';
  displayChat();
});

// Send message on Enter key
textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitBtn.click();
  }
});

// Add new person
addPersonBtn.addEventListener('click', () => {
  addPersonModal.classList.add('active');
  modalInput.value = '';
  modalInput.focus();
});

// Cancel modal
modalCancelBtn.addEventListener('click', () => {
  addPersonModal.classList.remove('active');
});

// Add person from modal
modalAddBtn.addEventListener('click', () => {
  const name = modalInput.value.trim();
  
  if (!name) {
    alert('Please enter a username');
    return;
  }

  // Check if person already exists
  if (chats[name]) {
    alert('This person already exists!');
    return;
  }

  // Add to chats object
  chats[name] = [];

  // Add to contacts list
  const contactItem = document.createElement('div');
  contactItem.className = 'contact-item';
  contactItem.innerHTML = `
    <div class="contact-name">${name}</div>
    <button class="remove-btn" title="Remove">×</button>
  `;

  contactsList.appendChild(contactItem);

  // Auto-select new contact
  document.querySelectorAll('.contact-item').forEach(item => {
    item.classList.remove('active');
  });
  contactItem.classList.add('active');
  currentChat = name;
  displayChat();

  // Close modal
  addPersonModal.classList.remove('active');
});

// Close modal on Enter key
modalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    modalAddBtn.click();
  }
});

// Window controls
document.getElementById('min-btn').addEventListener('click', () => {
  window.electronAPI.minimize();
});

document.getElementById('max-btn').addEventListener('click', () => {
  window.electronAPI.maximize();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.close();
});

// Initialize with first contact
displayChat();
