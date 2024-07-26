// Import necessary libraries and modules
import { ChatOpenAI } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatMessagePromptTemplate } from '@langchain/core/prompts';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import pineconeClient from './pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors';
import { Index, RecordMetadata } from '@pinecone-database/pinecone/dist/index';
import { adminDb } from '../firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import pRetry from 'p-retry';

// Initialize the OpenAI model
const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is correctly set
    modelName: 'gpt-4o',
});

export const indexName = 'papafam';

/**
 * Generate documents from a PDF stored in Firestore
 * @param {string} docId - The ID of the document in Firestore
 * @returns {Promise<Array>} - An array of split document parts
 */
export async function generateDocs(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    console.log(`Fetching download URL for document: ${docId}`);
    const firebaseRef = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(docId)
        .get();

    const downloadUrl = firebaseRef.data()?.downloadUrl;
    console.log(`Download URL fetched successfully: ${downloadUrl}`);

    const response = await fetch(downloadUrl);
    console.log(`Loading the PDF into a PDFDocument object`);
    const data = await response.blob();

    console.log(`Loading PDF Document`);
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    console.log(`Splitting documents into smaller parts for easier processing`);
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Splitting documents completed successfully`);
    console.log(`Number of document pieces: ${splitDocs.length}`); // Log the number of document pieces

    return splitDocs;
}

/**
 * Check if a namespace exists in Pinecone
 * @param {Index<RecordMetadata>} index - The Pinecone index
 * @param {string} namespace - The namespace to check
 * @returns {Promise<boolean>} - True if namespace exists, otherwise false
 */
async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No namespace value provided");
    const namespaces = await index.describeIndexStats();
    return (namespaces as { [key: string]: any })?.[namespace] !== undefined;
}

/**
 * Generate embeddings and store them in Pinecone Vector Store
 * @param {string} docId - The ID of the document in Firestore
 * @returns {Promise<PineconeStore>} - The Pinecone Vector Store
 */
export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    let pineconeVectorStore;

    console.log("Generating embeddings for document: ", docId);
    const embeddings = new OpenAIEmbeddings();

    const index = await pineconeClient.index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if (namespaceAlreadyExists) {
        console.log(`Namespace ${docId} already exists. Reusing existing embeddings`);

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });

        return pineconeVectorStore;
    } else {
        // If the namespace does not exist, download the PDF from Firestore
        // via the stored DownloadURL & generate the embeddings and store them
        // in the Pinecone Vector Store

        const splitDocs = await generateDocs(docId);

        // Retry logic for handling quota errors
        pineconeVectorStore = await pRetry(async () => {
            return await PineconeStore.fromDocuments(
                splitDocs,
                embeddings,
                {
                    pineconeIndex: index,
                    namespace: docId,
                }
            );
        }, {
            onFailedAttempt: error => {
                console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
                console.log(error);
            },
            retries: 5
        });

        return pineconeVectorStore;
    }
}