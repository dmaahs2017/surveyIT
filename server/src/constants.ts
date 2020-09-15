export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";

export enum UserTypesEnum {
  Surveyor = "SURVEYOR",
  Surveyee = "SURVEYEE",
}
