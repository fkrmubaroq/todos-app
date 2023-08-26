import { TCard, TColumn } from "@/types";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import cn from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import Card, { CardEmpty } from "./Card";
import { DragIndicatorIcon, PencilSquareIcon } from "./Icons";
import { DragOverlay } from "@dnd-kit/core";
import Portal from "./Portal";
import { useOnClickOutside } from "@/lib/hooks";


type TContainerProps = React.ComponentPropsWithoutRef<"div"> &
  TColumn & {
    isDragOverlay?: boolean;
    onAddCard?: (columnId: string) => void;
    tasks: TCard[];
    onEditTitleColumn: (id:string, value: string) => void;
  };

export default function Column({
  id,
  isDragOverlay,
  className,
  title,
  onAddCard,
  tasks,
  onEditTitleColumn,
}: TContainerProps) {
  const [editable, setEditable] = useState<boolean>(false);
  const {
    isDragging,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: "Column",
      column: {
        id,
        title,
      },
    },
  });
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "",
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          "bg-grey p-2 border-2 border-dashed shrink-0 rounded-md w-[300px] h-[calc(100vh-100px)]",
          className
        )}
      ></div>
    );
  }

  const onSave = () => {
    setEditable(false);
    onEditTitleColumn(id, title);
  }

  return (
    <div
      className={cn("flex flex-col gap-y-7 bg-white", {
        "p-2 rounded-lg shadow-active ": isDragOverlay,
      })}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between items-center border-b pb-3">
        <Title
          onEnter={onSave}
          onBlur={onSave}
          editable={editable}
          text={title}
          total={tasks?.length}
          onEdit={(value: string) => onEditTitleColumn(id, value)}
        />
        <div className="flex items-center">
          {!editable && (
            <div
              className="hover:bg-gray-200 cursor-pointer p-2 rounded-md"
              onClick={() => setEditable((e) => !e)}
            >
              <PencilSquareIcon width="15" height="15" />
            </div>
          )}
          <div
            className="cursor-grab w-7 flex justify-end"
            {...listeners}
            {...attributes}
          >
            <DragIndicatorIcon width="15" height="15" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "bg-grey p-3 border border-grey-200 rounded-2xl w-[300px] shrink-0 ",
          className
        )}
      >
        <div>
          <div
            className={cn("flex flex-col gap-y-2 z-10 h-[600px] overflow-auto")}
          >
            <SortableContext
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <Card key={task.id} {...task} />
              ))}
            </SortableContext>
          </div>
        </div>
        <div
          onClick={() => onAddCard && onAddCard(id)}
          className="mt-4 cursor-pointer rounded-lg text-sm hover:bg-grey-200 py-3 flex justify-center items-center font-semibold"
        >
          + Add Task
        </div>
      </div>
    </div>
  );
}
function Title({
  text,
  total,
  editable,
  onEdit,
  onBlur,
  onEnter,
}: {
  text: string;
  total: number;
  editable: boolean;
  onEdit: (value: string) => void;
  onBlur: () => void;
  onEnter: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef || !editable) return;
    inputRef.current?.focus();
  }, [editable]);

  return (
    <div className="flex gap-x-2 items-center w-full">
      {editable ? (
        <input
          ref={inputRef}
          value={text}
          className="w-full uppercase font-semibold outline-none bg-yellow-100 p-2 rounded-md"
          onChange={(e) => onEdit(e.target.value)}
          autoFocus
          onBlur={() => onBlur()}
          onKeyUp={(e) => e.code === "Enter" && onEnter()}
        />
      ) : (
        <div className={cn("p-2 rounded-md text-sm font-semibold uppercase ")}>{text}</div>
      )}
      {!editable && (
        <span>
          <div className="px-2 text-sm rounded-full bg-gray-100">{total}</div>
        </span>
      )}
    </div>
  );
}