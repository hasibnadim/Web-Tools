import React from 'react'
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex"; 
import rehypePrism from "rehype-prism-plus";
import "katex/dist/katex.min.css";
import "prismjs/themes/prism-tomorrow.css";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface BWMarkdownProps {
  children: string;
  className?: string;
}

const BWMarkdown = ({ children, className = "" }: BWMarkdownProps) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex, rehypePrism]}
        components={{
          // Headings
          h1: ({...props}) => <h1 className="text-3xl font-bold text-purple-100 mb-4 mt-6 border-b border-[#2d1e4d] pb-2" {...props} />,
          h2: ({...props}) => <h2 className="text-2xl font-semibold text-purple-200 mb-3 mt-5 border-b border-[#2d1e4d] pb-1" {...props} />,
          h3: ({...props}) => <h3 className="text-xl font-medium text-purple-200 mb-2 mt-4" {...props} />,
          h4: ({...props}) => <h4 className="text-lg font-medium text-purple-300 mb-2 mt-3" {...props} />,
          h5: ({...props}) => <h5 className="text-base font-medium text-purple-300 mb-2 mt-2" {...props} />,
          h6: ({...props}) => <h6 className="text-sm font-medium text-purple-400 mb-2 mt-2" {...props} />,
          
          // Paragraphs and text
          p: ({...props}) => <p className="text-purple-200 mb-4 leading-7" {...props} />,
          strong: ({...props}) => <strong className="font-semibold text-white" {...props} />,
          em: ({...props}) => <em className="italic text-purple-300" {...props} />,
          del: ({...props}) => <del className="line-through text-purple-500" {...props} />,
          
          // Lists
          ul: ({...props}) => <ul className="list-disc list-inside text-purple-200 mb-4 space-y-1 ml-4" {...props} />,
          ol: ({...props}) => <ol className="list-decimal list-inside text-purple-200 mb-4 space-y-1 ml-4" {...props} />,
          li: ({...props}) => <li className="mb-1 leading-6" {...props} />,
          
          // Task lists (GitHub-style)
          input: ({checked, ...props}) => (
            <input 
              type="checkbox" 
              checked={checked} 
              readOnly 
              className="mr-2 h-4 w-4 text-blue-400 border-[#2d1e4d] bg-[#231a36] rounded focus:ring-blue-500"
              {...props}
            />
          ),
          
          // Code blocks
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: ({inline, className, ...props}: {inline?: boolean; className?: string; [key: string]: any}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="bg-[#181622] text-purple-100 p-4 rounded-lg overflow-x-auto mb-4 border border-[#2d1e4d]">
                <code className={`language-${match[1]} text-sm`} {...props} />
              </pre>
            ) : (
              <code className="bg-[#231a36] text-purple-200 px-2 py-1 rounded text-sm font-mono border border-[#2d1e4d]" {...props} />
            );
          },
          
          // Pre blocks
          pre: ({...props}) => <pre className="bg-[#181622] text-purple-100 p-4 rounded-lg overflow-x-auto mb-4 border border-[#2d1e4d]" {...props} />,
          
          // Blockquotes
          blockquote: ({...props}) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-purple-300 mb-4 bg-[#231a36] py-2 rounded-r" {...props} />
          ),
          
          // Tables
          table: ({...props}) => (
            <div className="overflow-x-auto mb-4 border border-[#2d1e4d] rounded-lg">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({...props}) => <thead className="bg-[#2d1e4d]" {...props} />,
          tbody: ({...props}) => <tbody className="divide-y divide-[#2d1e4d]" {...props} />,
          tr: ({...props}) => <tr className="hover:bg-[#231a36]" {...props} />,
          th: ({...props}) => <th className="border border-[#2d1e4d] px-4 py-3 bg-[#231a36] font-semibold text-left text-purple-200" {...props} />,
          td: ({...props}) => <td className="border border-[#2d1e4d] px-4 py-3 text-purple-200" {...props} />,
          
          // Links
          a: ({href, ...props}) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Images
          img: ({src, alt, ...props}) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg border border-[#2d1e4d] my-4 shadow-sm" 
              {...props}
            />
          ),
          
          // Horizontal rule
          hr: ({...props}) => <hr className="border-t border-[#2d1e4d] my-6" {...props} />,
          
          // Definition lists
          dl: ({...props}) => <dl className="mb-4" {...props} />,
          dt: ({...props}) => <dt className="font-semibold text-purple-100 mb-1" {...props} />,
          dd: ({...props}) => <dd className="text-purple-200 mb-3 ml-4" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
      
      <style jsx>{`
        .markdown-content {
          line-height: 1.6;
        }
        
        .markdown-content > *:first-child {
          margin-top: 0;
        }
        
        .markdown-content > *:last-child {
          margin-bottom: 0;
        }
        
        /* GitHub-style code highlighting */
        .markdown-content pre {
          background-color: #181622;
          color: #e0d7ff;
        }
        
        .markdown-content code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        }
        
        /* Task list styling */
        .markdown-content input[type="checkbox"] {
          margin-right: 0.5rem;
        }
        
        /* Table improvements */
        .markdown-content table {
          font-size: 0.875rem;
        }
        
        /* Link hover effects */
        .markdown-content a:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

export default BWMarkdown