

export const UHKMacroMonarchLanguage: monaco.languages.IMonarchLanguage = {
    includeLF: true,
    defaultToken: 'invalid',

    commands: ["set"],

    identifier: /[a-zA-Z_]\w*/,
    variable: /\$@identifier/,

    escape: /\\(?:[abfnrtv\\"])/,

    tokenizer: {
        root: [
            [/\/\/.*/, 'comment'],


            [/@identifier:/, 'entity'],
            [/@identifier/, {
                cases: {
                    'setVar': { token: 'keyword', next: '@setVar' },
                    'goTo': { token: 'keyword', next: '@goTo' },
                    'repeatFor': { token: 'keyword', next: '@repeatFor' },
                    '@commands': 'keyword',
                    '@default': 'invalid'
                }
            }],

            [/[{}]/, '@brackets'],

            { include: '@variable' },
            { include: '@interpolatedString' },
            { include: '@literalString' },
            { include: '@expression' },
        ],

        setVar: [
            [/@identifier/, 'variable.name', '@pop'],
            [/\$queuedKeyId\.[1-9][0-9]*/, 'invalid'],
            [/\$keyId\.\S+/, 'invalid'],  // TODO: define keyID
            [/@variable/, 'invalid'],
            [/(?=[^\s\w]+)/, '', '@pop'],
            [/\n/, '', '@pop']
        ],

        goTo: [
            [/@identifier/, 'entity', '@pop'],
            [/(?=[^\s\w]+)/, '', '@pop'],
            [/\n/, '', '@pop']
        ],

        repeatFor: [
            [/@identifier/, { token: 'variable.name', switchTo: '@goTo' }],
            [/\$queuedKeyId\.[1-9][0-9]*/, { token: 'invalid', switchTo: '@goTo' }],
            [/\$keyId\.\S+/, { token: 'invalid', switchTo: '@goTo' }],  // TODO: define keyID
            [/@variable/, { token: 'invalid', switchTo: '@goTo' }],
            [/(?=[^\s\w]+)/, { token: '', switchTo: '@goTo' }],
            [/\n/, '', '@pop']
        ],

        variable: [
            [/\$queuedKeyId\.[1-9][0-9]*/, 'variable.value'],
            [/\$keyId\.\S+/, 'variable.value'],  // TODO: define keyID
            [/@variable/, 'variable.value'],
        ],

        parenthesedExpression: [
            [/\(/, { token: 'bracket', bracket: '@open', next: '@_parenthesed' }],
        ],

        _parenthesed: [
            [/\)/, { token: 'bracket', bracket: '@close', next: '@pop' }],
            { include: '@expression' },
            [/\n[^\)\s]*\)?/, 'invalid', '@pop'],
            [/\S/, 'invalid'],
        ],

        expression: [
            { include: '@parenthesedExpression' },
            { include: '@variable' },
            { include: '@interpolatedString' },
            { include: '@literalString' },
            [/-?\d*\.\d+/, 'number.float'],
            [/-?\d+/, 'number'],
            [/<=|>=|==|!=|&&|\|\||!|\+|\-|\*|\/|\%|\<|\>/, 'operator'],
            [/(min|max)\(/, 'keyword', '@_parenthesed'],
        ],

        interpolatedString: [
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@_interpolated' }],
        ],

        _interpolated: [
            { include: '@variable' },
            [/[^\\"]/, 'string'],
            [/@escape/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
        ],

        literalString: [
            [/'[^']*$/, 'string.invalid'],
            [/'/, { token: 'string.quote', bracket: '@open', next: '@_literal' }],
        ],

        _literal: [
            [/[^']/, 'string'],
            [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
        ],
    },
}


export const UHKMacroConfig: monaco.languages.LanguageConfiguration = {
    comments: {
        lineComment: '//'
    },
    brackets: [
        ['{', '}'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string'] },
    ],
}
