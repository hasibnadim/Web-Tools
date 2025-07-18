import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator } from 'lucide-react'
import React from 'react'
import CashOutCalculator from './_CashOutCalc'


const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-2">
      <div className="container mx-auto px-2">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
              <Calculator className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">Mobile Banking</span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-1">
              Transaction Fee Calculator
            </h1>

            <p className="text-sm text-gray-500">
              Calculate transaction fees for different mobile banking platforms
            </p>
          </div>
          <Tabs defaultValue="rocket" >
            <TabsList className="w-full flex justify-between bg-gray-100 rounded-lg p-1 gap-1">
              <TabsTrigger value="rocket" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">Rocket</TabsTrigger>
              <TabsTrigger value="bkash" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">Bkash</TabsTrigger>
              <TabsTrigger value="nagad" className="flex-1 text-xs px-2 py-1 rounded-md data-[state=active]:bg-red-100 data-[state=active]:text-red-700">Nagad</TabsTrigger>
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