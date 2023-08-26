import { TCard } from "@/types";
import { getRandomNumber } from "@/utils";
import { useDraggable } from "@dnd-kit/core";
import cn from "classnames";
import React, { useMemo, useState } from "react";
import { AvatarCharacterIcon, TimeIcon } from "./Icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export default function Card({
  id,
  columnId,
  title,
  createdAt
}: TCard) {
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
        createdAt
      },
    },
  });

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

  return (
    <div
      {...listeners}
      {...attributes}
      style={style}
      ref={setNodeRef}
      className={cn(
        "rounded-2xl px-4 hover:shadow py-3 hover:border-blue shrink-0 flex flex-col h-36 gap-y-3 bg-white hover:border-blue-800 cursor-pointer border-2 border-transparent",
        {
          "shadow-active": isDragging,
        }
      )}
    >
      <div className="flex flex-col justify-between h-full">
        <span className="text-base font-semibold leading-6 line-clamp-3">
          {title}
        </span>

        <span className="flex items-center text-xs gap-x-2">
          <TimeIcon width="16" height="16" color="#333"/>
          <span>{createdAt ? dayjs(createdAt).toNow() : "-"}</span>
        </span>
      </div>
    </div>
  );
}

export function CardEmpty() {
   const {
     isDragging,
     attributes,
     transition,
     listeners,
     setNodeRef,
     transform,
   } = useSortable({
     id: "empty-card",
     data: {
       type: "Task",
     },
   });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || "",
    };
  return (
    <div {...listeners} {...attributes} style={style} ref={setNodeRef}>ASD</div>
  );
}