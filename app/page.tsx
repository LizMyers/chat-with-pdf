import {
  MapPinIcon,
  LightbulbIcon,
  CloudCogIcon,
  EyeIcon,
  MonitorSmartphoneIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";



const features = [
  {
    name: "Store your PDF Documents",
    description: "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: MapPinIcon
  },
  {
    name: "Blazing Fast Responses",
    description: "Experience lightening-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: ZapIcon
  },
  {
    name: "Chat Memorization",
    description: "Our intelligent chatbot remembers previous conversations, making it easier to pick up where you left off.",
    icon: LightbulbIcon
  },
  {
    name: "Interactive PDF Viewer",
    description: "Engage with you PDFs like never before with our intuitive and interactive viewer.",
    icon: EyeIcon
  },
  {
    name: "Cloud Backup",
    description: "Sleep well, knowing your documents are safely backed up in the cloud.",
    icon: CloudCogIcon
  },
  {
    name: "Responsive Design",
    description: "Access your PDF files on any device, including desktops, laptops, tablets, and smartphones.",
    icon: MonitorSmartphoneIcon
  },
];


export default function Home() {


  return (
    <main className="flex overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">

    <div className="flex-1 bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">

     {/* header */}
  
        <div className="container mx-auto text-center">
          <p className="text-indigo-700 text-sm sm:text-md font-semibold uppercase mb-2">Your Interactive Document Companion</p>
          <h1 className="text-3xl sm:text-6xl font-semibold text-red-700 leading-20 mb-10 mt-6">
            Transform Your PDFs into <br /> Interactive Conversations
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Introducing <span className="text-indigo-600 font-semibold">Chat with PDF.</span>
          </p>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Upload your document, and our chatbot will answer questions, summarize content,
            and answer all your Qs. Ideal for everyone, <span className="text-red-600 font-semibold">Chat with PDF</span> turns static documents
            into <span className="font-semibold">dynamic conversations</span>, enhancing productivity 10x fold effortlessly.
          </p>
          <Button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
              <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
    
      <div className="relative overflow-hidden pt-16 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            alt="App screenshot"
            src="https://i.imgur.com/VciRSTI.jpeg"
            width={2432}
            height={1442}
            className="mb-[-0%] rounded-lg shadow-2xl ring-1 ring-gray-900/10"
          />
          <div aria-hidden="true" className="relative">
            <div className="absolute bottom-0 inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
        
          </div>
        </div>

    </div>

    {/* features */}
   
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">Features</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div className="bg-white p-8 rounded-lg flex items-start" key={index}>
                <div className="bg-indigo-600 p-3 rounded-full flex-shrink-0 mt-1">
                  <feature.icon size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-500">{feature.name}</h2>
                  <p className="text-left text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
     

    </div>
    </main>
  );
}
