import { cn } from '@/lib/utils';
import { Funnel } from 'lucide-react';
import React, {
  ChangeEventHandler,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '../svg-icon';
import { Button, ButtonProps } from '../ui/button';
import { SearchInput } from '../ui/input';
import { CheckboxFormMultipleProps, FilterPopover } from './filter-popover';

interface IProps {
  title?: ReactNode;
  searchString?: string;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  showFilter?: boolean;
  leftPanel?: ReactNode;
  preChildren?: ReactNode;
}

export const FilterButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { count?: number }
>(({ count = 0, ...props }, ref) => {
  return (
    <Button variant="secondary" {...props} ref={ref}>
      {/* <span
        className={cn({
          'text-text-primary': count > 0,
          'text-text-sub-title-invert': count === 0,
        })}
      >
        Filter
      </span> */}
      {count > 0 && (
        <span className="rounded-full bg-text-badge px-1 text-xs ">
          {count}
        </span>
      )}
      <Funnel />
    </Button>
  );
});

FilterButton.displayName = 'FilterButton';
export default function ListFilterBar({
  title,
  children,
  preChildren,
  searchString,
  onSearchChange,
  showFilter = true,
  leftPanel,
  value,
  onChange,
  onOpenChange,
  filters,
  className,
  icon,
  filterGroup,
}: PropsWithChildren<IProps & Omit<CheckboxFormMultipleProps, 'setOpen'>> & {
  className?: string;
  icon?: ReactNode;
  filterGroup?: Record<string, string[]>;
}) {
  const filterCount = useMemo(() => {
    return typeof value === 'object' && value !== null
      ? Object.values(value).reduce((pre, cur) => {
          if (Array.isArray(cur)) {
            return pre + cur.length;
          }
          if (typeof cur === 'object') {
            return (
              pre +
              Object.values(cur).reduce((pre, cur) => {
                return pre + cur.length;
              }, 0)
            );
          }
          return pre;
        }, 0)
      : 0;
  }, [value]);

  return (
    <div className={cn('flex justify-between mb-5 items-center', className)}>
      <div className="text-2xl font-semibold flex items-center gap-2.5">
        {typeof icon === 'string' ? (
          // <IconFont name={icon} className="size-6"></IconFont>
          <HomeIcon name={`${icon}`} width={'32'} />
        ) : (
          icon
        )}
        {leftPanel || title}
      </div>
      <div className="flex gap-5 items-center">
        {preChildren}
        {showFilter && (
          <FilterPopover
            value={value}
            onChange={onChange}
            filters={filters}
            filterGroup={filterGroup}
            onOpenChange={onOpenChange}
          >
            <FilterButton count={filterCount}></FilterButton>
          </FilterPopover>
        )}

        <SearchInput
          value={searchString}
          onChange={onSearchChange}
          className="w-32"
        ></SearchInput>
        {children}
      </div>
    </div>
  );
}

export function RootListFilterBar({
  title,
  children,
  preChildren,
  searchString,
  onSearchChange,
  showFilter = true,
  leftPanel,
  value,
  onChange,
  onOpenChange,
  filters,
  className,
  icon,
  filterGroup,
}: PropsWithChildren<IProps & Omit<CheckboxFormMultipleProps, 'setOpen'>> & {
  className?: string;
  icon?: ReactNode;
  filterGroup?: Record<string, string[]>;
}) {
  const { t } = useTranslation();
  const filterCount = useMemo(() => {
    return typeof value === 'object' && value !== null
      ? Object.values(value).reduce((pre, cur) => {
          if (Array.isArray(cur)) {
            return pre + cur.length;
          }
          if (typeof cur === 'object') {
            return (
              pre +
              Object.values(cur).reduce((pre, cur) => {
                return pre + cur.length;
              }, 0)
            );
          }
          return pre;
        }, 0)
      : 0;
  }, [value]);

  //modify by yangq

  return (
    <div className="w-full py-[65px] flex items-center relative">
      {/* 左侧：小海豹（相对定位，悬浮在搜索框左方，间距约12px） */}
      <img
        src={`${icon}`} // 替换为你的小海豹图片路径
        alt="小海豹"
        className={`h-[240px] w-auto object-contain absolute left-1/2 -translate-x-full top-[100px] -translate-y-1/2 shrink-0 z-10 ${
          // 根据title不同设置不同ml-[-xxxpx]（右侧间距）
          title === t('header.dataset')
            ? 'ml-[-300px]'
            : title === t('chat.chatApps')
              ? 'ml-[-240px]'
              : title === t('search.searchApps')
                ? 'ml-[-260px]'
                : title === t('header.fileManager')
                  ? 'ml-[-260px]'
                  : 'ml-[-300px]' // 默认值，防止title未传/传未知值
        }`}
      />

      {/* 中间核心：搜索框 + 知识库文字（真正的页面正中间） */}
      <div className="flex flex-col items-center gap-4 mx-auto">
        {/* 知识库标题 */}
        <div className="relative">
          <img
            src="/title_dot.png"
            alt="装饰点"
            className="absolute -top-2 -right-3 w-6 h-6 object-contain"
          />

          <h1 className="text-[clamp(1.5rem,5vw,1.5rem)] font-bold text-gray-800 relative z-10">
            {title}
          </h1>
        </div>

        {/* 搜索框组件 */}
        <div className="w-[590px] flex items-center bg-[#EFF4FC] my-2 rounded-full shadow-sm border border-gray-100 overflow-hidden">
          {/* 搜索图标 */}
          <div className="pl-5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {/* 输入框 */}
          <input
            type="text"
            placeholder="输入关键字进行搜索"
            value={searchString}
            onChange={onSearchChange}
            className="flex-1 py-3 px-3 bg-transparent outline-none text-gray-800 text-base placeholder:text-base placeholder-gray-400"
          />
          {/* 搜索按钮 */}
          <button className="bg-gradient-to-b from-[#9f7aea] to-[#667eea] text-white m-0.5 px-7 py-2 text-[17px] font-medium rounded-3xl">
            {t('search.searchApps')}
          </button>
        </div>
      </div>

      {/* 右侧：创建知识库按钮（页面右侧，垂直居中） */}
      <div className="absolute right-0 top-[70px] -translate-y-1/2">
        {children}
      </div>
    </div>
  );
}
