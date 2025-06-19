"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Pin,
  Shield,
  BookOpen,
  FileText,
  Bell,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDemo } from "@/contexts/DemoContext"
import { useRouter } from "next/navigation"

export function OfficerForum() {
  const { t } = useTranslation()
  const { isDemoMode, demoOfficer } = useDemo()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  // ✅ Demo Officer Forum Data
  const [forumPosts] = useState([
    {
      id: "OF-001",
      title: "New Document Verification Guidelines - June 2024",
      content:
        "Updated guidelines for verifying income certificates. Please review the new checklist and AI-assisted verification process.",
      author: "District Collector - Chennai",
      department: "Revenue Department",
      category: "Policy Updates",
      replies: 15,
      likes: 28,
      views: 156,
      timestamp: "2 hours ago",
      status: "pinned",
      priority: "high",
      tags: ["Policy", "Document Verification", "Guidelines"],
      isOfficial: true,
    },
    {
      id: "OF-002",
      title: "AI Classification Accuracy Issues",
      content:
        "Has anyone noticed inconsistencies in AI document classification for caste certificates? Getting 85% accuracy instead of expected 95%.",
      author: "VAO - Anna Nagar",
      department: "Agriculture Department",
      category: "Technical Discussion",
      replies: 8,
      likes: 12,
      views: 89,
      timestamp: "4 hours ago",
      status: "open",
      priority: "medium",
      tags: ["AI", "Document Classification", "Technical"],
      isOfficial: false,
    },
    {
      id: "OF-003",
      title: "Training: Multi-language Support Best Practices",
      content:
        "Sharing best practices for handling applications in Tamil, Telugu, and Hindi. Includes voice assistance tips.",
      author: "Training Coordinator",
      department: "Administrative",
      category: "Training Materials",
      replies: 22,
      likes: 45,
      views: 234,
      timestamp: "1 day ago",
      status: "answered",
      priority: "medium",
      tags: ["Training", "Multi-language", "Best Practices"],
      isOfficial: true,
    },
    {
      id: "OF-004",
      title: "Certificate Template Updates Required",
      content:
        "Need to update community certificate templates to include new government logo and QR code verification.",
      author: "Document Officer - Coimbatore",
      department: "Revenue Department",
      category: "Department Discussions",
      replies: 6,
      likes: 18,
      views: 67,
      timestamp: "2 days ago",
      status: "in-progress",
      priority: "high",
      tags: ["Templates", "Certificates", "Updates"],
      isOfficial: false,
    },
    {
      id: "OF-005",
      title: "Success Story: 100% Digital Verification Achieved",
      content:
        "Our district achieved 100% digital document verification this month. Sharing the process and lessons learned.",
      author: "BDO - Salem",
      department: "Rural Development",
      category: "Success Stories",
      replies: 31,
      likes: 67,
      views: 445,
      timestamp: "3 days ago",
      status: "success",
      priority: "low",
      tags: ["Success Story", "Digital Verification", "Achievement"],
      isOfficial: false,
    },
  ])

  // ✅ Filter posts based on search and category
  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // ✅ Get status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pinned":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "answered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "open":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pinned":
        return <Pin className="h-4 w-4" />
      case "answered":
        return <CheckCircle className="h-4 w-4" />
      case "success":
        return <TrendingUp className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "open":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-orange-400" />
              <span>{t("officer.officer_forum")}</span>
              {isDemoMode && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  DEMO
                </Badge>
              )}
            </h1>
            <p className="text-slate-400">
              {t("officer.department_discussions")} • {demoOfficer?.department || "Department"}
            </p>
          </div>

          {/* ✅ Search and Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search discussions, policies, or training materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    onClick={() => router.push("/officer/forum/new")}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Forum Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">156</div>
                <div className="text-sm text-slate-400">Active Discussions</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">89</div>
                <div className="text-sm text-slate-400">Resolved Issues</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">234</div>
                <div className="text-sm text-slate-400">Officers Online</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">12</div>
                <div className="text-sm text-slate-400">Policy Updates</div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Forum Content */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
                All Discussions
              </TabsTrigger>
              <TabsTrigger value="policy" className="data-[state=active]:bg-slate-700">
                <FileText className="h-4 w-4 mr-2" />
                Policy Updates
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-slate-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-slate-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="announcements" className="data-[state=active]:bg-slate-700">
                <Bell className="h-4 w-4 mr-2" />
                Announcements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* ✅ Discussion Posts */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className={getStatusColor(post.status)}>
                                {getStatusIcon(post.status)}
                                <span className="ml-1 capitalize">{post.status.replace("-", " ")}</span>
                              </Badge>
                              <Badge variant="secondary" className={getPriorityColor(post.priority)}>
                                {post.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-400">
                                {post.category}
                              </Badge>
                              {post.isOfficial && (
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Official
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 hover:text-orange-400 cursor-pointer">
                              {post.title}
                            </h3>
                            <p className="text-slate-300 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-slate-300">{post.author}</span>
                            <span>•</span>
                            <span>{post.department}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{post.views} views</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-500">No discussions yet. Start one!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ✅ Other tab contents would filter by category */}
            <TabsContent value="policy">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Policy Updates")
                  .map((post) => (
                    <Card key={post.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-slate-300 text-sm">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="technical">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Technical Discussion")
                  .map((post) => (
                    <Card key={post.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-slate-300 text-sm">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="training">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Training Materials")
                  .map((post) => (
                    <Card key={post.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-slate-300 text-sm">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
