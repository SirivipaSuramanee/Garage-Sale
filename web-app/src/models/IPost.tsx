import { CategoryInterface } from "./ICategory";
export interface PostInterface {
  ID: number;
  Topic: string;
  Price: number;
  Picture: File[]; //###############
  Detail: string;
  categoryID: number;
  category: CategoryInterface[];
  lat: string;
  lng: string;
}


export interface PostAllInterface {
  ID: number;
  CreatedAt: Date;
  topic: string;
  price: number;
  picture: string; //###############
  dayTimeOpen: Date;
  dayTimeClose: Date;
  detail: string;
  category: CategoryInterface[];
  user: {
    profileURL: string,
  }
  lat: string;
  lng: string;
}

