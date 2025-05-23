import { validationHandler } from './validation';
import { genericHandler } from "./generic";
import { notFoundHandler } from "./not-found.error";
import { tokenNotFoundHandler } from './token-notFound.error';

export const errorHandlers = [validationHandler, tokenNotFoundHandler, notFoundHandler, genericHandler];