export type TColumn = {
  id: string;
  title: string;
}

export type TItemActive = {
  id: number;
  container: string
};

export type TCard = {
  columnId: string;
  id: string;
  title: string;
  createdAt: string;
};
