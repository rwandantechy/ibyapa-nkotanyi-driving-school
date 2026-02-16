export const emailRegex = new RegExp(
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
);


export const passwordRegex = new RegExp(/.{8,}$/);
export const phoneNumberRegex = new RegExp(/^(\+\d{1,3}\s?)?(\d{10,12})$/);

export const fullNameRegex = new RegExp(/^(?=(?:\s*[A-Za-z]){4})[A-Za-z\s]+$/);
