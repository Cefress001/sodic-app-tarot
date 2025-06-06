
import { GoogleGenAI } from '@google/genai';
import { TAROT_DECK, SPREAD_DEFINITIONS, HA_MEFARESH_SYSTEM_PROMPT_HEADER, INTERPRETATION_MODULE_TITLES, DEFAULT_KAVANAH, SODIC_GOLD } from './constants.js';

// --- Configuration ---
const API_KEY = globalThis.process?.env?.API_KEY || globalThis.SODIC_MIRROR_API_KEY;
const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // Use the specified model

let ai;
if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
        // This error will be shown on pages that need AI if ai object is not initialized.
    }
} else {
    console.warn("API_KEY is not available. AI features will be disabled.");
}

// --- DOM Elements (Common) ---
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();

// --- Helper Functions ---
function showLoading(message, isPageTransition = false) {
    const overlayId = isPageTransition ? 'page-transition-overlay' : (document.body.classList.contains('draw-page') ? 'loading-overlay' : 'loading-interpretation-message');
    let overlay = document.getElementById(overlayId);
    
    if (!overlay && isPageTransition) { // Create page transition overlay if not exists
        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.className = 'loading-overlay'; // Use general loading overlay style
        document.body.appendChild(overlay);
    }
    
    if (overlay) {
        if (overlayId === 'loading-interpretation-message') {
            // This is the specific styled message on interpretation.html
            overlay.style.display = 'flex';
            const p = overlay.querySelector('p');
            if(p) p.textContent = message;

        } else {
             overlay.innerHTML = `<div class="spinner"></div><p id="loading-text">${message}</p>`;
             overlay.style.display = 'flex';
        }
    }
}

function hideLoading(isPageTransition = false) {
    const overlayId = isPageTransition ? 'page-transition-overlay' : (document.body.classList.contains('draw-page') ? 'loading-overlay' : 'loading-interpretation-message');
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.style.display = 'none';
    }
}


function showError(message, showRetryButton = false, retryCallback = null) {
    console.error("Sodic Mirror Error:", message);
    const errorSection = document.getElementById('error-display-section');
    const errorMessageContent = document.getElementById('error-message-content');
    const retryButton = document.getElementById('retry-interpretation-button');

    // Hide loading states
    hideLoading(); // Hides general loading overlay
    hideLoading(true); // Hides page transition overlay
    const interpretationLoading = document.getElementById('loading-interpretation-message');
    if(interpretationLoading) interpretationLoading.style.display = 'none';


    if (errorSection && errorMessageContent) {
        errorMessageContent.innerHTML = message; // Use innerHTML if message contains HTML (e.g. link)
        errorSection.style.display = 'block';
        
        const mainContent = document.getElementById('interpretation-layout');
        if(mainContent) mainContent.style.display = 'none'; // Hide main interpretation layout

        if (retryButton) {
            if (showRetryButton && retryCallback) {
                retryButton.style.display = 'inline-block';
                const newRetryButton = retryButton.cloneNode(true); // Re-clone to remove old event listeners
                retryButton.parentNode.replaceChild(newRetryButton, retryButton);
                newRetryButton.addEventListener('click', () => {
                    errorSection.style.display = 'none';
                    // Don't reshow mainContent here, retryCallback should handle it
                    retryCallback();
                });
            } else {
                retryButton.style.display = 'none';
            }
        }
    } else if (document.body.classList.contains('draw-page')) {
        // If on draw page, show error more subtly
        const kavanahSection = document.getElementById('kavanah-section');
        if(kavanahSection) {
            let errorP = kavanahSection.querySelector('.draw-page-error');
            if (!errorP) {
                errorP = document.createElement('p');
                errorP.className = 'draw-page-error'; // Add class for styling
                errorP.style.color = 'var(--sodic-accent-gevurah)';
                errorP.style.textAlign = 'center';
                errorP.style.marginTop = '10px';
                kavanahSection.appendChild(errorP);
            }
            errorP.textContent = message;
        }
    }
}


// --- Page Specific Logic ---

// --- Home Page (index.html) ---
if (document.body.classList.contains('home-page')) {
    console.log("Sodic Mirror: Sanctuary Entrance loaded.");
    // Add smooth scroll for navigation or other home-specific JS
}

// --- Draw Page (draw.html) ---
if (document.body.classList.contains('draw-page')) {
    const kavanahInput = document.getElementById('kavanah-input');
    const spreadButtonsContainer = document.getElementById('spread-buttons-container');
    const drawCardsButton = document.getElementById('draw-cards-button');
    const animatedGlyphBackground = document.getElementById('animated-glyph-background');

    let currentSpreadMode = SPREAD_DEFINITIONS.SingleCard.mode; // Default

    function initializeDrawPage() {
        console.log("Sodic Mirror: Draw Page loaded.");
        if (kavanahInput) {
            const storedKavanah = localStorage.getItem('sodicMirrorKavanah');
            kavanahInput.value = storedKavanah || DEFAULT_KAVANAH;
            kavanahInput.addEventListener('input', () => {
                localStorage.setItem('sodicMirrorKavanah', kavanahInput.value);
            });
        }


        if (spreadButtonsContainer) {
            spreadButtonsContainer.innerHTML = ''; 
            Object.values(SPREAD_DEFINITIONS).forEach(def => {
                const button = document.createElement('button');
                button.classList.add('spread-button');
                if (def.mode === currentSpreadMode) button.classList.add('active');
                button.textContent = def.displayName;
                button.dataset.mode = def.mode;
                button.onclick = () => selectSpreadMode(def.mode);
                spreadButtonsContainer.appendChild(button);
            });
        }

        if (drawCardsButton) {
            drawCardsButton.onclick = handleDrawCards;
            if (!API_KEY || !ai) { 
                drawCardsButton.disabled = true;
                drawCardsButton.title = "AI features disabled: API Key not configured or AI failed to initialize.";
                 showError("AI features are currently unavailable. Please ensure the API Key is correctly configured.", false);
            }
        }
        
        createAnimatedGlyphs();
        hideLoading(); // Hide any residual loading overlay
    }

    function selectSpreadMode(mode) {
        currentSpreadMode = mode;
        const buttons = spreadButtonsContainer.querySelectorAll('.spread-button');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        console.log("Spread mode selected:", mode);
    }

    function handleDrawCards() {
        showLoading("Drawing sacred cards...", true);
        const kavanah = kavanahInput.value.trim() || DEFAULT_KAVANAH;
        const spreadDef = SPREAD_DEFINITIONS[currentSpreadMode];
        const numCardsToDraw = spreadDef.positions.length;
        
        let drawnCardsData = [];
        const deckCopy = [...TAROT_DECK];

        for (let i = 0; i < numCardsToDraw; i++) {
            if (deckCopy.length === 0) {
                hideLoading(true);
                showError("Not enough cards in deck to draw.");
                return;
            }
            const randomIndex = Math.floor(Math.random() * deckCopy.length);
            const card = deckCopy.splice(randomIndex, 1)[0];
            drawnCardsData.push({
                cardId: card.id,
                positionName: spreadDef.positions[i].name,
                positionMeaning: spreadDef.positions[i].meaning,
            });
        }

        localStorage.setItem('sodicMirrorReadingData', JSON.stringify({
            kavanah,
            spreadMode: currentSpreadMode,
            drawnCardsData, // Corrected variable name
            timestamp: new Date().toISOString()
        }));

        // Simulate divine transition
        document.body.classList.add('page-transition-active');
        setTimeout(() => {
            window.location.href = 'interpretation.html';
            // hideLoading(true) will be called on the next page load by initializeInterpretationPage
        }, 1500); // Adjust delay as needed
    }

    function createAnimatedGlyphs() {
        if (!animatedGlyphBackground) return;
        const glyphs = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
        const numGlyphs = 20; // Adjust for density

        for (let i = 0; i < numGlyphs; i++) {
            const glyphSpan = document.createElement('span');
            glyphSpan.classList.add('animated-glyph');
            glyphSpan.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
            glyphSpan.style.left = `${Math.random() * 100}vw`;
            glyphSpan.style.top = `${Math.random() * 100}vh`;
            glyphSpan.style.fontSize = `${20 + Math.random() * 40}px`;
            glyphSpan.style.animationDelay = `${Math.random() * 10}s`;
            glyphSpan.style.animationDuration = `${10 + Math.random() * 10}s`;
            animatedGlyphBackground.appendChild(glyphSpan);
        }
    }

    initializeDrawPage();
}


// --- Interpretation Page (interpretation.html) ---
if (document.body.classList.contains('interpretation-page')) {
    const drawnCardsContainer = document.getElementById('drawn-cards-container');
    const interpretationAccordionContainer = document.getElementById('interpretation-accordion-container');
    const treeSvgContainer = document.getElementById('tree-of-life-svg-container');
    const readingContextSummary = document.getElementById('reading-context-summary');
    const downloadPdfButton = document.getElementById('download-pdf-button');
    const interpretationLayout = document.getElementById('interpretation-layout');


    let currentReadingData; // To store data for retry

    async function initializeInterpretationPage() {
        console.log("Sodic Mirror: Interpretation Page loaded.");
        showLoading("Unveiling the sacred patterns...", false); 
        interpretationLayout.style.display = 'none'; // Hide until ready

        const rawData = localStorage.getItem('sodicMirrorReadingData');
        if (!rawData) {
            showError("No reading data found. Please start a new reading. <a href='draw.html'>Go to Draw Page</a>", false);
            return;
        }

        try {
            currentReadingData = JSON.parse(rawData);
        } catch (e) {
            showError("Invalid reading data. Please start a new reading. <a href='draw.html'>Go to Draw Page</a>", false);
            return;
        }
        
        if (!API_KEY || !ai) {
             showError("AI features are disabled: API Key not configured or AI failed to initialize. Interpretation cannot be generated.", false);
             // Still display cards and tree if possible
             displayDrawnCards(currentReadingData.drawnCardsData);
             await loadTreeOfLifeSVG();
             highlightTreeOfLife(currentReadingData.drawnCardsData);
             if(readingContextSummary) {
                const date = currentReadingData.timestamp ? new Date(currentReadingData.timestamp).toLocaleString() : 'N/A';
                readingContextSummary.innerHTML = `
                    <p><strong>Kavanah:</strong> ${currentReadingData.kavanah || 'Not specified'}</p>
                    <p><strong>Reading Time:</strong> ${date}</p>
                `;
            }
            interpretationLayout.style.display = 'block'; // Show basic layout
            document.getElementById('interpretation-modules-section').style.display = 'none'; // Hide AI modules part
            return;
        }


        displayDrawnCards(currentReadingData.drawnCardsData);
        await loadTreeOfLifeSVG(); // Load SVG first
        highlightTreeOfLife(currentReadingData.drawnCardsData); // Then highlight

        if(readingContextSummary) {
            const date = currentReadingData.timestamp ? new Date(currentReadingData.timestamp).toLocaleString() : 'N/A';
            readingContextSummary.innerHTML = `
                <p><strong>Kavanah:</strong> ${currentReadingData.kavanah || 'Not specified'}</p>
                <p><strong>Reading Time:</strong> ${date}</p>
            `;
        }

        await generateAndDisplayInterpretation(currentReadingData);
        
        hideLoading();
        interpretationLayout.style.display = 'block'; // Show layout after content is ready
        document.body.classList.remove('page-transition-active'); // From previous page
    }

    async function generateAndDisplayInterpretation(readingData) {
        showLoading("HaMefaresh HaPenimi is contemplating the patterns of light...", false);
        try {
            const interpretationText = await callGeminiAPI(readingData);
            const parsedInterpretation = parseInterpretation(interpretationText);
            displayInterpretation(parsedInterpretation);
        } catch (error) {
            console.error("Error during interpretation generation:", error);
            showError(`Error from HaMefaresh HaPenimi: ${error.message || 'Could not retrieve interpretation.'}`, true, () => {
                // Retry logic:
                document.getElementById('error-display-section').style.display = 'none';
                interpretationLayout.style.display = 'none'; // Hide old layout before retry
                generateAndDisplayInterpretation(readingData); // Retry with same data
            });
        } finally {
            hideLoading();
        }
    }


    function displayDrawnCards(drawnCardsData) {
        if (!drawnCardsContainer) return;
        drawnCardsContainer.innerHTML = ''; // Clear previous

        drawnCardsData.forEach(drawnCard => {
            const cardDetails = TAROT_DECK.find(c => c.id === drawnCard.cardId);
            if (!cardDetails) {
                console.warn(`Card with ID ${drawnCard.cardId} not found in deck.`);
                return;
            }

            const cardItem = document.createElement('div');
            cardItem.classList.add('card-display-item');
            
            const imageName = cardDetails.name.toLowerCase().replace(/[\s()']/g, '-').replace(/[:]/g, '');
            const imagePath = `images/cards/${imageName}.jpg`; // Assuming .jpg extension

            cardItem.innerHTML = `
                <div class="card-image-placeholder">
                    <img src="${imagePath}" alt="${cardDetails.name}" class="card-actual-image" style="display:none;" onload="this.style.display='block'; this.nextElementSibling.style.display='none';" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <span class="card-text-placeholder hidden">${cardDetails.imagePlaceholder || cardDetails.hebrewName || '?'}</span>
                </div>
                <h3 class="card-name">${cardDetails.name}</h3>
                ${drawnCard.positionName ? `<p class="card-position font-cardo"><em>${drawnCard.positionName}</em></p>` : ''}
                ${cardDetails.hebrewName ? `<p class="card-hebrew-name font-alef">${cardDetails.hebrewName}</p>` : ''}
                <p class="card-brief-meaning">${cardDetails.briefMeaning}</p>
            `;
            drawnCardsContainer.appendChild(cardItem);
        });
    }
    
    async function callGeminiAPI(readingData) {
        if (!ai) {
            throw new Error("AI service is not initialized. Cannot generate interpretation.");
        }
        
        let promptContent = `${HA_MEFARESH_SYSTEM_PROMPT_HEADER}\n\n`;
        promptContent += `User's Kavanah (Intention): "${readingData.kavanah}"\n`;
        promptContent += `Spread: ${SPREAD_DEFINITIONS[readingData.spreadMode].displayName}\n\n`;

        readingData.drawnCardsData.forEach((drawnCard, index) => {
            const cardDetails = TAROT_DECK.find(c => c.id === drawnCard.cardId);
            if (cardDetails) {
                promptContent += `Card ${index + 1}: ${cardDetails.name} (${cardDetails.hebrewName || 'N/A'})\n`;
                promptContent += `Position: ${drawnCard.positionName} (${drawnCard.positionMeaning})\n`;
                promptContent += `Keywords: ${cardDetails.keywords.join(', ')}\n`;
                promptContent += `Kabbalistic Concepts: ${cardDetails.kabbalisticConcepts.join(', ')}\n\n`;
            }
        });
        promptContent += "Generate the five-module interpretation based on this data.";

        console.log("Sending prompt to Gemini:", promptContent);

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: promptContent,
        });
        
        console.log("Received response from Gemini");
        return response.text;
    }

    function parseInterpretation(text) {
        const modules = {};
        const lines = text.split('\n');
        let currentModuleKey = null;

        const moduleKeys = Object.keys(INTERPRETATION_MODULE_TITLES);

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // Check if the line starts with a module title pattern
            let matchedKey = null;
            for (const key of moduleKeys) {
                // Use a flexible check: starts with the symbol and key name, or just key name followed by (
                const titlePatternSymbol = INTERPRETATION_MODULE_TITLES[key].substring(0, INTERPRETATION_MODULE_TITLES[key].indexOf('(') +1 ).trim();
                const titlePatternNoSymbol = key + " (";

                if (trimmedLine.startsWith(INTERPRETATION_MODULE_TITLES[key]) || 
                    trimmedLine.startsWith(titlePatternSymbol) ||
                    trimmedLine.toLowerCase().startsWith(key.toLowerCase() + " (") ||
                    trimmedLine.toLowerCase().startsWith(INTERPRETATION_MODULE_TITLES[key].split(' ')[1].toLowerCase()) // e.g. "Atzilut ("
                   ) {
                    matchedKey = key;
                    break;
                }
            }
            
            if (matchedKey) {
                currentModuleKey = matchedKey;
                modules[currentModuleKey] = ""; // Initialize or reset module content
                // Optional: attempt to clean the title itself from the content if it's part of the first line
                // This can be tricky if the AI doesn't strictly adhere to only content after title.
                 let contentStart = trimmedLine.replace(INTERPRETATION_MODULE_TITLES[currentModuleKey], '').trim();
                 if (contentStart.startsWith(':')) contentStart = contentStart.substring(1).trim();
                 if (contentStart) modules[currentModuleKey] += contentStart + "\n";

            } else if (currentModuleKey && modules[currentModuleKey] !== undefined) {
                modules[currentModuleKey] += line + "\n";
            }
        }
        
        // Trim trailing newlines and ensure all modules are present
        for (const key of moduleKeys) {
            if (modules[key]) {
                modules[key] = modules[key].trim();
            } else {
                // Fallback if parsing fails to identify a module from the raw text
                if (key === "FinalSynthesis" && !modules[key] && text.includes("Final Synthesis")) {
                    // Try to grab a chunk for final synthesis if specifically missed.
                }
                 // console.warn(`Module ${key} not found in interpretation text.`);
                 // modules[key] = "Information for this module was not clearly delineated in the response.";
            }
        }

        // If parsing fails significantly, return the whole text under a general module
        if (Object.values(modules).every(val => !val) && text.length > 50) {
             console.warn("Failed to parse modules cleanly. Displaying raw interpretation.");
             modules["RawInterpretation"] = text;
        }


        return modules;
    }

    function displayInterpretation(parsedModules) {
        if (!interpretationAccordionContainer) return;
        interpretationAccordionContainer.innerHTML = ''; // Clear previous

        Object.keys(INTERPRETATION_MODULE_TITLES).forEach((key, index) => {
            const title = INTERPRETATION_MODULE_TITLES[key];
            const content = parsedModules[key] || "Content for this module is being refined by HaMefaresh.";
            
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');
            
            const buttonId = `accordion-button-${key}`;
            const contentId = `accordion-content-${key}`;

            accordionItem.innerHTML = `
                <button id="${buttonId}" class="accordion-button" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="${contentId}">
                    ${title}
                    <span class="icon" aria-hidden="true">${index === 0 ? '−' : '+'}</span>
                </button>
                <div id="${contentId}" class="accordion-content" role="region" aria-labelledby="${buttonId}" ${index > 0 ? 'aria-hidden="true"' : ''}>
                    <pre>${content}</pre>
                    <button class="speaker-button" data-content-id="${contentId}" title="Read Aloud">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                    </button>
                </div>
            `;
            interpretationAccordionContainer.appendChild(accordionItem);
        });

        if (parsedModules["RawInterpretation"]) { // Handle raw display
             const rawItem = document.createElement('div');
             rawItem.classList.add('accordion-item');
             rawItem.innerHTML = `
                <button class="accordion-button" aria-expanded="true">Full Revelation</button>
                <div class="accordion-content" aria-hidden="false"><pre>${parsedModules["RawInterpretation"]}</pre></div>
             `;
             interpretationAccordionContainer.appendChild(rawItem);
        }

        setupAccordion();
        setupSpeakerButtons();
    }

    function setupAccordion() {
        const accordionButtons = interpretationAccordionContainer.querySelectorAll('.accordion-button');
        accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const content = document.getElementById(button.getAttribute('aria-controls'));
                const icon = button.querySelector('.icon');
                const isExpanded = button.getAttribute('aria-expanded') === 'true';

                button.setAttribute('aria-expanded', !isExpanded);
                content.setAttribute('aria-hidden', isExpanded);
                if (icon) icon.textContent = isExpanded ? '+' : '−';
            });
        });
    }

    let currentSpeech = null;
    let activeSpeakerButton = null;

    function setupSpeakerButtons() {
        const speakerButtons = interpretationAccordionContainer.querySelectorAll('.speaker-button');
        speakerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const contentId = button.dataset.contentId;
                const contentElement = document.getElementById(contentId);
                const textToSpeak = contentElement.querySelector('pre').textContent;

                if (currentSpeech && speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    if (activeSpeakerButton) {
                         activeSpeakerButton.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`; // Speaker icon
                    }
                    if (activeSpeakerButton === button) { // Clicked same button to stop
                        currentSpeech = null;
                        activeSpeakerButton = null;
                        return;
                    }
                }
                
                currentSpeech = new SpeechSynthesisUtterance(textToSpeak);
                currentSpeech.lang = 'en-US';
                currentSpeech.onend = () => {
                    button.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`; // Speaker icon
                    activeSpeakerButton = null;
                };
                
                speechSynthesis.speak(currentSpeech);
                button.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`; // Stop icon
                activeSpeakerButton = button;
            });
        });
    }

    async function loadTreeOfLifeSVG() {
        if (!treeSvgContainer) return;
        try {
            const response = await fetch('images/tree-of-life.svg');
            if (!response.ok) throw new Error(`Failed to load SVG: ${response.statusText}`);
            const svgText = await response.text();
            treeSvgContainer.innerHTML = svgText;
            const svgElement = treeSvgContainer.querySelector('svg');
            if (svgElement) {
                svgElement.id = 'tree-of-life-svg'; // Ensure it has the ID for styling
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
            }
        } catch (error) {
            console.error("Error loading Tree of Life SVG:", error);
            treeSvgContainer.innerHTML = '<p class="tree-placeholder">Could not load Tree of Life diagram.</p>';
        }
    }

    function highlightTreeOfLife(drawnCardsData) {
        const treeSvg = document.getElementById('tree-of-life-svg');
        if (!treeSvg) return;

        // Clear previous highlights
        treeSvg.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));

        const conceptsToHighlight = new Set();
        drawnCardsData.forEach(drawnCard => {
            const cardDetails = TAROT_DECK.find(c => c.id === drawnCard.cardId);
            if (cardDetails && cardDetails.kabbalisticConcepts) {
                cardDetails.kabbalisticConcepts.forEach(concept => conceptsToHighlight.add(concept));
            }
        });
        
        conceptsToHighlight.forEach(concept => {
            // Sefirah IDs are typically like "sefirah-kether", "sefirah-chochmah"
            // Path IDs are typically like "path-aleph", "path-beth"
            const conceptId = concept.toLowerCase().replace(/\s+/g, '-');
            const element = treeSvg.getElementById(`sefirah-${conceptId}`) || treeSvg.getElementById(`path-${conceptId}`) || treeSvg.getElementById(conceptId);
            if (element) {
                element.classList.add('highlighted');
                // If it's a group (e.g. sefirah circle + text), highlight children too
                if (element.tagName.toLowerCase() === 'g') {
                    element.querySelectorAll('circle, rect, ellipse, text, path').forEach(child => child.classList.add('highlighted'));
                }
            } else {
                // console.warn(`Tree of Life element not found for concept: ${concept} (tried ID: ${conceptId})`);
            }
        });
    }
    
    if (downloadPdfButton) {
        downloadPdfButton.onclick = () => {
            // Placeholder for PDF generation
            alert("PDF Download functionality is coming soon in a future update!");
            // For actual implementation, you'd use a library like jsPDF or a backend service.
            // Example:
            // const { jsPDF } = window.jspdf;
            // const doc = new jsPDF();
            // doc.text("Sodic Mirror Reading", 10, 10);
            // ... add content ...
            // doc.save("SodicMirrorReading.pdf");
        };
    }

    // Stop speech synthesis if user navigates away
    window.addEventListener('beforeunload', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    });

    initializeInterpretationPage();
}
