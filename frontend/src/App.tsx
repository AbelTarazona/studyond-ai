import './App.css'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { useJourneyStore } from '@/store/journeyStore'
import { LandingPage } from '@/components/landing/LandingPage'
import { IntakeForm } from '@/components/intake/IntakeForm'
import { JourneyMap } from '@/components/journey/JourneyMap'
import { StuckDialog } from '@/components/stuck/StuckDialog'
import { Home, MessageSquare, Folder, Compass, Settings, ChevronRight } from 'lucide-react'
import StudyondLogo from '@/assets/studyond.svg'

type AppView = 'landing' | 'intake' | 'journey'

export default function App() {
  const { startJourney, hasStarted } = useJourneyStore()
  const [stuckStageId, setStuckStageId] = useState<string | null>(null)
  const [appView, setAppView] = useState<AppView>(hasStarted ? 'journey' : 'landing')

  useEffect(() => {
    if (hasStarted && appView === 'landing') {
      setAppView('journey')
    }

    if (!hasStarted && appView === 'journey') {
      setAppView('intake')
    }
  }, [appView, hasStarted])

  const handleLandingSelect = () => {
    setAppView('intake')
  }

  const handleStartJourney = (data: any) => {
    startJourney(data)
    setAppView('journey')
  }

  const handleResetJourney = () => {
    setStuckStageId(null)
    setAppView('intake')
  }

  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-white text-gray-900 flex">
        {/* Side Navigation - Always Visible */}
        <nav className="w-72 border-r border-gray-200 bg-white fixed left-0 top-0 h-screen flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <img src={StudyondLogo} alt="Studyond" className="h-8 object-contain" />
        </div>

        {/* Navigation Content */}
        <div className="flex-1">
          {/* Personal Section */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal</p>
            <div className="space-y-2">
              <button
                onClick={() => setAppView('landing')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Home</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Messages</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <Folder className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">My Projects</span>
              </button>

              <button
                onClick={() => setAppView(hasStarted ? 'journey' : 'intake')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  appView === 'journey' || appView === 'intake'
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5" />
                  <span className="text-sm font-medium">Thesis GPS</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explore Section */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Explore</p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Topics</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Jobs</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">People</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Organizations</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings & Profile */}
        <div className="border-t border-gray-200 px-6 py-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">My Settings</span>
          </button>

          <div className="pt-2 border-t border-gray-200 mt-4">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
              <div className="text-left min-w-0">
                <p className="text-sm font-medium truncate">Diya Desai</p>
                <p className="text-xs text-gray-500 truncate">diyajigneshbhai.desai@stu...</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Always with left margin for sidebar */}
      <div className="ml-72 flex-1">
        {appView === 'landing' ? (
          <LandingPage onStart={handleLandingSelect} />
        ) : appView === 'intake' ? (
          <IntakeForm onSubmit={handleStartJourney} />
        ) : (
          <>
            {/* Journey map — owns its own top bar */}
            <JourneyMap
              onStuck={(id) => setStuckStageId(id)}
              onReset={handleResetJourney}
            />

            {/* Stuck dialog */}
            <StuckDialog
              stageId={stuckStageId}
              onClose={() => setStuckStageId(null)}
            />
          </>
        )}
      </div>
    </div>
    </>
  )
}
