type FN<A extends any[] = [], R = void> = (...args: A) => R // todo: spinoff

const validateRegExp = /^\/(.+)\/([ismug]*)$/ // note: won't catch everything

const attempt = <R, F extends any = null>(fn: FN<[], R>, fallback: R): R | F => {
	try {
		return fn()
	} catch (error) {
		return fallback
	}
}
const escapeBackslashes = (txt: string) => txt.replace(/\\/g, '\\')

const txt2regex = (validPattern: string) => {
	const [_, exp, flags] = validPattern.match(validateRegExp)!
	return new RegExp(escapeBackslashes(exp), flags)
}

export const userInput2regex = (pattern: string) => attempt(() => txt2regex(pattern), null)
