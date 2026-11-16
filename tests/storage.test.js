import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { create, act } from 'react-test-renderer'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

test('saved state survives mounting and consecutive functional updates', () => {
  const data = new Map([['items', '["saved"]']])
  globalThis.localStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  let state
  function Probe({ name = 'items' }) { state = useLocalStorage(name, []); return null }
  let tree
  act(() => { tree = create(React.createElement(Probe)) })
  assert.deepEqual(state[0], ['saved'])
  act(() => { state[1](items => [...items, 'one']); state[1](items => [...items, 'two']) })
  assert.deepEqual(state[0], ['saved', 'one', 'two'])
  assert.deepEqual(JSON.parse(data.get('items')), state[0])
  act(() => { tree.update(React.createElement(Probe, { name: 'different-key' })) })
  assert.deepEqual(state[0], [])
  act(() => tree.unmount())
})

test('malformed array data and unavailable storage do not break the app', () => {
  globalThis.localStorage = { getItem: () => '{"wrong":"shape"}', setItem: () => { throw new Error('quota exceeded') } }
  let state
  function Probe() { state = useLocalStorage('invalid', []); return null }
  let tree
  act(() => { tree = create(React.createElement(Probe)) })
  assert.deepEqual(state[0], [])
  act(() => state[1](['usable in memory']))
  assert.deepEqual(state[0], ['usable in memory'])
  act(() => tree.unmount())
})
