import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const posts = [
    {
      title: "Introducing Smart Event Recommendations",
      excerpt: "Learn how our new features help match attendees with the perfect events.",
      date: "2024-01-15",
      author: "Sarah Johnson",
      category: "Product Updates",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
    },
    {
      title: "The Future of Virtual Events in 2024",
      excerpt: "Discover the latest trends and technologies shaping virtual events.",
      date: "2024-01-10",
      author: "Michael Chen",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
    },
    {
      title: "Event Security Best Practices",
      excerpt: "Essential security measures every event organizer should implement.",
      date: "2024-01-05",
      author: "David Smith",
      category: "Security",
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329"
    },
    {
      title: "Maximizing Attendee Engagement",
      excerpt: "Tips and strategies to create memorable event experiences.",
      date: "2024-01-01",
      author: "Emily Brown",
      category: "Best Practices",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865"
    }
  ]

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
          EventFlow Blog
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Insights, updates, and best practices for event management
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <article
            key={index}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-colors"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">By {post.author}</span>
                <Button variant="ghost" className="text-indigo-500 hover:text-indigo-400">
                  Read More →
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600">
          View All Posts
        </Button>
      </div>
    </div>
  )
}
