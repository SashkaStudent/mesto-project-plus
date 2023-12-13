import { model, Model, Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  about: string;
  avatar: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email: any) => validator.isEmail(email),
      message: "Неправильный формат почты",
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    validate: {
      validator: (urlAvatar: any) => validator.isURL(urlAvatar),
      message: "Неправильный формат ccылки",
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error("Неправильные имя или пароль"));
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Неправильные имя или пароль"));
          }

          return user;
        });
      });
  }
);

const Users = model("Users", userSchema);

Users.createIndexes();

export default model<IUser, UserModel>("User", userSchema);
