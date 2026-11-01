// What the manager changes on top of the built-in menu and events. Safe for client code.

export type MenuName = "evening" | "morning";

export type DrinkCopy = { name: string; note?: string };

export type AddedDrink = {
  id: string;
  menu: MenuName;
  group: number;
  price: string;
  image?: string;
  vi: DrinkCopy;
  en: DrinkCopy;
};

export type EventCopy = { title: string; heading: string; text: string; notes: string[] };

export type AddedEvent = {
  id: string;
  date: string;
  time?: string;
  image: string;
  vi: EventCopy;
  en: EventCopy;
};

export type Catalog = {
  inactiveDrinks: string[];
  addedDrinks: AddedDrink[];
  inactiveEvents: string[];
  removedEvents: string[];
  addedEvents: AddedEvent[];
};

export const emptyCatalog: Catalog = {
  inactiveDrinks: [],
  addedDrinks: [],
  inactiveEvents: [],
  removedEvents: [],
  addedEvents: [],
};

export const CATALOG_TAG = "catalog";
