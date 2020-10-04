const addAt = <T>(arr: T[], i: number, val: T) => [...arr.slice(0, i), val, ...arr.slice(i)]
const removeAt = <T>(arr: T[], i: number) => [...arr.slice(0, i), ...arr.slice(i + 1)]
const setAt = <T>(arr: T[], i: number, val: T) => [...arr.slice(0, i), val, ...arr.slice(i + 1)]
const moveTo = <T>(arr: T[], from: number, to: number) => addAt(removeAt(arr, from), to, arr[from])

// todo: add a wrapper to everything for negative index support?
export {addAt, removeAt, setAt, moveTo}
