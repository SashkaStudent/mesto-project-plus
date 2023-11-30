export const defaultError = (err: any) => {
  err.message = 'На сервере произошла ошибка';
  return {message: err.message};
};

export const castError = (err: any, isCard?: boolean) => {
  err.message = isCard ? 'Запрашиваемая карточка не найдена':'Запрашиваемый пользователь не найден';
  return {message: err.message};
};

export const inputError = (err: any) => {
  err.message = 'Введены неверные данные';
  return {message: err.message};
}