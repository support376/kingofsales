"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Camera, CheckCircle, FileText } from "lucide-react";

export default function VerifyPage() {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-lg font-bold">인증 제출 완료!</h2>
        <p className="text-sm text-muted-foreground text-center">
          운영진이 2~3 영업일 내 검토합니다.
          <br />
          인증 완료 시 Lv.2 권한이 자동 활성화됩니다.
        </p>
        <Link href="/profile">
          <Button>프로필로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-4">
      <Link href="/profile" className="flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      <div className="space-y-2">
        <h1 className="text-lg font-bold">소득 인증</h1>
        <p className="text-sm text-muted-foreground">
          인증 완료 시 Lv.2 권한이 부여되어 전체 리더보드 열람, 인증 전용
          게시판 접근이 가능합니다.
        </p>
      </div>

      {/* 증빙 종류 선택 */}
      <div className="space-y-2">
        <Label>증빙 종류</Label>
        <Select value={docType} onValueChange={(v) => setDocType(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="증빙 종류를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="salary_slip">급여명세서</SelectItem>
            <SelectItem value="employment_cert">재직증명서</SelectItem>
            <SelectItem value="health_cert">건강보험 자격확인서</SelectItem>
            <SelectItem value="business_card">명함</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 파일 업로드 */}
      <div className="space-y-2">
        <Label>증빙 파일</Label>
        <Card
          className="cursor-pointer border-dashed border-2 hover:border-[#2E75B6]"
          onClick={() => fileRef.current?.click()}
        >
          <CardContent className="p-6 text-center space-y-2">
            {file ? (
              <>
                <FileText className="h-8 w-8 mx-auto text-[#2E75B6]" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  탭하여 변경
                </p>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm">촬영 또는 파일 선택</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, PDF (최대 10MB)
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* 안내사항 */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-3 text-xs text-amber-800 space-y-1">
          <p className="font-medium">개인정보 보호 안내</p>
          <p>- 주민등록번호가 포함된 경우 반드시 마스킹 후 제출해주세요</p>
          <p>- 제출된 증빙은 인증 검증 목적으로만 사용됩니다</p>
          <p>- 인증 완료 후 30일 이내 원본은 파기됩니다</p>
          <p>- 인증 결과(연봉 구간, 재직 여부)만 DB에 저장됩니다</p>
        </CardContent>
      </Card>

      <Button
        className="w-full bg-[#2E75B6] hover:bg-[#1B3A5C] text-white"
        size="lg"
        disabled={!docType || !file}
        onClick={() => setSubmitted(true)}
      >
        인증 제출
      </Button>
    </div>
  );
}
