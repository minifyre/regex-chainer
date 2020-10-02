import {h} from 'preact'
import {useState} from 'preact/hooks'
import * as style from './style.css'

type FN<A extends any[], R = void> = (...args: A) => R
type IPartial<T> = Exclude<Partial<T>, undefined>

type IStep = {pattern: string; type: 'match' | 'replace'; replace: string}
type IState = {
	list: {selected: []; selectMultiple: boolean}
	liveMatchCount: boolean
	step: {index: number; type: 'after' | 'before'}
	steps: IStep[]
	text: string
}

// todo: T could be an object- i keyof T & arr T[] | extends {[K]: T}
const setAt = <T,>(arr: T[], i: number, val: T) => [...arr.slice(0, i), val, ...arr.slice(i + 1)]
const setPropVal = <T, K extends keyof T>(obj: T, prop: K, val: T[K]) =>
	Object.assign({}, obj, {[prop]: val})

const validateRegExp = /^\/(.+)\/([ismug]*)$/ //won't catch everything
const txt2regex = (validPattern: string) => {
	const [_, exp, flags] = validPattern.match(validateRegExp)!
	return new RegExp(escapeBackslashes(exp), flags)
}
const escapeBackslashes = (txt: string) => txt.replace(/\\/g, '\\')

const STEP_TYPES = ['match', 'replace'] as const
const Steps = ({steps, setSteps}: {steps: IStep[]; setSteps: FN<[IStep[]]>}) => {
	const allSteps = steps.concat({pattern: '', type: 'replace', replace: ''})

	const setStep = <K extends keyof IStep>(i: number, prop: K, val: IStep[K]) =>
		setSteps(setAt(steps, i, setPropVal(steps[i], prop, val)))

	return (
		<form>
			{allSteps.map((step, i) => (
				<div>
					<input
						onChange={evt => setStep(i, 'pattern', evt.currentTarget.value)}
						placeholder="//g"
						value={step.pattern}
					/>
					<select
						onChange={evt =>
							setStep(i, 'type', evt.currentTarget.value as IStep['type'])
						}
					>
						{STEP_TYPES.map(value => (
							<option {...{children: value, selected: value === step.type, value}} />
						))}
					</select>
					<input
						onChange={evt => setStep(i, 'replace', evt.currentTarget.value)}
						placeholder="$&"
						value={step.replace}
					/>
				</div>
			))}
		</form>
	)
}

const sampleSteps: IStep[] = [{pattern: `/<[^>]*>/g`, type: 'replace', replace: ''}]
const sampleText = `<!Doctype html>
<title>title</title>
<h1>Heading</h1>
<p>Paragraph</p>
`

export default () => {
	const [text, setText] = useState(sampleText)
	const [steps, setSteps] = useState<IState['steps']>(sampleSteps)

	const displayedText = steps.reduce((text, step) => {
		if (step.type === 'match') return text //todo: finish
		return text.replace(txt2regex(step.pattern), step.replace)
	}, text)

	return (
		<div class={style.home}>
			<h1>Home</h1>
			<Steps {...{steps, setSteps}} />
			<textarea
				onChange={evt => setText(evt.currentTarget.value)}
				style={{height: '10rem', width: '26rem'}}
			>
				{displayedText}
			</textarea>
		</div>
	)
}
