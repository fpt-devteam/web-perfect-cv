import { CollapsibleFilter } from "@/shared/components/ui/collapsible";
import { CvSectionTabsItem } from "./CvSectionTabItem";

type tabItem = {
  id: string;
  title: string;
  detail: string;
}

interface CvSectionTabProps {
  readonly title: string;
  readonly tabItems: tabItem[];
  readonly selectedId?: string;
  readonly onChange: (id: string) => void;
  readonly onAdd: () => void;
  readonly onDelete: (id: string) => void;
  readonly onUnShow: (id: string) => void;
}

export function CvSectionTab({
  title,
  onChange,
  tabItems,
  selectedId,
  onAdd,
  onDelete,
  onUnShow,
}: CvSectionTabProps) {
  return (
    <CollapsibleFilter
      title={title}
      handleOnClick={onAdd}
      defaultOpen={true}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-2"
    >
      {tabItems.map(item => (
        <CvSectionTabsItem
          id={item.id}
          title={item.title}
          detail={item.detail}
          handleSelectTab={onChange}
          handledDeleteTab={onDelete}
          handleUnShowTab={onUnShow}
          isActive={item.id === selectedId}
        />
      ))}
    </CollapsibleFilter>
  );
}