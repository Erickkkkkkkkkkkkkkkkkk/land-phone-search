'use client';

import React from 'react';
import RegionSelect from '@/app/components/RegionSelect';
import PeriodSelect from '@/app/components/PeriodSelect';
import ApartmentList from '@/app/components/ApartmentList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            LAND Alarm - 아파트 분양 정보
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            지역과 기간을 선택하여 분양 정보를 확인하세요.
          </p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          {/* 필터 섹션 */}
          <div className="border-b">
            <RegionSelect />
          </div>
          <div className="border-b">
            <PeriodSelect />
          </div>

          {/* 분양 정보 목록 */}
          <ApartmentList />
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 LAND Alarm. 데이터 제공: 청약홈
          </p>
        </div>
      </footer>
    </main>
  );
}
