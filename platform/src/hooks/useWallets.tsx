import { App } from "antd";
import { createWalletAction } from "../redux/actions/wallets-actions";
import { useAppDispatch, useAppSelector } from "../redux/store"
import { CoinsType } from "../utils/enums";


export const useWallets = () => {
  const dispatch = useAppDispatch();
  const { notification } = App.useApp();
  const { user_id } = useAppSelector((state) => state.auth);
  const { wallets, loading: walletsLoading, error } = useAppSelector((state) => state.wallets);

  const createWallet = async (coin: CoinsType) => {
    try {
      await dispatch(createWalletAction({ user_id, coin })).unwrap();
      notification.success({
        message: `Wallet ${coin} created successfully`
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return {
    user_id,
    wallets,
    walletsLoading,
    error,
    createWallet
  };
}