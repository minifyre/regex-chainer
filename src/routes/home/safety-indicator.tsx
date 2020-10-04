import {h} from 'preact'
import safe from 'safe-regex'

const SAFETY_LEVELS = {
	blank: ['&nbsp;', ''],
	error: ['&cross;', 'red', 'invalid pattern'],
	warning: ['!', '#fc0', 'potentially unsafe pattern'],
	safe: ['&check;', 'green'],
} as const

export const SafetyIndicator = (pattern: string, regex: RegExp | null) => {
	const safetyLvl = !pattern.length
		? 'blank'
		: !regex
		? 'error'
		: !safe(regex)
		? 'warning'
		: 'safe'
	const [__html, color, title = ''] = SAFETY_LEVELS[safetyLvl]

	return (
		<button
			dangerouslySetInnerHTML={{__html}}
			disabled
			style={{backgroundColor: color || 'default', color: 'white'}}
			{...(title ? {title} : {})}
		/>
	)
}
