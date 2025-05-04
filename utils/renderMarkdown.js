import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import 'katex/dist/katex.min.css';
import 'markdown-it-texmath/css/texmath.css';

const md = new MarkdownIt({ html: true }).use(texmath, {
  engine: require('katex'),
  delimiters: 'dollars',
  katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
});

export function renderMarkdownWithLatex(text) {
  return md.render(text || '');
}
