// --- Initialization ---
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');

        // Set initial content and render
        const initialContent = `## Bienvenido al Convertidor de Markdown a Word

Este es un convertidor que funciona **directamente en tu navegador**.

## Caracteristicas
- Convierte **Markdown** a Word
- Soporta *Cursiva* y __Negrita__
- Listas y Tablas

| Caracteristica | Soporte |
|----------------|---------|
| Tablas         | Si      |
| Listas         | Si      |

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
                document.execCommand('copy');
                alert('Texto enriquecido copiado al portapapeles!');
            } catch (err) {
                console.error('Failed to copy', err);
                alert('Error al copiar el texto.');
            }

            window.getSelection().removeAllRanges();
        }

        // --- Markdown to DOCX Generation (The Heavy Lifting) ---
        async function downloadDocx() {
            const text = editor.value;
            const tokens = marked.lexer(text);

            // Generate filename from the first H1 heading, or default
            let filename = "documento-markdown.docx";
            const h1Token = tokens.find(t => t.type === 'heading' && t.depth === 1);
            if (h1Token) {
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
                alert("Error al generar el documento. Revisa la consola.");
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
                        token.tokens.forEach(t => {
                            if (t.type === 'paragraph') {
                                children.push(new docx.Paragraph({
                                    children: [new docx.TextRun(t.text)],
                                    indent: { left: 720 },
                                    style: "IntenseQuote"
                                }));
                            }
                        })
                        break;
                    case 'table':
                        children.push(createTable(token));
                        break;
                    case 'space':
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

        function createHeading(token) {
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

        function createParagraph(text) {
            const textRuns = parseInlineText(text);

            return new docx.Paragraph({
                children: textRuns,
                spacing: { after: 120 }
            });
        }

        function createList(token) {
            const items = [];
            token.items.forEach(item => {
                items.push(new docx.Paragraph({
                    children: parseInlineText(item.text),
                    bullet: { level: 0 },
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
                        size: 22,
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
            const rows = [];

            const headerCells = token.header.map(cell =>
                new docx.TableCell({
                    children: [new docx.Paragraph({ children: parseInlineText(cell.text), style: "strong" })],
                    shading: { fill: "f3f4f6" }
                })
            );
            rows.push(new docx.TableRow({ children: headerCells }));

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

        function parseInlineText(text) {
            const runs = [];
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
                    runs.push(new docx.TextRun({ text: part }));
                }
            });

            return runs;
        }
