import { Mail, Phone, MapPin, MessageSquare, Clock, Globe, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["support@eventflow.com", "sales@eventflow.com"],
      description: "We aim to respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 99999 99999", "+91 87654 32109"],
      description: "Mon-Fri from 9:30am to 6:30pm IST"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["VJTI", "Mumbai, Maharashtra 400019"],
      description: "Come visit us!"
    }
  ]

  const faqs = [
    {
      question: "How quickly can I get started with EventFlow?",
      answer: "You can start using EventFlow immediately after signing up. Our intuitive platform allows you to create your first event within minutes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and offer invoice payment options for enterprise customers."
    },
    {
      question: "Do you offer custom solutions for large events?",
      answer: "Yes! Our enterprise team can work with you to create custom solutions tailored to your specific needs."
    },
    {
      question: "Is there a limit to the number of events I can create?",
      answer: "No, there's no limit to the number of events you can create. Different pricing tiers offer various features and attendee limits."
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 mb-24">
        {/* Contact Form */}
        <div>
          <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-zinc-400">
                    First name
                  </label>
                  <Input 
                    id="firstName"
                    placeholder="John" 
                    className="bg-zinc-800/50 border-zinc-700 focus:border-indigo-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-zinc-400">
                    Last name
                  </label>
                  <Input 
                    id="lastName"
                    placeholder="Doe" 
                    className="bg-zinc-800/50 border-zinc-700 focus:border-indigo-500" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-400">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="john@example.com" 
                  className="bg-zinc-800/50 border-zinc-700 focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-zinc-400">
                  Subject
                </label>
                <Input 
                  id="subject"
                  placeholder="How can we help?" 
                  className="bg-zinc-800/50 border-zinc-700 focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-400">
                  Message
                </label>
                <Textarea 
                  id="message"
                  placeholder="Tell us about your inquiry..." 
                  className="bg-zinc-800/50 border-zinc-700 focus:border-indigo-500 min-h-[150px] resize-y" 
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-indigo-500 hover:bg-indigo-600">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 bg-indigo-500/10 p-3 rounded-lg">
                  <item.icon className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-zinc-400 leading-relaxed">{detail}</p>
                  ))}
                  <p className="text-sm text-zinc-500 mt-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Response Time Card */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0 bg-indigo-500/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Response Time</h3>
            </div>
            <p className="text-zinc-400 mb-4 leading-relaxed">
              We typically respond to all inquiries within 24 hours during business days. 
              For urgent matters, please call our support line.
            </p>
            <div className="flex items-center gap-3">
              <div className="shrink-0 bg-indigo-500/10 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-zinc-400">
                Available worldwide in multiple languages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Find quick answers to common questions about EventFlow
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
