// ========================================
// Handbook Module Registry
// ========================================
const handbooks = {
    'ai-engineering-syllabus': {
        title: 'AI Engineering Syllabus',
        modules: [
            { file: 'README.md', name: 'Overview — Program Structure' },
            { file: '01-data-science-ai-for-business/syllabus.md', name: '01. Data Science & AI for Business' },
            { file: '02-machine-learning/syllabus.md', name: '02. Machine Learning' },
            { file: '03-generative-ai-engineering/syllabus.md', name: '03. Generative AI Engineering' },
            { file: '04-deep-learning-nlp/syllabus.md', name: '04. Deep Learning & NLP' },
            { file: '05-computer-vision/syllabus.md', name: '05. Computer Vision' },
            { file: '06-ai-ethics-governance-explainability/syllabus.md', name: '06. AI Ethics, Governance & Explainability' },
            { file: '07-cloud-ai-infrastructure/syllabus.md', name: '07. Cloud & AI Infrastructure' }
        ]
    },
    'llm-handbook': {
        title: 'LLM Handbook',
        modules: [
            { file: 'README.md', name: 'Overview — Reading Order' },
            { file: '00-overview.md', name: '00. Overview' },
            { file: '01-foundations.md', name: '01. Foundations' },
            { file: '02-pretraining.md', name: '02. Pre-training' },
            { file: '03-post-training.md', name: '03. Post-training' },
            { file: '04-inference.md', name: '04. Inference' },
            { file: '05-architectures.md', name: '05. Architectures' },
            { file: '06-reasoning-agents.md', name: '06. Reasoning & Agents' },
            { file: '07-evaluation.md', name: '07. Evaluation' },
            { file: '08-production.md', name: '08. Production' },
            { file: '09-essential-reading.md', name: '09. Essential Reading' },
            { file: '10-learning-plan.md', name: '10. Learning Plan' },
            { file: '11-appendix-A-toolkit.md', name: 'A. Toolkit' },
            { file: '12-appendix-B-opensource-and-local.md', name: 'B. Open Source & Local' },
            { file: '13-appendix-C-agent-engineering.md', name: 'C. Agent Engineering' },
            { file: '14-appendix-D-api-vs-selfhosted.md', name: 'D. API vs Self-hosted' },
            { file: '15-appendix-E-hardware.md', name: 'E. Hardware' },
            { file: '16-appendix-F-enterprise-cases.md', name: 'F. Enterprise Cases' },
            { file: '17-appendix-G-security.md', name: 'G. Security' }
        ]
    },
    'algorithms-handbook': {
        title: 'Algorithms Handbook',
        modules: [
            { file: 'README.md', name: 'Overview — Module Map' },
            { file: '00-overview.md', name: '00. Overview' },
            { file: '01-complexity-analysis.md', name: '01. Complexity Analysis' },
            { file: '02-data-structures.md', name: '02. Data Structures' },
            { file: '03-sorting-and-searching.md', name: '03. Sorting & Searching' },
            { file: '04-recursion-and-backtracking.md', name: '04. Recursion & Backtracking' },
            { file: '05-divide-and-conquer.md', name: '05. Divide and Conquer' },
            { file: '06-dynamic-programming.md', name: '06. Dynamic Programming' },
            { file: '07-greedy-algorithms.md', name: '07. Greedy Algorithms' },
            { file: '08-graph-algorithms.md', name: '08. Graph Algorithms' },
            { file: '09-string-algorithms.md', name: '09. String Algorithms' },
            { file: '10-advanced-topics.md', name: '10. Advanced Topics' },
            { file: '11-complexity-theory.md', name: '11. Complexity Theory' },
            { file: '12-problem-solving-patterns.md', name: '12. Problem-Solving Patterns' },
            { file: '13-essential-reading.md', name: '13. Essential Reading' },
            { file: '14-network-flows.md', name: '14. Network Flows' }
        ]
    },
    'computational-thinking-handbook': {
        title: 'Buku Panduan Computational Thinking',
        modules: [
            { file: 'README.md', name: 'Gambaran Umum' },
            { file: '00-overview.md', name: '00. Apa Itu Computational Thinking?' },
            { file: '01-decomposition.md', name: '01. Dekomposisi' },
            { file: '02-pattern-recognition.md', name: '02. Pengenalan Pola' },
            { file: '03-abstraction.md', name: '03. Abstraksi' },
            { file: '04-algorithm-design.md', name: '04. Desain Algoritma' },
            { file: '05-logical-thinking.md', name: '05. Berpikir Logis' },
            { file: '06-debugging.md', name: '06. Debugging' },
            { file: '07-everyday-ct.md', name: '07. CT Sehari-hari' },
            { file: '08-fun-activities.md', name: '08. Aktivitas Seru' },
            { file: '09-for-teachers-and-parents.md', name: '09. Untuk Guru & Orang Tua' }
        ]
    }
};

// ========================================
// State
// ========================================
let currentHandbook = null;
const GITHUB_BASE = 'https://raw.githubusercontent.com/kusandriadi/cs/main';
const GITHUB_REPO = 'https://github.com/kusandriadi/cs/blob/main';

// ========================================
// Theme Management
// ========================================
function initTheme() {
    const saved = localStorage.getItem('cs-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeButtons(saved);
}

function updateThemeButtons(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cs-theme', theme);
        updateThemeButtons(theme);
    });
});

// ========================================
// Navigation
// ========================================
function showHome() {
    document.querySelector('.header').classList.remove('hidden');
    document.querySelector('.handbooks-grid').classList.remove('hidden');
    document.getElementById('module-viewer').classList.add('hidden');
    document.getElementById('content-viewer').classList.add('hidden');
    currentHandbook = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showModuleList(handbookKey) {
    const handbook = handbooks[handbookKey];
    if (!handbook) return;

    currentHandbook = handbookKey;

    document.querySelector('.header').classList.add('hidden');
    document.querySelector('.handbooks-grid').classList.add('hidden');
    document.getElementById('content-viewer').classList.add('hidden');

    const viewer = document.getElementById('module-viewer');
    document.getElementById('viewer-title').textContent = handbook.title;

    const list = document.getElementById('module-list');
    list.innerHTML = handbook.modules.map((mod, i) => `
        <div class="module-item" data-handbook="${handbookKey}" data-file="${mod.file}">
            <div class="module-number">${i === 0 ? '~' : String(i).padStart(2, '0')}</div>
            <div class="module-name">${mod.name}</div>
        </div>
    `).join('');

    list.querySelectorAll('.module-item').forEach(item => {
        item.addEventListener('click', () => {
            loadContent(item.dataset.handbook, item.dataset.file);
        });
    });

    viewer.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadContent(handbookKey, file) {
    const contentViewer = document.getElementById('content-viewer');
    const contentBody = document.getElementById('content-body');
    const btnGithub = document.getElementById('btn-github');

    document.getElementById('module-viewer').classList.add('hidden');

    btnGithub.href = `${GITHUB_REPO}/${handbookKey}/${file}`;
    contentBody.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Loading...</p></div>';
    contentViewer.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const url = `${GITHUB_BASE}/${handbookKey}/${file}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();

        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            contentBody.innerHTML = marked.parse(markdown);

            // Render LaTeX math with KaTeX
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(contentBody, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true }
                    ],
                    throwOnError: false
                });
            }
        } else {
            contentBody.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
        }
    } catch (err) {
        contentBody.innerHTML = `
            <div class="loading-indicator">
                <p>Could not load content. <a href="${GITHUB_REPO}/${handbookKey}/${file}" target="_blank">View on GitHub</a></p>
            </div>
        `;
    }
}

// ========================================
// Event Listeners
// ========================================
document.querySelectorAll('.handbook-card').forEach(card => {
    card.addEventListener('click', () => {
        showModuleList(card.dataset.handbook);
    });
});

document.getElementById('btn-back').addEventListener('click', showHome);

document.getElementById('btn-back-content').addEventListener('click', () => {
    if (currentHandbook) {
        showModuleList(currentHandbook);
    } else {
        showHome();
    }
});

// Handle browser back button
window.addEventListener('popstate', () => {
    const viewer = document.getElementById('content-viewer');
    const moduleViewer = document.getElementById('module-viewer');

    if (!viewer.classList.contains('hidden')) {
        if (currentHandbook) {
            showModuleList(currentHandbook);
        } else {
            showHome();
        }
    } else if (!moduleViewer.classList.contains('hidden')) {
        showHome();
    }
});

// ========================================
// Init
// ========================================
initTheme();

// Register Service Worker for PWA (installable / downloadable)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/cs/sw.js').catch(() => {});
}
