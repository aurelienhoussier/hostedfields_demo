// Hosted Fields Builder - Liberté totale de configuration

class HostedFieldsBuilder {
    constructor() {
        this.config = {
            html: '',
            css: '',
            apiResponse: {},
            sessionData: {},
            styleConfig: {},
            fieldsConfig: {},
            eventHandlers: []
        };
        this.hostedFieldsInstance = null;
        this.sdkLoaded = false;
        this.eventHandlerCount = 0;
        this.availableEvents = [
            'focus',
            'blur',
            'empty',
            'valid',
            'invalid',
            'field-ready',
            'all-fields-ready',
            'error-init-fields',
            'card-brand-selected',
            'card-brand-entry',
            'error',
            'validityChange'
        ];
        this.dangerousPatterns = [
            { regex: /window\.location/gi, name: 'window.location', severity: 'danger', reason: 'Can redirect to malicious sites' },
            { regex: /eval\s*\(/gi, name: 'eval()', severity: 'danger', reason: 'Dynamic code execution' },
            { regex: /Function\s*\(/gi, name: 'Function()', severity: 'danger', reason: 'Dynamic code execution' },
            { regex: /localStorage|sessionStorage/gi, name: 'Storage access', severity: 'warning', reason: 'May expose sensitive data' },
            { regex: /fetch\s*\(|XMLHttpRequest/gi, name: 'Network requests', severity: 'warning', reason: 'HTTP requests to external servers' },
            { regex: /document\.write|innerHTML\s*=/gi, name: 'DOM manipulation', severity: 'warning', reason: 'Can inject malicious content' },
            { regex: /\.cookie/gi, name: 'Cookie access', severity: 'danger', reason: 'Can steal session cookies' },
            { regex: /\.submit\s*\(|\.click\s*\(/gi, name: 'Form submission', severity: 'info', reason: 'May trigger unintended actions' }
        ];
        this.templates = {
            classic: this.getClassicTemplate(),
            creditcard: this.getCreditCardTemplate()
        };
        this.init();
    }

    init() {
        this.loadDemoData();
    }

    getClassicTemplate() {
        return {
            html: `<div class="classic-card">
  <div class="classic-header">
    <div class="classic-icon">💳</div>
    <h1>Secure Payment</h1>
    <p>Enter your card information</p>
  </div>

  <form id="paymentForm" class="classic-form">
    <div class="classic-group">
      <label>Card Holder</label>
      <div id="cardholderName" class="classic-field"></div>
    </div>

    <div class="classic-group">
      <div class="classic-label-row">
        <label>Card Number</label>
        <div id="cardBrands" class="classic-card-brand-overlay"></div>
      </div>
      <div class="card-number-container">
        <div id="card-field" class="classic-field"></div>
      </div>
    </div>

    <div class="classic-row">
      <div class="classic-group">
        <label>Expiry Date</label>
        <div id="expiryDate" class="classic-field"></div>
      </div>
      <div class="classic-group">
        <label>CVV</label>
        <div id="csc" class="classic-field"></div>
      </div>
    </div>

    <button type="submit" class="classic-submit-button">Pay Now</button>
  </form>
</div>`,
            css: `/* ========== CLASSIC CARD CONTAINER ========== */
.classic-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 40px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.5s ease-out;
    margin: 0 auto;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ========== HEADER ========== */
.classic-header {
    text-align: center;
    margin-bottom: 30px;
}

.classic-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.classic-header h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 8px 0;
}

.classic-header p {
    font-size: 1rem;
    color: #666;
    margin: 0;
}

/* ========== FORM ========== */
.classic-form {
    display: flex;
    flex-direction: column;
}

/* ========== FORM GROUP ========== */
.classic-group {
    margin-bottom: 20px;
}

.classic-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.classic-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.classic-label-row label {
    margin-bottom: 0;
}

/* ========== FORM ROW (2 colonnes) ========== */
.classic-row {
    display: flex;
    gap: 15px;
}

.classic-row .classic-group {
    flex: 1;
}

/* ========== HOSTED FIELD ========== */
.classic-field {
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 15px;
    background: #fafafa;
    transition: all 0.3s ease;
    height: 55px;
    min-height: 55px;
    display: flex;
    align-items: center;
}

.classic-field iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
}

.classic-field:focus-within {
    border-color: #0050D8;
    box-shadow: 0 0 0 3px rgba(0, 80, 216, 0.1);
    background: #fff;
}

.classic-field.valid {
    border-color: #10b981;
    background: #ecfdf5;
}

.classic-field.invalid {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    background: #fef2f2;
}

/* ========== CARD NUMBER CONTAINER ========== */
.card-number-container {
    position: relative;
    width: 100%;
}

.card-number-container .classic-field {
    width: 100%;
    padding-right: 60px;
}

/* ========== CARD BRAND OVERLAY ========== */
.classic-card-brand-overlay {
    display: inline;
    align-items: center;
}

.classic-card-brand-overlay iframe {
    border: none !important;
    background: transparent !important;
    max-height: 44px;
}

/* ========== BUTTON ========== */
.classic-submit-button {
    width: 100%;
    padding: 16px 24px;
    margin-top: 10px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #0050D8 0%, #003DA5 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 80, 216, 0.4);
}

.classic-submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 80, 216, 0.6);
}

.classic-submit-button:active {
    transform: translateY(0);
}

.classic-submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}`,
            fieldsConfig: {
                "cardNumber": {
                    "id": "card-field",
                    "title": "Card Number",
                    "placeholder": "0000 0000 0000 0000",
                    "caption": "Card Number"
                },
                "cardholderName": {
                    "id": "cardholderName",
                    "title": "Card Holder",
                    "placeholder": "John Doe"
                },
                "cardBrands": {
                    "id": "cardBrands",
                    "title": "Card Brand",
                    "placeholder": "VISA"
                },
                "expiryDate": {
                    "id": "expiryDate",
                    "caption": "Expiry Date",
                    "checkExpiredDate": "true",
                    "placeholder": "MM/YY"
                },
                "csc": {
                    "id": "csc",
                    "title": "Security Code",
                    "caption": "CVV",
                    "placeholder": "123"
                }
            },
            styleConfig: {
                input: {
                    color: '#1a1a2e',
                    'font-family': '"Segoe UI", Arial, sans-serif',
                    'font-size': '15px',
                    border: 'none',
                    padding: '0',
                    'background-color': 'transparent'
                },
                placeholder: {
                    color: '#9ca3af'
                },
                focus: {
                    'border-color': '#0050D8',
                    'box-shadow': 'none'
                }
            }
        };
    }

    getCreditCardTemplate() {
        return {
            html: `<div class="cc-container">
  <form id="paymentForm" class="cc-form">
    <div class="cc-card">
      <div class="cc-top">
        <div class="cc-chip">
          <div class="cc-chip-line"></div>
          <div class="cc-chip-line"></div>
          <div class="cc-chip-line"></div>
        </div>
        <div class="cc-brand">
          <div id="cardBrands" class="cc-brand-sdk"></div>
        </div>
      </div>

      <div class="cc-number">
        <div id="card-field" class="cc-field"></div>
      </div>

      <div class="cc-bottom">
        <div class="cc-holder">
          <span>Card Holder</span>
          <div id="cardholderName" class="cc-field"></div>
        </div>
        <div class="cc-expiry">
          <span>Expiry</span>
          <div id="expiryDate" class="cc-field"></div>
        </div>
        <div class="cc-cvv">
          <span>CVV</span>
          <div id="csc" class="cc-field"></div>
        </div>
      </div>
    </div>
    <button type="submit" class="cc-submit">Pay Now</button>
  </form>
</div>`,
            css: `.cc-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    padding: 20px;
}

.cc-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cc-card {
    width: 400px;
    min-height: 250px;
    padding: 25px;
    border-radius: 20px;
    background: linear-gradient(135deg, #1a1500 0%, #3d3015 50%, #2a2005 100%);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
}

.cc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.cc-chip {
    width: 50px;
    height: 38px;
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 6px 8px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.cc-chip-line {
    height: 3px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 2px;
}

.cc-brand {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.cc-brand-sdk {
    height: 40px;
    padding-left: 60%;
    min-width: 80px;
    width: auto;
}

.cc-number {
    margin: 20px 0;
}

.cc-field {
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(212, 175, 55, 0.4) !important;
    padding: 8px 0;
    height: 55px;
    min-height: 55px;
    max-height: 44px;
}

.cc-field iframe {
    border: none !important;
    background: transparent !important;
}

.cc-bottom {
    display: flex !important;
    flex-direction: row !important;
    gap: 20px;
    align-items: flex-start;
    margin-top: 15px;
}

.cc-holder {
    flex: 2;
    min-width: 0;
}

.cc-expiry {
    flex: 1;
    min-width: 80px;
}

.cc-cvv {
    flex: 1;
    min-width: 70px;
}

.cc-holder span,
.cc-expiry span,
.cc-cvv span {
    display: block;
    font-size: 10px;
    color: rgba(212, 175, 55, 0.7);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
    font-weight: 500;
}

.cc-submit {
    margin-top: 30px;
    padding: 16px 70px;
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
    border: none;
    border-radius: 30px;
    color: #1a1500;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
}

.cc-submit:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
}

.cc-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}`,
            fieldsConfig: {
                "cardNumber": {
                    "id": "card-field",
                    "title": "Card Number",
                    "placeholder": "•••• •••• •••• ••••",
                    "caption": "Card Number"
                },
                "cardholderName": {
                    "id": "cardholderName",
                    "title": "Card Holder",
                    "placeholder": "YOUR NAME"
                },
                "cardBrands": {
                    "id": "cardBrands",
                    "title": "Card Brand",
                    "placeholder": "VISA"
                },
                "expiryDate": {
                    "id": "expiryDate",
                    "caption": "Expiry Date",
                    "checkExpiredDate": "true",
                    "placeholder": "MM/YY"
                },
                "csc": {
                    "id": "csc",
                    "title": "Security Code",
                    "caption": "CVV",
                    "placeholder": "•••"
                }
            },
            styleConfig: {
                input: {
                    color: '#ffffff',
                    'font-family': '"Courier New", monospace',
                    'font-size': '18px',
                    'letter-spacing': '2px',
                    border: 'none',
                    padding: '0',
                    'background-color': 'transparent'
                },
                placeholder: {
                    color: 'rgba(255, 255, 255, 0.5)'
                },
                focus: {
                    border: 'none',
                    'box-shadow': 'none'
                }
            }
        };
    }

    loadTemplate(templateName) {
        if (!templateName) {
            // Custom template selected - clear all fields except session data
            document.getElementById('htmlEditor').value = '';
            document.getElementById('cssEditor').value = '';
            document.getElementById('styleConfigEditor').value = '';
            document.getElementById('fieldsConfigEditor').value = '';

            document.getElementById('previewContent').innerHTML = `
                <div style="color: #9ca3af; text-align: center; padding: 40px 20px;">
                    Click on "Apply & Preview" to see your form
                </div>
            `;

            this.config = {
                html: '',
                css: '',
                apiResponse: this.config.apiResponse,
                sessionData: this.config.sessionData,
                styleConfig: {},
                fieldsConfig: {},
                eventHandlers: []
            };

            this.eventHandlerCount = 0;
            this.renderEventHandlers();

            this.showStatus('📝 Custom template selected - all fields cleared (session data preserved)', 'loading');
            return;
        }

        if (!this.templates[templateName]) return;

        const template = this.templates[templateName];
        document.getElementById('htmlEditor').value = template.html;
        document.getElementById('cssEditor').value = template.css;
        document.getElementById('styleConfigEditor').value = JSON.stringify(template.styleConfig, null, 2);
        document.getElementById('fieldsConfigEditor').value = JSON.stringify(template.fieldsConfig, null, 2);

        this.showStatus(`✅ Template "${templateName}" loaded!`, 'ready');
    }

    loadDemoData() {
        // Load Classic template by default
        const template = this.templates.classic;
        const demoApiResponse = {
        };

        document.getElementById('htmlEditor').value = template.html;
        document.getElementById('cssEditor').value = template.css;
        document.getElementById('sessionDataEditor').value = JSON.stringify(demoApiResponse, null, 2);
        document.getElementById('styleConfigEditor').value = JSON.stringify(template.styleConfig, null, 2);
        document.getElementById('fieldsConfigEditor').value = JSON.stringify(template.fieldsConfig, null, 2);
        document.getElementById('templateSelector').value = 'classic';

        this.showStatus('✅ Real session loaded - Ready to test!', 'ready');
    }

    applyPreview() {
        try {
            // Récupérer les valeurs des éditeurs
            const html = document.getElementById('htmlEditor').value.trim();
            const css = document.getElementById('cssEditor').value.trim();
            const sessionDataText = document.getElementById('sessionDataEditor').value.trim();
            const styleConfigText = document.getElementById('styleConfigEditor').value.trim();
            const fieldsConfigText = document.getElementById('fieldsConfigEditor').value.trim();

            // Valider et parser les JSON
            let apiResponse = {};
            let sessionData = {};
            let styleConfig = {};
            let fieldsConfig = {};
            let sdkUrl = '';

            try {
                if (sessionDataText) apiResponse = JSON.parse(sessionDataText);
            } catch (e) {
                throw new Error('Session Data JSON invalid: ' + e.message);
            }

            try {
                if (styleConfigText) styleConfig = JSON.parse(styleConfigText);
            } catch (e) {
                throw new Error('Style Config JSON invalid: ' + e.message);
            }

            try {
                if (fieldsConfigText) fieldsConfig = JSON.parse(fieldsConfigText);
            } catch (e) {
                throw new Error('Fields Config JSON invalid: ' + e.message);
            }

            // Validate that HTML is provided
            if (!html) {
                throw new Error('Please provide HTML');
            }

            // Check that fieldsConfig is an object (not an array)
            if (typeof fieldsConfig !== 'object' || Array.isArray(fieldsConfig)) {
                throw new Error('Invalid fields configuration: should be a JSON object');
            }

            const hasFields = Object.keys(fieldsConfig).length > 0;
            if (!hasFields) {
                throw new Error('No fields configured in the object');
            }

            // Extract sessionData and sdkUrl from API response
            if (apiResponse.sessionData) {
                sessionData = apiResponse.sessionData;
                sdkUrl = apiResponse.sdkUrl || '';
            } else {
                sessionData = apiResponse;
                sdkUrl = apiResponse.sdkUrl || '';
            }

            if (!sessionData.hostedFieldsSessionId) {
                throw new Error('Invalid Session Data: hostedFieldsSessionId missing');
            }

            // Save config
            this.config = {
                html,
                css,
                apiResponse,
                sessionData,
                styleConfig,
                fieldsConfig,
                eventHandlers: this.config.eventHandlers || []
            };

            // Update preview and initialize SDK
            this.showStatus('⏳ Initializing SDK...', 'loading');
            this.updatePreview();
            this.renderEventHandlers();
            this.updateConfigDisplay();

            // Load SDK if URL is provided
            if (sdkUrl) {
                this.loadSDK(sdkUrl, styleConfig, fieldsConfig, sessionData);
            } else {
                this.initializeHostedFieldsDemo(fieldsConfig, styleConfig);
                this.showStatus('✅ Preview applied (no SDK URL)', 'ready');
            }

        } catch (err) {
            this.showStatus('❌ Error: ' + err.message, 'error');
            console.error(err);
        }
    }

    loadSDK(sdkUrl, styleConfig, fieldsConfig, sessionData) {
        // Vérifier si le script est déjà chargé
        if (window.sdpx && window.sdpx.hostedfields) {
            this.initializeHostedFields(styleConfig, fieldsConfig, sessionData);
            return;
        }

        const script = document.createElement('script');
        script.src = sdkUrl;
        script.async = true;

        script.onload = () => {
            console.log('✅ SDK loaded successfully');
            this.initializeHostedFields(styleConfig, fieldsConfig, sessionData);
        };

        script.onerror = () => {
            console.error('❌ Error loading SDK');
            this.showStatus('❌ Error loading SDK', 'error');
            // Fallback: initialize demo
            this.initializeHostedFieldsDemo(fieldsConfig, styleConfig);
        };

        document.head.appendChild(script);
    }

    initializeHostedFields(styleConfig, fieldsConfig, sessionData) {
        try {
            const previewContent = document.getElementById('previewContent');

            // Check that SDK is available
            if (!window.sdpx || !window.sdpx.hostedfields) {
                throw new Error('SDK not available. Using demo mode.');
            }

            // Create hosted fields instance
            const hostedFields = window.sdpx.hostedfields.create({
                sessionData: sessionData,
                logLevel: 'debug',
                style: styleConfig,
                fields: fieldsConfig
            });

            console.log('✅ Hosted Fields initialized', hostedFields);

            // Apply custom event handlers from configuration
            if (this.config.eventHandlers && Array.isArray(this.config.eventHandlers)) {
                this.config.eventHandlers.forEach(handler => {
                    try {
                        // Create a function from the code string
                        const eventCode = handler.code;
                        const eventHandler = new Function('event', eventCode);

                        // Attach the handler to the event
                        hostedFields.on(handler.eventType, eventHandler);
                        console.log(`✅ Event handler attached: ${handler.eventType}`);
                    } catch (err) {
                        console.error(`❌ Error attaching handler for ${handler.eventType}:`, err);
                    }
                });
            }
            this.hostedFieldsInstance = hostedFields;
            this.showStatus('✅ SDK and Hosted Fields initialized successfully!', 'ready');

        } catch (err) {
            console.error('Initialization error:', err);
            this.showStatus('⚠️ ' + err.message, 'error');
            this.initializeHostedFieldsDemo(fieldsConfig, styleConfig);
        }
    }

    initializeHostedFieldsDemo(fieldsConfig, styleConfig) {
        // Demo mode when SDK is not available
        const previewContent = document.getElementById('previewContent');
        const demoContainer = previewContent.querySelector('.checkout-form') || previewContent;

        // fieldsConfig is now directly an object with field properties
        if (fieldsConfig && typeof fieldsConfig === 'object') {
            // Iterate through all properties (cardNumber, cardholderName, expiryDate, csc, cardBrands)
            Object.entries(fieldsConfig).forEach(([fieldName, fieldConfig]) => {
                const element = demoContainer.querySelector(`#${fieldConfig.id}`);
                if (element) {
                    // Add visual styles to show it's a hosted field
                    element.style.borderWidth = '2px';
                    element.style.borderColor = '#3b82f6';
                    element.style.backgroundColor = '#eff6ff';
                    element.setAttribute('data-field-type', fieldName);

                    if (element.textContent.trim() === '') {
                        element.textContent = `[Hosted Field - ${fieldName}]`;
                        element.style.color = '#3b82f6';
                        element.style.fontSize = '12px';
                    }
                }
            });
        }

        this.showStatus('⚠️ Demo mode (SDK not available)', 'loading');
    }

    updatePreview() {
        const previewContent = document.getElementById('previewContent');

        // Créer un container pour le HTML + CSS
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.config.html;

        // Appliquer le CSS
        if (this.config.css) {
            const style = document.createElement('style');
            style.textContent = this.config.css;
            wrapper.insertBefore(style, wrapper.firstChild);
        }

        // Vider et remplir le preview
        previewContent.innerHTML = '';
        previewContent.appendChild(wrapper);

        // Ajouter des écouteurs d'événements pour les champs de formulaire
        this.attachFormListeners(wrapper);
    }

    attachFormListeners(container) {
        const inputs = container.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        const buttons = container.querySelectorAll('button[type="submit"]');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#1e40af';
                input.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '#d1d5db';
                input.style.boxShadow = 'none';
            });
        });

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        });
    }

    handleFormSubmit() {
        if (this.hostedFieldsInstance) {
            // Use real SDK to tokenize
            this.showStatus('⏳ Tokenization in progress...', 'loading');

            try {
                this.hostedFieldsInstance.tokenize(false).then(result => {
                    console.log('✅ Tokenization successful:', result);

                    const payload = {
                        token: result.token,
                        sessionId: this.config.sessionData.hostedFieldsSessionId,
                        timestamp: new Date().toISOString(),
                        fieldsData: this.config.fieldsConfig
                    };

                    console.log('📤 Tokenized payload:', payload);
                    this.displayTokenResult(result, payload);
                    this.showStatus('✅ Tokenization successful!', 'ready');

                }).catch(err => {
                    console.error('❌ Tokenization error:', err);
                    this.showStatus('❌ Tokenization error: ' + err.message, 'error');
                    this.displayTokenError(err);
                });
            } catch (err) {
                this.showTokenizationDemo();
            }
        } else {
            this.showTokenizationDemo();
        }
    }

    displayTokenResult(result, payload) {
        const previewContent = document.getElementById('previewContent');

        // Créer une zone de résultat
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background-color: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
        `;

        resultDiv.innerHTML = `
            <div style="color: #047857; font-weight: 600; font-size: 16px; margin-bottom: 15px;">
                ✅ Tokenization Successful!
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <div style="color: #374151; font-weight: 600; margin-bottom: 8px;">Token:</div>
                <div style="
                    background-color: #f3f4f6;
                    padding: 10px;
                    border-radius: 4px;
                    word-break: break-all;
                    color: #1e40af;
                    font-weight: 600;
                    font-size: 12px;
                ">${result.token}</div>
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 4px;">
                <div style="color: #374151; font-weight: 600; margin-bottom: 8px;">Full Payload:</div>
                <pre style="
                    background-color: #1f2937;
                    color: #e5e7eb;
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 11px;
                    line-height: 1.4;
                    margin: 0;
                ">${JSON.stringify(payload, null, 2)}</pre>
            </div>
        `;

        previewContent.appendChild(resultDiv);

        // Scroll vers le résultat
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    displayTokenError(err) {
        const previewContent = document.getElementById('previewContent');

        // Créer une zone d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background-color: #fef2f2;
            border: 2px solid #dc2626;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
        `;

        errorDiv.innerHTML = `
            <div style="color: #991b1b; font-weight: 600; font-size: 16px; margin-bottom: 15px;">
                ❌ Tokenization Error
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 4px;">
                <div style="color: #991b1b; font-weight: 600; margin-bottom: 8px;">Error:</div>
                <div style="
                    background-color: #f3f4f6;
                    padding: 10px;
                    border-radius: 4px;
                    color: #dc2626;
                    word-break: break-all;
                ">${err.message || JSON.stringify(err)}</div>
            </div>
        `;

        previewContent.appendChild(errorDiv);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showTokenizationDemo() {
        // Demo mode without SDK
        const demoToken = 'demo-token-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const payload = {
            token: demoToken,
            sessionId: this.config.sessionData.hostedFieldsSessionId,
            timestamp: new Date().toISOString(),
            mode: 'demo',
            fieldsData: this.config.fieldsConfig
        };

        console.log('📤 Demo tokenization:', payload);
        this.displayTokenResult({ token: demoToken }, payload);
        this.showStatus('✅ Demo tokenization successful! (SDK not available)', 'ready');
    }

    updateConfigDisplay() {
        const configDisplay = document.getElementById('configDisplay');
        const configJSON = {
            html: this.config.html.substring(0, 50) + '...',
            css: this.config.css.substring(0, 50) + '...',
            sessionData: this.config.sessionData,
            styleConfig: this.config.styleConfig,
            fieldsConfig: this.config.fieldsConfig,
            timestamp: new Date().toISOString()
        };

        configDisplay.textContent = JSON.stringify(configJSON, null, 2);
    }

    downloadConfiguration() {
        const fullConfig = {
            html: this.config.html,
            css: this.config.css,
            sessionData: this.config.sessionData,
            styleConfig: this.config.styleConfig,
            fieldsConfig: this.config.fieldsConfig,
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(fullConfig, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hosted-fields-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showStatus('📥 Configuration downloaded', 'ready');
    }

    downloadCompleteSetup() {
        const config = this.config;

        // 1. Créer hostedfields_page.html
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hosted Fields Payment Form</title>
    <link rel="stylesheet" href="hostedfields_style.css">
</head>
<body>
    <div id="paymentContainer">
        ${config.html}
    </div>
    <script src="hostedfields_script.js"></script>
</body>
</html>`;

        // 2. Créer hostedfields_style.css
        const cssContent = config.css;

        // 3. Créer hostedfields_script.js avec la configuration
        const jsContent = `// Auto-generated Hosted Fields Configuration
// Configuration timestamp: ${new Date().toISOString()}
// 
// INTEGRATION GUIDE:
// 1. Replace API_ENDPOINT with your backend endpoint that returns session data
// 2. The endpoint should return: { hostedFieldsSessionId, sessionData, sdkUrl, ... }
// 3. Ensure your backend implements proper error handling and session management

class HostedFieldsConfig {
    constructor() {
        // ⚙️ CONFIGURATION - Modify these for your integration
        this.apiEndpoint = '/api/payment/hosted-fields-session'; // ← Change this to your endpoint
        this.useStaticConfig = false; // Set to false to fetch from API, true to use embedded config

        // Static configuration (used if useStaticConfig = true)
        this.staticConfig = {
            sessionData: ${JSON.stringify(config.sessionData, null, 2)},
            styleConfig: ${JSON.stringify(config.styleConfig, null, 2)},
            fieldsConfig: ${JSON.stringify(config.fieldsConfig, null, 2)},
            sdkUrl: "${config.apiResponse.sdkUrl || ''}"
        };

        this.hostedFieldsInstance = null;
    }

    async initialize() {
        try {
            let config;

            if (this.useStaticConfig) {
                // Use embedded configuration
                config = this.staticConfig;
                console.log('✅ Using embedded configuration');
            } else {
                // Fetch configuration from backend API
                config = await this.fetchSessionFromBackend();
            }

            // Load SDK
            if (!window.sdpx && config.sdkUrl) {
                await this.loadSDK(config.sdkUrl);
            }

            // Create Hosted Fields instance
            if (window.sdpx && window.sdpx.hostedfields) {
                this.hostedFieldsInstance = window.sdpx.hostedfields.create({
                    sessionData: config.sessionData,
                    logLevel: 'debug',
                    style: config.styleConfig,
                    fields: config.fieldsConfig
                });

                console.log('✅ Hosted Fields initialized successfully');

                // Listen to events
                this.hostedFieldsInstance.on('card-brand-entry', (event) => {
                    console.log('🔵 Card brand entry:', event.data?.brands);
                });

                this.hostedFieldsInstance.on('validityChange', (event) => {
                    console.log('🔵 Validity change:', event);
                });

                this.hostedFieldsInstance.on('valid', (event) => {
                    console.log('✅ Field valid:', event);
                });

                this.hostedFieldsInstance.on('invalid', (event) => {
                    console.log('❌ Field invalid:', event);
                });

                // Handle form submission
                const form = document.querySelector('form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleSubmit();
                    });
                }
            } else {
                console.warn('⚠️ SDK not available - running in demo mode');
                this.initializeDemo();
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.initializeDemo();
        }
    }

    async fetchSessionFromBackend() {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(\`Backend API error: \${response.status}\`);
            }

            const data = await response.json();
            console.log('✅ Session fetched from backend');
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch session from backend:', error);
            throw error;
        }
    }

    loadSDK(sdkUrl) {
        return new Promise((resolve, reject) => {
            if (window.sdpx && window.sdpx.hostedfields) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = sdkUrl;
            script.async = true;

            script.onload = () => {
                console.log('✅ SDK loaded successfully');
                resolve();
            };

            script.onerror = () => {
                console.error('❌ Error loading SDK');
                reject(new Error('Failed to load SDK'));
            };

            document.head.appendChild(script);
        });
    }

    initializeDemo() {
        console.log('Running in demo mode - fields marked with teal borders');
        const fields = document.querySelectorAll('[class*="field"]');
        fields.forEach(field => {
            field.style.borderColor = '#277777';
            field.style.borderWidth = '2px';
            field.style.backgroundColor = '#E0F0F0';
        });
    }

    async handleSubmit() {
        if (!this.hostedFieldsInstance) {
            console.warn('Hosted Fields not initialized');
            return;
        }

        try {
            console.log('⏳ Tokenizing...');
            const result = await this.hostedFieldsInstance.tokenize(false);

            const payload = {
                token: result.token,
                timestamp: new Date().toISOString()
            };

            console.log('✅ Tokenization successful:', payload);

            // TODO: Send to your backend for payment processing
            // Example:
            // const response = await fetch('/api/payment/process', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });
            // const result = await response.json();
            // Handle payment result...

        } catch (error) {
            console.error('❌ Tokenization error:', error);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const config = new HostedFieldsConfig();
    config.initialize();
    console.log('🚀 Hosted Fields Configuration initialized');
});

// Export for module usage (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HostedFieldsConfig;
}`;

        // Download the files with proper naming
        this.downloadFile(htmlContent, 'hostedfields_page.html', 'text/html');
        setTimeout(() => {
            this.downloadFile(cssContent, 'hostedfields_style.css', 'text/css');
        }, 500);
        setTimeout(() => {
            this.downloadFile(jsContent, 'hostedfields_script.js', 'text/javascript');
        }, 1000);

        this.showStatus('📦 Downloading: hostedfields_page.html, hostedfields_style.css, hostedfields_script.js', 'ready');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    copyToClipboard() {
        try {
            const fullConfig = {
                html: this.config.html,
                css: this.config.css,
                sessionData: this.config.sessionData,
                styleConfig: this.config.styleConfig,
                fieldsConfig: this.config.fieldsConfig
            };

            const json = JSON.stringify(fullConfig, null, 2);
            navigator.clipboard.writeText(json).then(() => {
                this.showStatus('📋 Configuration copied to clipboard', 'ready');
            });
        } catch (err) {
            this.showStatus('❌ Error copying: ' + err.message, 'error');
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to reset all editors?')) {
            document.getElementById('htmlEditor').value = '';
            document.getElementById('cssEditor').value = '';
            document.getElementById('sessionDataEditor').value = '';
            document.getElementById('styleConfigEditor').value = '';
            document.getElementById('fieldsConfigEditor').value = '';

            document.getElementById('previewContent').innerHTML = `
                <div style="color: #9ca3af; text-align: center; padding: 40px 20px;">
                    Click on "Apply & Preview" to see your form
                </div>
            `;

            this.config = {
                html: '',
                css: '',
                apiResponse: {},
                sessionData: {},
                styleConfig: {},
                fieldsConfig: {},
                eventHandlers: []
            };

            this.eventHandlerCount = 0;
            this.renderEventHandlers();

            this.showStatus('🗑️ All editors have been reset', 'loading');
        }
    }

    showStatus(message, type = 'loading') {
        const status = document.getElementById('status');
        status.className = `status ${type}`;
        status.textContent = message;

        // Auto-reset status after 5 seconds if success
        if (type === 'ready') {
            setTimeout(() => {
                if (status.classList.contains('ready')) {
                    status.className = 'status loading';
                    status.textContent = 'Ready to configure...';
                }
            }, 5000);
        }
    }

    addEventHandler() {
        const handler = {
            id: this.eventHandlerCount++,
            eventType: 'focus',
            code: 'console.log("Event fired:", event);'
        };
        this.config.eventHandlers.push(handler);
        this.renderEventHandlers();
    }

    removeEventHandler(handlerId) {
        this.config.eventHandlers = this.config.eventHandlers.filter(h => h.id !== handlerId);
        this.renderEventHandlers();
    }

    updateEventHandler(handlerId, eventType, code) {
        const handler = this.config.eventHandlers.find(h => h.id === handlerId);
        if (handler) {
            handler.eventType = eventType;
            handler.code = code;
        }
    }

    validateEventCode(code) {
        const issues = [];
        
        this.dangerousPatterns.forEach(pattern => {
            const matches = code.match(pattern.regex);
            if (matches) {
                issues.push({
                    pattern: pattern.name,
                    severity: pattern.severity,
                    reason: pattern.reason,
                    count: matches.length
                });
            }
        });
        
        return issues;
    }

    getSecurityBadge(issues) {
        if (issues.length === 0) {
            return '<span style="display: inline-block; background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">✅ SAFE</span>';
        }
        
        const hasDanger = issues.some(i => i.severity === 'danger');
        if (hasDanger) {
            return '<span style="display: inline-block; background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">⚠️ DANGER</span>';
        }
        
        return '<span style="display: inline-block; background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">⚡ WARNING</span>';
    }

    getIssuesHTML(issues) {
        if (issues.length === 0) {
            return '<div style="color: #10b981; font-size: 11px; margin-top: 6px;">No security issues detected</div>';
        }
        
        let html = '<div style="margin-top: 6px; font-size: 11px;">';
        issues.forEach(issue => {
            const color = issue.severity === 'danger' ? '#dc2626' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6';
            html += `<div style="color: ${color}; margin-bottom: 4px;">
                • <strong>${issue.pattern}</strong> (${issue.severity}): ${issue.reason}
            </div>`;
        });
        html += '</div>';
        return html;
    }

    renderEventHandlers() {
        const container = document.getElementById('eventHandlersContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.config.eventHandlers.length === 0) {
            container.innerHTML = '<p style="color: #9ca3af; font-size: 12px;">No event handlers configured yet. Click "Add Event Handler" to create one.</p>';
            return;
        }

        this.config.eventHandlers.forEach(handler => {
            const item = document.createElement('div');
            item.className = 'event-handler-item';

            // Validate the code
            const issues = this.validateEventCode(handler.code);
            
            const eventSelect = document.createElement('select');
            eventSelect.className = 'event-select';
            this.availableEvents.forEach(event => {
                const option = document.createElement('option');
                option.value = event;
                option.textContent = event;
                option.selected = event === handler.eventType;
                eventSelect.appendChild(option);
            });

            const codeTextarea = document.createElement('textarea');
            codeTextarea.className = 'event-code';
            codeTextarea.value = handler.code;
            codeTextarea.placeholder = 'Enter JavaScript code for this event handler. You have access to "event" object.';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.type = 'button';
            removeBtn.textContent = '🗑️ Remove';
            removeBtn.onclick = (e) => {
                e.preventDefault();
                this.removeEventHandler(handler.id);
            };

            const header = document.createElement('div');
            header.className = 'event-header';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '8px';
            
            const selectContainer = document.createElement('div');
            selectContainer.style.flex = '1';
            selectContainer.style.marginRight = '10px';
            selectContainer.appendChild(eventSelect);
            
            const badgeContainer = document.createElement('div');
            badgeContainer.innerHTML = this.getSecurityBadge(issues);
            
            header.appendChild(selectContainer);
            header.appendChild(badgeContainer);

            const codeContainer = document.createElement('div');
            codeContainer.appendChild(header);
            codeContainer.appendChild(codeTextarea);
            
            // Add security issues display
            const issuesDiv = document.createElement('div');
            issuesDiv.innerHTML = this.getIssuesHTML(issues);
            codeContainer.appendChild(issuesDiv);

            const actions = document.createElement('div');
            actions.className = 'event-actions';
            actions.appendChild(removeBtn);

            item.appendChild(codeContainer);
            item.appendChild(actions);

            // Update handler when values change
            eventSelect.addEventListener('change', (e) => {
                this.updateEventHandler(handler.id, e.target.value, codeTextarea.value);
                this.renderEventHandlers(); // Re-render to update validation
            });

            codeTextarea.addEventListener('change', (e) => {
                this.updateEventHandler(handler.id, eventSelect.value, e.target.value);
                this.renderEventHandlers(); // Re-render to update validation
            });

            container.appendChild(item);
        });
    }

    // ...existing code...
}

// Initialization
let hostedFieldsBuilder;
document.addEventListener('DOMContentLoaded', () => {
    hostedFieldsBuilder = new HostedFieldsBuilder();
    console.log('🚀 Hosted Fields Builder initialized');
});

// Global functions for onclick
function applyPreview() {
    hostedFieldsBuilder.applyPreview();
}

function clearAll() {
    hostedFieldsBuilder.clearAll();
}

function downloadConfiguration() {
    hostedFieldsBuilder.downloadConfiguration();
}

function downloadCompleteSetup() {
    hostedFieldsBuilder.downloadCompleteSetup();
}

function copyToClipboard() {
    hostedFieldsBuilder.copyToClipboard();
}
