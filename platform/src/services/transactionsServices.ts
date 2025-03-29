import axios from "axios";
import config from "../utils/config";
import { QueryOptions } from "./adminServices";

class TransactionsServices {
  async fetchUserTransactions(user_id: string, queryOptions?: QueryOptions) {
    const res = await axios.get(`${config.urls.transactions}/${user_id}`, { params: queryOptions });
    const transactions = res.data;
    return transactions;
  };
};

const transactionsServices = new TransactionsServices();
export default transactionsServices;