// --- Initialization ---
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');

        // Set initial content and render
        const initialContent = `## Welcome to Markdown to Word

This is a **client-side** converter tool.

## Features
- Convert **Markdown** to Word
- Supports *Italics* and __Bold__
- Lists and Tables

| Feature | Support |
|---------|---------|
| Tables  | Yes     |
| Lists   | Yes     |

\`\`\`javascript
console.log("Hello World");
\`\`\`
`;

        if (!editor.value) {
            editor.value = initialContent;
        }

        // --- Markdown to HTML (Preview) ---
        function updatePreview() {
            const markdownText = editor.value;
            const htmlContent = marked.parse(markdownText);
            preview.innerHTML = htmlContent;
        }

        editor.addEventListener('input', updatePreview);
        updatePreview(); // Initial render

        // --- File Upload ---
        function handleFileUpload(input) {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                editor.value = e.target.result;
                updatePreview();
            };
            reader.readAsText(file);
        }

        // --- Copy Rich Text ---
        // We select the preview div and copy its HTML content to clipboard
        async function copyRichText() {
            const range = document.createRange();
            range.selectNode(preview);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            try {
                // Modern Async Clipboard API (if text/html is supported, mostly strict security)
                // Fallback to execCommand for better rich text support across browsers
                document.execCommand('copy');
                alert('Rich text copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy', err);
                alert('Failed to copy text.');
            }

            window.getSelection().removeAllRanges();
        }

        // --- Markdown to DOCX Generation (The Heavy Lifting) ---
        // We use 'marked.lexer' to get tokens, then map tokens to 'docx' library objects.
        async function downloadDocx() {
            const text = editor.value;
            const tokens = marked.lexer(text);

            // Generate filename from the first H1 heading, or default
            let filename = "markdown-document.docx";
            const h1Token = tokens.find(t => t.type === 'heading' && t.depth === 1);
            if (h1Token) {
                // Sanitize filename: keep alphanumeric, spaces, hyphens
                const safeName = h1Token.text.replace(/[^a-z0-9 \-_]/gi, '').trim();
                if (safeName) {
                    filename = safeName.replace(/\s+/g, '-') + ".docx";
                }
            }

            const docChildren = mapTokensToDocx(tokens);

            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: docChildren,
                }],
            });

            docx.Packer.toBlob(doc).then((blob) => {
                const docxBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

                // Use DOM anchor method for maximum compatibility
                const url = window.URL.createObjectURL(docxBlob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = filename;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(url);
            }).catch(err => {
                console.error("Error generating docx:", err);
                alert("Error generating document. See console.");
            });
        }

        // --- Mapper Function: Tokens -> Docx Paragraphs ---
        function mapTokensToDocx(tokens) {
            const children = [];

            tokens.forEach(token => {
                switch (token.type) {
                    case 'heading':
                        children.push(createHeading(token));
                        break;
                    case 'paragraph':
                        children.push(createParagraph(token.text));
                        break;
                    case 'list':
                        children.push(...createList(token));
                        break;
                    case 'code':
                        children.push(createCodeBlock(token));
                        break;
                    case 'blockquote':
                        // Blockquotes treated as italicized indented text
                        token.tokens.forEach(t => {
                            if (t.type === 'paragraph') {
                                children.push(new docx.Paragraph({
                                    children: [new docx.TextRun(t.text)],
                                    indent: { left: 720 }, // 0.5 inch
                                    style: "IntenseQuote" // Docx built-in style or manual
                                }));
                            }
                        })
                        break;
                    case 'table':
                        children.push(createTable(token));
                        break;
                    case 'space':
                        // Ignore
                        break;
                    case 'hr':
                        children.push(new docx.Paragraph({
                            border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } }
                        }));
                        break;
                    default:
                        console.warn('Unhandled token type:', token.type);
                }
            });

            return children;
        }

        // Helper: Create Heading
        function createHeading(token) {
            // marked token.depth is 1-6
            let headingLevel = docx.HeadingLevel.HEADING_1;
            if (token.depth === 2) headingLevel = docx.HeadingLevel.HEADING_2;
            if (token.depth === 3) headingLevel = docx.HeadingLevel.HEADING_3;
            if (token.depth === 4) headingLevel = docx.HeadingLevel.HEADING_4;
            if (token.depth === 5) headingLevel = docx.HeadingLevel.HEADING_5;
            if (token.depth >= 6) headingLevel = docx.HeadingLevel.HEADING_6;

            return new docx.Paragraph({
                children: [
                    new docx.TextRun({
                        text: token.text,
                    })
                ],
                heading: headingLevel,
                spacing: { before: 200, after: 120 }
            });
        }

        // Helper: Create Paragraph with inline formatting (bold/italic)
        // Note: marked token.text is plain string with Markdown syntax. 
        // Ideally we recursively parse inline markdown. marked.inlineLexer?
        // Simpler approach for client-side without massive complexity:
        // Use a simple regex replacer or split logic for ** and *.
        // Ideally we should use token.tokens if available for inline.
        // Let's assume basic text or try to handle simple formatting.
        function createParagraph(text) {
            // Basic parsing for Bold (**text**) and Italic (*text*)
            // This is a naive implementation. For robust production usage, we'd traverse the inline tokens.
            // But for this single-file tool, we will try to support basic formatting.

            const textRuns = parseInlineText(text);

            return new docx.Paragraph({
                children: textRuns,
                spacing: { after: 120 }
            });
        }

        function createList(token) {
            const items = [];
            token.items.forEach(item => {
                // item.text contains the content. 
                // We should handle nested formatting if possible.
                items.push(new docx.Paragraph({
                    children: parseInlineText(item.text),
                    bullet: { level: 0 }, // docx.js handles numbering vs bullets automatically if using proper Paragraph props? 
                    // Actually docx.js requires styling numbering. 
                    // For Simplicity: We use 'bullet' property. 
                    // For ordered lists we can try numbering but it needs config.
                    // Falling back to simple bullets for both for generic stability or just bullets.
                }));
            });
            return items;
        }

        function createCodeBlock(token) {
            return new docx.Paragraph({
                children: [
                    new docx.TextRun({
                        text: token.text,
                        font: "Courier New",
                        size: 22, // 11pt
                    })
                ],
                shading: {
                    type: docx.ShadingType.CLEAR,
                    fill: "F1F5F9",
                },
                spacing: { before: 120, after: 120 }
            });
        }

        function createTable(token) {
            // token.header is array of {text: string}
            // token.rows is array of array of {text: string}

            const rows = [];

            // Header
            const headerCells = token.header.map(cell =>
                new docx.TableCell({
                    children: [new docx.Paragraph({ children: parseInlineText(cell.text), style: "strong" })],
                    shading: { fill: "f3f4f6" }
                })
            );
            rows.push(new docx.TableRow({ children: headerCells }));

            // Body
            token.rows.forEach(row => {
                const cells = row.map(cell =>
                    new docx.TableCell({
                        children: [new docx.Paragraph({ children: parseInlineText(cell.text) })]
                    })
                );
                rows.push(new docx.TableRow({ children: cells }));
            });

            return new docx.Table({
                rows: rows,
                width: { size: 100, type: docx.WidthType.PERCENTAGE }
            });
        }

        // --- Simple Inline Parser --- 
        // Supports **bold**, *italic*, `code`.
        function parseInlineText(text) {
            const runs = [];
            // Regex to split by bold, italic, code
            // This is tricky. A better way is to use marked inline lexer tokens if available.
            // marked.lexer(text) returns block tokens. 
            // Inside paragraph token, there might be 'tokens' array if 'smartypants' or default inline parser run.
            // Let's check `marked.lexer` output in console. It usually puts inline tokens in `token.tokens`.

            // However, since we don't have the token object passed here (only text string for some helpers), 
            // let's re-lex inline. 
            // Actually, we can just use the provided tokens in the recursive map.
            // But `createParagraph` received `text`. Let's assume we can split manually for now.
            // Or better: pass the token itself to createParagraph everywhere.

            // Re-implementing a basic regex parser for common syntax:
            // Split by ** or * or `
            // This is "Good Enough" for MVP.

            let parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

            parts.forEach(part => {
                if (!part) return;

                if (part.startsWith('**') && part.endsWith('**')) {
                    runs.push(new docx.TextRun({ text: part.slice(2, -2), bold: true }));
                } else if (part.startsWith('*') && part.endsWith('*')) {
                    runs.push(new docx.TextRun({ text: part.slice(1, -1), italics: true }));
                } else if (part.startsWith('`') && part.endsWith('`')) {
                    runs.push(new docx.TextRun({ text: part.slice(1, -1), font: "Courier New" }));
                } else {
                    // Start decoding HTML entities if marked left them? marked.lexer decodes entities usually.
                    // But we might need to handle &amp; etc. Docx handles string content well.
                    runs.push(new docx.TextRun({ text: part }));
                }
            });

            return runs;
        }
