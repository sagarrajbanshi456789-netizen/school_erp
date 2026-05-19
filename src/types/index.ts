export interface Level {
  id: string
  name: string
}

export interface Class {
  id: string
  name: string
  levelId: string
}

export interface Subject {
  id: string
  name: string
  classId: string
}