import HttpError from './http-error';

export default class BadRequestError extends HttpError {
  constructor(message = 'Некорректные данные') {
    super(400, message);
  }
}
