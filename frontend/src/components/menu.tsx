import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Mic, Clock, Globe, Sparkles } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const DEMO_PDF_URL = '/demo.pdf'; // 替换为你的演示 PDF 文件的实际路径

export default function Menu({ handleGenerate, isGenerating }: { handleGenerate: (formData: FormData) => void, isGenerating: boolean }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [tone, setTone] = useState('neutral');
  const [duration, setDuration] = useState('short');
  const [language, setLanguage] = useState('Chinese');
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 5MB limit.');
        setPdfFile(null);
      } else {
        setFileError(null);
        setPdfFile(file);
      }
    }
  };

  const handleDemoPdfClick = async () => {
    try {
      const response = await fetch(DEMO_PDF_URL);
      const blob = await response.blob();
      const file = new File([blob], 'demo.pdf', { type: 'application/pdf' });
      setPdfFile(file);
      setFileError(null);
    } catch (error) {
      console.error('Error loading demo PDF:', error);
      setFileError('Failed to load demo PDF.');
    }
  };

  const handleSubmit = () => {
    if (!pdfFile) {
      setFileError('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('textInput', textInput);
    formData.append('tone', tone);
    formData.append('duration', duration);
    formData.append('language', language);

    handleGenerate(formData);
  };

  return (
    <div className="w-full md:w-1/5 p-6 border-r rounded-2xl m-3 border-gray-200 bg-white flex flex-col text-gray-800 hidden md:flex shadow-lg shadow-gray-300/50">
      <div className="flex-grow overflow-y-auto space-y-8">
        <div className="transition-all duration-300">
          <h2 className="text-sm font-semibold mb-3 flex items-center"><Upload className="mr-2 text-gray-600" size={20} /> 上传 PDF *</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 bg-white hover:bg-gray-50 transition-all duration-300">
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              id="pdf-upload" 
              onChange={handleFileChange}
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-gray-600">
                {pdfFile ? pdfFile.name : "Click to upload PDF"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF 文件不应超过 5MB
              </p>
            </label>
          </div>
          {fileError && <p className="text-red-500">{fileError}</p>}
          <div className="flex items-center space-x-2 pt-2">
            <span className="text-sm font-semibold text-gray-500">试一试: </span>
            <button
              onClick={handleDemoPdfClick}
              className="text-sm  font-semibold underline"
            >
              introduce_chatgpt.pdf
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center"><FileText className="mr-2 text-gray-600" size={20} /> 问题</h2>
          <Textarea 
            style={{"resize": "none"}}
            placeholder="说点什么..." 
            className="w-full h-40 bg-white border-gray-200 text-gray-800 rounded-xl focus:border-gray-400 focus:ring-gray-400"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center"><Mic className="mr-2 text-gray-600" size={20} /> 语气</h2>
          <Select onValueChange={setTone}>
            <SelectTrigger className="w-full bg-white border-gray-200 text-gray-800 rounded-xl">
              <SelectValue placeholder="中立" defaultValue={tone}/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 rounded-xl" >
              <SelectItem value="neutral" className="cursor-pointer hover:bg-gray-100">中立</SelectItem>
              <SelectItem value="happy" className="cursor-pointer hover:bg-gray-100">开心</SelectItem>
              <SelectItem value="sad" className="cursor-pointer hover:bg-gray-100">难过</SelectItem>
              <SelectItem value="excited" className="cursor-pointer hover:bg-gray-100">兴奋</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center"><Clock className="mr-2 text-gray-600" size={20} /> 时长</h2>
          <Select onValueChange={setDuration}>
            <SelectTrigger className="w-full bg-white border-gray-200 text-gray-800 rounded-xl">
              <SelectValue placeholder="短对话 (1-2分钟)" defaultValue={duration}/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 rounded-xl">
              <SelectItem value="short" className="cursor-pointer  hover:bg-gray-100">短对话 (1-2分钟)</SelectItem>
              <SelectItem value="medium" className="cursor-pointer hover:bg-gray-100">中对话 (3-5分钟)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center"><Globe className="mr-2 text-gray-600" size={20} /> 语言</h2>
          <Select onValueChange={setLanguage}>
            <SelectTrigger className="w-full bg-white border-gray-200 text-gray-800 rounded-xl">
              <SelectValue placeholder="中文" defaultValue={language}/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 rounded-xl">
              <SelectItem value="English" className="cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-100">英文</SelectItem>
              <SelectItem value="Chinese" className="cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-100">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          disabled={isGenerating}
          className={`
            w-full rounded-xl transition-all duration-300 transform hover:scale-105
            flex items-center justify-center space-x-2
            ${isGenerating 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}
            text-white font-semibold py-3 px-6 shadow-lg hover:shadow-xl
          `}
          onClick={handleSubmit}
        >
          {!isGenerating && <Sparkles className="w-5 h-5" />}
          <span>{isGenerating ? '生成中...' : '生成播客'}</span>
        </Button>
      </div>
    </div>
  );
}
