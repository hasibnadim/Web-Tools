import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import applications from '@/lib/applications'
import Link from 'next/link'
import React from 'react'
import SearchBox from './SearchBox'


const page = () => {
    return (
        <div className='container mx-auto py-1'>
            <SearchBox /> 
            <Accordion type="single" collapsible className="w-full mt-3" defaultValue={Object.keys(applications)[0]}>
                {Object.entries(applications).map(([category, tools]) => (
                    <AccordionItem key={category} value={category}>
                        <AccordionTrigger className='text-xl font-sans'>{category}</AccordionTrigger>
                        <AccordionContent>
                            <>
                                {tools.map((tool) => (
                                    <Link key={tool.name} href={tool.link} target="_blank" rel="noopener noreferrer"
                                        className='block p-2 rounded text-lg my-1 font-mono hover:bg-blue-50'>
                                        {tool.name}
                                    </Link>

                                ))}
                            </>
                        </AccordionContent>
                    </AccordionItem>
                ))}

            </Accordion>
        </div>
    )
}

export default page