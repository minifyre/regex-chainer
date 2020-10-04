import {moveTo} from './array'

test('move up', () => expect(moveTo([0, 1, 2, 3, 4], 4, 1)).toBe([0, 4, 1, 2, 3]))
test('move down', () => expect(moveTo([0, 1, 2, 3, 4], 2, 4)).toBe([0, 1, 3, 4, 2]))
