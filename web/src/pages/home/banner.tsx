import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function BannerCard() {
  return (
    <Card className="w-auto border-none h-3/4">
      <CardContent className="p-4">
        <span className="inline-block bg-backgroundCoreWeak rounded-sm px-1 text-xs">
          System
        </span>
        <div className="flex mt-1 gap-4">
          <span className="text-lg truncate">Setting up your LLM</span>
          <ArrowRight />
        </div>
      </CardContent>
    </Card>
  );
}

export function Banner() {
  return (
    <section className="h-28 rounded-2xl  my-8 flex gap-8 justify-between">
      <div className="h-full text-3xl font-bold items-center inline-flex ml-6">
        Welcome to RAGFlow
      </div>
      <div className="flex justify-between items-center gap-4 mr-5">
        <BannerCard></BannerCard>
        <BannerCard></BannerCard>
        <BannerCard></BannerCard>
        <button
          type="button"
          className="relative p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
}

export function NextBanner() {
  const { t } = useTranslation();
  return (
    <div className="flex items-end justify-center py-10 gap-2">
      <img
        src={'/home_logo.png'}
        alt="home_logo"
        className="w-56 aspect-[1.37] object-cover"
      />
      <div className="mx-4 mb-4">
        <div className=" text-[50px] font-extrabold text-gray-800 leading-tight">
          <img
            src={'/logo_name.svg'}
            alt="海小豹"
            className="inline-block align-text-bottom h-15 w-auto  px-1"
          />
          {t('header.assistant')}
        </div>

        <p className="text-gray-600 text-md mt-2 max-w-2xl">
          我能帮你管理海量资料、起草公文方案、精准检索信息，做你最靠谱的办公搭档！
        </p>
      </div>
    </div>
  );
}
