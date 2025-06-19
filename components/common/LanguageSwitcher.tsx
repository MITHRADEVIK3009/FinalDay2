"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslation } from "react-i18next"

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages, isTranslating } = useLanguage()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== currentLanguage) {
      await changeLanguage(langCode)
    }
    setIsOpen(false)
  }

  const currentLang = supportedLanguages.find((lang) => lang.code === currentLanguage)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white relative" disabled={isTranslating}>
          {isTranslating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
          <span className="hidden sm:inline">{currentLang?.nativeName || currentLang?.name || "EN"}</span>
          <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
          {isTranslating && (
            <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
              {t("common.loading")}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
        <div className="px-2 py-1.5 text-xs font-medium text-slate-400 border-b border-slate-700">
          {t("languages.select_language")}
        </div>
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-slate-700 text-white"
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-slate-400">{language.name}</span>
            </div>
            {currentLanguage === language.code && <Check className="h-4 w-4 text-green-400" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
