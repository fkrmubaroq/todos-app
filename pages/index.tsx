import { NextPage } from "next";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TCard, TColumn } from "@/types";
import Column from "@/components/Column";
import { generateID } from "@/utils";
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

const generateId = [generateID(), generateID(), generateID(), generateID()];
const initColumn = [
  {
    id: generateId[0],
    title: "TODO"
  },
  {
    id: generateId[1],
    title: "DO TODAY"
  },
  {
    id: generateId[2],
    title: "IN PROGRESS"
  },
  {
    id: generateId[3],
    title: "COMPLETE"
  },
];

const initTasks = [
  // TODO
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Create landing page user",
    createdAt: new Date("2023-09-15").toString(),
  },
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Correct spelling tutorial page",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Measure load performance of the site",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Measure load performance of the site",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Create documentation SEO for all developer",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[0],
    id: generateID(),
    title: "Use SASS for stylesheet",
    createdAt: new Date("2023-09-10").toString(),
  },
  // DO TODAY
  {
    columnId: generateId[1],
    id: generateID(),
    title: "Write blog entry for our new product",
    createdAt: new Date().toString(),
  },
  {
    columnId: generateId[1],
    id: generateID(),
    title: "Schedule & prepare database maintenance",
    createdAt: new Date().toString(),
  },
  {
    columnId: generateId[1],
    id: generateID(),
    title: "Create Signin on Google+",
    createdAt: new Date().toString(),
  },
  {
    columnId: generateId[1],
    id: generateID(),
    title: "Implement Design system",
    createdAt: new Date().toString(),
  },
  {
    columnId: generateId[1],
    id: generateID(),
    title: "Encahnce API capabilities",
    createdAt: new Date().toString(),
  },
  
  // IN PROGRESS
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Create Signin on Google+",
    createdAt: new Date().toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Make sure sponsors are indicated for tech talk",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Implement Ant Design",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Drag and drop is not working on the calendar page",
    createdAt: new Date("2023-09-10").toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Document the service API",
    createdAt: new Date("2023-09-09").toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Allow User to upload avatar",
    createdAt: new Date("2023-09-09").toString(),
  },
  {
    columnId: generateId[2],
    id: generateID(),
    title: "Automated Tests",
    createdAt: new Date("2023-09-09").toString(),
  },

  // COMPLETE
  {
    columnId: generateId[3],
    id: generateID(),
    title: "Initiate Automatic payment gateway  ",
    createdAt: new Date("2023-09-15").toString(),
  },
  {
    columnId: generateId[3],
    id: generateID(),
    title: "Create newsletter template",
    createdAt: new Date("2023-08-01").toString(),
  },
  {
    columnId: generateId[3],
    id: generateID(),
    title: "Investigate competitor site",
    createdAt: new Date("2023-08-01").toString(),
  },
];


const Index: NextPage = () => {
  const [columns, setColumns] = useState<TColumn[]>(initColumn);
  const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
  const [activeTask, setActiveTask] = useState<TCard | null >(null);
  const [tasks, setTasks] = useState<({ columnId: string } & TCard)[]>(initTasks); 
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

  const onDeleteTask = (id:string) => {
    setTasks(tasks => {
      const findTaskByid = tasks.findIndex((task) => task.id === id);
      if (findTaskByid === -1) return tasks;
      const clone = structuredClone(tasks);
      clone.splice(findTaskByid, 1);
      return clone;
    })
  };

  const onRemoveColumn = (id: string) => {
    setColumns((columns) => {
      const findColumnByid = columns.findIndex((column) => column.id === id);
      if (findColumnByid === -1) return columns;
      const clone = structuredClone(columns);
      clone.splice(findColumnByid, 1);
      return clone;
    });
    
    // find task by column
    const findTaskByColumnId = tasks.some(task => task.columnId === id);
    if (!findTaskByColumnId) return;
    setTasks(tasks => {
      const filterWithoutColumnId = tasks.filter(task => task.columnId !== id);
      return filterWithoutColumnId;
    });
  };

  const supportSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance:8
      }
    }),
    useSensor(TouchSensor)
  )

  return (
    <>
      <Head>
        <title>Todos App</title>
        <meta name="description" content="Todos app" />
        <meta name="viewport" content="width=device-width, initial-scale=0.1" />
      </Head>
      <h1
        className="text-2xl font-semibold text-center my-6"
      >
        Todos App
      </h1>
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
                onRemove={onRemoveColumn}
                tasks={filterTasksByColumnId(item.id)}
              >
                <SortableContext
                  items={taskIds}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks
                    .filter((task) => task.columnId === item.id)
                    .map((task) => (
                      <Card
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        key={task.id}
                        {...task}
                      />
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

