"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, MessageCircle, ThumbsUp, Reply, Users, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// ✅ Community Forum with Sample Discussions
export default function CommunityForumPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDemoMode] = useState(() => localStorage.getItem("demo_mode") === "true")

  // ✅ Sample forum discussions
  const forumPosts = [
    {
      id: "1",
      title: "How to apply for PMAY scheme online?",
      content: "I'm trying to apply for Pradhan Mantri Awas Yojana but facing issues with the online portal. Can someone guide me through the process?",
      author: "Rajesh Kumar",
      category: "Housing Schemes",
      replies: 12,
      likes: 25,
      views: 156,
      timestamp: "2 hours ago",
      status: "answered",
      tags: ["PMAY", "Housing", "Online Application"],
    },
    {
      id: "2",
      title: "MGNREGA job card not working - Need help",
      content: "My MGNREGA job card shows invalid status. I've been trying to get work for the past month but no luck. What should I do?",
      author: "Priya Sharma",
      category: "Employment",
      replies: 8,
      likes: 18,
      views: 89,
      timestamp: "5 hours ago",
      status: "open",
      tags: ["MGNREGA", "Job Card", "Employment"],
    },
    {
      id: "3",
      title: "Documents required for caste certificate",
      content: "What are the exact documents needed for caste certificate application? Different offices are asking for different documents.",
      author: "Amit Patel",
      category: "Certificates",
      replies: 15,
      likes: 32,
      views: 234,
      timestamp: "1 day ago",
      status: "answered",
      tags: ["Caste Certificate", "Documents", "Application"],
    },
    {
      id: "4",
      title: "Aadhaar update taking too long",
      content: "I submitted my address change request 3 months ago but still no update. Is this normal? How can I track the status?",
      author: "Sunita Devi",
      category: "Aadhaar Services",
      replies: 6,
      likes: 14,
      views: 67,
      timestamp: "2 days ago",
      status: "open",
      tags: ["Aadhaar", "Address Update", "Tracking"],
    },
    {
      id: "5",
      title: "Success Story: Got my income certificate in 7 days!",
      content: "Sharing my experience of getting income certificate quickly. Here's what worked for me...",
      author: "Vikram Singh",
      category: "Success Stories",
      replies: 22,
      likes: 45,
      views: 312,
      timestamp: "3 days ago",
      status: "success",
      tags: ["Income Certificate", "Success Story", "Tips"],
    },
  ]

  // ✅ Sample replies for demonstration
  const sampleReplies = [
    {
      id: "r1",
      postId: "1",
      content: "You need to visit the official PMAY website and create an account first. Make sure you have all required documents ready.",
      author: "Government Helper",
      likes: 8,
      timestamp: "1 hour ago",
      isOfficial: true,
    },
    {
      id: "r2",
      postId: "1",
      content: "I faced the same issue. Try clearing your browser cache and use Chrome browser. It worked for me.",
      author: "Helpful Citizen",
      likes: 5,
      timestamp: "30 minutes ago",
      isOfficial: false,
    },
  ]

  // ✅ Filter posts based on search
  const filteredPosts = forumPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // ✅ Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "success":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "open":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  // ✅ Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "answered":
        return <CheckCircle className="h-4 w-4" />
      case "success":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                <Users className="h-3 w-3 mr-1" />
                Community Forum
              </Badge>
              {isDemoMode && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Forum Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Community Forum</h1>
            <p className="text-slate-400">Connect with fellow citizens, share experiences, and get help with government services</p>
          </div>

          {/* ✅ Search and Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search discussions, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Forum Content */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All Discussions</TabsTrigger>
              <TabsTrigger value="housing" className="data-[state=active]:bg-slate-700">Housing</TabsTrigger>
              <TabsTrigger value="employment" className="data-[state=active]:bg-slate-700">Employment</TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-slate-700">Certificates</TabsTrigger>
              <TabsTrigger value="success" className="data-[state=active]:bg-slate-700">Success Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* ✅ Forum Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">1,234</div>
                    <div className="text-sm text-slate-400">Total Questions</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">892</div>
                    <div className="text-sm text-slate-400">Answered</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">342</div>
                    <div className="text-sm text-slate-400">Open</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">567</div>
                    <div className="text-sm text-slate-400">Active Users</div>
                  </CardContent>
                </Card>
              </div>

              {/* ✅ Discussion Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className={getStatusColor(post.status)}>
                              {getStatusIcon(post.status)}
                              <span className="ml-1 capitalize">{post.status}</span>
                            </Badge>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {post.category}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2 hover:text-teal-400 cursor-pointer">
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
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <div className="flex items-center space-x-4">
                            <span>by {post.author}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Reply className="h-4 w-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-4 w-4" />
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
                ))}
              </div>
            </TabsContent>

            {/* ✅ Other tab contents would filter by category */}
            <TabsContent value="housing">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Housing Schemes")
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

            <TabsContent value="employment">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Employment")
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

            <TabsContent value="certificates">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Certificates")
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

            <TabsContent value="success">
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.category === "Success Stories")
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
  )\
}
