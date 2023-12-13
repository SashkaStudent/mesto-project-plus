import {
  CONFLICT_ERROR,
  FORBIDDEN_ERROR,
  INVALID_INPUT,
  NOT_FOUND,
  UNAUTH_ERROR,
} from "../error-codes";

class ApiError extends Error {
  public statusCode: number;
  public errors: any;
  constructor(statusCode: number, message: string, errors: any = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
  static ConflictUserError() {
    return new ApiError(
      CONFLICT_ERROR,
      "Пользователь с таким email уже существует"
    );
  }
  static InvalidLoginError() {
    return new ApiError(INVALID_INPUT, "Неправильные логин или пароль");
  }
  static InvalidInputError(
    message: string = "Введены некорректные данные",
    errors: any = []
  ) {
    return new ApiError(INVALID_INPUT, message, errors.errors);
  }
  static NotFoundError() {
    return new ApiError(NOT_FOUND, "Страница или ресурс не найдены");
  }
  static UnauthorizedError() {
    return new ApiError(UNAUTH_ERROR, "Требуется авторизация");
  }
  static ForbiddenError() {
    return new ApiError(FORBIDDEN_ERROR, "Недостаточно прав");
  }
}

export default ApiError;
