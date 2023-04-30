import { CategoryInterface } from "./ICategory";

export interface PostInterface {
  ID: number;
  Topic: string;
  Price: number;
  Picture: File; //###############
  DayTime_Open: Date;
  DayTime_Close: Date;
  Detail: string;
  CategoryID: number;
  Category: CategoryInterface;
}
