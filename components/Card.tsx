import { TCard } from "@/types";
import cn from "classnames";
import React, { useRef, useState } from "react";
import { PencilSquareIcon, TimeIcon } from "./Icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export default function Card({ id, columnId, title, createdAt, onEdit }: TCard & { onEdit?: (id: string, value: string) => void }) {
  const [editable, setEditable] = useState<boolean>(false);
  const {
    isDragging,
    attributes,
    transition,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({
    id,
    data: {
      type: "Task",
      task: {
        id,
        columnId,
        title,
        createdAt,
      },
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "",
  };

  if (isDragging) {
    return (
      <div
        {...listeners}
        {...attributes}
        style={style}
        ref={setNodeRef}
        className={cn(
          "rounded-2xl px-4 py-3 flex flex-col h-36 shrink-0 gap-y-3 cursor-pointer border-dashed border-2",
          {
            "shadow-active border-blue": isDragging,
          }
        )}
      ></div>
    );
  }

  const onSave = () => {
    setEditable(false);
    onEdit && onEdit(id, title);
  };

  return (
    <div
      {...listeners}
      {...attributes}
      style={style}
      ref={setNodeRef}
      className={cn(
        "rounded-2xl px-4 relative group hover:shadow py-3 hover:border-blue shrink-0 flex flex-col h-36 gap-y-3 bg-white hover:border-blue-800 cursor-pointer border-2 border-transparent",
        {
          "shadow-active": isDragging,
        }
      )}
    >
      <div className="flex flex-col justify-between h-full">
        {editable ? (
          <textarea
            autoFocus
            onBlur={onSave}
            onKeyUp={(e) => e.code === "Enter" && onSave()}
            onChange={(e) => onEdit && onEdit(id, e.target.value)}
            ref={textareaRef}
            value={title || ""}
            className="outline-none bg-yellow-100 p-2 h-20 rounded-md resize-none"
          ></textarea>
        ) : (
          <span className="text-base font-semibold leading-6 line-clamp-3 break-all">
            {title}
          </span>
        )}

        <span className="flex items-center text-xs gap-x-2">
          <TimeIcon width="16" height="16" color="#333" />
          <span>{createdAt ? dayjs(createdAt).toNow() : "-"}</span>
        </span>
      </div>
      <div
        onClick={() => {
          setEditable(true);
        }}
        className={cn(
          "absolute top-2 rounded-md hidden bg-gray-200 hover:bg-gray-400 p-1.5 right-3",
          {
            "group-hover:block": !editable,
          }
        )}
      >
        <PencilSquareIcon color="#333" width="15" height="15" />
      </div>
    </div>
  );
}