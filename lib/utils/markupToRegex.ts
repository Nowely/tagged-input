import {Markup} from '../types'
import {escape} from './escape'
import {PLACEHOLDER} from "../constants";

export const markupToRegex = (markup: Markup) => {
	const escapedMarkup = escape(markup)

	const charAfterLabel = escape(markup[markup.indexOf(PLACEHOLDER.LABEL) + PLACEHOLDER.LABEL.length] ?? '')
	const charAfterValue = escape(markup[markup.indexOf(PLACEHOLDER.VALUE) + PLACEHOLDER.VALUE.length] ?? '')

	const pattern = escapedMarkup
		.replace(PLACEHOLDER.LABEL, `([^${charAfterLabel}]+?)`)
		.replace(PLACEHOLDER.VALUE, `([^${charAfterValue}]+?)`)

	return new RegExp(pattern)
}