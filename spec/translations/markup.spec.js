import React from 'react';
import { markupToReact } from 'translations/markup';

describe('markupToReact', () => {
    it('passes plain string as is', () => {
        const value = 'string';
        const expected = 'string';
        expect(markupToReact(value)).toEqual(expected);
    });

    it('transforms bold syntax', () => {
        let value = '**foo**';
        let expected = [<b>foo</b>];
        expect(markupToReact(value)).toEqual(expected);

        value = '**foo** bar';
        expected = [<b>foo</b>, ' bar'];
        expect(markupToReact(value)).toEqual(expected);

        value = 'bar **foo**';
        expected = ['bar ', <b>foo</b>];
        expect(markupToReact(value)).toEqual(expected);

        value = 'bar **foo** baz';
        expected = ['bar ', <b>foo</b>, ' baz'];
        expect(markupToReact(value)).toEqual(expected);

        value = '**foo****bar**';
        expected = [<b>foo</b>, <b>bar</b>];
        expect(markupToReact(value)).toEqual(expected);
    });

    it('transforms link syntax', () => {
        let value = '[foo](http://google.com)';
        let expected = [<a href="http://google.com" target="_blank">foo</a>];
        expect(markupToReact(value)).toEqual(expected);

        value = '[foo](http://google.com) bar';
        expected = [<a href="http://google.com" target="_blank">foo</a>, ' bar'];
        expect(markupToReact(value)).toEqual(expected);

        value = 'bar [foo](http://google.com)';
        expected = ['bar ', <a href="http://google.com" target="_blank">foo</a>];
        expect(markupToReact(value)).toEqual(expected);

        value = 'bar [foo](http://google.com) baz';
        expected = ['bar ', <a href="http://google.com" target="_blank">foo</a>, ' baz'];
        expect(markupToReact(value)).toEqual(expected);

        value = '[foo](http://google.com)[bar](http://google.ca)';
        expected = [
            <a href="http://google.com" target="_blank">foo</a>,
            <a href="http://google.ca" target="_blank">bar</a>
        ];
        expect(markupToReact(value)).toEqual(expected);
    });

    it('converts mixed syntax', () => {
        let value = 'Bold **foo** link [foo](http://google.com) text';
        let expected = [
            'Bold ',
            <b>foo</b>,
            ' link ',
            <a href="http://google.com" target="_blank">foo</a>,
            ' text'
        ];
        expect(markupToReact(value)).toEqual(expected);
    });
});
