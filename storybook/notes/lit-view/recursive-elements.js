import { html } from 'lit-html/lib/lit-extended';
import { md, codeblock } from '../index';

export default function notes(view) {
    const docs = md`# Nesting views
    
## Example`;

    const details = md`## Nesting \`<lit-view>\` elements

As an alternative to using the recursive \`render\` function it is possible to simply nest the \`<lit-view>\`
elements in the partial templates.

${codeblock('js')}
import { html } from 'lit-html'; 
import moment from 'moment'; 
import { ViewTemplates } from 'lit-any';

ViewTemplates.default
    .when
    .valueMatches(v => v.type === 'Person')
    .renders((render, person) => 
        html\`Hello, my name is $\{person.fullName}. 
             I was born <lit-view value=$\{person.birthDate}></lit-view>\`);

ViewTemplates.default
    .when
    .valueMatches(v => v instanceof Date || Date.parse(value))
    .renders((_, date) => html\`$\{moment(date).fromNow()}\`);
${codeblock()}

The difference this is that each \`<lit-view>\` element creates a [Shadow Root[sroot] or its content, which
may be useful when there is desired to isolate portions of the generated HTML.

[sroot]: https://www.webcomponents.org/specs#the-shadow-dom-specification`;

    return html`${docs} <br> ${view} <br> <hr> <br> ${details}`;
}