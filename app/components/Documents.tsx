import { adminDb } from "../../firebaseAdmin";
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server";
import Document from "./Document";

async function Documents() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div className="h-screen overflow-auto p-5 bg-gray-100">
      <div className="flex flex-wrap justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
        {documentsSnapshot.docs.map((doc) => {
          const { name, downloadUrl, size } = doc.data();
          return (
            <Document
              key={doc.id}
              id={doc.id}
              name={name}
              size={size}
              downloadUrl={downloadUrl}
            />
          );
        })}
        <PlaceholderDocument />
      </div>
    </div>
  );
}
export default Documents;