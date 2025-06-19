"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Loader2,
  Download,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { DemoApiClient } from "@/lib/demo-data"

export function SchemeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const schemeId = params.id as string

  const [scheme, setScheme] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const demoApi = DemoApiClient.getInstance()

  useEffect(() => {
    loadSchemeDetails()
  }, [schemeId])

  const loadSchemeDetails = async () => {
    try {
      setLoading(true)
      const schemeData = await demoApi.getSchemeById(schemeId)

      if (!schemeData) {
        setError("Scheme not found")
        return
      }

      setScheme(schemeData)

      // Log page view
      await demoApi.logUserAction("scheme_detail_view", {
        schemeId,
        schemeTitle: schemeData.title,
      })
    } catch (err) {
      console.error("Failed to load scheme details:", err)
      setError("Failed to load scheme details")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyNow = async () => {
    await demoApi.logUserAction("apply_now_click", {
      schemeId,
      schemeTitle: scheme.title,
      source: "scheme_detail_page",
    })

    router.push(`/citizen/apply?scheme=${schemeId}`)
  }

  const handleVisitPortal = async () => {
    await demoApi.logUserAction("external_portal_click", {
      schemeId,
      portalUrl: scheme.portal_url,
    })

    window.open(scheme.portal_url, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400 mx-auto mb-4" />
          <p className="text-white">Loading scheme details...</p>
        </div>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Alert className="border-red-500/50 bg-red-500/10 max-w-md">
            <AlertDescription className="text-red-200">{error || "Scheme not found"}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={() => router.back()} className="mt-4 border-slate-600 text-slate-400">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      USA: "🇺🇸",
      India: "🇮🇳",
      China: "🇨🇳",
      France: "🇫🇷",
      Germany: "🇩🇪",
    }
    return flags[country] || "🌍"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Scheme Details</h1>
                <p className="text-slate-400">Learn more about this government scheme</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-teal-500 text-teal-400">
                {getCountryFlag(scheme.country)} {scheme.country}
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {scheme.category}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Scheme Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getCountryFlag(scheme.country)}</span>
                  <div>
                    <CardTitle className="text-2xl text-white">{scheme.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-lg mt-2">{scheme.description}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    scheme.status === "active" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
                  }
                >
                  {scheme.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-slate-400">Department</p>
                    <p className="text-white font-medium">{scheme.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Country</p>
                    <p className="text-white font-medium">{scheme.country}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Category</p>
                    <p className="text-white font-medium">{scheme.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleApplyNow} className="bg-green-500 hover:bg-green-600 flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  onClick={handleVisitPortal}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20 flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Portal
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-400">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overview */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-teal-400" />
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">{scheme.overview}</p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Eligibility Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">{scheme.eligibility}</p>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <span>Required Documents</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Please ensure you have all these documents ready before applying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheme.required_documents?.map((doc: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-400" />
                <span>How to Apply</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Prepare Documents</h3>
                    <p className="text-slate-400">Gather all required documents listed above</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Fill Application</h3>
                    <p className="text-slate-400">Complete the online application form with accurate information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Upload Documents</h3>
                    <p className="text-slate-400">Upload clear scanned copies of all required documents</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Submit & Track</h3>
                    <p className="text-slate-400">Submit your application and track its progress online</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Phone className="h-5 w-5 text-orange-400" />
                <span>Contact & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Official Website</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-400 hover:text-blue-300"
                      onClick={handleVisitPortal}
                    >
                      Visit Portal
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-400">Helpline</p>
                    <p className="text-white font-medium">1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email Support</p>
                    <p className="text-white font-medium">support@scheme.gov</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h2>
              <p className="text-slate-300 mb-6">
                Start your application now and get one step closer to accessing this government scheme.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleApplyNow} size="lg" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Start Application
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/citizen/support")}
                  className="border-slate-600 text-slate-400"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
