import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquare } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from "react";
import DialogueList from "./dialog-list";

interface TranscriptProps {
  isSummaryLoading: boolean;
  summaryError: string | null;
  summaryTextChunk: string[];
  isSummaryDone: boolean;
  transcriptTextChunks: string[];
  transcriptError: string | null;
  transcriptIsLoading: boolean;
  transcriptIsDone: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export default function Transcript({
  isSummaryLoading,
  summaryError,
  summaryTextChunk,
  transcriptTextChunks,
  transcriptError,
  transcriptIsLoading,
  activeTab,
  setActiveTab
}: TranscriptProps) {
  const summaryContentRef = useRef<HTMLDivElement>(null);
  const transcriptContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summaryContentRef.current) {
      summaryContentRef.current.scrollTop = summaryContentRef.current.scrollHeight;
    }
  }, [summaryTextChunk]);

  useEffect(() => {
    if (transcriptContentRef.current) {
      transcriptContentRef.current.scrollTop = transcriptContentRef.current.scrollHeight;
    }
  }, [transcriptTextChunks]);

  return (
    <div className="w-full p-6 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList className="inline-flex bg-gray-100 rounded-xl p-1">
            <TabsTrigger 
              value="summary" 
              className="data-[state=active]:bg-white rounded-[5px] m-1"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="transcript" 
              className="data-[state=active]:bg-white rounded-[5px] m-1"
            >
              Transcript
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-8 h-[calc(100vh-450px)] overflow-y-auto" ref={summaryContentRef}>
              {
                renderContent(
                  isSummaryLoading,
                  summaryError,
                  summaryTextChunk,
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transcript">
          <Card>
            <CardContent className="p-8 h-[calc(100vh-450px)] overflow-y-auto" ref={transcriptContentRef}>
              <DialogueList
                textChunks={transcriptTextChunks}
                transcriptError={transcriptError}
                transcriptIsLoading={transcriptIsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderContent(isLoading: boolean, error: string | null, textChunks: string[]) {
  return (
    <>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4 rounded-xl" />
          <Skeleton className="h-6 w-5/6 rounded-xl" />
          <Skeleton className="h-6 w-2/3 rounded-xl" />
          <Skeleton className="h-6 w-2/3 rounded-xl" />
          <Skeleton className="h-6 w-2/3 rounded-xl" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex items-center space-x-4" key={index}>
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[250px] rounded-xl" />
                </div>
              </div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "An error occurred while loading the summary."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="prose max-w-none h-full">
          {textChunks.length > 0 ? (
            <ReactMarkdown>{textChunks.join('')}</ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No conversation yet</h3>
              <p className="text-gray-500 mb-6">Start a new conversation to see the summary here.</p>
            </div>
          )}
        </div>
      )
    }
    </>
  )
}