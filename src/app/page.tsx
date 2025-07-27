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
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 py-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4">
          <div className="text-center">
            {/* Logo & Brand */}
            <div className="inline-flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 shadow-md">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-purple-700 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-200">BAW Unified Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
              书 حكمة
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-2">
              Shū Hikma
            </h2>
            <p className="text-base text-gray-400 mb-6 max-w-2xl mx-auto">
              A unified platform where books, wisdom, and AI converge to boost your productivity, deepen your connection to the world, and inspire the exploration of new knowledge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-6">
              <Link href="/kit">
                <Button size="sm" className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white px-5 py-2 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 min-h-0 min-w-0 h-9">
                  <Package className="w-4 h-4 mr-1" />
                  Explore Tools
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link> 
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-blue-300 mb-0.5">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

 

      {/* Tools Overview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Featured Tool Kits</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need for development, conversion, and data analysis in one place.
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(applications).map(([category, tools]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Card key={category} className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-purple-800 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-100">{category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tools.map((tool) => (
                        <Link key={tool.name} href={tool.link}>
                          <div className="group p-4 rounded-full border bg-slate-900 hover:bg-blue-500 hover:shadow-blue-400/25 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center group-hover:from-blue-800 group-hover:to-purple-800 transition-all duration-200">
                                  <tool.icon className="w-4 h-4 text-blue-300"/>
                                </div>
                                <span className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200">
                                  {tool.name}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
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
