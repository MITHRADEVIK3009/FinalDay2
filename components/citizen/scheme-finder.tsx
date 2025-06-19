"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  ExternalLink,
  Heart,
  Bookmark,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function SchemeFinder() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<number[]>([])

  const schemes = [
    {
      id: 1,
      title: "PM Kisan Samman Nidhi",
      description: "Financial assistance of ₹6000 per year to small and marginal farmers",
      department: "Agriculture",
      category: "Farmer",
      eligibility: "Small & Marginal Farmers",
      amount: "₹6,000/year",
      deadline: "2024-12-31",
      status: "Active",
      beneficiaries: "12 Crore+",
    },
    {
      id: 2,
      title: "Beti Bachao Beti Padhao",
      description: "Scheme to improve child sex ratio and promote education of girl child",
      department: "Women & Child Development",
      category: "Women",
      eligibility: "Girl Child & Women",
      amount: "Varies",
      deadline: "2024-10-15",
      status: "Active",
      beneficiaries: "2.5 Crore+",
    },
    {
      id: 3,
      title: "Pradhan Mantri Awas Yojana",
      description: "Housing scheme for economically weaker sections and low income groups",
      department: "Housing & Urban Affairs",
      category: "Housing",
      eligibility: "EWS/LIG families",
      amount: "Up to ₹2.5 Lakh",
      deadline: "2024-11-30",
      status: "Active",
      beneficiaries: "1.2 Crore+",
    },
    {
      id: 4,
      title: "Ayushman Bharat",
      description: "Health insurance scheme providing coverage up to ₹5 lakh per family",
      department: "Health & Family Welfare",
      category: "Health",
      eligibility: "Poor & Vulnerable families",
      amount: "₹5 Lakh coverage",
      deadline: "Ongoing",
      status: "Active",
      beneficiaries: "50 Crore+",
    },
    {
      id: 5,
      title: "Skill India Mission",
      description: "Skill development program for youth to enhance employability",
      department: "Skill Development",
      category: "Youth",
      eligibility: "Youth aged 15-45",
      amount: "Free Training",
      deadline: "2024-09-30",
      status: "Active",
      beneficiaries: "4 Crore+",
    },
  ]

  const categories = ["All", "Farmer", "Women", "Youth", "Senior Citizen", "Health", "Housing", "Education"]
  const departments = [
    "All",
    "Agriculture",
    "Health & Family Welfare",
    "Women & Child Development",
    "Housing & Urban Affairs",
    "Skill Development",
  ]

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "All" || scheme.category === selectedCategory
    const matchesDepartment =
      !selectedDepartment || selectedDepartment === "All" || scheme.department === selectedDepartment

    return matchesSearch && matchesCategory && matchesDepartment
  })

  const toggleBookmark = (schemeId: number) => {
    setBookmarkedSchemes((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Scheme Finder</h1>
                <p className="text-slate-400">Discover government schemes tailored for you</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Your Perfect Scheme</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Use filters to narrow down schemes based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search schemes by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-400">
            Found {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""} matching your criteria
          </p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{scheme.title}</CardTitle>
                    <CardDescription className="text-slate-300 mb-3">{scheme.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                        {scheme.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {scheme.department}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(scheme.id)}
                    className="text-slate-400 hover:text-yellow-400"
                  >
                    <Bookmark
                      className={`h-4 w-4 ${bookmarkedSchemes.includes(scheme.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Eligibility</p>
                      <p className="text-sm text-white">{scheme.eligibility}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Benefit</p>
                      <p className="text-sm text-white">{scheme.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Deadline</p>
                      <p className="text-sm text-white">{scheme.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Beneficiaries</p>
                      <p className="text-sm text-white">{scheme.beneficiaries}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      {scheme.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Learn More
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No schemes found</h3>
              <p className="text-slate-400 mb-4">Try adjusting your search criteria or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                  setSelectedDepartment("")
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
