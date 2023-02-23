export interface UserInterface {
  id: string;
  name: string;
  email: string;
}

export type UserType = {
  user: UserInterface;
};

class UserModel {
  readonly id: string;
  name: string;
  email: string;

  constructor({ id, name, email }: UserInterface) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  toJson = (): object => {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  };
}

export default UserModel;
