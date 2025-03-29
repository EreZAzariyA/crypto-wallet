import axios from "axios";
import { UserModel } from "../models";
import config from "../utils/config";

export interface QueryOptions {
  limit: number;
  skip: number;
  sort?: string;
}

class AdminServices {

  async getUsers(queryOptions: QueryOptions): Promise<{ users: UserModel[], total: number }> {
    const res = await axios.get(config.urls.admin.getUsers, { params: queryOptions });
    const users = res.data;
    return users;
  }

};

const adminServices = new AdminServices();
export default adminServices;