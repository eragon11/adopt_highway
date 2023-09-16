export interface TableColumn {
  name: string; // column name
  dataKey: string; // name of key of the actual data in this column
  position?: 'right' | 'left'; // should it be right-aligned or left-aligned?
  isSortable?: boolean; // can a column be sorted?
  isControl?: boolean; //is this a control element i.e. select box
  isGroupBy?: boolean;  //used to identify a group by column
}