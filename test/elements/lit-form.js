import { html } from 'lit-html/lib/lit-extended';
import '../../src/elements/lit-form';
import { async, forRender } from '../async-tests';
import render from '../../src/render';

describe('lit-form', () => {
    let litForm;
    let renderFunc;

    beforeEach(() => {
        litForm = fixture('lit-form');
        renderFunc = sinon.spy(render, 'field');
    });

    afterEach(() => {
        if (renderFunc) {
            renderFunc.restore();
        }
    });

    async(it, 'should render empty form for empty contract', async () => {
        // given
        litForm.contract = { };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.children.length).to.equal(0);
    });

    async(it, 'should render legend for contract title', async () => {
        // given
        litForm.contract = {
            title: 'My first form',
        };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.querySelector('legend').textContent).to.equal('My first form');
    });

    async(it, 'should render wrapper for every field', async () => {
        // given
        litForm.contract = {
            fields: [{}, {}, {}, {}],
        };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.querySelectorAll('.field').length).to.equal(4);
    });

    async(it, 'should render every field', async () => {
        // given
        litForm.contract = {
            fields: [{}, {}, {}, {}],
        };

        // when
        await forRender(litForm);

        // then
        expect(renderFunc.getCalls().length).to.equal(4);
    });

    async(it, 'should pass pre-existing value when rendering field', async () => {
        // given
        litForm.contract = {
            fields: [{
                property: 'prop',
            }],
        };
        litForm.value = {
            prop: '10',
        };

        // when
        await forRender(litForm);

        // then
        const renderCall = renderFunc.firstCall;
        expect(renderCall.args[1]).to.equal('10');
    });

    async(it, 'should pass a change callback which sets value', async () => {
        // given
        renderFunc.restore();
        sinon.stub(render, 'field', (f, o, callback) => html`<input type="text" on-input="${callback}" />`);
        litForm.contract = {
            fields: [{
                property: 'test',
            }],
        };
        await forRender(litForm);

        // when
        const element = litForm.form.querySelector('input');
        element.value = 'abc';
        const e = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(e);

        // then
        expect(litForm.value.test).to.equal('abc');
    });

    async(it, 'should not render legend when title is empty', async () => {
        // given
        litForm.contract = {
            fields: [{}],
        };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.querySelector('legend')).to.be.null;
    });

    async(it, 'should set form[action] to contract\'s target', async () => {
        // given
        litForm.contract = {
            target: 'http://exmple.com/resource',
        };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.getAttribute('action')).to.equal('http://exmple.com/resource');
    });

    async(it, 'should set form[method] to contract\'s method', async () => {
        // given
        litForm.contract = {
            method: 'POST',
        };

        // when
        await forRender(litForm);

        // then
        expect(litForm.form.getAttribute('method')).to.equal('POST');
    });
});
