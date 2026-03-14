import SearchableSelect from '../../components/SearchableSelect'
import DateTimePicker from '../../components/DateTimePicker'
import TopicTagsInput from '../../components/TopicTagsInput'
import {
  JOURNEY_STATUSES,
  JOURNEY_TYPES,
  JOURNEY_VISIBILITY,
  JOURNEY_LIMITS,
  JOURNEY_LABELS,
} from '../../constants/journey'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30'

export default function JourneyForm({
  form,
  errors,
  setField,
  idPrefix = 'journey',
  children,
}) {
  const inputErr = (name) =>
    errors[name] ? 'border-red-500 ring-red-500/20' : ''

  return (
    <div className="space-y-8">
      {errors._form && (
        <p
          className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300"
          role="alert"
        >
          {errors._form}
        </p>
      )}

      {/* Primary */}
      <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">
          Identity
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              maxLength={JOURNEY_LIMITS.titleMax}
              className={`${inputClass} ${inputErr('title')}`}
              placeholder="e.g. DSA grind"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
              maxLength={JOURNEY_LIMITS.descriptionMax}
              className={`min-h-[5rem] resize-y ${inputClass} ${inputErr('description')}`}
              placeholder="Goals, notes, links, milestones…"
            />
            <p className="mt-0.5 text-[10px] text-slate-600">
              {form.description.length}/{JOURNEY_LIMITS.descriptionMax}
            </p>
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Category</label>
              <input
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                maxLength={JOURNEY_LIMITS.categoryMax}
                className={`${inputClass} ${inputErr('category')}`}
                placeholder="e.g. Interview prep"
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Target items</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.targetItems}
                onChange={(e) => setField('targetItems', e.target.value)}
                className={`${inputClass} ${inputErr('targetItems')}`}
                placeholder="0"
              />
              {errors.targetItems && (
                <p className="mt-1 text-xs text-red-400">{errors.targetItems}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Type & tags */}
        <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-6">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">
            Track & topics
          </h2>
          <div className="space-y-5">
            <SearchableSelect
              id={`${idPrefix}-type`}
              label="Journey type"
              options={JOURNEY_TYPES}
              value={form.journeyType}
              onChange={(v) => setField('journeyType', v)}
              getLabel={(v) => JOURNEY_LABELS[v] || v}
              error={errors.journeyType}
              placeholder="Search type…"
            />
            <TopicTagsInput
              idPrefix={idPrefix}
              value={form.topicTags || []}
              onChange={(tags) => setField('topicTags', tags)}
              error={errors.topicTags}
            />
          </div>
        </section>

        {/* Status block */}
        <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-6">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">
            Status & visibility
          </h2>
          <div className="space-y-5">
            <SearchableSelect
              id={`${idPrefix}-status`}
              label="Status"
              options={JOURNEY_STATUSES}
              value={form.status}
              onChange={(v) => setField('status', v)}
              getLabel={(v) => JOURNEY_LABELS[v] || v}
              error={errors.status}
              placeholder="Search status…"
            />
            <SearchableSelect
              id={`${idPrefix}-visibility`}
              label="Visibility"
              options={JOURNEY_VISIBILITY}
              value={form.visibility}
              onChange={(v) => setField('visibility', v)}
              getLabel={(v) => JOURNEY_LABELS[v] || v}
              error={errors.visibility}
              placeholder="Search visibility…"
            />
            <div>
              <label className="mb-1 block text-xs text-slate-500">Priority</label>
              <input
                type="number"
                step={1}
                value={form.priority}
                onChange={(e) => setField('priority', e.target.value)}
                className={`${inputClass} ${inputErr('priority')}`}
                placeholder="0"
              />
              <p className="mt-0.5 text-[10px] text-slate-600">
                Higher sorts first on dashboards
              </p>
              {errors.priority && (
                <p className="mt-1 text-xs text-red-400">{errors.priority}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Schedule */}
      <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-6">
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">
          Schedule
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DateTimePicker
            id={`${idPrefix}-start`}
            label="Start"
            value={form.startDate}
            onChange={(v) => setField('startDate', v)}
            error={errors.startDate}
          />
          <DateTimePicker
            id={`${idPrefix}-end`}
            label="End"
            value={form.endDate}
            onChange={(v) => setField('endDate', v)}
            error={errors.endDate}
          />
          <DateTimePicker
            id={`${idPrefix}-activity`}
            label="Last activity (optional)"
            value={form.lastActivityAt}
            onChange={(v) => setField('lastActivityAt', v)}
            error={errors.lastActivityAt}
          />
        </div>
      </section>

      {/* Metadata */}
      <section className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-6">
        <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">
          Custom metadata
        </h2>
        <p className="mb-3 text-[10px] text-slate-600">
          JSON object. Focus tags above are saved separately as{' '}
          <code className="text-slate-500">topicTags</code>.
        </p>
        <textarea
          value={form.metadataJson}
          onChange={(e) => setField('metadataJson', e.target.value)}
          rows={5}
          spellCheck={false}
          className={`font-mono text-sm ${inputClass} ${errors.metadata ? 'border-red-500' : ''}`}
          placeholder={'{\n  "repo": "my-notes", "cohort": "2025"\n}'}
        />
        {errors.metadata && (
          <p className="mt-1 text-xs text-red-400">{errors.metadata}</p>
        )}
      </section>

      {children}
    </div>
  )
}
