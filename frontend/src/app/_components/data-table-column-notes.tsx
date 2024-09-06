import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface DataTableColumnNotesProps {
  content: string;
  nameTechnical: string;
  date: string;
}

export function DataTableColumnNotes({
  content,
  nameTechnical,
  date,
}: DataTableColumnNotesProps) {
  const notes = content;
  const maxLength = 20;
  const truncatedNotes =
    notes.length > maxLength ? notes.substring(0, maxLength) + "..." : notes;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className="cursor-pointer border-none bg-transparent p-0 hover:underline">
          {truncatedNotes}
        </p>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold capitalize">
              {nameTechnical}
            </h4>
            <p className="text-sm">{notes}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {dayjs(date, "DD/MM/YYYY").format("D MMMM, YYYY")}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
