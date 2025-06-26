// import PDFDropzone from "@/components/PDFDropzone";
import PDFDropzone from "@/components/PDFDropzone";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Check, ScanText, Search, Shield, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
   <div className="flex flex-col min-h-screen">
      {/* Hero */}
     <section className="py-1">
  <div className="container px-4 md:px-6 mx-auto">
    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto" data-aos="fade-up">
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          <ScanText className="animate-pulse"/> AI Document Processing
        </h1>
        <p className="text-gray-400 md:text-xl max-w-2xl mx-auto">
          Scan, analyze, and send your documents with AI. Save time and extract data — instantly.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/docs">
          <Button className="px-6  text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:scale-105 transition transform duration-300 shadow-lg hover:shadow-blue-700/40">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" className="hover:scale-105 transition-transform duration-300 border-gray-600 text-gray-400 hover:cursor-pointer">
            Learn More
          </Button>
        </Link>
      </div>
    </div>

    {/* PDF Dropzone */}
    <div className="mt-5 flex justify-center" data-aos="zoom-in-up">
      <div className="relative w-full max-w-3xl rounded-2xl border border-blue-500/30 bg-white/5 backdrop-blur-md shadow-xl shadow-blue-500/10 dark:bg-gray-900/30 dark:border-blue-700/40 transition hover:scale-[1.01] duration-300">
        <div className="p-6 md:p-8">
          <PDFDropzone />
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Features */}
<section id="features" className="py-15 bg-white text-gray-900">
  <div className="container px-4 md:px-6 mx-auto">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-3 max-w-2xl mx-auto" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">⚙️ Powerful Features</h2>
        <p className="text-gray-600 md:text-lg">
          Our AI-powered platform transforms how you manage documents and track critical information — faster, smarter, better.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 w-full max-w-6xl" data-aos="fade-up" data-aos-delay="100">
        {/* Feature 1 */}
        <div className="flex flex-col items-center space-y-4 rounded-2xl p-6 border border-gray-200 bg-white transition duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300">
          <div className="p-4 rounded-full bg-blue-100 transition duration-300 group-hover:scale-110">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Easy Uploads</h3>
          <p className="text-gray-600 text-sm text-center">
            Drag and drop PDFs for instant scanning and streamlined document flow.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center space-y-4 rounded-2xl p-6 border border-gray-200 bg-white transition duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-green-300">
          <div className="p-4 rounded-full bg-green-100 transition duration-300">
            <Search className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">AI Analysis</h3>
          <p className="text-gray-600 text-sm text-center">
            Automatically extract, analyze, and categorize critical data using intelligent AI.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center space-y-4 rounded-2xl p-6 border border-gray-200 bg-white transition duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300">
          <div className="p-4 rounded-full bg-purple-100 transition duration-300">
            <BarChart className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold">Smart Dashboards</h3>
          <p className="text-gray-600 text-sm text-center">
            Visualize trends, track metrics, and make smarter decisions with real-time insights.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>




     <section className="py-16 md:py-24 text-white">
  <div className="container px-4 md:px-6 mx-auto">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl text-black">Pricing Plans</h2>
        <p className="max-w-[700px] text-gray-400 md:text-xl">Flexible options built for every kind of user</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
      {/* Free Tier */}
      <div className="flex flex-col p-6 bg-gradient-to-b from-gray-800 to-gray-600 border border-gray-700 rounded-2xl shadow-md hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Free</h3>
          <p className="text-gray-400 text-sm">Kickstart with essential features</p>
        </div>
        <div className="mt-4 flex">
          <p className="text-4xl font-extrabold text-white">$0</p>
          <p className="text-gray-400 text-sm">month</p>
        </div>
        <ul className="mt-6 space-y-2 flex-1 text-sm">
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>✅ 20 scans/month</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>📄 Basic data extraction</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>🕑 7-day history</span>
          </li>
        </ul>
        <div className="mt-6">
          <Link href="/manage-plan">
            <Button className="w-full hover:bg-gray-300 transition-colors hover:cursor-pointer" variant="outline">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Starter Tier */}
      <div className="flex flex-col p-6 bg-gradient-to-b from-gray-800 to-gray-600 border border-gray-700 rounded-2xl shadow-md hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Starter</h3>
          <p className="text-gray-400 text-sm">Just the right power boost</p>
        </div>
        <div className="mt-4 flex">
          <p className="text-4xl font-extrabold text-white">$4.99</p>
          <p className="text-gray-400 text-sm">month</p>
        </div>
        <ul className="mt-6 space-y-2 flex-1 text-sm">
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>✅ 100 scans/month</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>🔍 Enhanced extraction</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>🗂️ 30-day history</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-400 h-5 w-5 mr-2" />
            <span>📤 Basic export</span>
          </li>
        </ul>
        <div className="mt-6">
          <Link href="/manage-plan">
            <Button className="w-full hover:bg-gray-400 hover:border-black transition-colors hover:cursor-pointer" variant="outline">
              Choose Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Pro Tier */}
      <div className="flex flex-col p-6 bg-gradient-to-br from-blue-800 to-indigo-900 border border-blue-700 rounded-2xl shadow-lg relative hover:scale-[1.03] transition-all duration-300">
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-pulse">
          🌟 Most Popular
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Pro</h3>
          <p className="text-gray-300 text-sm">Everything you need, and more</p>
        </div>
        <div className="mt-4 flex">
          <p className="text-4xl font-extrabold text-white">$9.99</p>
          <p className="text-gray-300 text-sm">month</p>
        </div>
        <ul className="mt-6 space-y-2 flex-1 text-sm">
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>✅ 500 scans/month</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>🔍 Enhanced extraction</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>♾️ Unlimited history</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>📤 Full export options</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>🧠 AI-powered summaries</span>
          </li>
          <li className="flex items-center">
            <Check className="text-green-300 h-5 w-5 mr-2" />
            <span>🏷️ Smart tags & categories</span>
          </li>
        </ul>
        <div className="mt-6">
          <Link href="/manage-plan">
          <Button className=" hover:cursor-pointer w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md backdrop-blur-md border border-blue-400 transition-transform duration-300 transform hover:border-amber-300">
  <span className="relative z-10 font-semibold tracking-wide">
    Upgrade Now
  </span>
  <span className="absolute inset-0 w-full h-full bg-blue-500 opacity-0 group-hover:opacity-10 transition duration-300 blur-xl rounded-xl"></span>
</Button>

          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Info */}
    <section className="py-12 md:py-10 ">
  <div className="container px-4 md:px-6 mx-auto">
    <div className="text-center max-w-3xl mx-auto space-y-6" data-aos="fade-up">
      <div className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          🚀 Start Scanning Smarter — Today
        </h2>
        <p className="text-gray-400 text-lg md:text-xl">
          Join 1000+ users who are saving hours every week — scan, extract, and organize your docs in seconds ⚡
        </p>
      </div>
      <div className="pt-4">
        <Link href="/signup">
          <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white text-lg rounded-xl shadow-lg transition duration-300">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
     <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 md:px-6 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1">
            <Shield className="h-6 w-6 text-blue-600"/>
            <span>Market 🔍</span>

          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">THe smater way managing documents</p>
          </div>

        </div>

      </div>

     </footer>
   </div>
  );
}


