import { useState } from 'react'
import SearchableSelect from '../../components/SearchableSelect'
import ConfirmDialog from '../../components/ConfirmDialog'
import SearchableCreatableSelect from '../../components/SearchableCreatableSelect'
import MultiPickField from '../../components/MultiPickField'
import {
  LEARNING_ITEM_TYPES,
  ITEM_STATUSES,
  ITEM_TYPE_LABELS,
  ITEM_STATUS_LABELS,
  ITEM_LIMITS,
} from '../../constants/learningItem'
import {
  PLATFORM_PRESETS,
  TAG_PRESETS,
  FLAG_PRESETS,
  DIFFICULTY_PRESETS,
} from '../../data/itemPicklists'
import { STORAGE_KEYS } from '../../utils/itemPicklistStorage'

const input =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600'

export default function ItemForm({ form, errors, setField, idPrefix = 'item' }) {
  const [resourceRemoveIdx, setResourceRemoveIdx] = useState(null)
  const err = (k) => (errors[k] ? 'border-red-500/60' : '')

  function setResource(i, key, v) {
    const next = [...form.resources]
    next[i] = { ...next[i], [key]: v }
    setField('resources', next)
  }
  function addResource() {
    if (form.resources.length >= ITEM_LIMITS.resourcesMax) return
    setField('resources', [...form.resources, { title: '', url: '', type: '' }])
  }
  function removeResource(i) {
    const next = form.resources.filter((_, j) => j !== i)
    setField('resources', next.length ? next : [{ title: '', url: '', type: '' }])
  }

  return (
    <div className="space-y-8">
      {errors._form && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300">
          {errors._form}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400/90">
          Core
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              maxLength={ITEM_LIMITS.titleMax}
              className={`${input} ${err('title')}`}
              placeholder="e.g. Two sum"
            />
            <p className="mt-0.5 text-[10px] text-slate-600">
              {form.title.length}/{ITEM_LIMITS.titleMax}
            </p>
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
              maxLength={ITEM_LIMITS.descriptionMax}
              className={`min-h-[5rem] resize-y ${input} ${err('description')}`}
              placeholder="Statement, constraints, what “done” means…"
            />
            <p className="mt-0.5 text-[10px] text-slate-600">
              {form.description.length}/{ITEM_LIMITS.descriptionMax}
            </p>
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SearchableSelect
              id={`${idPrefix}-type`}
              label="Type"
              options={LEARNING_ITEM_TYPES}
              value={form.type}
              onChange={(v) => setField('type', v)}
              getLabel={(v) => ITEM_TYPE_LABELS[v] || v}
              error={errors.type}
              placeholder="Search type…"
            />
            <SearchableSelect
              id={`${idPrefix}-status`}
              label="Status"
              options={ITEM_STATUSES}
              value={form.status}
              onChange={(v) => setField('status', v)}
              getLabel={(v) => ITEM_STATUS_LABELS[v] || v}
              error={errors.status}
              placeholder="Search status…"
            />
          </div>
          <div className="max-w-xs">
            <label className="mb-1 block text-xs text-slate-500">Order index</label>
            <input
              type="number"
              step={1}
              value={form.orderIndex}
              onChange={(e) => setField('orderIndex', e.target.value)}
              className={`${input} ${err('orderIndex')}`}
            />
            {errors.orderIndex && (
              <p className="mt-1 text-xs text-red-400">{errors.orderIndex}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400/90">
          Platform & difficulty
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <SearchableCreatableSelect
            id={`${idPrefix}-platform`}
            label="Platform"
            presets={PLATFORM_PRESETS}
            storageKey={STORAGE_KEYS.platform}
            value={form.platform}
            onChange={(v) => setField('platform', v)}
            maxLength={ITEM_LIMITS.platformMax}
            error={errors.platform}
            placeholder="Search platform or type your own…"
            hint="Suggestions + your past picks. Edit anytime on this field."
          />
          <div>
            <label className="mb-1 block text-xs text-slate-500">Platform ID</label>
            <input
              value={form.platformId}
              onChange={(e) => setField('platformId', e.target.value)}
              maxLength={ITEM_LIMITS.platformIdMax}
              className={input}
              placeholder="Problem id / slug"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-slate-500">Platform URL</label>
            <input
              type="url"
              value={form.platformUrl}
              onChange={(e) => setField('platformUrl', e.target.value)}
              maxLength={ITEM_LIMITS.platformUrlMax}
              className={input}
              placeholder="https://…"
            />
          </div>
          <SearchableCreatableSelect
            id={`${idPrefix}-plat-diff`}
            label="Platform difficulty"
            presets={DIFFICULTY_PRESETS}
            storageKey={STORAGE_KEYS.difficulty}
            value={form.platformDifficulty}
            onChange={(v) => setField('platformDifficulty', v)}
            maxLength={ITEM_LIMITS.difficultyMax}
            error={errors.platformDifficulty}
            placeholder="Rating / tier…"
            hint="LC tiers, CF rating, or your own label."
          />
          <SearchableCreatableSelect
            id={`${idPrefix}-pers-diff`}
            label="Personal difficulty"
            presets={DIFFICULTY_PRESETS}
            storageKey={STORAGE_KEYS.difficulty}
            value={form.personalDifficulty}
            onChange={(v) => setField('personalDifficulty', v)}
            maxLength={ITEM_LIMITS.difficultyMax}
            error={errors.personalDifficulty}
            placeholder="How it felt for you"
            hint="Same list; pick or type. Editable when you revisit."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400/90">
          Tags & flags
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <MultiPickField
            label="Tags"
            presets={TAG_PRESETS}
            storageKey={STORAGE_KEYS.tag}
            value={form.tags}
            onChange={(tags) => setField('tags', tags)}
            max={ITEM_LIMITS.tagsMax}
            hint="Topic tags for filters & search. Remove a chip to edit set."
            error={errors.tags}
            placeholder="Search topics…"
          />
          <MultiPickField
            label="Flags"
            presets={FLAG_PRESETS}
            storageKey={STORAGE_KEYS.flag}
            value={form.flags}
            onChange={(flags) => setField('flags', flags)}
            max={ITEM_LIMITS.flagsMax}
            hint="Workflow labels. Custom flags are remembered."
            error={errors.flags}
            placeholder="Search flags…"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400/90">
          Resources
        </h2>
        <p className="mb-3 text-xs text-slate-600">
          Links, PDFs, editorial — title + URL + optional type.
        </p>
        <div className="space-y-3">
          {form.resources.map((r, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60 sm:grid-cols-12"
            >
              <input
                value={r.title}
                onChange={(e) => setResource(i, 'title', e.target.value)}
                placeholder="Title"
                className={`sm:col-span-4 ${input}`}
              />
              <input
                value={r.url}
                onChange={(e) => setResource(i, 'url', e.target.value)}
                placeholder="URL"
                className={`sm:col-span-5 ${input}`}
              />
              <input
                value={r.type}
                onChange={(e) => setResource(i, 'type', e.target.value)}
                placeholder="Type"
                className={`sm:col-span-2 ${input}`}
              />
              <button
                type="button"
                onClick={() => setResourceRemoveIdx(i)}
                className="rounded-lg text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 sm:col-span-1"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addResource}
            disabled={form.resources.length >= ITEM_LIMITS.resourcesMax}
            className="text-sm text-violet-600 hover:underline disabled:opacity-40 dark:text-violet-400"
          >
            + Add resource
          </button>
        </div>
        {errors.resources && <p className="mt-2 text-xs text-red-400">{errors.resources}</p>}
        <ConfirmDialog
          open={resourceRemoveIdx !== null}
          onClose={() => setResourceRemoveIdx(null)}
          onConfirm={() => {
            if (resourceRemoveIdx !== null) removeResource(resourceRemoveIdx)
            setResourceRemoveIdx(null)
          }}
          title="Remove this resource?"
          message="This row will be removed from the form. Save the item to persist changes."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          variant="danger"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400/90">
          Notes & review
        </h2>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={5}
            maxLength={ITEM_LIMITS.notesMax}
            className={`${input} ${err('notes')}`}
            placeholder="Patterns, mistakes, next steps…"
          />
          <p className="mt-0.5 text-[10px] text-slate-600">
            {form.notes.length}/{ITEM_LIMITS.notesMax}
          </p>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
          <input
            type="checkbox"
            checked={form.revisionRequired}
            onChange={(e) => setField('revisionRequired', e.target.checked)}
            className="rounded border-slate-400 dark:border-slate-600"
          />
          Revision required
        </label>
      </section>
    </div>
  )
}
