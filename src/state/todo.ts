import { atom } from 'jotai'
import type { Filter } from '../types/todo'

// 絞り込みの選択状態。初期値は「すべて」
export const filterAtom = atom<Filter>('all')