import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Package, 
  Zap, 
  Grid, 
  Code, 
  ArrowRight, 
  Users, 
  Shield, 
  Sparkles, 
  Globe, 
  CheckCircle, 
  Search,
  User,
  Star
} from "lucide-react";
import applications from "@/lib/applications";

export default function Home() {
  const categoryIcons = {
    "Generator Kit": Zap,
    "Conversion Kit": Grid,
    "Developer Suite": Code
  };

  const features = [
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Lightning-fast tools designed for developers who need results quickly"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All processing happens locally - your data never leaves your browser"
    },
    {
      icon: Sparkles,
      title: "Modern UI",
      description: "Beautiful, responsive design that works on any device"
    },
    {
      icon: Users,
      title: "User Profiles",
      description: "Personalized experience with Google OAuth integration"
    }
  ];

  const stats = [
    { label: "Tools Available", value: "5+" },
    { label: "Categories", value: "3" },
    { label: "Users", value: "100+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo & Brand */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">BAW Web Tools</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6">
              书 حكمة
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shū Hikma
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Book and Wisdom - A comprehensive suite of developer tools designed to enhance your productivity and streamline your workflow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/kits">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  <Package className="w-5 h-5 mr-2" />
                  Explore Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-medium border-2 hover:bg-blue-50 transition-all duration-300">
                  <User className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BAW?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by developers, for developers. Our tools are designed to make your daily tasks faster and more efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Overview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Developer Tools Suite</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for development, conversion, and data analysis in one place.
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(applications).map(([category, tools]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Card key={category} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tools.map((tool) => (
                        <Link key={tool.name} href={tool.link}>
                          <div className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-200">
                                  <tool.icon className="w-4 h-4 text-blue-600" /> 
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {tool.name}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Personalized Experience</h2>
              <p className="text-lg text-gray-600 mb-8">
                Create your profile, track your activity, and discover other developers in the community.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Google OAuth Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Editable User Profiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Activity Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">User Discovery</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/auth/login">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <User className="w-5 h-5 mr-2" />
                    Create Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Profile</span>
                  </div>
                  <p className="text-sm text-gray-600">Customize your persona and track your activity</p>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Discover</span>
                  </div>
                  <p className="text-sm text-gray-600">Find and connect with other developers</p>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Activity</span>
                  </div>
                  <p className="text-sm text-gray-600">Track your tool usage and preferences</p>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Community</span>
                  </div>
                  <p className="text-sm text-gray-600">Join the growing developer community</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who are already using BAW to boost their productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kits">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-medium">
                <Package className="w-5 h-5 mr-2" />
                Explore Tools
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                <User className="w-5 h-5 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
