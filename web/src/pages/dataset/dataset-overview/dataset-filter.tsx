import { FilterButton } from '@/components/list-filter-bar';
import {
  CheckboxFormMultipleProps,
  FilterPopover,
} from '@/components/list-filter-bar/filter-popover';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChangeEventHandler, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LogTabs } from './dataset-common';

interface IProps {
  searchString?: string;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  active?: (typeof LogTabs)[keyof typeof LogTabs];
  setActive?: (active: (typeof LogTabs)[keyof typeof LogTabs]) => void;
}
const DatasetFilter = (
  props: IProps & Omit<CheckboxFormMultipleProps, 'setOpen'>,
) => {
  const {
    searchString,
    onSearchChange,
    value,
    onChange,
    filters,
    onOpenChange,
    active = LogTabs.FILE_LOGS,
    setActive,
    ...rest
  } = props;
  const { t } = useTranslation();
  const filterCount = useMemo(() => {
    return typeof value === 'object' && value !== null
      ? Object.values(value).reduce((pre, cur) => {
          return pre + cur.length;
        }, 0)
      : 0;
  }, [value]);
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-2 bg-bg-card p-1 rounded-md">
        <Button
          variant={active === LogTabs.FILE_LOGS ? 'default' : 'ghost'}
          className={cn('px-4 py-2 rounded-md border-0.5', {
            'bg-bg-base text-white': active === LogTabs.FILE_LOGS,
            'bg-bg-card border-transparent text-text-secondary hover:text-text-primary hover:bg-border-button focus-visible:text-text-primary focus-visible:bg-border-button':
              active !== LogTabs.FILE_LOGS,
          })}
          onClick={() => setActive?.(LogTabs.FILE_LOGS)}
        >
          {t('knowledgeDetails.fileLogs')}
        </Button>
        <Button
          variant={active === LogTabs.DATASET_LOGS ? 'default' : 'ghost'}
          className={cn('px-4 py-2 rounded-md border-0.5', {
            'bg-bg-base text-white': active === LogTabs.DATASET_LOGS,
            'bg-bg-card border-transparent text-text-secondary hover:text-text-primary hover:bg-border-button focus-visible:text-text-primary focus-visible:bg-border-button':
              active !== LogTabs.DATASET_LOGS,
          })}
          onClick={() => setActive?.(LogTabs.DATASET_LOGS)}
        >
          {t('knowledgeDetails.datasetLogs')}
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <FilterPopover
          value={value}
          onChange={onChange}
          filters={filters}
          onOpenChange={onOpenChange}
        >
          <FilterButton count={filterCount}></FilterButton>
        </FilterPopover>

        <SearchInput
          value={searchString}
          onChange={onSearchChange}
          className="w-32"
        ></SearchInput>
      </div>
    </div>
  );
};

export { DatasetFilter };
