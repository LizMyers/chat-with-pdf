import Documents from "@/components/Documents";

export const dynamic = "force-dynamic";


function Dashboard() {
  return (
    <div className="h-full max-w-7xl mx-auto bg-gray-100">
        <h1 className="text-gray-500 ml-6 pt-10 text-3xl p-10 bg-gray-100 font-extralight">
            My Documents
        </h1>
        <div className="ml-11">
           <Documents />
        </div>
        
      
    </div>
 
  )
}

export default Dashboard