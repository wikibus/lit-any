/* eslint-disable class-methods-use-this */
import { html } from 'lit-html/lib/lit-extended';
import { LitElement } from '@polymer/lit-element';
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map';
import contract from './contract-helpers';
import { FieldTemplates } from '../template-registry';

function onSubmit(e) {
    this.submit();
    e.preventDefault();
    return false;
}

export default class LitForm extends LitElement {
    constructor() {
        super();

        this.contract = null;
        this.noLabels = false;
        this.value = {};
        this.submitButtonLabel = 'Submit';
        this.noSubmitButton = false;
        this.resetButtonLabel = 'Reset';
        this.noResetButton = false;
    }

    get form() {
        return this.shadowRoot.querySelector('form');
    }

    static get properties() {
        return {
            contract: Object,
            noLabels: Boolean,
            value: Object,
            submitButtonLabel: String,
            noSubmitButton: Boolean,
            resetButtonLabel: String,
            noResetButton: Boolean,
            templateRegistry: String,
        };
    }

    static get observedAttributes() {
        return [
            'no-labels',
            'template-registry',
            'submit-button-label',
            'no-submit-button',
            'reset-button-label',
            'no-reset-button',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        let value = newValue;
        const propName = dashToCamelCase(name);

        if (LitForm.properties[propName] === Boolean) {
            value = newValue !== null;
        }

        this[propName] = value;
    }

    submit() {
        this.dispatchEvent(new CustomEvent('submit', {
            detail: {
                value: this.value,
                target: this.form.action,
                method: this.form.getAttribute('method') || this.form.method.toUpperCase(),
            },
        }));
    }

    async reset() {
        this.requestRender();
        await this.renderComplete;
        this.value = {};
    }

    _render(props) {
        if (props.contract) {
            return this.__formTemplate(props);
        }

        return html``;
    }

    __formTemplate(props) {
        return html`<style>
                    ${this.__stylesheet()}
                </style>

            <form action$="${props.contract.target}"
                 method$="${props.contract.method}" 
                 on-submit="${onSubmit.bind(this)}">
                ${contract.hasAnythingToRender(props.contract) ? this.__fieldsetTemplate(props) : ''}
                
                ${props.noSubmitButton ? '' : this.__submitButtonTemplate(props)}
                ${props.noResetButton ? '' : this.__resetButtonTemplate(props)}
            </form>`;
    }

    __stylesheet() {
        return `:host {
                        display: block;
                    }
                
                    form {
                        @apply --lit-form-form;
                    }
                    
                    fieldset {
                        @apply --lit-form-fieldset;
                    }
                    
                    .field {
                        @apply --lit-form-field;
                    }`;
    }

    __submitButtonTemplate(props) {
        return html`<button type="submit">${props.submitButtonLabel}</button>`;
    }

    __resetButtonTemplate(props) {
        return html`<input type="button" value="${props.resetButtonLabel}" on-click="${this.reset.bind(this)}">`;
    }

    __fieldsetTemplate(props) {
        let fieldsArray = [];
        if (contract.fieldsAreIterable(props.contract)) {
            fieldsArray = props.contract.fields;
        }

        return html`
            <fieldset>
                ${this.__fieldsetHeading(props.contract)}
                
                ${fieldsArray.map(f => this.__fieldWrapperTemplate(props, f))}
            </fieldset>`;
    }

    __fieldWrapperTemplate(props, field) {
        const fieldId = field.property;

        let fieldLabel = html``;
        if (props.noLabels === false) {
            fieldLabel = html`<label for$="${fieldId}">${field.title || field.property}</label>`;
        }

        return html`<div class="field">
                        ${fieldLabel}
                        ${this.__fieldTemplate(props, field, fieldId)}
                    </div>`;
    }

    __fieldTemplate(props, field, fieldId) {
        const setter = this.__createModelValueSetter(props, field);

        const fieldTemplate = FieldTemplates.byName(props.templateRegistry).getTemplate({ field });
        const fieldValue = this.__getPropertyValue(field, props.value);

        if (fieldTemplate === null) {
            console.warn('Could not find template for field. Rendering fallback input. Field was:', field);
            return html`<input id$="${fieldId}" class="fallback" on-input="${e => setter(e.target.value)}" value="${fieldValue || ''}">`;
        }

        return fieldTemplate.render(field, fieldId, fieldValue, setter);
    }

    __createModelValueSetter(props, field) {
        return (fieldInput) => {
            let newValue = fieldInput;

            if (field.valueDecorator && typeof field.valueDecorator.wrap === 'function') {
                newValue = field.valueDecorator.wrap(newValue);
            }

            this.value[field.property] = newValue;
        };
    }

    __getPropertyValue(field, model) {
        let value = model[field.property] || null;

        if (value && field.valueDecorator && typeof field.valueDecorator.unwrap === 'function') {
            value = field.valueDecorator.unwrap(value);
        }

        return value;
    }

    __fieldsetHeading(currentContract) {
        if (!currentContract.title) {
            return html``;
        }

        return html`<legend>${currentContract.title}</legend>`;
    }
}

window.customElements.define('lit-form', LitForm);
