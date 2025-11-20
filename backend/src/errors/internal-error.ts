import HttpError from "./http-error";

export default class InternalError extends HttpError {
  constructor(message = "Внутренняя ошибка сервера") {
    super(500, message);
  }
}