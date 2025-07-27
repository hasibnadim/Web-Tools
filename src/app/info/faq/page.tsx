"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Globe, Waves, BookOpen, Code, Shield, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const faqCategories = [
    {
      title: "Multilingual Support",
      icon: Globe,
      slug: "multilingual",
      questions: [
        {
          question: "What about Chinese, Arabic and English support?",
          answer: "书 حكمة (Shū Hikma) embraces multilingualism as a core philosophy. The platform supports Chinese (中文), Arabic (العربية), and English, reflecting our commitment to global wisdom traditions. The name itself combines Chinese '书' (book) and Arabic 'حكمة' (wisdom), symbolizing the convergence of Eastern and Western knowledge systems.",
          slug: "chinese-arabic-english-support"
        },
        {
          question: "Why these three languages specifically?",
          answer: "These languages represent three of the world's most ancient and influential wisdom traditions. Chinese brings Confucian and Taoist philosophy, Arabic carries Islamic scholarship and scientific heritage, and English serves as a modern bridge language. Together, they create a comprehensive framework for global knowledge exchange.",
          slug: "why-three-languages"
        },
        {
          question: "Will you add more languages in the future?",
          answer: "Yes, we plan to expand language support based on user demand and community contributions. Our goal is to make wisdom accessible across all major world languages while maintaining the quality and depth of content.",
          slug: "more-languages-future"
        }
      ]
    },
    {
      title: "Ocean Philosophy",
      icon: Waves,
      slug: "ocean-philosophy",
      questions: [
        {
          question: "What is the Philosophy of Ocean?",
          answer: "The Ocean represents the vast, interconnected nature of knowledge and human consciousness. Just as the ocean connects continents, our platform connects different wisdom traditions, cultures, and individuals. The ocean's depth symbolizes the infinite potential for learning and growth, while its waves represent the dynamic flow of ideas and innovation.",
          slug: "what-is-ocean-philosophy"
        },
        {
          question: "How does the Ocean feature work?",
          answer: "The Ocean is a collaborative space where users can share insights, ask questions, and engage in meaningful discussions. It's designed to foster deep thinking and cross-cultural dialogue, allowing wisdom to flow freely between participants like currents in the ocean.",
          slug: "how-ocean-feature-works"
        },
        {
          question: "Is the Ocean feature available to everyone?",
          answer: "The Ocean feature is available to registered users to ensure quality discussions and protect the community. This helps maintain a respectful environment for meaningful knowledge exchange.",
          slug: "ocean-feature-availability"
        }
      ]
    },
    {
      title: "Platform Features",
      icon: BookOpen,
      slug: "platform-features",
      questions: [
        {
          question: "What tools are available on the platform?",
          answer: "We offer a comprehensive suite of tools including development utilities, conversion tools, text analysis, QR code generators, and more. Each tool is designed to enhance productivity while maintaining the platform's focus on wisdom and knowledge.",
          slug: "available-tools"
        },
        {
          question: "Are the tools free to use?",
          answer: "Most tools are free to use. Some advanced features may require registration or have usage limits to ensure fair access for all users.",
          slug: "tools-pricing"
        },
        {
          question: "How do I get started with the tools?",
          answer: "Simply navigate to the Tools section, browse the available categories, and click on any tool that interests you. Each tool includes instructions and examples to help you get started quickly.",
          slug: "getting-started-tools"
        }
      ]
    },
    {
      title: "Technical & Security",
      icon: Shield,
      slug: "technical-security",
      questions: [
        {
          question: "How secure is my data?",
          answer: "We implement industry-standard security measures including encryption, secure authentication, and regular security audits. Your privacy and data protection are our top priorities.",
          slug: "data-security"
        },
        {
          question: "What data do you collect?",
          answer: "We collect minimal data necessary for platform functionality. This includes account information (if you register), usage analytics (with consent), and technical data for service improvement. We never sell your personal data.",
          slug: "data-collection"
        },
        {
          question: "How do you handle cookies?",
          answer: "We use cookies to enhance your experience and provide essential functionality. You can control cookie preferences through our consent management system, choosing which types of cookies to accept.",
          slug: "cookie-handling"
        }
      ]
    },
    {
      title: "Community & Support",
      icon: Users,
      slug: "community-support",
      questions: [
        {
          question: "How can I contribute to the platform?",
          answer: "You can contribute by participating in discussions, suggesting new tools, reporting issues, or sharing your knowledge with the community. We welcome contributions that align with our mission of fostering wisdom and knowledge exchange.",
          slug: "how-to-contribute"
        },
        {
          question: "How do I report issues or bugs?",
          answer: "You can report issues through our GitHub repository, contact us directly, or use the feedback forms available throughout the platform. We appreciate detailed reports that help us improve the service.",
          slug: "report-issues"
        },
        {
          question: "Is there a community forum or discussion area?",
          answer: "Yes, the Ocean feature serves as our primary community space where users can engage in discussions, ask questions, and share insights with like-minded individuals.",
          slug: "community-forum"
        }
      ]
    },
    {
      title: "Development & Future",
      icon: Code,
      slug: "development-future",
      questions: [
        {
          question: "Is the platform open source?",
          answer: "Yes, the platform is open source and available on GitHub. We believe in transparency and community collaboration, allowing developers to contribute, learn, and improve the platform together.",
          slug: "open-source"
        },
        {
          question: "What's the technology stack?",
          answer: "We use modern web technologies including Next.js, React, TypeScript, and Tailwind CSS. The backend is built with Node.js and MongoDB, ensuring scalability and performance.",
          slug: "technology-stack"
        },
        {
          question: "What features are planned for the future?",
          answer: "We're planning to add AI-powered content recommendations, enhanced multilingual support, mobile applications, and more collaborative features. We regularly update our roadmap based on user feedback and community needs.",
          slug: "future-features"
        }
      ]
    }
  ];

  // Handle URL hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Find the item to open based on hash
        let targetItem = '';
        faqCategories.forEach((category, categoryIndex) => {
          category.questions.forEach((question, questionIndex) => {
            if (question.slug === hash) {
              targetItem = `item-${categoryIndex}-${questionIndex}`;
            }
          });
        });
        
        if (targetItem) {
          setOpenItem(targetItem);
          // Scroll to the element after a short delay to ensure it's rendered
          setTimeout(() => {
            const element = document.getElementById(targetItem);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    }
  }, [faqCategories]);

  // Update URL when accordion item opens
  const handleAccordionChange = (value: string | undefined) => {
    setOpenItem(value);
    
    if (value && typeof window !== 'undefined') {
      // Find the slug for the opened item
      let targetSlug = '';
      faqCategories.forEach((category, categoryIndex) => {
        category.questions.forEach((question, questionIndex) => {
          if (`item-${categoryIndex}-${questionIndex}` === value) {
            targetSlug = question.slug;
          }
        });
      });
      
      if (targetSlug) {
        // Update URL without page reload
        const newUrl = `${window.location.pathname}#${targetSlug}`;
        window.history.pushState({}, '', newUrl);
      }
    } else if (!value && typeof window !== 'undefined') {
      // Remove hash when accordion closes
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            FAQ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about 书 حكمة (Shū Hikma), our multilingual approach, ocean philosophy, and platform features.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full"
                  value={openItem}
                  onValueChange={handleAccordionChange}
                >
                  {category.questions.map((item, itemIndex) => {
                    const itemId = `item-${categoryIndex}-${itemIndex}`;
                    return (
                      <AccordionItem key={itemIndex} value={itemId} id={itemId}>
                        <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {item.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          <p>{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Still Have Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/info/about">
                <Button variant="outline" size="sm">
                  About Us
                </Button>
              </Link>
              <Link href="https://github.com/hasibnadim/web-tools" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  GitHub Issues
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 