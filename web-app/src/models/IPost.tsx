import { CategoryInterface } from "./ICategory";
export interface PostInterface {
  ID: number;
  Topic: string;
  Price: number;
  Picture: File; //###############
  Detail: string;
  CategoryID: number;
  Category: CategoryInterface;
}
