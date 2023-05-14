import {Markup} from 'rc-marked-input'
import {isEqual} from './analyzers/isEqual'
import {findSingleGap} from './analyzers/findSingleGap'
import {modifyOrigin} from './joiners/modifyOrigin'
import {mapStraight} from './joiners/mapStraight'
import {RegexParser} from './parsers/RegexParser'
import {SymbolParser} from './parsers/SymbolParser'
import {Analyzer, JoinParameters, ParserConstructor} from './types'

export const Markups_16: Markup[] = [
	'@[__label__]',
	'@[__label__}',
	'@{__label__]',
	'@{__label__}',

	'/[__label__}',
	'/{__label__]',
	'/{__label__}',

	'@[__label__*',
	'@*__label__]',
	'@*__label__*',

	'_[__label__]_',
	'____label____',
	'**__label__**',
	'[^__label__^]',
	'[=^__label__^=]',
	'[[__label__]]',
]

export const Markups_1 = Markups_16.slice(0, 1)
export const Markups_2 = Markups_16.slice(0, 2)
export const Markups_4 = Markups_16.slice(0, 4)
export const Markups_8 = Markups_16.slice(0, 8)

export const AnnCountToMarkupMap: Record<string, Markup[]> = {
	'a1': Markups_1,
	'a2': Markups_2,
	'a4': Markups_4,
	'a8': Markups_8,
	'a16': Markups_16,
}

export const LineCountToDiff: Record<string, { count: number, speed: number }> = {
	2: {
		count: 10,
		speed: 1,
	},
	5: {
		count: 10,
		speed: 2,
	},
	10: {
		count: 10,
		speed: 5,
	},
	20: {
		count: 10,
		speed: 5,
	},
	50: {
		count: 10,
		speed: 10,
	},
	100: {
		count: 10,
		speed: 20,
	},
	1_000: {
		count: 10,
		speed: 50,
	},
	10_000: {
		count: 10,
		speed: 100,
	},
	100_000: {
		count: 10,
		speed: 1000,
	},
	500_000: {
		count: 10,
		speed: 5000,
	},
	1_000_000: {
		count: 10,
		speed: 10000,
	},
}

export const Analyzers: Analyzer[] = [isEqual, findSingleGap]
export const Parsers: ParserConstructor[] = [SymbolParser, RegexParser]
export const Joiners: ((params: JoinParameters) => string)[] = [mapStraight, modifyOrigin]

/**
* In kB
*/
export const SizeMap = {
	analyzer: {
		0: 0.05, //0.07 isEqual
		1: 0.34, //0.19 findSingleGap
	},
	parser: {
		0: 2.24, //1.02 symbol
		1: 2.16, //1.04 regex
	},
	joiner: {
		0: 0.44, //0.31 mapStraight
		1: 0.18, //0.17 modifyOrigin
	}
} as const