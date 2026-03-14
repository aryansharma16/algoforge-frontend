import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from '../api/authApi'
import { setCredentials } from '../store/authSlice'
import UserAvatar from '../components/UserAvatar'
import ProfileLocationFields from '../components/ProfileLocationFields'
import ProfileWorkCards from '../components/ProfileWorkCards'
import ProfileEducationCards from '../components/ProfileEducationCards'
import SkillChipsInput from '../components/SkillChipsInput'
import SocialProfileCards from '../components/SocialProfileCards'
import ProfilePreview from '../components/ProfilePreview'
import { MAX_SOCIAL_PROFILES } from '../constants/socialProfiles'
import { normalizeWorkForForm } from '../utils/profileWork'
import { getInitials } from '../utils/avatar'
import { toast, apiErrorMessage } from '../utils/toast'
import countriesData from '../data/geo/countries.json'
import indiaData from '../data/geo/india-states-cities.json'

const HIDDEN_KEYS = new Set([
  '_id',
  'id',
  '__v',
  'password',
  'passwordHash',
  'token',
  'emailVerified',
  'createdAt',
])

const PROFILE_KEYS = new Set([
  'username',
  'email',
  'displayName',
  'bio',
  'photo',
  'organisation',
  'number',
  'resume',
  'address',
  'city',
  'state',
  'country',
  'education',
  'workExperience',
  'skills',
  'currentCompany',
  'socialProfiles',
])

function countryName(code) {
  if (!code) return ''
  return countriesData.countries.find((c) => c.code === code)?.name || code
}

function stateNameFromCode(stateCode) {
  if (!stateCode) return ''
  const st = indiaData.states.find((s) => s.code === stateCode)
  return st?.name || ''
}

function inferCountryCode(u) {
  const c = (u.country || '').trim().toLowerCase()
  if (!c || c === 'india') return 'IN'
  const found = countriesData.countries.find(
    (x) => x.name.toLowerCase() === c
  )
  return found?.code || 'IN'
}

function inferStateCode(stateName) {
  if (!stateName?.trim()) return ''
  const n = stateName.trim().toLowerCase()
  const st = indiaData.states.find((s) => s.name.toLowerCase() === n)
  return st?.code || ''
}

const emptySocial = () => ({
  type: 'github',
  url: '',
  label: '',
})

const emptyEducation = () => ({
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  description: '',
})

function pickEditable(user) {
  const u = user || {}
  const countryCode = inferCountryCode(u)
  const isIn = countryCode === 'IN'
  let stateCode = ''
  if (isIn && u.state) stateCode = inferStateCode(u.state)
  const education = Array.isArray(u.education) && u.education.length
    ? u.education.map((e) => ({
        institution: e.institution ?? '',
        degree: e.degree ?? '',
        field: e.field ?? '',
        startYear: e.startYear != null ? String(e.startYear) : '',
        endYear: e.endYear != null ? String(e.endYear) : '',
        description: e.description ?? '',
      }))
    : [emptyEducation()]
  const workExperience = normalizeWorkForForm(u.workExperience)
  const skills = Array.isArray(u.skills) ? [...u.skills].filter(Boolean) : []
  const socialProfiles =
    Array.isArray(u.socialProfiles) && u.socialProfiles.length
      ? u.socialProfiles.map((s) => ({
          type: (s.type || 'other').toLowerCase().slice(0, 32),
          url: s.url ?? '',
          label: s.label ?? '',
        }))
      : [emptySocial()]

  return {
    username: u.username ?? '',
    displayName: u.displayName ?? '',
    bio: u.bio ?? '',
    photo: u.photo ?? '',
    organisation: u.organisation ?? '',
    number: u.number ?? '',
    resume: u.resume ?? '',
    address: u.address ?? '',
    countryCode,
    stateCode: isIn ? stateCode : '',
    city: isIn ? (u.city ?? '') : '',
    stateText: isIn ? '' : (u.state ?? ''),
    cityText: isIn ? '' : (u.city ?? ''),
    currentCompany: u.currentCompany ?? '',
    education,
    workExperience,
    skills,
    socialProfiles,
  }
}

function serializeSocialProfiles(list) {
  return list
    .map((s) => ({
      type: (s.type || 'other').toLowerCase().trim().slice(0, 32),
      url: (s.url || '').trim().slice(0, 2000),
      label: (s.label || '').trim().slice(0, 80),
    }))
    .filter((s) => s.type && s.url)
    .slice(0, MAX_SOCIAL_PROFILES)
}

function serializeEducation(list) {
  return list
    .map((e) => ({
      institution: (e.institution || '').trim(),
      degree: (e.degree || '').trim(),
      field: (e.field || '').trim(),
      startYear:
        e.startYear === '' || e.startYear == null
          ? undefined
          : Number(e.startYear),
      endYear:
        e.endYear === '' || e.endYear == null ? undefined : Number(e.endYear),
      description: (e.description || '').trim(),
    }))
    .filter(
      (e) =>
        e.institution ||
        e.degree ||
        e.field ||
        e.description ||
        e.startYear != null ||
        e.endYear != null
    )
}

function serializeWork(list) {
  return list
    .map((w) => {
      const start = w.startDate
        ? new Date(w.startDate + 'T12:00:00').toISOString()
        : undefined
      let end
      if (!w.current && w.endDate)
        end = new Date(w.endDate + 'T12:00:00').toISOString()
      return {
        company: (w.company || '').trim(),
        role: (w.role || '').trim(),
        startDate: start,
        endDate: end,
        current: Boolean(w.current),
        description: (w.description || '').trim(),
      }
    })
    .filter(
      (w) => w.company || w.role || w.description || w.startDate || w.current
    )
}

function ProfileEditor({ user, userKey }) {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)
  const [mode, setMode] = useState('preview')
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()
  const { refetch, data: liveUser } = useGetCurrentUserQuery()
  const [form, setForm] = useState(() => pickEditable(user))
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState('')

  const displayUser = liveUser || user

  const email = user?.email ?? ''
  const displayTitle =
    form.displayName?.trim() ||
    form.username?.trim() ||
    getInitials(user) ||
    'Your profile'

  const setField = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setFormError('')
    setSaved(false)
  }, [])

  const onCountryChange = useCallback((code) => {
    setForm((f) => ({
      ...f,
      countryCode: code,
      stateCode: '',
      city: '',
      stateText: '',
      cityText: '',
    }))
    setFormError('')
    setSaved(false)
  }, [])

  const onIndiaStateChange = useCallback((code) => {
    setForm((f) => ({ ...f, stateCode: code, city: '' }))
    setFormError('')
    setSaved(false)
  }, [])

  function enterEdit() {
    setForm(pickEditable(displayUser))
    setMode('edit')
    setFormError('')
    setSaved(false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaved(false)
    const u = form.username.trim()
    if (u.length < 2 || u.length > 64) {
      setFormError('Username must be 2–64 characters.')
      return
    }
    if (form.displayName.length > 120) {
      setFormError('Display name max 120 characters.')
      return
    }
    if (form.bio.length > 2000) {
      setFormError('Bio max 2000 characters.')
      return
    }

    const isIn = form.countryCode === 'IN'
    const stateStr = isIn
      ? stateNameFromCode(form.stateCode)
      : form.stateText.trim()
    const cityStr = isIn ? form.city.trim() : form.cityText.trim()
    const countryStr = countryName(form.countryCode) || 'India'

    const body = {
      username: u,
      displayName: form.displayName.trim(),
      bio: form.bio.trim(),
      photo: form.photo.trim(),
      organisation: form.organisation.trim(),
      number: form.number.trim().slice(0, 32),
      resume: form.resume.trim().slice(0, 2000),
      address: form.address.trim().slice(0, 500),
      city: cityStr.slice(0, 100),
      state: stateStr.slice(0, 100),
      country: countryStr.slice(0, 100),
      currentCompany: form.currentCompany.trim().slice(0, 200),
      education: serializeEducation(form.education),
      workExperience: serializeWork(form.workExperience),
      skills: form.skills,
      socialProfiles: serializeSocialProfiles(form.socialProfiles),
    }

    try {
      const res = await updateProfile(body).unwrap()
      setSaved(true)
      if (res?.user && res?.token) {
        dispatch(setCredentials({ token: res.token, user: res.user }))
      } else if (res && typeof res === 'object' && token) {
        const nextUser = res.user ?? { ...user, ...res }
        if (!nextUser.passwordHash)
          dispatch(setCredentials({ token, user: nextUser }))
      }
      await refetch()
      setMode('preview')
      toast.success('Profile saved')
    } catch (err) {
      const msg =
        err?.data?.message || err?.data?.error || 'Could not save profile.'
      setFormError(msg)
      toast.error('Could not save profile', { description: apiErrorMessage(err, msg) })
    }
  }

  const extraRows = Object.entries(user).filter(
    ([k, v]) =>
      !HIDDEN_KEYS.has(k) &&
      !PROFILE_KEYS.has(k) &&
      v !== null &&
      v !== undefined &&
      typeof v !== 'object'
  )

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500'

  if (mode === 'preview') {
    return (
      <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900/80 p-1">
            <span className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white">
              Preview
            </span>
            <button
              type="button"
              onClick={enterEdit}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Edit
            </button>
          </div>
        </div>
        <ProfilePreview user={displayUser} onEdit={enterEdit} />
        {extraRows.length > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6">
            <h3 className="text-sm font-medium text-slate-400">Other</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              {extraRows.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-wrap justify-between gap-2 rounded-lg bg-slate-950/50 px-3 py-2"
                >
                  <dt className="text-slate-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="text-slate-300">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900/80 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('preview')
              setForm(pickEditable(displayUser))
            }}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Preview
          </button>
          <span className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white">
            Edit
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <UserAvatar user={{ ...user, ...form }} size={80} />
          <div>
            <h2 className="text-xl font-semibold text-white">Editing profile</h2>
            <p className="text-sm text-slate-500">{displayTitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-xl sm:p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          {saved && (
            <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
              Saved — showing preview.
            </div>
          )}
          {formError && (
            <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <section className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Identity
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Email (read-only)</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-300">
                  <span className="min-w-0 flex-1 truncate">{email}</span>
                  <span className="shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-500">
                    Fixed
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">
                  Username <span className="text-red-400">*</span> (2–64)
                </label>
                <input
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setField('username', e.target.value)}
                  className={inputClass}
                  minLength={2}
                  maxLength={64}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Display name</label>
                <input
                  value={form.displayName}
                  onChange={(e) => setField('displayName', e.target.value)}
                  className={inputClass}
                  maxLength={120}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Photo URL</label>
                <input
                  type="url"
                  value={form.photo}
                  onChange={(e) => setField('photo', e.target.value)}
                  className={`font-mono text-sm ${inputClass}`}
                  maxLength={2000}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setField('bio', e.target.value)}
                  className={inputClass}
                  maxLength={2000}
                />
                <p className="mt-1 text-[10px] text-slate-600">{form.bio.length}/2000</p>
              </div>
            </div>
          </section>

          <section className="space-y-6 border-t border-slate-800 pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Phone</label>
                <input
                  type="tel"
                  value={form.number}
                  onChange={(e) => setField('number', e.target.value)}
                  className={inputClass}
                  maxLength={32}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Organisation</label>
                <input
                  value={form.organisation}
                  onChange={(e) => setField('organisation', e.target.value)}
                  className={inputClass}
                  maxLength={200}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Current company</label>
                <input
                  value={form.currentCompany}
                  onChange={(e) => setField('currentCompany', e.target.value)}
                  className={inputClass}
                  maxLength={200}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Resume</label>
                <textarea
                  rows={2}
                  value={form.resume}
                  onChange={(e) => setField('resume', e.target.value)}
                  className={`font-mono text-sm ${inputClass}`}
                  maxLength={2000}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  className={inputClass}
                  maxLength={500}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-slate-800 pt-8">
            <ProfileLocationFields
              userKey={userKey}
              countryCode={form.countryCode}
              stateCode={form.stateCode}
              city={form.city}
              stateText={form.stateText}
              cityText={form.cityText}
              onCountryChange={onCountryChange}
              onStateChange={onIndiaStateChange}
              onCityChange={(v) => setField('city', v)}
              onStateTextChange={(v) => setField('stateText', v)}
              onCityTextChange={(v) => setField('cityText', v)}
            />
          </section>

          <section className="border-t border-slate-800 pt-8">
            <SkillChipsInput
              skills={form.skills}
              onChange={(skills) => setField('skills', skills)}
            />
          </section>

          <section className="border-t border-slate-800 pt-8">
            <SocialProfileCards
              items={form.socialProfiles}
              onChange={(socialProfiles) => {
                setForm((f) => ({ ...f, socialProfiles }))
                setSaved(false)
              }}
            />
          </section>

          <section className="space-y-8 border-t border-slate-800 pt-8">
            <ProfileWorkCards
              items={form.workExperience}
              onChange={(workExperience) => {
                setForm((f) => ({ ...f, workExperience }))
                setSaved(false)
              }}
            />
            <ProfileEducationCards
              items={form.education}
              onChange={(education) => {
                setForm((f) => ({ ...f, education }))
                setSaved(false)
              }}
            />
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={() => {
                setForm(pickEditable(displayUser))
                setFormError('')
                setSaved(false)
              }}
              className="rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save & preview'}
            </button>
          </div>
        </form>
      </div>

      {extraRows.length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6">
          <h3 className="text-sm font-medium text-slate-400">Other</h3>
          <dl className="mt-4 grid gap-3 text-sm">
            {extraRows.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-wrap justify-between gap-2 rounded-lg bg-slate-950/50 px-3 py-2"
              >
                <dt className="text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="text-slate-300">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  )
}

export default function Profile() {
  const { data: user, isLoading, isError, error } = useGetCurrentUserQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    )
  }
  if (isError || !user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center text-red-300">
        {error?.data?.message || 'Could not load profile'}
      </div>
    )
  }

  const userKey = user.email || user.username || 'me'
  return (
    <div className="relative pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-24 top-48 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-5xl xl:max-w-6xl">
        <ProfileEditor key={userKey} user={user} userKey={userKey} />
      </div>
    </div>
  )
}
