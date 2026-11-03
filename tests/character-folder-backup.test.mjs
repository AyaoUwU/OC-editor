import assert from 'node:assert/strict'
import test from 'node:test'
import { parseCharacterFolders, planCharacterFolderImport } from '../src/features/characters/folder-backup.ts'

const folder = (id, name) => ({ id, name, order: 0, createdAt: 1 })

test('old backups remain accepted and malformed folder data is rejected before import', () => {
  assert.deepEqual(parseCharacterFolders(undefined), [])
  for (const value of [null, {}, [null], [{ id: 'f', name: '' }],
    [folder('f', 'A'), folder('f', 'B')]]) {
    assert.throws(() => parseCharacterFolders(value))
  }
  assert.deepEqual(parseCharacterFolders([{ id: 'f', name: ' A ' }]), [
    { id: 'f', name: 'A', order: 0, createdAt: 0 },
  ])
})

test('replace restores folder definitions and keeps imported role assignments', () => {
  const character = { name: '测试角色', folderId: 'new' }
  const result = planCharacterFolderImport([folder('old', '旧')], [folder('new', '新')], [character], 'replace')
  assert.deepEqual(result.folders, [folder('new', '新')])
  assert.deepEqual(result.characters, [character])
  assert.deepEqual(planCharacterFolderImport([folder('old', '旧')], [], [], 'replace').folders, [])
})

test('skip preserves local metadata; overwrite accepts imported metadata', () => {
  const current = [folder('same', '本地')]
  const incoming = [folder('same', '导入'), folder('new', '新增')]
  assert.equal(planCharacterFolderImport(current, incoming, [], 'skip').folders[0].name, '本地')
  assert.equal(planCharacterFolderImport(current, incoming, [], 'overwrite').folders[0].name, '导入')
  assert.equal(planCharacterFolderImport(current, incoming, [], 'skip').folders.length, 2)
})

test('keep-both remaps colliding folders and imported assignments without mutating inputs', () => {
  const current = [folder('same', '本地')]
  const incoming = [folder('same', '导入'), folder('same-import-1', '占用后缀')]
  const characters = [{ name: '测试角色', folderId: 'same' }, { name: '未分类', folderId: null }]
  const result = planCharacterFolderImport(current, incoming, characters, 'keep-both')
  assert.equal(result.folders[0].name, '本地')
  assert.equal(result.characters[0].folderId, 'same-import-2')
  assert.equal(result.folders.find(({ id }) => id === 'same-import-2').name, '导入')
  assert.equal(characters[0].folderId, 'same')
  assert.equal(incoming[0].id, 'same')
  assert.equal(result.characters[1].folderId, null)
  assert.equal(planCharacterFolderImport(current, current, [], 'keep-both').folders.length, 1)
})
