import { Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import Icon from "../utils/iconMap";

const MOCK_POSTS = [
  { slug:"ai-tools-2026", title:"Top 10 AI Tools to Boost Productivity in 2026", excerpt:"Discover the most powerful AI-powered tools that professionals are using this year.", category:"AI News", date:"Jun 25, 2026", readTime:"5 min", icon:"HiSparkles" },
  { slug:"pdf-tips", title:"10 PDF Tricks You Didn't Know You Needed", excerpt:"From batch processing to OCR extraction, master every PDF workflow.", category:"Tutorials", date:"Jun 20, 2026", readTime:"7 min", icon:"FiFileText" },
  { slug:"seo-2026", title:"SEO Best Practices for 2026: What Actually Works", excerpt:"Google's algorithm updates have changed everything. Here's what you need to know.", category:"SEO", date:"Jun 15, 2026", readTime:"9 min", icon:"FiTrendingUp" },
  { slug:"image-compress", title:"How to Compress Images Without Losing Quality", excerpt:"A complete guide to image optimization for web performance and user experience.", category:"Tutorials", date:"Jun 10, 2026", readTime:"4 min", icon:"FiImage" },
];

function PostCard({ post, i }) {
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}>
      <Link to={`/blog/${post.slug}`} className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all">
        <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand-mid mb-3">
          <Icon name={post.icon} size={18} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-brand-light text-brand-mid px-2 py-0.5 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400">{post.readTime} read</span>
        </div>
        <h3 className="text-sm font-medium mb-2 leading-snug">{post.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
        <div className="text-xs text-gray-400 mt-3">{post.date}</div>
      </Link>
    </motion.div>
  );
}

function BlogList() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-semibold mb-1">Blog</h1>
      <p className="text-sm text-gray-500 mb-6">Tutorials, AI news, and tool guides</p>
      <div className="grid grid-cols-2 gap-4">
        {MOCK_POSTS.map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}
      </div>
    </div>
  );
}

function BlogPost() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <Link to="/blog" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1"><FiArrowLeft size={11}/> Blog</Link>
      <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-mid mb-4">
        <Icon name="HiSparkles" size={22} />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Top 10 AI Tools to Boost Productivity in 2026</h1>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs bg-brand-light text-brand-mid px-2 py-0.5 rounded-full">AI News</span>
        <span className="text-xs text-gray-400">Jun 25, 2026 · 5 min read</span>
      </div>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
        <p>The AI landscape in 2026 is transforming how professionals work. From writing assistants to code generators, these tools are becoming essential in every workflow.</p>
        <h2 className="text-base font-medium text-gray-900 mt-4">1. AI Content Writer</h2>
        <p>Generate high-quality blog posts, emails, and product descriptions in seconds. NanoTools AI Content Writer is trained on millions of examples across every industry.</p>
        <h2 className="text-base font-medium text-gray-900 mt-4">2. AI Code Generator</h2>
        <p>Describe what you want to build and get production-ready code instantly. Supports Python, JavaScript, TypeScript, Go, Rust, and more.</p>
        <p>And many more tools are available right here on NanoTools AI — <Link to="/" className="text-brand hover:underline">explore them all →</Link></p>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Routes>
      <Route index element={<BlogList />} />
      <Route path=":slug" element={<BlogPost />} />
    </Routes>
  );
}
