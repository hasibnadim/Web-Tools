import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Package,
  Grid,
  Code,
  ArrowRight, 
  Zap
} from "lucide-react";
import applications from "@/lib/applications";
import { totalUsers } from "@/service/auth/user";

export default async function Home() {
  const _totalUsers = await totalUsers();
  const categoryIcons = {
    "General Kit": Zap,
    "Conversion Kit": Grid,
    "Developer Suite": Code
  };

 

  const stats = [
    { label: "Tools Available", value: Object.values(applications).flat().length },
    { label: "Categories", value: Object.values(applications).length },
    { label: "Users", value: _totalUsers }
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
              <span className="text-sm font-medium text-gray-700">BAW Unified Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6">
              书 حكمة
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shū Hikma
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A unified platform where books, wisdom, and AI converge to boost your productivity, deepen your connection to the world, and inspire the exploration of new knowledge.
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
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
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

 

      {/* Tools Overview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tool Kits</h2>
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
 
    </div>
  );
}
