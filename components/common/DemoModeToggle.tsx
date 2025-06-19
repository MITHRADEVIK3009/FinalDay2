"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TestTube, Settings } from "lucide-react"
import { useDemo } from "@/contexts/DemoContext"

export function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemo()

  return (
    <div className="flex items-center space-x-2">
      {isDemoMode ? (
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
          <TestTube className="h-3 w-3 mr-1" />
          Demo Mode
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-slate-600/20 text-slate-400 border-slate-600/30">
          <Settings className="h-3 w-3 mr-1" />
          Production
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDemoMode}
        className={`text-xs ${
          isDemoMode ? "text-orange-400 hover:text-orange-300" : "text-slate-400 hover:text-slate-300"
        }`}
      >
        {isDemoMode ? "Exit Demo" : "Enable Demo"}
      </Button>
    </div>
  )
}
