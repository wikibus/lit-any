/* global describe, it, beforeEach */
import { expect } from '@open-wc/testing';
import ViewTemplateSelectorBuilder from '@lit-any/lit-any/views/TemplateSelectorBuilder';
import FieldTemplateSelectorBuilder from '@lit-any/lit-any/forms/TemplateSelectorBuilder';
import * as sinon from 'sinon';

describe('ViewTemplateSelectorBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new ViewTemplateSelectorBuilder({});
    });

    describe('adding value matcher function', () => {
        it('creates a matcher', () => {
            // given
            const valueToMatch = 'test val';

            // when
            builder.valueMatches(v => v === 'test val');

            // then
            const matcher = builder._selector._matchers[0];
            expect(matcher({
                value: valueToMatch,
            })).to.be.true;
        });
    });

    describe('adding scope matcher function', () => {
        it('creates a matcher', () => {
            // given
            const valueToMatch = 'the scope';

            // when
            builder.scopeMatches(s => s === 'the scope');

            // then
            const matcher = builder._selector._matchers[0];
            expect(matcher({
                scope: valueToMatch,
            })).to.be.true;
        });
    });

    describe('adding scope matcher shorthand', () => {
        it('creates a matcher', () => {
            // given
            const valueToMatch = 'the scope';

            // when
            builder.scopeMatches('the scope');

            // then
            const matcher = builder._selector._matchers[0];
            expect(matcher({
                scope: valueToMatch,
            })).to.be.true;
        });
    });
});

describe('FieldTemplateSelectorBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new FieldTemplateSelectorBuilder({});
    });

    describe('adding field matcher function', () => {
        it('creates a matcher', () => {
            // given
            const field = {};
            const matchFunc = sinon.stub().returns(true);

            // when
            builder.fieldMatches(matchFunc);

            // then
            const matcher = builder._selector._matchers[0];
            expect(matcher({ field })).to.be.true;
            expect(matchFunc.firstCall.args[0]).to.be.equal(field);
        });
    });
});
