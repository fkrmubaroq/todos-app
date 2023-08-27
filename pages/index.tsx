import { NextPage } from "next";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
import cn from "classnames";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TCard, TColumn } from "@/types";
import Column from "@/components/Column";
import ButtonAdd from "@/components/ButtonAdd";
import { generateID } from "@/utils";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Card from "@/components/Card";


type TContainer = {
  icon: React.ReactNode;
  containerName: string;
  data: TCard[];
}
const Portal = dynamic(
  import("@/components/Portal").then((module) => module.default),
  {
    ssr: false,
  }
);

const Index: NextPage = () => {
  const [columns, setColumns] = useState<TColumn[]>([]);
  const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
  const [activeTask, setActiveTask] = useState<TCard | null >(null);
  const [tasks, setTasks] = useState<({ columnId: string } & TCard)[]>([]); 
  const itemsId = useMemo(() => columns.map(column => column.id), [columns]);
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const onAddColumn = () => {
    setColumns((state) => {
      const clone = structuredClone(state);
      return [
        ...clone,
        {
          id: generateID(),
          title: `Column ${clone.length + 1}`,
        },
      ];
    });
  }
  
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);
    if (!over?.id) return;
    switch (active.data.current?.type) {
      case "Column":
        setColumns(columns => {
          const findActiveIndex = columns.findIndex(item => item.id === active.id);
          const findOverIndex = columns.findIndex(item => item.id === over.id);
          const moveColumn = arrayMove(columns, findActiveIndex, findOverIndex);
          return moveColumn;
        });
        break;
      case "Task":
        setTasks(tasks => {
          const findActiveIndex = tasks.findIndex((item) => item.id === active.id);
          const findOverIndex = tasks.findIndex((item) => item.id === over.id);
          const moveColumn = arrayMove(tasks, findActiveIndex, findOverIndex);
          return moveColumn;

        })
        break;
    }
  }

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event; 
    switch (active.data.current?.type) {
      case "Column":
        setActiveColumn(active.data.current.column);
        break;
      case "Task":
        setActiveTask(active.data.current.task);
    }
  }

  const onAddTask = (columnId: string) => {
    const findColumnById = columns.find(column => column.id === columnId);
    if (!findColumnById) return;
    setTasks(state => {
      const clone = structuredClone(state);
      const taskLength = clone?.filter((item) => item.columnId === columnId);
      const newTask = {
        columnId,
        id: generateID(),
        title: `New Title ${(taskLength?.length || 0) + 1}`,
        createdAt: new Date().toString(),
      };

      return [...(clone || []), newTask];
    })
  };

  const filterTasksByColumnId = useCallback((columnId: string) => {
    if (!tasks) return [];
    return tasks.filter(task => task.columnId === columnId);
  }, [tasks]);

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;
    const activeId = active?.id;
    if (!over?.data || active.data.current?.type !== "Task" || !overId || !activeId) return;
    const dataTaskOver:TCard = over?.data.current?.task;
    const dataTaskActive: TCard = active.data.current?.task;
    
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    
    if (isActiveTask && isOverTask) {
      console.log("move to another column");
      setTasks(tasks => {
        const findOverIndex = tasks.findIndex(task => task.id === dataTaskOver.id);
        const findActiveIndex = tasks.findIndex(task => task.id === dataTaskActive.id);
        if (tasks[findActiveIndex]?.columnId !== tasks[findOverIndex].columnId) {
          tasks[findActiveIndex].columnId = tasks[findOverIndex].columnId;
        }
        return arrayMove(tasks, findActiveIndex, findOverIndex);
      })
      return;
    }

    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks(tasks => {  
        if (!overId) return tasks;
        const findActiveIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[findActiveIndex].columnId = String(overId);
        return arrayMove(tasks, findActiveIndex, findActiveIndex);   
      });
    }

  }
  console.log("tasks ", columns, tasks);

  const onEditTitleColumn = (id: string, title: string) => {
    setColumns(columns => {
      const findColumnByid = columns.findIndex((column) => column.id === id);
      if (findColumnByid === -1) return columns;
      const clone = structuredClone(columns);
      clone.splice(findColumnByid, 1, {
        ...columns[findColumnByid],
        title,
      });
      return clone;
    })
  };

  const onEditTask = (id: string, title: string) => {
    setTasks(tasks => {
      const findTaskByid = tasks.findIndex((task) => task.id === id);
      if (findTaskByid === -1) return tasks;
      const clone = structuredClone(tasks);
      clone.splice(findTaskByid, 1, {
        ...tasks[findTaskByid],
        title,
      });
      return clone;

    })
  };

  const supportSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance:8
      }
    })
  )

  return (
    <>
      <Head>
        <title>Todos App</title>
        <meta name="description" content="Todos app" />
      </Head>
      <h1 className="text-2xl font-semibold text-center my-6">Todos App</h1>
      <div className="flex gap-x-7 pt-8 mx-10 min-h-screen overflow-auto ">
        <DndContext
          sensors={supportSensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext
            items={itemsId}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((item) => (
              <Column
                {...item}
                key={item.id}
                onAddTask={onAddTask}
                onEditTitleColumn={onEditTitleColumn}
                tasks={filterTasksByColumnId(item.id)}
              >
                <SortableContext
                  items={taskIds}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.filter(task => task.columnId === item.id).map((task) => (
                    <Card onEdit={onEditTask} key={task.id} {...task} />
                  ))}
                </SortableContext>
              </Column>
            ))}
          </SortableContext>

          <Portal>
            <DragOverlay>
              {activeColumn && (
                <Column
                  tasks={filterTasksByColumnId(activeColumn.id)}
                  isDragOverlay
                  {...activeColumn}
                />
              )}
              {activeTask && <Card {...activeTask} />}
            </DragOverlay>
          </Portal>
        </DndContext>
        <div
          onClick={onAddColumn}
          className="w-[330px] h-12 shrink-0 rounded-md text-gray-400 hover:border-gray-400 cursor-pointer flex justify-center items-center border-2"
        >
          + ADD COLUMN
        </div>
      </div>
    </>
  );
};



export default Index;

