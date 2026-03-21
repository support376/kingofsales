"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, CheckCircle, FileText } from "lucide-react";

export default function VerifyPage() {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-5">
        <CheckCircle className="h-14 w-14 text-green-500" />
        <p className="text-[17px] font-bold text-gray-900">인증 제출 완료!</p>
        <p className="text-[13px] text-gray-500 text-center">운영진이 2~3 영업일 내 검토합니다.<br/>인증 완료 시 Lv.2 권한이 자동 활성화됩니다.</p>
        <Link href="/profile">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] rounded-full px-6">프로필로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white px-5 py-3 border-b border-gray-50">
        <Link href="/profile" className="flex items-center gap-1 text-[13px] text-gray-500">
          <ArrowLeft className="h-4 w-4" /> 돌아가기
        </Link>
      </div>

      <div className="bg-white px-5 py-4 space-y-1">
        <p className="text-[15px] font-bold text-gray-900">소득 인증</p>
        <p className="text-[13px] text-gray-500">인증 완료 시 Lv.2 권한이 부여됩니다.</p>
      </div>

      <div className="bg-white mt-2 px-5 py-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">증빙 종류</Label>
          <Select value={docType} onValueChange={(v) => setDocType(v ?? "")}>
            <SelectTrigger className="text-[13px]">
              <SelectValue placeholder="증빙 종류를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salary_slip" className="text-[13px]">급여명세서</SelectItem>
              <SelectItem value="employment_cert" className="text-[13px]">재직증명서</SelectItem>
              <SelectItem value="health_cert" className="text-[13px]">건강보험 자격확인서</SelectItem>
              <SelectItem value="business_card" className="text-[13px]">명함</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">증빙 파일</Label>
          <div
            className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <>
                <FileText className="h-8 w-8 mx-auto text-blue-600" />
                <p className="text-[13px] font-medium text-gray-700 mt-2">{file.name}</p>
                <p className="text-[11px] text-gray-400 mt-1">탭하여 변경</p>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 mx-auto text-gray-300" />
                <p className="text-[13px] text-gray-500 mt-2">촬영 또는 파일 선택</p>
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, PDF (최대 10MB)</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>

      <div className="bg-amber-50 mt-2 px-5 py-3 space-y-0.5">
        <p className="text-[11px] font-medium text-amber-700">개인정보 보호 안내</p>
        <p className="text-[11px] text-amber-600">주민등록번호 포함 시 반드시 마스킹 후 제출</p>
        <p className="text-[11px] text-amber-600">인증 완료 후 30일 이내 원본 파기</p>
      </div>

      <div className="bg-white mt-2 px-5 py-4">
        <Button
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px]"
          disabled={!docType || !file}
          onClick={() => setSubmitted(true)}
        >
          인증 제출
        </Button>
      </div>
    </div>
  );
}
