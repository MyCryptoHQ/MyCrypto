// ad-hoc parser for translation strings
import React from 'react';

const BOLD_REGEXP = /(\*\*)(.*?)\1/;
const LINK_REGEXP = /\[([^\[]+)\]\(([^\)]+)\)/;

function decodeHTMLEntities(text) {
    var entities = [['amp', '&'], ['lt', '<'], ['gt', '>']];

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
}

function linkify(mdString: string) {
    const parts = mdString.split(LINK_REGEXP);
    if (parts.length === 1) {
        return decodeHTMLEntities(parts[0]);
    }
    const result = [];
    let i = 0;
    while (i + 1 < parts.length) {
        result.push(decodeHTMLEntities(parts[i]));
        result.push(<a href={parts[i + 2]} target="_blank">{parts[i + 1]}</a>);
        i += 3;
    }
    result.push(decodeHTMLEntities(parts[parts.length - 1]));
    return result.filter(Boolean);
}

export function markupToReact(mdString: string) {
    const parts = mdString.split(BOLD_REGEXP);
    if (parts.length === 1) {
        return linkify(parts[0]);
    }
    let result = [];
    let i = 0;
    while (i + 1 < parts.length) {
        result = result.concat(linkify(parts[i]));
        result.push(<b>{parts[i + 2]}</b>);
        i += 3;
    }
    result = result.concat(linkify(parts.pop()));
    return result.filter(Boolean);
}
