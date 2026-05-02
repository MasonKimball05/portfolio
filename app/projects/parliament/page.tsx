'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Shared ──────────────────────────────────────────────────────────────────

type MockupPage = 'home' | 'vote' | 'committees' | 'documents' | 'calendar' | 'excuses' | 'profile'

const NAV_LINKS: { label: string; page: MockupPage }[] = [
  { label: 'Vote',        page: 'vote' },
  { label: 'Committees',  page: 'committees' },
  { label: 'Documents',   page: 'documents' },
  { label: 'Calendar',    page: 'calendar' },
  { label: 'Excuses',     page: 'excuses' },
]

function NavBar({
  onHome,
  onNavigate,
  current,
}: {
  onHome?: () => void
  onNavigate?: (page: MockupPage) => void
  current?: MockupPage
}) {
  const logo = (
    <>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        Β
      </div>
      <span className="text-white font-semibold text-sm">Parliament</span>
    </>
  )

  return (
    <div className="bg-[#003DA5] px-4 py-3 flex items-center justify-between rounded-t-lg">
      {onHome ? (
        <button onClick={onHome} className="flex items-center gap-3 hover:opacity-75 transition-opacity">
          {logo}
        </button>
      ) : (
        <div className="flex items-center gap-3">{logo}</div>
      )}
      <div className="hidden sm:flex items-center gap-5">
        {NAV_LINKS.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => onNavigate?.(page)}
            className={`text-xs transition-colors ${
              current === page ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
        MK
      </div>
    </div>
  )
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
    >
      ← Home
    </button>
  )
}

// ── Mock sub-pages ──────────────────────────────────────────────────────────

function VoteMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  const votes = [
    { title: 'Resolution 2025-04: Amend Section 7.3 of Bylaws', status: 'Open', yes: 12, no: 4, abstain: 2, yours: null },
    { title: 'Resolution 2025-03: Approve Spring Budget Allocation', status: 'Open', yes: 8, no: 6, abstain: 3, yours: null },
    { title: 'Resolution 2025-02: Adopt New Risk Management Policy', status: 'Passed', yes: 18, no: 2, abstain: 1, yours: 'Yes' },
  ]
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} current="vote" />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Legislation & Voting</h2>
      </div>
      <div className="space-y-3">
        {votes.map((v) => (
          <div key={v.title} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{v.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
                v.status === 'Open'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {v.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400 font-medium">✓ {v.yes} Yes</span>
              <span className="text-red-500 dark:text-red-400 font-medium">✗ {v.no} No</span>
              <span>{v.abstain} Abstain</span>
            </div>
            {/* Vote bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.round((v.yes / (v.yes + v.no + v.abstain)) * 100)}%` }}
              />
            </div>
            {v.status === 'Open' && (
              <div className="flex gap-2 pt-1">
                <div className="flex-1 py-1.5 text-xs text-center bg-green-600 text-white rounded cursor-default font-medium">Vote Yes</div>
                <div className="flex-1 py-1.5 text-xs text-center bg-red-500 text-white rounded cursor-default font-medium">Vote No</div>
                <div className="flex-1 py-1.5 text-xs text-center border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded cursor-default">Abstain</div>
              </div>
            )}
            {v.yours && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Your vote: <span className="text-green-600 dark:text-green-400 font-medium">{v.yours}</span></p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExcusesMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  const excuses = [
    { event: 'Chapter Meeting', date: 'Apr 14', reason: 'Academic conflict — exam', status: 'Approved' },
    { event: 'Philanthropy 5K', date: 'Apr 10', reason: 'Family obligation', status: 'Pending' },
    { event: 'Chapter Meeting', date: 'Mar 31', reason: 'Medical appointment', status: 'Approved' },
    { event: 'Social Event', date: 'Mar 22', reason: 'Work shift', status: 'Denied' },
  ]
  const statusStyle: Record<string, string> = {
    Approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Pending:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Denied:   'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  }
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} current="excuses" />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">My Excuses</h2>
      </div>
      <div className="space-y-2">
        {excuses.map((e, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{e.event}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{e.date} · {e.reason}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${statusStyle[e.status]}`}>
                {e.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="px-4 py-2 text-xs bg-[#003DA5] text-white rounded cursor-default font-medium">
          + Submit Excuse
        </div>
      </div>
    </div>
  )
}

function CommitteesMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  const committees = [
    { code: 'EC', name: 'Executive Committee', role: 'Chair', members: 8 },
    { code: 'PHIL', name: 'Philanthropy', role: 'Member', members: 12 },
    { code: 'SOCIAL', name: 'Social', role: 'Member', members: 15 },
    { code: 'RISK', name: 'Risk Management', role: 'Member', members: 6 },
  ]
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} current="committees" />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">My Committees</h2>
      </div>
      <div className="space-y-2">
        {committees.map((c) => (
          <div
            key={c.code}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
                  {c.code}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    c.role === 'Chair'
                      ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {c.role}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{c.members} members</span>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function DocumentsMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  const docs = [
    { title: 'Chapter Constitution', type: 'Constitution', date: 'Mar 2024', emoji: '📜' },
    { title: 'Chapter Bylaws', type: 'Bylaws', date: 'Mar 2024', emoji: '📋' },
    { title: 'Spring 2025 Risk Policy', type: 'Risk Management', date: 'Jan 2025', emoji: '📄' },
    { title: 'Chapter Meeting Minutes — Apr 21', type: 'Minutes', date: 'Apr 2025', emoji: '📝' },
    { title: 'New Member Education Guide', type: 'Education', date: 'Aug 2024', emoji: '📚' },
  ]
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} current="documents" />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Chapter Documents</h2>
      </div>
      <div className="space-y-2">
        {docs.map((d) => (
          <div
            key={d.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3 border border-gray-200 dark:border-gray-700"
          >
            <span className="text-xl flex-shrink-0">{d.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{d.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{d.type} · {d.date}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  const events = [
    { title: 'Chapter Meeting', date: 'Wed, May 7', time: '7:00 PM', location: 'Chapter Room', type: 'Mandatory' },
    { title: 'Philanthropy 5K', date: 'Sat, May 10', time: '9:00 AM', location: 'Riverside Park', type: 'Service' },
    { title: 'Executive Board Meeting', date: 'Mon, May 12', time: '6:30 PM', location: 'Officer Suite', type: 'Officers' },
    { title: 'Spring Social', date: 'Fri, May 16', time: '8:00 PM', location: 'TBD', type: 'Social' },
  ]
  const typeStyle: Record<string, string> = {
    Mandatory: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    Service:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Officers:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Social:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  }
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} current="calendar" />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Calendar</h2>
      </div>
      <div className="space-y-3">
        {events.map((e) => (
          <div
            key={e.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{e.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">📅 {e.date} at {e.time}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">📍 {e.location}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${typeStyle[e.type]}`}>
                {e.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileMockup({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: MockupPage) => void }) {
  return (
    <div className="space-y-4">
      <NavBar onHome={onBack} onNavigate={onNavigate} />
      <div className="space-y-1 px-1">
        <BackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Profile</h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[#003DA5] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            MK
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-gray-100">Mason Kimball</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Member · ID: 73</p>
            <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
              Active
            </span>
          </div>
        </div>
        <div className="space-y-2.5 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
          {[
            { label: 'Major', value: 'Computer Science' },
            { label: 'Graduating', value: 'Spring 2026' },
            { label: 'Phone', value: '(555) 123-4567' },
            { label: '2FA', value: 'Enabled ✓', green: true },
          ].map(({ label, value, green }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`font-medium ${green ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Service Hours</p>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">14.5</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">This semester</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">10</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Required</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Home page content ───────────────────────────────────────────────────────

function HomeActionGrid({ onNavigate }: { onNavigate: (page: MockupPage) => void }) {
  const navCard = 'cursor-pointer hover:ring-2 hover:ring-blue-500/40 transition-shadow'

  return (
    // 2 columns on mobile, 3 on large — prevents a single tall list on phones
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Vote — static */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Vote</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">Cast votes on active legislation</p>
      </div>

      {/* Committees — navigates */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 ${navCard}`} onClick={() => onNavigate('committees')}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Committees</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">View your committee memberships</p>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-1.5 font-medium">View →</p>
      </div>

      {/* Documents — navigates */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 ${navCard}`} onClick={() => onNavigate('documents')}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Documents</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">Access chapter documents</p>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-1.5 font-medium">View →</p>
      </div>

      {/* Songbook — static, gradient */}
      <div className="rounded-lg shadow-sm p-3 sm:p-4" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-white leading-tight">Songbook</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <p className="text-white/80 text-xs leading-snug">Chapter songs and lyrics</p>
      </div>

      {/* Service Hours — static, gradient */}
      <div className="rounded-lg shadow-sm p-3 sm:p-4" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-white leading-tight">Service Hours</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-white/80 text-xs leading-snug">Track and submit service hours</p>
      </div>

      {/* Calendar — navigates */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 ${navCard}`} onClick={() => onNavigate('calendar')}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Calendar</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">View upcoming chapter events</p>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-1.5 font-medium">View →</p>
      </div>

      {/* Excuses — static */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">My Excuses</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">View and manage event excuses</p>
      </div>

      {/* Profile — navigates */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 ${navCard}`} onClick={() => onNavigate('profile')}>
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Profile</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug">View and edit your profile</p>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-1.5 font-medium">View →</p>
      </div>

      {/* Bug Tracker — static */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Bug Tracker</h3>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-snug mb-2">Report or view issues</p>
        <div className="flex gap-1.5">
          <div className="flex-1 py-1 text-xs text-center border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded cursor-default">
            View
          </div>
          <div className="flex-1 py-1 text-xs text-center bg-orange-500 text-white rounded cursor-default">
            Report
          </div>
        </div>
      </div>
    </div>
  )
}

function MemberHomeContent() {
  const [page, setPage] = useState<MockupPage>('home')
  const goHome = () => setPage('home')

  if (page === 'vote')        return <VoteMockup       onBack={goHome} onNavigate={setPage} />
  if (page === 'committees')  return <CommitteesMockup onBack={goHome} onNavigate={setPage} />
  if (page === 'documents')   return <DocumentsMockup  onBack={goHome} onNavigate={setPage} />
  if (page === 'calendar')    return <CalendarMockup   onBack={goHome} onNavigate={setPage} />
  if (page === 'excuses')     return <ExcusesMockup    onBack={goHome} onNavigate={setPage} />
  if (page === 'profile')     return <ProfileMockup    onBack={goHome} onNavigate={setPage} />

  return (
    <div className="space-y-4">
      <NavBar onHome={goHome} onNavigate={setPage} current="home" />
      <div
        className="rounded-lg p-4 text-white"
        style={{ background: 'linear-gradient(to right, #003DA5, #0052CC)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Welcome, Mason K.</h2>
            <p className="text-sm opacity-90">Active Member · 73</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xs text-center font-semibold leading-tight p-1 select-none flex-shrink-0">
            ΒΘΠ
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { emoji: '👥', value: '59', label: 'Members', sub: 'Active' },
          { emoji: '🗳️', value: '2', label: 'Open Votes', sub: 'Active' },
          { emoji: '📅', value: '3', label: 'Events', sub: 'This week' },
          { emoji: '👔', value: '4', label: 'Committees', sub: 'Yours' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{s.emoji}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
      <HomeActionGrid onNavigate={setPage} />
    </div>
  )
}

// ── Officer Portal ──────────────────────────────────────────────────────────

type OfficerPage = 'home' | 'announcements' | 'new-event' | 'attendance' | 'minutes' | 'members' | 'committees'

function OfficerBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
    >
      ← Officer Home
    </button>
  )
}

// 1 — Announcements
function AnnouncementsMockup({ onBack }: { onBack: () => void }) {
  const announcements = [
    { title: 'Spring Formal — Details Inside', author: 'Mason K.', date: 'Apr 28', body: 'Spring Formal is confirmed for May 9th at The Club. Tickets are $25 and must be purchased by May 5th. Bring your date!', pinned: true },
    { title: 'Chapter Meeting This Monday', author: 'Mason K.', date: 'Apr 25', body: 'Reminder that chapter meeting is this Monday at 7PM in the chapter room. Attendance is mandatory.', pinned: false },
    { title: 'Service Hours Deadline Approaching', author: 'Chris P.', date: 'Apr 20', body: 'All members must have 10 service hours logged by April 30th. Check your profile to see your current total.', pinned: false },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Announcements</h2>
      </div>
      <div className="flex justify-end">
        <div className="px-3 py-1.5 text-xs bg-green-600 text-white rounded cursor-default font-medium">+ New Announcement</div>
      </div>
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className={`px-4 pt-4 pb-3 border-l-4 ${a.pinned ? 'border-l-red-500' : 'border-l-gray-200 dark:border-l-gray-600'}`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {a.pinned && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-medium">Pinned</span>}
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{a.title}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Posted by {a.author} · {a.date}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{a.body}</p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex gap-3">
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
              <button className="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 4 — New Event
function NewEventMockup({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) return (
    <div className="space-y-4">
      <OfficerBackButton onBack={onBack} />
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center space-y-2">
        <div className="text-3xl">✅</div>
        <p className="text-sm font-semibold text-green-800 dark:text-green-200">Event Created!</p>
        <p className="text-xs text-green-600 dark:text-green-400">Spring Formal has been added to the calendar and members have been notified.</p>
        <button onClick={() => setSubmitted(false)} className="text-xs text-green-700 dark:text-green-300 underline mt-2">Create another</button>
      </div>
    </div>
  )
  const fields = [
    { label: 'Event Title', placeholder: 'Spring Formal', type: 'text' },
    { label: 'Date', placeholder: 'May 9, 2025', type: 'text' },
    { label: 'Time', placeholder: '7:00 PM', type: 'text' },
    { label: 'Location', placeholder: 'The Club at Colony Park', type: 'text' },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">New Event</h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
              <div className="w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700">
                {f.placeholder}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Event Type</label>
          <div className="flex flex-wrap gap-2">
            {['Mandatory', 'Social', 'Service', 'Officers', 'Optional'].map((t, i) => (
              <div key={t} className={`text-xs px-3 py-1 rounded border cursor-default ${i === 0 ? 'bg-[#003DA5] text-white border-[#003DA5]' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
          <div className="w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 h-16">
            Add event details...
          </div>
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-2 bg-[#003DA5] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          Create Event
        </button>
      </div>
    </div>
  )
}

// 5 — Event Attendance
function AttendanceMockup({ onBack }: { onBack: () => void }) {
  const events = ['Chapter Meeting — Apr 28', 'Philanthropy 5K — Apr 19', 'Chapter Meeting — Apr 14']
  const [selected, setSelected] = useState(0)
  const members = [
    { name: 'Mason Kimball', id: '73', status: 'Present' },
    { name: 'Chris Porter', id: '71', status: 'Present' },
    { name: 'Jake Morris', id: '68', status: 'Excused' },
    { name: 'Tyler Reese', id: '74', status: 'Absent' },
    { name: 'Ben Hartley', id: '65', status: 'Present' },
    { name: 'Sam Cho', id: '70', status: 'Present' },
    { name: 'Dylan Fox', id: '72', status: 'Absent' },
  ]
  const statusStyle: Record<string, string> = {
    Present: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Excused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Absent:  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  }
  const counts = { Present: members.filter(m => m.status === 'Present').length, Excused: members.filter(m => m.status === 'Excused').length, Absent: members.filter(m => m.status === 'Absent').length }
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Event Attendance</h2>
      </div>
      {/* Event picker */}
      <div className="space-y-1.5">
        {events.map((e, i) => (
          <button
            key={e}
            onClick={() => setSelected(i)}
            className={`w-full text-left text-xs px-3 py-2 rounded border transition-colors ${selected === i ? 'border-[#003DA5] bg-blue-50 dark:bg-blue-900/20 text-[#003DA5] dark:text-blue-300 font-medium' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {e}
          </button>
        ))}
      </div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        {(['Present', 'Excused', 'Absent'] as const).map((s) => (
          <div key={s} className={`rounded p-2 text-center ${statusStyle[s]}`}>
            <div className="text-lg font-bold">{counts[s]}</div>
            <div className="text-xs">{s}</div>
          </div>
        ))}
      </div>
      {/* Member list */}
      <div className="space-y-1.5">
        {members.map((m) => (
          <div key={m.id} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{m.name}</p>
              <p className="text-xs text-gray-400">ID: {m.id}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusStyle[m.status]}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 6 — Chapter Minutes
function MinutesMockup({ onBack }: { onBack: () => void }) {
  const minutes = [
    { title: 'Chapter Meeting Minutes', date: 'Apr 28, 2025', recorder: 'Mason K.', items: 6 },
    { title: 'Chapter Meeting Minutes', date: 'Apr 14, 2025', recorder: 'Mason K.', items: 4 },
    { title: 'Chapter Meeting Minutes', date: 'Mar 31, 2025', recorder: 'Chris P.', items: 8 },
    { title: 'Chapter Meeting Minutes', date: 'Mar 17, 2025', recorder: 'Mason K.', items: 5 },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Chapter Minutes</h2>
      </div>
      <div className="flex justify-end">
        <div className="px-3 py-1.5 text-xs bg-[#003DA5] text-white rounded cursor-default font-medium">+ New Minutes</div>
      </div>
      <div className="space-y-2">
        {minutes.map((m, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{m.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.date} · Recorded by {m.recorder}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{m.items} agenda items</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <div className="text-xs text-blue-600 dark:text-blue-400 cursor-default hover:underline">View</div>
                <div className="text-xs text-gray-400 cursor-default hover:underline">Edit</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 8 — Member List
function MembersMockup({ onBack }: { onBack: () => void }) {
  const members = [
    { name: 'Mason Kimball',  id: '73', type: 'Active',  role: 'EVP' },
    { name: 'Chris Porter',   id: '71', type: 'Active',  role: 'President' },
    { name: 'Jake Morris',    id: '68', type: 'Active',  role: 'Member' },
    { name: 'Tyler Reese',    id: '74', type: 'Active',  role: 'Treasurer' },
    { name: 'Ben Hartley',    id: '65', type: 'Active',  role: 'Member' },
    { name: 'Sam Cho',        id: '70', type: 'Active',  role: 'Secretary' },
    { name: 'Dylan Fox',      id: '72', type: 'Pledge',  role: 'New Member' },
    { name: 'Ethan Nash',     id: '75', type: 'Pledge',  role: 'New Member' },
  ]
  const [filter, setFilter] = useState<'All' | 'Active' | 'Pledge'>('All')
  const visible = filter === 'All' ? members : members.filter(m => m.type === filter)
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Member List</h2>
      </div>
      <div className="flex gap-2">
        {(['All', 'Active', 'Pledge'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded border transition-colors ${filter === f ? 'bg-[#003DA5] text-white border-[#003DA5]' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 self-center">{visible.length} members</span>
      </div>
      <div className="space-y-1.5">
        {visible.map((m) => (
          <div key={m.id} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#003DA5] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{m.name}</p>
                <p className="text-xs text-gray-400">ID: {m.id} · {m.role}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${m.type === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
              {m.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 10 — Manage Committees
function ManageCommitteesMockup({ onBack }: { onBack: () => void }) {
  const committees = [
    { code: 'EC',     name: 'Executive Committee',  chair: 'Chris P.',  members: 8  },
    { code: 'PHIL',   name: 'Philanthropy',          chair: 'Ben H.',    members: 12 },
    { code: 'SOCIAL', name: 'Social',                chair: 'Tyler R.',  members: 15 },
    { code: 'RISK',   name: 'Risk Management',       chair: 'Mason K.',  members: 6  },
    { code: 'SCHOL',  name: 'Scholarship',           chair: 'Sam C.',    members: 9  },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <OfficerBackButton onBack={onBack} />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Manage Committees</h2>
      </div>
      <div className="flex justify-end">
        <div className="px-3 py-1.5 text-xs bg-[#003DA5] text-white rounded cursor-default font-medium">+ New Committee</div>
      </div>
      <div className="space-y-2">
        {committees.map((c) => (
          <div key={c.code} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-medium flex-shrink-0">{c.code}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chair: {c.chair} · {c.members} members</p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0 text-xs">
                <button className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OfficerActionGrid({ onNavigate }: { onNavigate: (page: OfficerPage) => void }) {
  const navCard = 'cursor-pointer hover:ring-2 hover:ring-red-500/40 transition-shadow'
  type ActionDef = { title: string; desc: string; gradient?: string; page?: OfficerPage }
  const actions: ActionDef[] = [
    { title: 'Announcements',    desc: 'Create and manage chapter announcements', page: 'announcements' },
    { title: 'New Announcement', desc: 'Post a new announcement', gradient: 'from-green-600 to-green-700' },
    { title: 'Calendar Events',  desc: 'Manage chapter calendar events' },
    { title: 'New Event',        desc: 'Create a new calendar event', gradient: 'from-blue-600 to-blue-700', page: 'new-event' },
    { title: 'Event Attendance', desc: 'Manage attendance and review excuses', page: 'attendance' },
    { title: 'Chapter Minutes',  desc: 'Record and manage chapter minutes', page: 'minutes' },
    { title: 'Exec Board Minutes', desc: 'Record executive board minutes' },
    { title: 'Member List',      desc: 'View and manage chapter members', page: 'members' },
    { title: 'Manage Roles',     desc: 'Add, edit, or delete officer roles' },
    { title: 'Manage Committees', desc: 'Create, edit, or delete committees', page: 'committees' },
    { title: 'Landing Page',     desc: 'Edit the public-facing landing page' },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {actions.map((a) => (
        <div
          key={a.title}
          onClick={() => a.page && onNavigate(a.page)}
          className={`rounded-lg shadow-sm p-3 sm:p-4 ${
            a.gradient ? `bg-gradient-to-br ${a.gradient}` : 'bg-white dark:bg-gray-800'
          } ${a.page ? navCard : ''}`}
        >
          <h3 className={`text-xs sm:text-sm font-semibold mb-1 leading-tight ${a.gradient ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
            {a.title}
          </h3>
          <p className={`text-xs leading-snug ${a.gradient ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {a.desc}
          </p>
          {a.page && !a.gradient && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1.5 font-medium">View →</p>
          )}
          {a.page && a.gradient && (
            <p className="text-sm text-white/90 mt-1.5 font-medium">View →</p>
          )}
        </div>
      ))}
    </div>
  )
}

function OfficerPortalContent() {
  const [page, setPage] = useState<OfficerPage>('home')
  const goHome = () => setPage('home')

  if (page === 'announcements') return <AnnouncementsMockup onBack={goHome} />
  if (page === 'new-event')     return <NewEventMockup      onBack={goHome} />
  if (page === 'attendance')    return <AttendanceMockup    onBack={goHome} />
  if (page === 'minutes')       return <MinutesMockup       onBack={goHome} />
  if (page === 'members')       return <MembersMockup       onBack={goHome} />
  if (page === 'committees')    return <ManageCommitteesMockup onBack={goHome} />

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4 text-white bg-gradient-to-r from-red-600 to-red-700">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <div>
            <h2 className="text-xl font-bold">Officer Portal</h2>
            <p className="text-red-100 text-sm">Manage chapter operations and administrative functions</p>
          </div>
        </div>
      </div>
      <OfficerActionGrid onNavigate={setPage} />
    </div>
  )
}

// ── Accordion ──────────────────────────────────────────────────────────────

function Accordion({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string
  badge?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{title}</span>
          {badge && (
            <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <span className="text-muted-foreground text-xs select-none">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t border-border p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ParliamentShowcase() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-8 sm:space-y-12">

        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← projects
        </Link>

        <section className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Parliament</h1>
            <p className="text-sm text-muted-foreground">
              Chapter administration software for Beta Theta Pi · Alpha Mu Chapter
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['Python', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Alpine.js'].map((t) => (
              <span key={t} className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <a
              href="https://am-parliament.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-border px-3 py-1.5 hover:bg-muted transition-colors"
            >
              View Live ↗
            </a>
            <a
              href="https://github.com/MasonKimball05/Parliament-New"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-border px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </section>

        <section className="space-y-3 border-l-4 border-l-blue-500 pl-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parliament is a full-stack web application I built from scratch to manage chapter operations
            for the Alpha Mu chapter of Beta Theta Pi. It replaced a scattered mix of spreadsheets,
            group chats, and paper sign-in sheets with a single platform used by all ~60 active members.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Features include real-time voting on legislation, committee management with sub-voting and
            document sharing, service hour tracking, event attendance with excuse workflows, a private
            songbook, officer tools, and a custom security stack including TOTP-based 2FA, rate limiting,
            geolocation checks, and field-level encryption.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built and maintained entirely solo. Currently hardening the codebase and writing documentation
            for handoff to future chapter leadership before I graduate.
          </p>
        </section>

        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Interactive Mockup
            </h2>
            <p className="text-xs text-muted-foreground">
              Sample UI with fake data. Cards marked "View →" are clickable.
            </p>
          </div>

          <div className="space-y-2">
            <Accordion title="Member Home" badge="home page" defaultOpen>
              <MemberHomeContent />
            </Accordion>

            <Accordion title="Officer Portal" badge="officers only">
              <OfficerPortalContent />
            </Accordion>
          </div>
        </section>

      </main>
    </div>
  )
}
