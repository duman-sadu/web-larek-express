export default class HttpError extends Error {
  status: number;

  constructor(status = 500, message = "Ошибка сервера") {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}