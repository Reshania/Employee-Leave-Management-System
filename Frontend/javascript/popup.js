// Popup Message System
class PopupMessage {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create popup container if it doesn't exist
    if (!document.getElementById('popup-container')) {
      this.container = document.createElement('div');
      this.container.id = 'popup-container';
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('popup-container');
    }
  }

  show(message, type = 'info', title = '') {
    // Remove existing popup if any
    this.hide();

    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: scale(0.7);
      transition: transform 0.3s ease;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 10px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title || this.getTitle(type);
    titleElement.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: ${this.getColor(type)};
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.backgroundColor = '#f0f0f0';
    closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'transparent';
    closeBtn.onclick = () => this.hide();

    header.appendChild(titleElement);
    header.appendChild(closeBtn);

    // Create body
    const body = document.createElement('div');
    body.style.cssText = `
      padding: 20px;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    `;
    body.textContent = message;

    // Create footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 10px 20px 20px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `
      background: ${this.getColor(type)};
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
    `;
    okBtn.onmouseover = () => okBtn.style.opacity = '0.9';
    okBtn.onmouseout = () => okBtn.style.opacity = '1';
    okBtn.onclick = () => this.hide();

    footer.appendChild(okBtn);

    // Assemble popup
    popup.appendChild(header);
    popup.appendChild(body);
    popup.appendChild(footer);

    this.container.appendChild(popup);
    this.container.style.display = 'flex';

    // Animate in
    setTimeout(() => {
      popup.style.transform = 'scale(1)';
    }, 10);

    // Auto close after 5 seconds for info messages
    if (type === 'info' || type === 'success') {
      setTimeout(() => {
        this.hide();
      }, 5000);
    }

    // Close on background click
    this.container.onclick = (e) => {
      if (e.target === this.container) {
        this.hide();
      }
    };

    // Close on Escape key
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.container.innerHTML = '';
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
    }
  }

  getTitle(type) {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Message';
    }
  }

  getColor(type) {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#007bff';
      default: return '#6c757d';
    }
  }

  // Static methods for easy access
  static success(message, title) {
    const popup = new PopupMessage();
    popup.show(message, 'success', title);
  }

  static error(message, title) {
    const popup = new PopupMessage();
    popup.show(message, 'error', title);
  }

  static warning(message, title) {
    const popup = new PopupMessage();
    popup.show(message, 'warning', title);
  }

  static info(message, title) {
    const popup = new PopupMessage();
    popup.show(message, 'info', title);
  }
}

// Global functions for backward compatibility
function showPopup(message, type = 'info', title = '') {
  const popup = new PopupMessage();
  popup.show(message, type, title);
}

function showSuccess(message, title = '') {
  PopupMessage.success(message, title);
}

function showError(message, title = '') {
  PopupMessage.error(message, title);
}

function showWarning(message, title = '') {
  PopupMessage.warning(message, title);
}

function showInfo(message, title = '') {
  PopupMessage.info(message, title);
}

// Make PopupMessage available globally
window.PopupMessage = PopupMessage;
window.showPopup = showPopup;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
