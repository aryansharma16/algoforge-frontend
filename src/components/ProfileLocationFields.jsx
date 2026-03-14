import { useMemo } from 'react'
import countriesData from '../data/geo/countries.json'
import indiaData from '../data/geo/india-states-cities.json'

const selectClass =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500'
const inputClass =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500'

export default function ProfileLocationFields({
  userKey,
  countryCode,
  stateCode,
  city,
  stateText,
  cityText,
  onCountryChange,
  onStateChange,
  onCityChange,
  onStateTextChange,
  onCityTextChange,
}) {
  const countries = countriesData.countries || []
  const indiaStates = useMemo(() => indiaData.states || [], [])
  const isIndia = countryCode === 'IN'

  const stateList = useMemo(() => {
    if (!isIndia) return []
    return [...indiaStates].sort((a, b) => a.name.localeCompare(b.name))
  }, [isIndia, indiaStates])

  const citiesForState = useMemo(() => {
    if (!isIndia || !stateCode) return []
    const st = indiaStates.find((s) => s.code === stateCode)
    return st?.cities ? [...st.cities].sort((a, b) => a.localeCompare(b)) : []
  }, [isIndia, stateCode, indiaStates])

  const cityInList = isIndia && stateCode && citiesForState.includes(city)

  return (
    <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/30 p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Location</h3>
        <p className="mt-1 text-xs text-slate-500">
          Defaults to <strong className="text-slate-400">India</strong>. Then state
          (e.g. Punjab) → city. Other countries: type state and city.
        </p>
      </div>

      <div>
        <label
          htmlFor={`geo-country-${userKey}`}
          className="mb-1.5 block text-xs font-medium text-slate-400"
        >
          Country
        </label>
        <select
          id={`geo-country-${userKey}`}
          value={countryCode || ''}
          onChange={(e) => onCountryChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isIndia ? (
        <>
          <div>
            <label
              htmlFor={`geo-state-in-${userKey}`}
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              State / UT
            </label>
            <select
              id={`geo-state-in-${userKey}`}
              value={stateCode || ''}
              onChange={(e) => onStateChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Select state</option>
              {stateList.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`geo-city-select-${userKey}`}
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              City (from list)
            </label>
            <select
              id={`geo-city-select-${userKey}`}
              value={cityInList ? city : ''}
              onChange={(e) => onCityChange(e.target.value)}
              className={selectClass}
              disabled={!stateCode}
            >
              <option value="">
                {stateCode ? 'Select city' : 'Select state first'}
              </option>
              {citiesForState.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`geo-city-other-${userKey}`}
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Or type any city
            </label>
            <input
              id={`geo-city-other-${userKey}`}
              value={cityInList ? '' : city}
              onChange={(e) => onCityChange(e.target.value)}
              className={inputClass}
              placeholder="e.g. your town if not in list"
              disabled={!stateCode}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label
              htmlFor={`geo-state-${userKey}`}
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              State / Province
            </label>
            <input
              id={`geo-state-${userKey}`}
              value={stateText}
              onChange={(e) => onStateTextChange(e.target.value)}
              className={inputClass}
              placeholder="Region"
            />
          </div>
          <div>
            <label
              htmlFor={`geo-city-${userKey}`}
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              City
            </label>
            <input
              id={`geo-city-${userKey}`}
              value={cityText}
              onChange={(e) => onCityTextChange(e.target.value)}
              className={inputClass}
              placeholder="City"
            />
          </div>
        </>
      )}
    </div>
  )
}
