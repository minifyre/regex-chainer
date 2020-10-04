import {h} from 'preact'
import {useState} from 'preact/hooks'
import * as style from './style.css'
import {userInput2regex} from './user-input2regex'

type FN<A extends any[] = [], R = void> = (...args: A) => R
type IPartial<T> = Exclude<Partial<T>, undefined>

type IStep = {pattern: string; type: 'match' | 'replace'; replace: string}
type IState = {
	list: {selected: []; selectMultiple: boolean}
	liveMatchCount: boolean
	step: {index: number; type: 'after' | 'before'}
	steps: IStep[]
	text: string
}

const removeAt = <T,>(arr: T[], i: number) => arr.slice(0, i).concat(arr.slice(i + 1))
// todo: T could be an object- i keyof T & arr T[] | extends {[K]: T}
const setAt = <T,>(arr: T[], i: number, val: T) => [...arr.slice(0, i), val, ...arr.slice(i + 1)]
const setPropVal = <T, K extends keyof T>(obj: T, prop: K, val: T[K]) =>
	Object.assign({}, obj, {[prop]: val})

const STEP_TYPES = ['match', 'replace'] as const

const sampleSteps: IStep[] = [{pattern: `/<[^>]*>/g`, type: 'replace', replace: ''}]
const sampleText = `<!Doctype html>
<title>title</title>
<h1>Heading</h1>
<p>Paragraph</p>
`
// todo: why are new steps being defaulted to match?
// todo: replacing text with newlines is not working...
const transformMatches = (text: string, pattern: RegExp, replacement: string) =>
	(text.match(pattern) || []).map(match => match.replace(pattern, replacement)).join('')

export default () => {
	const [text, setText] = useState(sampleText)
	const [steps, setSteps] = useState<IState['steps']>(sampleSteps)

	const viewSteps = steps
		.concat({pattern: '', type: 'replace', replace: ''})
		.map(step => ({...step, regex: userInput2regex(step.pattern)}))

	const displayedText = viewSteps.reduce(
		(text, step) =>
			!step.regex
				? text
				: step.type === 'match'
				? transformMatches(text, step.regex, step.replace)
				: text.replace(step.regex, step.replace),
		text
	)

	const setStep = <K extends keyof IStep>(i: number, prop: K, val: IStep[K]) =>
		setSteps(setAt(steps, i, setPropVal(steps[i], prop, val)))

	return (
		<div class={style.home}>
			<h1>Home</h1>
			<form>
				<style>{`input:invalid{border: red solid 2px;}`}</style>
				{viewSteps.map((step, i, {length}) => {
					const last = i + 1 === length

					const pattern = (
						<input
							onInput={evt => setStep(i, 'pattern', evt.currentTarget.value)}
							pattern={step.regex !== null ? '^.+$' : '$.+^'}
							placeholder="//g"
							value={step.pattern}
						/>
					)
					const type = (
						<select
							onInput={evt =>
								setStep(i, 'type', evt.currentTarget.value as IStep['type'])
							}
						>
							{STEP_TYPES.map(value => (
								<option
									{...{children: value, selected: value === step.type, value}}
								/>
							))}
						</select>
					)
					const replacement = (
						<input
							onInput={evt => setStep(i, 'replace', evt.currentTarget.value)}
							placeholder="$&"
							value={step.replace}
						/>
					)
					const inputs = [pattern, type, replacement]

					const remove = (
						<button disabled={last} onClick={() => setSteps(removeAt(steps, i))}>
							x
						</button>
					)

					return <div>{inputs.concat([remove])}</div>
				})}
			</form>
			<textarea
				onChange={evt => setText(evt.currentTarget.value)}
				style={{height: '10rem', width: '26rem'}}
			>
				{displayedText}
			</textarea>
		</div>
	)
}
