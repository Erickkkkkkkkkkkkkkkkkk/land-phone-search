// 'use client';

// @ts-expect-error: ignoring missing module type declaration for @headlessui/react
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useChatStore } from '@/app/store/chatStore';

// 분양 정보 타입 정의는 ../types/api 에서 가져온 ApartmentInfo를 사용한다고 가정합니다.

const ApartmentInfoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { apartmentList } = useChatStore();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        분양정보 보기
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-white opacity-30" />
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  분양정보
                </Dialog.Title>
                <div className="mt-2">
                  {apartmentList.length === 0 ? (
                    <p className="text-sm text-gray-500">분양정보가 없습니다.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {apartmentList.map((apartment, index) => (
                        <li key={(((apartment as unknown) as { id: string; name: string }).id) || index} className="py-2">
                          <p className="text-sm font-medium text-gray-900">{(((apartment as unknown) as { id: string; name: string }).name) || '정보 없음'}</p>
                          {/* 추가 상세 정보 표시 가능 */}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200"
                    onClick={closeModal}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ApartmentInfoModal; 