import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator } from 'lucide-react'
import React from 'react'
import CashOutCalculator from './_CashOutCalc'


const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-2">
      <div className="container mx-auto px-2">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg border border-slate-800">
              <Calculator className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-medium text-gray-200">Mobile Banking</span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-1">
              Transaction Fee Calculator
            </h1>

            <p className="text-sm text-gray-400">
              Calculate transaction fees for different mobile banking platforms
            </p>
          </div>
          <Tabs defaultValue="rocket" >
            <TabsList className="w-full flex justify-between bg-slate-900/80 border border-slate-800 rounded-lg p-1 gap-1">
              <TabsTrigger value="rocket" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-purple-900 data-[state=active]:text-purple-200 text-gray-200">Rocket</TabsTrigger>
              <TabsTrigger value="bkash" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-pink-900 data-[state=active]:text-pink-200 text-gray-200">Bkash</TabsTrigger>
              <TabsTrigger value="nagad" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-red-900 data-[state=active]:text-red-200 text-gray-200">Nagad</TabsTrigger>
            </TabsList>

            <TabsContent value="rocket">
              <CashOutCalculator
                title="Rocket Cashout Calculator"
                defaultRate={0.0167}
                altRate={0.009}
                altLabel="ATM Booth"
              />
            </TabsContent>
            <TabsContent value="bkash">
              <CashOutCalculator
                title="bKash Cashout Calculator"
                defaultRate={0.0185}
                altRate={0.0149}
                altLabel="Priyo Number"
              />
            </TabsContent>
            <TabsContent value="nagad">
              <CashOutCalculator
                title="Nagad Cashout Calculator"
                defaultRate={0.0125}
                altRate={0.0150}
                altLabel="Islami Account"
              />
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
export default page
