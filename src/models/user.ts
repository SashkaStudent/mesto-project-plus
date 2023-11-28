import { model, Model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    name: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(name: string, password: string) {
    return this.findOne({ name }).then((user) => {
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
