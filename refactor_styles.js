const fs = require('fs');
const path = require('path');

const files = [
    'frontend/src/components/Step4Report.vue',
    'frontend/src/components/Step5Interaction.vue'
];

const colorMap = [
    { regex: /#ffffff|#fff|#f8f9fa|#fafafa/gi, replacement: 'var(--bg-base)' },
    { regex: /#f3f4f6|#f9fafb|#f1f5f9|#f8fafc/gi, replacement: 'var(--bg-panel)' },
    { regex: /#e5e7eb|#eaeaea|#d1d5db/gi, replacement: 'var(--border-dim)' },
    { regex: /#111827|#1f2937|#000000|#000/gi, replacement: 'var(--text-primary)' },
    { regex: /#374151|#4b5563/gi, replacement: 'var(--text-secondary)' },
    { regex: /#6b7280|#9ca3af|#999|#666/gi, replacement: 'var(--text-muted)' },
    { regex: /rgba\(31, 41, 55, [^\)]+\)/gi, replacement: 'var(--shadow-panel)' },
    { regex: /rgba\(0, 0, 0, [^\)]+\)/gi, replacement: 'var(--shadow-panel)' },
    { regex: /'Inter',\s*'Noto Sans SC',\s*system-ui,\s*sans-serif/g, replacement: 'var(--font-sans)' },
    { regex: /'Times New Roman',\s*Times,\s*serif/g, replacement: 'var(--font-sans)' },
    { regex: /'JetBrains Mono',\s*'SF Mono',\s*'Monaco',\s*'Consolas',\s*monospace/g, replacement: 'var(--font-mono)' },
    { regex: /'JetBrains Mono',\s*monospace/g, replacement: 'var(--font-mono)' }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Split into template/script and style
    const styleMatch = content.match(/(<style scoped>)([\s\S]*?)(<\/style>)/);
    if (!styleMatch) return;
    
    let styleContent = styleMatch[2];
    
    // Apply color mappings
    colorMap.forEach(map => {
        styleContent = styleContent.replace(map.regex, map.replacement);
    });
    
    if (file.includes('Step5Interaction.vue')) {
        // Refactor chat window to minimalist terminal/console style without bubbles
        
        // Remove row-reverse from user message
        styleContent = styleContent.replace(/\.chat-message\.user\s*{\s*flex-direction:\s*row-reverse;\s*}/g, '.chat-message.user {\n    /* Terminal style: all messages align left */\n    flex-direction: row;\n}');
        
        // Remove row-reverse from user header
        styleContent = styleContent.replace(/\.chat-message\.user \.message-header\s*{\s*flex-direction:\s*row-reverse;\s*}/g, '.chat-message.user .message-header {\n    flex-direction: row;\n}');
        
        // Adjust message avatar background for terminal look
        styleContent = styleContent.replace(/\.chat-message\.user \.message-avatar\s*{[\s\S]*?}/g, '.chat-message.user .message-avatar {\n    background: var(--bg-panel);\n    color: var(--text-secondary);\n    border: 1px solid var(--border-dim);\n}');
        styleContent = styleContent.replace(/\.chat-message\.assistant \.message-avatar\s*{[\s\S]*?}/g, '.chat-message.assistant .message-avatar {\n    background: var(--bg-panel);\n    color: var(--accent-primary);\n    border: 1px solid var(--border-focus);\n}');
        
        // Adjust message text for terminal look
        styleContent = styleContent.replace(/\.message-text\s*{[\s\S]*?}/g, '.message-text {\n    padding: 4px 0;\n    font-family: var(--font-mono);\n    font-size: 13px;\n    line-height: 1.6;\n}');
        
        // Remove background, color overrides and border radius for bubbles
        styleContent = styleContent.replace(/\.chat-message\.user \.message-text\s*{[\s\S]*?}/g, '.chat-message.user .message-text {\n    background: transparent;\n    color: var(--text-secondary);\n}');
        styleContent = styleContent.replace(/\.chat-message\.assistant \.message-text\s*{[\s\S]*?}/g, '.chat-message.assistant .message-text {\n    background: transparent;\n    color: var(--text-primary);\n}');
        
        // Change chat messages container background if needed
        styleContent = styleContent.replace(/\.chat-messages\s*{[\s\S]*?}/g, '.chat-messages {\n    flex: 1;\n    overflow-y: auto;\n    padding: 24px;\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    background: var(--bg-base);\n}');
        
        // Chat message overall spacing and borders
        styleContent = styleContent.replace(/\.chat-message\s*{[\s\S]*?}/g, '.chat-message {\n    display: flex;\n    gap: 16px;\n    padding-bottom: 16px;\n    border-bottom: 1px solid var(--border-dim);\n}');

        // Change message content width
        styleContent = styleContent.replace(/\.message-content\s*{\s*max-width:\s*70%;[\s\S]*?}/g, '.message-content {\n    max-width: 100%;\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    gap: 6px;\n}');
        styleContent = styleContent.replace(/\.chat-message\.user \.message-content\s*{\s*align-items:\s*flex-end;\s*}/g, '.chat-message.user .message-content {\n    align-items: flex-start;\n}');
        
        // Adjust chat input area for terminal look
        styleContent = styleContent.replace(/\.chat-input-area\s*{[\s\S]*?}/g, '.chat-input-area {\n    padding: 16px 24px;\n    border-top: 1px solid var(--border-dim);\n    background: var(--bg-panel);\n    display: flex;\n    gap: 12px;\n    align-items: flex-end;\n}');
        
        styleContent = styleContent.replace(/\.chat-input\s*{[\s\S]*?}/g, '.chat-input {\n    flex: 1;\n    padding: 12px 16px;\n    font-size: 14px;\n    background: var(--bg-input);\n    color: var(--text-primary);\n    border: 1px solid var(--border-dim);\n    border-radius: var(--radius-sm);\n    resize: none;\n    font-family: var(--font-mono);\n    line-height: 1.5;\n    transition: border-color 0.2s ease;\n}');

        styleContent = styleContent.replace(/\.send-btn\s*{[\s\S]*?}/g, '.send-btn {\n    width: 44px;\n    height: 44px;\n    background: var(--text-primary);\n    color: var(--bg-base);\n    border: none;\n    border-radius: var(--radius-sm);\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: background 0.2s ease;\n}');
    }

    // Fix linear gradients that mapped to same variables
    styleContent = styleContent.replace(/linear-gradient\(180deg, var\(--bg-base\) 0%, var\(--bg-base\) 100%\)/g, 'var(--bg-panel)');
    styleContent = styleContent.replace(/linear-gradient\(135deg, var\(--bg-panel\) 0%, var\(--bg-panel\) 100%\)/g, 'var(--bg-panel)');
    styleContent = styleContent.replace(/linear-gradient\(135deg, var\(--text-primary\) 0%, var\(--text-secondary\) 100%\)/g, 'var(--border-dim)');

    content = content.replace(styleMatch[0], `<style scoped>\n${styleContent}\n</style>`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});
