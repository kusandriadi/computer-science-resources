// ========================================
// Handbook Module Registry
// ========================================
const handbooks = {
    'ai-engineering-syllabus': {
        title: 'AI Engineering Syllabus',
        modules: [
            { file: 'README.md', name: 'Overview — Program Structure', meta: true },
            { file: '01-data-science-ai-for-business/syllabus.md', name: 'Data Science & AI for Business' },
            { file: '02-machine-learning/syllabus.md', name: 'Machine Learning' },
            { file: '03-generative-ai-engineering/syllabus.md', name: 'Generative AI Engineering' },
            { file: '04-deep-learning-nlp/syllabus.md', name: 'Deep Learning & NLP' },
            { file: '05-computer-vision/syllabus.md', name: 'Computer Vision' },
            { file: '06-ai-ethics-governance-explainability/syllabus.md', name: 'AI Ethics, Governance & Explainability' },
            { file: '07-cloud-ai-infrastructure/syllabus.md', name: 'Cloud & AI Infrastructure' }
        ]
    },
    'llm-handbook': {
        title: 'LLM Handbook',
        modules: [
            { file: 'README.md', name: 'Overview — Reading Order', meta: true },
            { file: '10-learning-plan.md', name: 'Learning Plan', meta: true },
            { file: '01-foundations.md', name: 'Foundations' },
            { file: '02-pretraining.md', name: 'Pre-training' },
            { file: '03-post-training.md', name: 'Post-training' },
            { file: '04-inference.md', name: 'Inference' },
            { file: '05-architectures.md', name: 'Architectures' },
            { file: '06-reasoning-agents.md', name: 'Reasoning & Agents' },
            { file: '07-evaluation.md', name: 'Evaluation' },
            { file: '08-production.md', name: 'Production' },
            { file: '11-appendix-A-toolkit.md', name: 'Toolkit', label: 'A' },
            { file: '12-appendix-B-opensource-and-local.md', name: 'Open Source & Local', label: 'B' },
            { file: '13-appendix-C-agent-engineering.md', name: 'Agent Engineering', label: 'C' },
            { file: '14-appendix-D-api-vs-selfhosted.md', name: 'API vs Self-hosted', label: 'D' },
            { file: '15-appendix-E-hardware.md', name: 'Hardware', label: 'E' },
            { file: '16-appendix-F-enterprise-cases.md', name: 'Enterprise Cases', label: 'F' },
            { file: '17-appendix-G-security.md', name: 'Security', label: 'G' }
        ]
    },
    'algorithms-handbook': {
        title: 'Algorithms Handbook',
        modules: [
            { file: 'README.md', name: 'Overview — Module Map', meta: true },
            { file: '01-complexity-analysis.md', name: 'Complexity Analysis' },
            { file: '02-data-structures.md', name: 'Data Structures' },
            { file: '03-sorting-and-searching.md', name: 'Sorting & Searching' },
            { file: '04-recursion-and-backtracking.md', name: 'Recursion & Backtracking' },
            { file: '05-divide-and-conquer.md', name: 'Divide and Conquer' },
            { file: '06-dynamic-programming.md', name: 'Dynamic Programming' },
            { file: '07-greedy-algorithms.md', name: 'Greedy Algorithms' },
            { file: '08-graph-algorithms.md', name: 'Graph Algorithms' },
            { file: '09-string-algorithms.md', name: 'String Algorithms' },
            { file: '10-advanced-topics.md', name: 'Advanced Topics' },
            { file: '11-complexity-theory.md', name: 'Complexity Theory' },
            { file: '12-problem-solving-patterns.md', name: 'Problem-Solving Patterns' },
            { file: '13-essential-reading.md', name: 'Essential Reading' },
            { file: '14-network-flows.md', name: 'Network Flows' }
        ]
    },
    'computational-thinking-handbook': {
        title: 'Buku Panduan Computational Thinking',
        modules: [
            { file: 'README.md', name: 'Gambaran Umum', meta: true },
            { file: '01-decomposition.md', name: 'Dekomposisi' },
            { file: '02-pattern-recognition.md', name: 'Pengenalan Pola' },
            { file: '03-abstraction.md', name: 'Abstraksi' },
            { file: '04-algorithm-design.md', name: 'Desain Algoritma' },
            { file: '05-logical-thinking.md', name: 'Berpikir Logis' },
            { file: '06-debugging.md', name: 'Debugging' },
            { file: '07-everyday-ct.md', name: 'CT Sehari-hari' },
            { file: '08-fun-activities.md', name: 'Aktivitas Seru' },
            { file: '09-for-teachers-and-parents.md', name: 'Untuk Guru & Orang Tua' }
        ]
    },
    'gan-handbook': {
        title: 'GAN Handbook',
        modules: [
            { file: 'README.md', name: 'Overview — Reading Order', meta: true },
            { file: '00-overview.md', name: 'Why GANs Exist', meta: true },
            { file: '10-learning-plan.md', name: 'Learning Plan', meta: true },
            { file: '01-foundations.md', name: 'Foundations' },
            { file: '02-losses.md', name: 'Losses' },
            { file: '03-architectures.md', name: 'Architectures' },
            { file: '04-conditional.md', name: 'Conditional & Image-to-Image' },
            { file: '05-evaluation.md', name: 'Evaluation' },
            { file: '06-applications.md', name: 'Applications (Real-ESRGAN)' },
            { file: '07-vs-diffusion.md', name: 'GAN vs Diffusion' },
            { file: '08-end-to-end.md', name: 'End-to-End: Runnable GAN' },
            { file: '09-essential-reading.md', name: 'Essential Reading' },
            { file: '11-appendix-A-toolkit.md', name: 'Toolkit', label: 'A' },
            { file: '12-appendix-B-hardware.md', name: 'Hardware', label: 'B' }
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
    updateFloatingActions();
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
    let chapterIdx = 0;
    list.innerHTML = handbook.modules.map((mod) => {
        let num;
        if (mod.meta) num = '~';
        else if (mod.label) num = mod.label;
        else num = String(++chapterIdx).padStart(2, '0');
        return `
        <div class="module-item" data-handbook="${handbookKey}" data-file="${mod.file}">
            <div class="module-number">${num}</div>
            <div class="module-name">${mod.name}</div>
        </div>
    `;
    }).join('');

    list.querySelectorAll('.module-item').forEach(item => {
        item.addEventListener('click', () => {
            loadContent(item.dataset.handbook, item.dataset.file);
        });
    });

    viewer.classList.remove('hidden');
    updateFloatingActions();
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
    updateFloatingActions();

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

function handleBack() {
    const contentVisible = !document.getElementById('content-viewer').classList.contains('hidden');
    if (contentVisible && currentHandbook) {
        showModuleList(currentHandbook);
    } else {
        showHome();
    }
}

document.getElementById('btn-back-content').addEventListener('click', handleBack);
document.getElementById('btn-back-floating').addEventListener('click', handleBack);
document.getElementById('btn-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// Floating Action Buttons visibility
// ========================================
function updateFloatingActions() {
    const fabs = document.getElementById('floating-actions');
    const inViewer =
        !document.getElementById('module-viewer').classList.contains('hidden') ||
        !document.getElementById('content-viewer').classList.contains('hidden');
    fabs.classList.toggle('hidden', !inViewer);
    updateTopButton();
}

function updateTopButton() {
    const btnTop = document.getElementById('btn-top');
    const shouldShow = window.scrollY > 200;
    btnTop.classList.toggle('is-hidden', !shouldShow);
}

window.addEventListener('scroll', updateTopButton, { passive: true });

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
