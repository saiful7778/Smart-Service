import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { CircleQuestionMark } from "lucide-react";

function DataTableEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleQuestionMark />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { DataTableEmpty };
