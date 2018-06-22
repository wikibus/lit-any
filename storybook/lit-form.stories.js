import { html } from 'lit-html/lib/lit-extended';
import { directive } from 'lit-html';
import { storiesOf } from '@storybook/polymer/dist/client/index';
import { select } from '@storybook/addon-knobs';
import '../src/elements/lit-form';
import { FieldTemplates } from '../src';
import { defaultValue, submitButton, resetButton, contract, noSubmitButton, noResetButton } from './knobs';
import onSubmit from './helpers/submit-handler';
import buttonsNotes from './notes/lit-form/buttons.md';
import fallbackNotes from './notes/lit-form/fallback-input.md';

import '../bower_components/paper-input/paper-input.html';

FieldTemplates.default
    .when
    .fieldMatches(f => f.type === 'integer')
    .renders((f, id, v, set) =>
        html`<input id=${id} 
                type=number 
                value=${v} 
                on-change=${e => set(Number.parseInt(e.target.value, 0))}>`);

storiesOf('lit-form', module)
    .add('Fallback input', () => {
        const c = {
            fields: [
                {
                    property: 'age',
                    title: 'Your age',
                    type: 'custom',
                },
            ],
        };

        const value = {
            age: 30,
        };

        FieldTemplates.byName('catch-all').when
            .fieldMatches(() => true)
            .renders((f, id, v, set) =>
                html`<paper-input id=${id} 
                 label=${f.title}
                 value=${v} 
                 on-change=${e => set(e.target.value)}></paper-input>`);

        const registry = select('Fallback behavior', ['default', 'catch-all'], 'default', 'Behavior');

        return html`<lit-form
                          contract="${contract(c)}" 
                          noLabels="${registry === 'catch-all'}"
                          submitButtonLabel=${submitButton('Register')}
                          value="${defaultValue(value)}"
                          template-registry$="${registry}"
                          on-submit="${onSubmit}"></lit-form>`;
    }, {
        notes: { markdown: fallbackNotes },
    });

storiesOf('lit-form', module)
    .add('Form buttons', () => {
        const c = {
            target: 'http://example.com',
            method: 'POST',
            fields: [
                {
                    property: 'age',
                    title: 'Your age',
                },
            ],
        };

        let form;
        const getForm = (part) => {
            form = part.element;
        };

        return html`
<lit-form ref="${directive(getForm)}"
          contract="${contract(c)}" 
          noSubmitButton="${noSubmitButton()}"
          submitButtonLabel=${submitButton('Submit')}
          noResetButton="${noResetButton()}"
          resetButtonLabel=${resetButton('Reset')}
          on-submit="${onSubmit}"></lit-form>

<button on-click="${() => form.submit()}">Submit from the outside</button>`;
    }, {
        notes: { markdown: buttonsNotes },
    });
