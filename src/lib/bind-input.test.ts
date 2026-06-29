import { describe, it, expect, vi } from 'vitest'
import BindInput from './bind-input'

/**
 * Tests for BindInput — Phase 1: Runtime Verification
 *
 * These tests verify the input binding mechanism that bridges
 * the editor with HTML form elements.
 *
 * Source: Plan Testing Strategy "Content round-trip"
 */

describe('lib/bind-input', () => {
    describe('constructor', () => {
        /* Plan: Editor initialization requires valid element */
        it('accepts an input element', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)
            expect(bindInput.element).toBe(input)
        })

        /* Plan: Editor initialization requires valid element */
        it('accepts a textarea element', () => {
            const textarea = document.createElement('textarea')
            const bindInput = new BindInput(textarea)
            expect(bindInput.element).toBe(textarea)
        })

        /* Unhappy: invalid element type */
        it('throws when provided a div element', () => {
            const div = document.createElement('div') as any
            expect(() => new BindInput(div)).toThrow(
                '[BlockEditor] provided element should be an input or textarea element'
            )
        })

        /* Unhappy: invalid element type — span */
        it('throws when provided a span element', () => {
            const span = document.createElement('span') as any
            expect(() => new BindInput(span)).toThrow(
                '[BlockEditor] provided element should be an input or textarea element'
            )
        })

        /* Unhappy: invalid element type — select */
        it('throws when provided a select element', () => {
            const select = document.createElement('select') as any
            expect(() => new BindInput(select)).toThrow(
                '[BlockEditor] provided element should be an input or textarea element'
            )
        })
    })

    describe('getValue', () => {
        /* Plan: Content round-trip — reads initial value */
        it('returns value from an input element', () => {
            const input = document.createElement('input')
            input.value = '<p>Hello World</p>'
            const bindInput = new BindInput(input)

            expect(bindInput.getValue()).toBe('<p>Hello World</p>')
        })

        /* Plan: Content round-trip — reads from textarea */
        it('returns innerText from a textarea element', () => {
            const textarea = document.createElement('textarea')
            textarea.innerText = '<p>Block content</p>'
            const bindInput = new BindInput(textarea)

            expect(bindInput.getValue()).toBe('<p>Block content</p>')
        })

        /* Unhappy: empty input */
        it('returns empty string for empty input', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)

            expect(bindInput.getValue()).toBe('')
        })

        /* Unhappy: empty textarea — jsdom does not implement innerText */
        it('returns a falsy value for empty textarea', () => {
            const textarea = document.createElement('textarea')
            const bindInput = new BindInput(textarea)

            // jsdom doesn't implement innerText (returns undefined)
            // In real browsers, empty textarea.innerText returns ''
            // Both are falsy, which is the contract we care about
            expect(bindInput.getValue()).toBeFalsy()
        })
    })

    describe('setValue', () => {
        /* Plan: Content round-trip — serialized HTML written back */
        it('sets value on an input element', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)

            bindInput.setValue('<p>Updated content</p>')

            expect(input.value).toBe('<p>Updated content</p>')
        })

        /* Plan: Content round-trip — serialized HTML written to textarea */
        it('sets innerText on a textarea element', () => {
            const textarea = document.createElement('textarea')
            const bindInput = new BindInput(textarea)

            bindInput.setValue('<p>Updated content</p>')

            expect(textarea.innerText).toBe('<p>Updated content</p>')
        })

        /* Plan: Editor output sync — dispatches change event */
        it('dispatches a change event on the element', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)
            const handler = vi.fn()
            input.addEventListener('change', handler)

            bindInput.setValue('new value')

            expect(handler).toHaveBeenCalledTimes(1)
        })

        /* Unhappy: setValue with empty string */
        it('handles empty string value', () => {
            const input = document.createElement('input')
            input.value = 'existing'
            const bindInput = new BindInput(input)

            bindInput.setValue('')

            expect(input.value).toBe('')
        })

        /* Unhappy: setValue with HTML entities */
        it('preserves HTML entities in serialized output', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)

            bindInput.setValue('<p>&amp; &lt; &gt;</p>')

            expect(input.value).toBe('<p>&amp; &lt; &gt;</p>')
        })
    })

    describe('getElement', () => {
        /* Plan: Editor references original element for form submission */
        it('returns the original element reference', () => {
            const input = document.createElement('input')
            const bindInput = new BindInput(input)

            expect(bindInput.getElement()).toBe(input)
        })
    })
})
